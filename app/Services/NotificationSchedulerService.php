<?php

namespace App\Services;

use App\Jobs\GenerateTaskRecommendationsJob;
use App\Mail\RecommendedTaskReminder;
use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Notifications\TaskReminderNotification;
use App\Notifications\WeeklyRecommendationsNotification;
use Carbon\Carbon;
use Cron\CronExpression;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Service responsible for processing scheduled notifications based on user preferences.
 *
 * This service runs hourly via the Laravel scheduler and checks all enabled notification
 * preferences to determine if any notifications should be sent at the current time.
 * It uses cron expressions stored in the notification_preferences table to determine
 * when each user should receive their notifications.
 *
 * The service currently supports:
 * - Weekly recommendation emails (WeeklyRecommendations::class)
 * - Task reminder emails (RecommendedTaskReminder::class)
 *
 * Usage:
 * - Automatically runs via Laravel scheduler every hour
 * - Can be manually triggered via: php artisan notifications:process-scheduled
 * - Supports dry-run mode: php artisan notifications:process-scheduled --dry-run
 */
class NotificationSchedulerService
{
    /**
     * Process all pending notifications that should be sent at this time.
     */
    public function processPendingNotifications(): void
    {
        Log::info('Starting notification scheduler service');

        $now = Carbon::now();
        $processedCount = 0;

        // Get all enabled notification preferences with their cron expressions
        $notificationPreferences = NotificationPreference::query()
            ->where('is_enabled', true)
            ->whereNotNull('cron_expression')
            ->with('user')
            ->get();

        foreach ($notificationPreferences as $preference) {
            if ($this->shouldSendNotification($preference, $now)) {
                $this->sendNotificationForUser($preference);
                $processedCount++;
            }
        }

        Log::info("Notification scheduler completed. Processed {$processedCount} notifications.");
    }

    /**
     * Check if a notification should be sent based on the cron expression.
     */
    private function shouldSendNotification(NotificationPreference $preference, Carbon $now): bool
    {
        try {
            $cronExpression = new CronExpression($preference->cron_expression);

            // Check if the cron expression matches the current time
            // We check if it's due within the last hour to account for the hourly check
            $previousHour = $now->copy()->subHour();

            return $cronExpression->isDue($now) ||
                ($cronExpression->getPreviousRunDate($now) >= $previousHour);
        } catch (\Exception $e) {
            Log::warning("Invalid cron expression for notification preference {$preference->id}: {$preference->cron_expression}", [
                'error' => $e->getMessage(),
                'user_id' => $preference->user_id,
            ]);

            return false;
        }
    }

    /**
     * Send the appropriate notification for a user.
     */
    private function sendNotificationForUser(NotificationPreference $preference): void
    {
        $user = $preference->user;

        if (! $user) {
            Log::warning("User not found for notification preference {$preference->id}");

            return;
        }

        // Handle different notification types
        switch ($preference->notification_class) {
            case WeeklyRecommendations::class:
                $this->sendWeeklyRecommendations($user);
                break;

            case RecommendedTaskReminder::class:
                $this->sendTaskReminder($user);
                break;

            default:
                Log::warning("Unknown notification class: {$preference->notification_class}");
        }
    }

    /**
     * Send weekly recommendations to a user.
     */
    private function sendWeeklyRecommendations(User $user): void
    {
        try {
            $currentWeekStart = Carbon::now()->startOfWeek();

            // Get or create weekly recommendation for this week
            $weeklyRecommendation = WeeklyRecommendation::query()
                ->where('user_id', $user->id)
                ->where('week_start_date', $currentWeekStart)
                ->with(['recommendedTasks.task.category'])
                ->first();

            // If no recommendation exists for this week, generate one
            if (! $weeklyRecommendation) {
                Log::info("No weekly recommendation found for user {$user->id} for week {$currentWeekStart->toDateString()}. Dispatching job to generate new recommendations.");

                // Dispatch job to generate recommendations asynchronously
                // The job will handle sending the email when recommendations are ready
                GenerateTaskRecommendationsJob::dispatch($user->id);

                Log::info("Weekly recommendations generation job dispatched for user {$user->id}. Email will be sent when recommendations are ready.");

                return;
            }

            // Check if email has already been sent for this recommendation
            if ($weeklyRecommendation->email_sent_at) {
                Log::info("Email already sent for weekly recommendation {$weeklyRecommendation->id} for user {$user->id}. Skipping.");

                return;
            }

            // Check if this recommendation has any tasks
            if ($weeklyRecommendation->recommendedTasks->isEmpty()) {
                Log::info("Weekly recommendation for user {$user->id} has no tasks. Skipping email.");

                return;
            }

            // Send the email
            Mail::to($user->email)->send(new WeeklyRecommendations($user, $weeklyRecommendation));

            // Send database notification
            $user->notify(new WeeklyRecommendationsNotification($weeklyRecommendation));

            // Mark email as sent
            $weeklyRecommendation->update(['email_sent_at' => Carbon::now()]);

            Log::info("Weekly recommendations email and database notification sent to user {$user->id} ({$user->email})");
        } catch (\Exception $e) {
            Log::error("Failed to send weekly recommendations to user {$user->id}", [
                'error' => $e->getMessage(),
                'user_email' => $user->email,
            ]);
        }
    }

    /**
     * Send task reminder to a user.
     */
    private function sendTaskReminder(User $user): void
    {
        try {
            $currentWeekStart = Carbon::now()->startOfWeek();

            // Get the weekly recommendation for this week
            $weeklyRecommendation = WeeklyRecommendation::query()
                ->where('user_id', $user->id)
                ->where('week_start_date', $currentWeekStart)
                ->with(['recommendedTasks.task.category'])
                ->first();

            if (! $weeklyRecommendation) {
                Log::info("No weekly recommendations found for user {$user->id} for current week. Skipping task reminder email.");

                return;
            }

            // Check if this recommendation has any incomplete tasks
            $incompleteTasks = $weeklyRecommendation->recommendedTasks()
                ->where('completed', false)
                ->count();

            if ($incompleteTasks === 0) {
                Log::info("All tasks completed for user {$user->id}. Skipping task reminder email.");

                return;
            }

            // Send the email
            Mail::to($user->email)->send(new RecommendedTaskReminder($user, $weeklyRecommendation));

            // Send database notification
            $user->notify(new TaskReminderNotification($weeklyRecommendation));

            Log::info("Task reminder email and database notification sent to user {$user->id} ({$user->email})");
        } catch (\Exception $e) {
            Log::error("Failed to send task reminder to user {$user->id}", [
                'error' => $e->getMessage(),
                'user_email' => $user->email,
            ]);
        }
    }

    /**
     * Get the count of users who have notifications scheduled for the current time.
     */
    public function getPendingNotificationCount(): int
    {
        $now = Carbon::now();
        $count = 0;

        $notificationPreferences = NotificationPreference::query()
            ->where('is_enabled', true)
            ->whereNotNull('cron_expression')
            ->with('user')
            ->get();

        foreach ($notificationPreferences as $preference) {
            if ($this->shouldSendNotification($preference, $now)) {
                // Check if this notification would actually be sent (not a duplicate)
                if ($this->wouldActuallySendNotification($preference)) {
                    $count++;
                }
            }
        }

        return $count;
    }

    /**
     * Check if a notification would actually be sent (not skipped due to duplicates).
     */
    private function wouldActuallySendNotification(NotificationPreference $preference): bool
    {
        $user = $preference->user;

        if (! $user) {
            return false;
        }

        // Only handle weekly recommendations for now (can extend for other types)
        if ($preference->notification_class === WeeklyRecommendations::class) {
            $currentWeekStart = Carbon::now()->startOfWeek();

            $weeklyRecommendation = WeeklyRecommendation::query()
                ->where('user_id', $user->id)
                ->where('week_start_date', $currentWeekStart)
                ->first();

            // If no recommendation exists for this week, it would be sent (after generating)
            if (! $weeklyRecommendation) {
                return true;
            }

            // If email already sent, would be skipped
            if ($weeklyRecommendation->email_sent_at) {
                return false;
            }

            // If recommendation exists but email not sent, would be sent
            return true;
        }

        // For other notification types, assume they would be sent
        return true;
    }
}

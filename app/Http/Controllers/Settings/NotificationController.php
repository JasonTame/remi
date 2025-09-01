<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\CronExpressionHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\NotificationPreferencesUpdateRequest;
use App\Mail\RecommendedTaskReminder;
use App\Mail\WeeklyRecommendations;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display the notification preferences page.
     */
    public function show(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Get existing preferences or set defaults
        $weeklyDigestPreference = $user->notificationPreferences()
            ->where('notification_class', WeeklyRecommendations::class)
            ->first();

        $taskReminderPreference = $user->notificationPreferences()
            ->where('notification_class', RecommendedTaskReminder::class)
            ->first();

        $digestCronExpression = $weeklyDigestPreference?->cron_expression ?? '0 8 * * 1'; // Default: Monday 8am GMT
        $reminderCronExpression = $taskReminderPreference?->cron_expression ?? '0 8 * * 5'; // Default: Friday 8am GMT

        $preferences = [
            'weekly_digest' => $weeklyDigestPreference?->is_enabled ?? true,
            'digest_day' => CronExpressionHelper::cronToDayOfWeek($digestCronExpression),
            'digest_time' => CronExpressionHelper::cronToTimeOfDay($digestCronExpression),
            'task_reminder' => $taskReminderPreference?->is_enabled ?? true,
            'reminder_day' => CronExpressionHelper::cronToDayOfWeek($reminderCronExpression),
            'reminder_time' => CronExpressionHelper::cronToTimeOfDay($reminderCronExpression),
            'push_notifications' => false, // TODO: Implement push notifications later
        ];

        return Inertia::render('settings/notifications', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update the notification preferences.
     */
    public function update(NotificationPreferencesUpdateRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $validated = $request->validated();

        // Convert UI values to cron expressions
        $digestCronExpression = CronExpressionHelper::buildCronExpression(
            $validated['digest_day'],
            $validated['digest_time']
        );

        $reminderCronExpression = CronExpressionHelper::buildCronExpression(
            $validated['reminder_day'],
            $validated['reminder_time']
        );

        // Update or create weekly digest preference
        $user->notificationPreferences()->updateOrCreate(
            ['notification_class' => WeeklyRecommendations::class],
            [
                'is_enabled' => $validated['weekly_digest'],
                'cron_expression' => $digestCronExpression,
            ]
        );

        // Update or create task reminder preference
        $user->notificationPreferences()->updateOrCreate(
            ['notification_class' => RecommendedTaskReminder::class],
            [
                'is_enabled' => $validated['task_reminder'],
                'cron_expression' => $reminderCronExpression,
            ]
        );

        return redirect()->back()->with('success', 'Notification preferences updated successfully.');
    }
}

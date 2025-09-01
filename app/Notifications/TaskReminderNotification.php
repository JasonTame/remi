<?php

namespace App\Notifications;

use App\Models\WeeklyRecommendation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public WeeklyRecommendation $weeklyRecommendation;

    /**
     * Create a new notification instance.
     */
    public function __construct(WeeklyRecommendation $weeklyRecommendation)
    {
        $this->weeklyRecommendation = $weeklyRecommendation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $incompleteTasks = $this->weeklyRecommendation->recommendedTasks()
            ->where('completed', false)
            ->count();

        $totalTasks = $this->weeklyRecommendation->recommendedTasks()->count();
        $completedTasks = $totalTasks - $incompleteTasks;

        if ($incompleteTasks === 0) {
            $message = "🎉 Amazing! You've completed all {$totalTasks} recommended tasks this week!";
        } else {
            $message = "You have {$incompleteTasks} task" . ($incompleteTasks > 1 ? 's' : '') . " remaining this week ({$completedTasks}/{$totalTasks} completed).";
        }

        return [
            'type' => 'task_reminder',
            'title' => 'Weekly Task Reminder',
            'message' => $message,
            'incomplete_tasks' => $incompleteTasks,
            'completed_tasks' => $completedTasks,
            'total_tasks' => $totalTasks,
            'weekly_recommendation_id' => $this->weeklyRecommendation->id,
            'action_url' => '/dashboard',
            'icon' => $incompleteTasks === 0 ? '🎉' : '📝',
        ];
    }
}

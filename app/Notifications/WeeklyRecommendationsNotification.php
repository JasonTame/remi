<?php

namespace App\Notifications;

use App\Models\WeeklyRecommendation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class WeeklyRecommendationsNotification extends Notification implements ShouldQueue
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
        $weekStart = $this->weeklyRecommendation->week_start_date->format('M j');
        $weekEnd = $this->weeklyRecommendation->week_start_date->addDays(6)->format('M j');
        $taskCount = $this->weeklyRecommendation->recommendedTasks()->count();

        return [
            'type' => 'weekly_recommendations',
            'title' => 'New Weekly Task Recommendations',
            'message' => "Your task suggestions for {$weekStart} - {$weekEnd} are ready! {$taskCount} tasks recommended.",
            'week_start' => $weekStart,
            'week_end' => $weekEnd,
            'task_count' => $taskCount,
            'weekly_recommendation_id' => $this->weeklyRecommendation->id,
            'action_url' => '/dashboard',
            'icon' => '📋',
        ];
    }
}

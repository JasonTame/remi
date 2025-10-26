<?php

use App\Mail\RecommendedTaskReminder;
use App\Models\Category;
use App\Models\NotificationPreference;
use App\Models\RecommendedTask;
use App\Models\Task;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Services\NotificationSchedulerService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();
});

it('can create a recommended task reminder email', function () {
    $user = User::factory()->create(['name' => 'John Doe']);
    $category = Category::factory()->create(['name' => 'Work']);
    $task = Task::factory()->create([
        'title' => 'Complete project',
        'category_id' => $category->id,
        'user_id' => $user->id,
    ]);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => Carbon::now()->startOfWeek(),
    ]);

    $recommendedTask = RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
        'priority' => 1,
        'reason' => 'This task is overdue',
    ]);

    $mailable = new RecommendedTaskReminder($user, $weeklyRecommendation);

    expect($mailable->user)->toBe($user);
    expect($mailable->weeklyRecommendation)->toBe($weeklyRecommendation);
});

it('generates correct email content for task reminder', function () {
    $user = User::factory()->create(['name' => 'Jane Smith']);
    $category = Category::factory()->create(['name' => 'Personal']);

    $completedTask = Task::factory()->create([
        'title' => 'Completed task',
        'category_id' => $category->id,
        'user_id' => $user->id,
    ]);

    $incompleteTask = Task::factory()->create([
        'title' => 'Incomplete task',
        'category_id' => $category->id,
        'user_id' => $user->id,
        'timing_description' => 'Every Friday morning',
    ]);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => Carbon::parse('2024-01-01'), // Monday
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $completedTask->id,
        'priority' => 2,
        'reason' => 'Regular maintenance',
        'completed' => true,
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $incompleteTask->id,
        'priority' => 1,
        'reason' => 'Important deadline approaching',
        'completed' => false,
    ]);

    $mailable = new RecommendedTaskReminder($user, $weeklyRecommendation);
    $envelope = $mailable->envelope();

    expect($envelope->subject)->toBe('Gentle reminder: Your week\'s tasks 📝');
});

it('notification scheduler sends task reminder for enabled preferences', function () {
    $user = User::factory()->create();

    // Create notification preference for task reminders
    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => RecommendedTaskReminder::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 5', // Friday 8am
    ]);

    $category = Category::factory()->create();
    $task = Task::factory()->create([
        'user_id' => $user->id,
        'category_id' => $category->id,
    ]);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => Carbon::now()->startOfWeek(),
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
        'completed' => false,
    ]);

    // Mock the current time to be Friday 8am (this week)
    $testTime = Carbon::now()->next(Carbon::FRIDAY)->setTime(8, 0, 0);
    Carbon::setTestNow($testTime);

    // Update the weekly recommendation to match the current week
    $weeklyRecommendation->update([
        'week_start_date' => $testTime->copy()->startOfWeek(),
    ]);

    $service = new NotificationSchedulerService;
    $service->processPendingNotifications();

    Mail::assertSent(RecommendedTaskReminder::class, function ($mail) use ($user) {
        return $mail->user->id === $user->id;
    });
});

it('does not send task reminder when all tasks are completed', function () {
    $user = User::factory()->create();

    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => RecommendedTaskReminder::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 5',
    ]);

    $category = Category::factory()->create();
    $task = Task::factory()->create([
        'user_id' => $user->id,
        'category_id' => $category->id,
    ]);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => Carbon::now()->startOfWeek(),
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
        'completed' => true, // RecommendedTask is completed
    ]);

    Carbon::setTestNow(Carbon::parse('Friday 8:00'));

    $service = new NotificationSchedulerService;
    $service->processPendingNotifications();

    Mail::assertNotSent(RecommendedTaskReminder::class);
});

it('does not send task reminder when preference is disabled', function () {
    $user = User::factory()->create();

    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => RecommendedTaskReminder::class,
        'is_enabled' => false, // Disabled
        'cron_expression' => '0 8 * * 5',
    ]);

    $category = Category::factory()->create();
    $task = Task::factory()->create([
        'user_id' => $user->id,
        'category_id' => $category->id,
    ]);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => Carbon::now()->startOfWeek(),
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
        'completed' => false,
    ]);

    Carbon::setTestNow(Carbon::parse('Friday 8:00'));

    $service = new NotificationSchedulerService;
    $service->processPendingNotifications();

    Mail::assertNotSent(RecommendedTaskReminder::class);
});

it('does not send task reminder when no weekly recommendation exists', function () {
    $user = User::factory()->create();

    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => RecommendedTaskReminder::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 5',
    ]);

    // No weekly recommendation created

    Carbon::setTestNow(Carbon::parse('Friday 8:00'));

    $service = new NotificationSchedulerService;
    $service->processPendingNotifications();

    Mail::assertNotSent(RecommendedTaskReminder::class);
});

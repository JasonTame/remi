<?php

use App\Jobs\ProcessScheduledNotificationsJob;
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
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Mail::fake();
    Queue::fake();
});

it('processes scheduled notifications when job is executed', function () {
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

    // Mock the current time to be Friday 8am
    $testTime = Carbon::now()->next(Carbon::FRIDAY)->setTime(8, 0, 0);
    Carbon::setTestNow($testTime);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => $testTime->copy()->startOfWeek(),
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
        'completed' => false,
    ]);

    // Execute the job
    $job = new ProcessScheduledNotificationsJob;
    $job->handle(new NotificationSchedulerService);

    // Verify the email was sent
    Mail::assertSent(RecommendedTaskReminder::class, function ($mail) use ($user) {
        return $mail->user->id === $user->id;
    });
});

it('has correct job configuration', function () {
    $job = new ProcessScheduledNotificationsJob;

    expect($job->tries)->toBe(3);
    expect($job->timeout)->toBe(300);
    expect($job->uniqueId())->toContain('process-scheduled-notifications-');
});

it('generates unique ID based on current hour', function () {
    $job = new ProcessScheduledNotificationsJob;

    $uniqueId1 = $job->uniqueId();

    // Should contain the current date and hour
    $expectedPrefix = 'process-scheduled-notifications-' . now()->format('Y-m-d-H');
    expect($uniqueId1)->toBe($expectedPrefix);

    // Same hour should generate same ID
    $uniqueId2 = $job->uniqueId();
    expect($uniqueId1)->toBe($uniqueId2);
});

it('handles service exceptions and re-throws them', function () {
    // Mock the service to throw an exception
    $mockService = Mockery::mock(NotificationSchedulerService::class);
    $mockService->shouldReceive('processPendingNotifications')
        ->once()
        ->andThrow(new \Exception('Service failed'));

    $job = new ProcessScheduledNotificationsJob;

    expect(fn() => $job->handle($mockService))
        ->toThrow(\Exception::class, 'Service failed');
});

it('implements correct interfaces', function () {
    $job = new ProcessScheduledNotificationsJob;

    expect($job)->toBeInstanceOf(\Illuminate\Contracts\Queue\ShouldQueue::class);
    expect($job)->toBeInstanceOf(\Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing::class);
});

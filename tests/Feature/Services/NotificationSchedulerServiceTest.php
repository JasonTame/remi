<?php

use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\RecommendedTask;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Services\NotificationSchedulerService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->service = app(NotificationSchedulerService::class);
});

it('processes pending notifications correctly', function () {
    Mail::fake();

    // Mock the current time to be Monday at 8am first
    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00')); // This is a Monday

    // Create a user with a weekly recommendation for the test week
    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create(['week_start_date' => Carbon::now()->startOfWeek()]);

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    // Create a notification preference that should trigger now (every Monday at 8am)
    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Every Monday at 8am
        ]);

    $this->service->processPendingNotifications();

    Mail::assertSent(WeeklyRecommendations::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });
});

it('does not send notifications when disabled', function () {
    Mail::fake();

    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create();

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    // Create a disabled notification preference
    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => false,
            'cron_expression' => '0 8 * * 1',
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00')); // Monday at 8am

    $this->service->processPendingNotifications();

    Mail::assertNotSent(WeeklyRecommendations::class);
});

it('does not send notifications when cron expression does not match', function () {
    Mail::fake();

    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create();

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    // Create a notification preference for Tuesday at 8am
    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 2', // Tuesday at 8am
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00')); // Monday at 8am

    $this->service->processPendingNotifications();

    Mail::assertNotSent(WeeklyRecommendations::class);
});

it('does not send notifications when no weekly recommendations exist', function () {
    Mail::fake();

    $user = User::factory()->create();

    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1',
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00')); // Monday at 8am

    $this->service->processPendingNotifications();

    Mail::assertNotSent(WeeklyRecommendations::class);
});

it('does not send notifications when weekly recommendation has no tasks', function () {
    Mail::fake();

    $user = User::factory()->create();
    WeeklyRecommendation::factory()
        ->for($user)
        ->create(); // No recommended tasks

    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1',
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00')); // Monday at 8am

    $this->service->processPendingNotifications();

    Mail::assertNotSent(WeeklyRecommendations::class);
});

it('handles invalid cron expressions gracefully', function () {
    Mail::fake();

    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create();

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    // Create a notification preference with invalid cron expression
    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => 'invalid-cron',
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00'));

    // Should not throw an exception
    $this->service->processPendingNotifications();

    Mail::assertNotSent(WeeklyRecommendations::class);
});

it('counts pending notifications correctly', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $user3 = User::factory()->create();

    // Create notification preferences that should trigger
    NotificationPreference::factory()
        ->for($user1)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Monday at 8am
        ]);

    NotificationPreference::factory()
        ->for($user2)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Monday at 8am
        ]);

    // Create one disabled preference for a different user
    NotificationPreference::factory()
        ->for($user3)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => false,
            'cron_expression' => '0 8 * * 1',
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00')); // Monday at 8am

    $count = $this->service->getPendingNotificationCount();

    expect($count)->toBe(2);
});

it('handles notifications due within the previous hour', function () {
    Mail::fake();

    // Set current time to 8:30am (30 minutes after the scheduled time) first
    Carbon::setTestNow(Carbon::parse('2024-01-01 08:30:00')); // Monday at 8:30am

    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create(['week_start_date' => Carbon::now()->startOfWeek()]);

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    // Create a notification preference for 8am
    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Monday at 8am
        ]);

    $this->service->processPendingNotifications();

    Mail::assertSent(WeeklyRecommendations::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });
});

<?php

use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\RecommendedTask;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

it('processes scheduled notifications successfully', function () {
    Mail::fake();

    // Create a user with a weekly recommendation
    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create(['week_start_date' => Carbon::now()->startOfWeek()]);

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    // Create a notification preference that should trigger
    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Every Monday at 8am
        ]);

    // Mock the current time to be Monday at 8am
    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00'));

    $this->artisan('notifications:process-scheduled')
        ->expectsOutput('Processing scheduled notifications...')
        ->expectsOutput('Scheduled notifications processed successfully.')
        ->assertExitCode(0);

    Mail::assertSent(WeeklyRecommendations::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });
});

it('shows dry run information without sending emails', function () {
    Mail::fake();

    // Create a user with notification preferences
    $user = User::factory()->create();
    $weeklyRecommendation = WeeklyRecommendation::factory()
        ->for($user)
        ->create();

    RecommendedTask::factory()
        ->for($weeklyRecommendation)
        ->create();

    NotificationPreference::factory()
        ->for($user)
        ->create([
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1',
        ]);

    Carbon::setTestNow(Carbon::parse('2024-01-01 08:00:00'));

    $this->artisan('notifications:process-scheduled --dry-run')
        ->expectsOutput('Processing scheduled notifications...')
        ->expectsOutput('Dry run: 1 notifications would be processed.')
        ->assertExitCode(0);

    Mail::assertNotSent(WeeklyRecommendations::class);
});

it('handles no pending notifications gracefully', function () {
    $this->artisan('notifications:process-scheduled')
        ->expectsOutput('Processing scheduled notifications...')
        ->expectsOutput('Scheduled notifications processed successfully.')
        ->assertExitCode(0);
});

it('shows zero notifications in dry run when none are pending', function () {
    $this->artisan('notifications:process-scheduled --dry-run')
        ->expectsOutput('Processing scheduled notifications...')
        ->expectsOutput('Dry run: 0 notifications would be processed.')
        ->assertExitCode(0);
});

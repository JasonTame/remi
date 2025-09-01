<?php

use App\Mail\RecommendedTaskReminder;
use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\User;

it('displays task reminder preferences on notification settings page', function () {
    $user = User::factory()->create();

    // Create existing preferences
    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => WeeklyRecommendations::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 1', // Monday 8am
    ]);

    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => RecommendedTaskReminder::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 5', // Friday 8am
    ]);

    $response = $this->actingAs($user)->get(route('notifications.edit'));

    $response->assertOk();
    $response->assertInertia(
        fn($page) => $page
            ->component('settings/notifications')
            ->has('preferences')
            ->where('preferences.weekly_digest', true)
            ->where('preferences.digest_day', 'monday')
            ->where('preferences.digest_time', 'morning')
            ->where('preferences.task_reminder', true)
            ->where('preferences.reminder_day', 'friday')
            ->where('preferences.reminder_time', 'morning')
    );
});

it('uses default values when no task reminder preference exists', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('notifications.edit'));

    $response->assertOk();
    $response->assertInertia(
        fn($page) => $page
            ->component('settings/notifications')
            ->where('preferences.task_reminder', true)
            ->where('preferences.reminder_day', 'friday')
            ->where('preferences.reminder_time', 'morning')
    );
});

it('can update task reminder notification preferences', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => true,
        'digest_day' => 'monday',
        'digest_time' => 'morning',
        'task_reminder' => true,
        'reminder_day' => 'wednesday',
        'reminder_time' => 'evening',
        'push_notifications' => false,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Notification preferences updated successfully.');

    // Check that the task reminder preference was created/updated
    $taskReminderPreference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', RecommendedTaskReminder::class)
        ->first();

    expect($taskReminderPreference)->not->toBeNull();
    expect($taskReminderPreference->is_enabled)->toBeTrue();
    expect($taskReminderPreference->cron_expression)->toBe('0 18 * * 3'); // Wednesday 6pm
});

it('can disable task reminder notifications', function () {
    $user = User::factory()->create();

    // Create existing enabled preference
    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => RecommendedTaskReminder::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 5',
    ]);

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => true,
        'digest_day' => 'monday',
        'digest_time' => 'morning',
        'task_reminder' => false, // Disable task reminders
        'reminder_day' => 'friday',
        'reminder_time' => 'morning',
        'push_notifications' => false,
    ]);

    $response->assertRedirect();

    // Check that the preference was disabled
    $taskReminderPreference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', RecommendedTaskReminder::class)
        ->first();

    expect($taskReminderPreference->is_enabled)->toBeFalse();
});

it('validates task reminder notification preferences', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => true,
        'digest_day' => 'monday',
        'digest_time' => 'morning',
        'task_reminder' => 'invalid', // Invalid boolean
        'reminder_day' => 'invalid_day', // Invalid day
        'reminder_time' => 'invalid_time', // Invalid time
        'push_notifications' => false,
    ]);

    $response->assertSessionHasErrors([
        'task_reminder',
        'reminder_day',
        'reminder_time',
    ]);
});

it('updates task reminder preferences for different time combinations', function () {
    $user = User::factory()->create();

    $testCases = [
        ['day' => 'sunday', 'time' => 'morning', 'expected_cron' => '0 8 * * 0'],
        ['day' => 'tuesday', 'time' => 'afternoon', 'expected_cron' => '0 13 * * 2'],
        ['day' => 'saturday', 'time' => 'evening', 'expected_cron' => '0 18 * * 6'],
    ];

    foreach ($testCases as $testCase) {
        $this->actingAs($user)->patch(route('notifications.update'), [
            'weekly_digest' => true,
            'digest_day' => 'monday',
            'digest_time' => 'morning',
            'task_reminder' => true,
            'reminder_day' => $testCase['day'],
            'reminder_time' => $testCase['time'],
            'push_notifications' => false,
        ]);

        $preference = NotificationPreference::where('user_id', $user->id)
            ->where('notification_class', RecommendedTaskReminder::class)
            ->first();

        expect($preference->cron_expression)->toBe($testCase['expected_cron']);
    }
});

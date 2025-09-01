<?php

use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\User;

test('authenticated user can view notification preferences page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('notifications.edit'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('settings/notifications')
            ->has('preferences')
            ->where('preferences.weekly_digest', true)
            ->where('preferences.digest_day', 'monday')
            ->where('preferences.digest_time', 'morning')
            ->where('preferences.task_reminder', true)
            ->where('preferences.reminder_day', 'friday')
            ->where('preferences.reminder_time', 'morning')
            ->where('preferences.push_notifications', false)
    );
});

test('unauthenticated user cannot view notification preferences page', function () {
    $response = $this->get(route('notifications.edit'));

    $response->assertRedirect(route('login'));
});

test('user can update notification preferences', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => false,
        'digest_day' => 'friday',
        'digest_time' => 'evening',
        'task_reminder' => true,
        'reminder_day' => 'wednesday',
        'reminder_time' => 'morning',
        'push_notifications' => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Notification preferences updated successfully.');

    // Check that the preference was created/updated in the database
    $preference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', WeeklyRecommendations::class)
        ->first();

    expect($preference)->not->toBeNull();
    expect($preference->is_enabled)->toBeFalse();
    expect($preference->cron_expression)->toBe('0 18 * * 5'); // Friday 6pm
});

test('user can enable weekly digest', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => true,
        'digest_day' => 'wednesday',
        'digest_time' => 'afternoon',
        'task_reminder' => false,
        'reminder_day' => 'friday',
        'reminder_time' => 'morning',
        'push_notifications' => false,
    ]);

    $response->assertRedirect();

    $preference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', WeeklyRecommendations::class)
        ->first();

    expect($preference->is_enabled)->toBeTrue();
    expect($preference->cron_expression)->toBe('0 13 * * 3'); // Wednesday 1pm
});

test('existing preferences are updated not duplicated', function () {
    $user = User::factory()->create();

    // Create an existing preference
    NotificationPreference::factory()->create([
        'user_id' => $user->id,
        'notification_class' => WeeklyRecommendations::class,
        'is_enabled' => true,
        'cron_expression' => '0 8 * * 1',
    ]);

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => false,
        'digest_day' => 'sunday',
        'digest_time' => 'morning',
        'task_reminder' => true,
        'reminder_day' => 'tuesday',
        'reminder_time' => 'evening',
        'push_notifications' => false,
    ]);

    $response->assertRedirect();

    // Should still only have one preference record
    $preferences = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', WeeklyRecommendations::class)
        ->get();

    expect($preferences)->toHaveCount(1);
    expect($preferences->first()->is_enabled)->toBeFalse();
    expect($preferences->first()->cron_expression)->toBe('0 8 * * 0'); // Sunday 8am
});

test('validation fails with invalid data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('notifications.update'), [
        'weekly_digest' => 'invalid',
        'digest_day' => 'invalid_day',
        'digest_time' => 'invalid_time',
        'task_reminder' => 'invalid',
        'reminder_day' => 'invalid_day',
        'reminder_time' => 'invalid_time',
        'push_notifications' => 'invalid',
    ]);

    $response->assertSessionHasErrors([
        'weekly_digest',
        'digest_day',
        'digest_time',
        'task_reminder',
        'reminder_day',
        'reminder_time',
        'push_notifications',
    ]);
});

test('validation fails with missing required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('notifications.update'), []);

    $response->assertSessionHasErrors([
        'weekly_digest',
        'digest_day',
        'digest_time',
        'task_reminder',
        'reminder_day',
        'reminder_time',
        'push_notifications',
    ]);
});

test('cron expression is built correctly for different day and time combinations', function () {
    $user = User::factory()->create();

    $testCases = [
        ['sunday', 'morning', '0 8 * * 0'],
        ['monday', 'afternoon', '0 13 * * 1'],
        ['tuesday', 'evening', '0 18 * * 2'],
        ['wednesday', 'morning', '0 8 * * 3'],
        ['thursday', 'afternoon', '0 13 * * 4'],
        ['friday', 'evening', '0 18 * * 5'],
        ['saturday', 'morning', '0 8 * * 6'],
    ];

    foreach ($testCases as [$day, $time, $expectedCron]) {
        $this->actingAs($user)->patch(route('notifications.update'), [
            'weekly_digest' => true,
            'digest_day' => $day,
            'digest_time' => $time,
            'task_reminder' => false,
            'reminder_day' => 'friday',
            'reminder_time' => 'morning',
            'push_notifications' => false,
        ]);

        $preference = NotificationPreference::where('user_id', $user->id)
            ->where('notification_class', WeeklyRecommendations::class)
            ->first();

        expect($preference->cron_expression)->toBe($expectedCron);
    }
});

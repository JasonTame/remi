<?php

use App\Listeners\RegisteredListener;
use App\Mail\OnboardingWelcome;
use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;

test('registered listener sends welcome email and creates default notification preferences', function () {
    Mail::fake();

    $user = User::factory()->create();

    $listener = new RegisteredListener;
    $event = new Registered($user);

    $listener->handle($event);

    // Assert welcome email was sent
    Mail::assertSent(OnboardingWelcome::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });

    // Assert default notification preference was created
    $preference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', WeeklyRecommendations::class)
        ->first();

    expect($preference)->not->toBeNull();
    expect($preference->is_enabled)->toBeTrue();
    expect($preference->cron_expression)->toBe('0 8 * * 1'); // Monday 8am GMT
});

test('registered listener creates notification preferences when user registers through event', function () {
    Mail::fake();

    $user = User::factory()->create();

    // Dispatch the Registered event
    Event::dispatch(new Registered($user));

    // Assert default notification preference was created
    $preference = NotificationPreference::where('user_id', $user->id)
        ->where('notification_class', WeeklyRecommendations::class)
        ->first();

    expect($preference)->not->toBeNull();
    expect($preference->is_enabled)->toBeTrue();
    expect($preference->cron_expression)->toBe('0 8 * * 1');
});

test('registered listener handles multiple users correctly', function () {
    Mail::fake();

    $users = User::factory()->count(3)->create();
    $listener = new RegisteredListener;

    foreach ($users as $user) {
        $event = new Registered($user);
        $listener->handle($event);
    }

    // Assert each user has their own notification preference
    foreach ($users as $user) {
        $preference = NotificationPreference::where('user_id', $user->id)
            ->where('notification_class', WeeklyRecommendations::class)
            ->first();

        expect($preference)->not->toBeNull();
        expect($preference->is_enabled)->toBeTrue();
        expect($preference->cron_expression)->toBe('0 8 * * 1');
    }

    // Assert total count is correct
    expect(NotificationPreference::count())->toBe(3);
});

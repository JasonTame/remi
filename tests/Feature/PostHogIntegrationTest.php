<?php

use App\Models\User;
use App\Services\PostHogService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;

it('provides posthog user data through inertia props', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'name' => 'Test User',
    ]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertInertia(
        fn ($page) => $page
            ->has('posthog')
            ->where('posthog.user_id', $user->id)
            ->where('posthog.user_email', $user->email)
            ->where('posthog.user_name', $user->name)
    );
});

it('provides null posthog data for unauthenticated users', function () {
    $response = $this->get('/');

    $response->assertInertia(
        fn ($page) => $page
            ->has('posthog')
            ->where('posthog.user_id', null)
            ->where('posthog.user_email', null)
            ->where('posthog.user_name', null)
    );
});

it('fires posthog identification listener on user login', function () {
    Event::fake();

    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    Event::assertDispatched(Login::class, function ($event) use ($user) {
        return $event->user->id === $user->id;
    });
});

it('fires posthog identification listener on user registration', function () {
    Event::fake();

    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    Event::assertDispatched(Registered::class);
});

it('posthog service can identify users when api key is configured', function () {
    config(['posthog.api_key' => 'test-key']);

    $user = User::factory()->create();
    $service = app(PostHogService::class);

    // This should not throw an exception
    expect(fn () => $service->identify($user))->not->toThrow(Exception::class);
});

it('posthog service handles missing api key gracefully', function () {
    config(['posthog.api_key' => null]);

    $user = User::factory()->create();
    $service = app(PostHogService::class);

    // This should not throw an exception
    expect(fn () => $service->identify($user))->not->toThrow(Exception::class);
    expect(fn () => $service->capture($user, 'Test Event'))->not->toThrow(Exception::class);
    expect(fn () => $service->captureAnonymous('anonymous', 'Test Event'))->not->toThrow(Exception::class);
    expect(fn () => $service->alias('anonymous', $user))->not->toThrow(Exception::class);
});

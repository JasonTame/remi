<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

use function Pest\Laravel\mock;

test('google redirect returns redirect response', function () {
    $response = $this->get(route('auth.google'));

    $response->assertRedirect();
});

test('google callback creates new user when user does not exist', function () {
    $googleUser = mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn('123456789');
    $googleUser->shouldReceive('getName')->andReturn('John Doe');
    $googleUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $googleUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');
    $googleUser->id = '123456789';
    $googleUser->name = 'John Doe';
    $googleUser->email = 'john@example.com';
    $googleUser->avatar = 'https://example.com/avatar.jpg';

    Socialite::shouldReceive('driver')
        ->with('google')
        ->andReturnSelf()
        ->shouldReceive('user')
        ->andReturn($googleUser);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('onboarding'));

    $user = User::where('email', 'john@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('John Doe');
    expect($user->google_id)->toBe('123456789');
    expect($user->avatar)->toBe('https://example.com/avatar.jpg');
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->onboarding_completed)->toBeFalse();
});

test('google callback logs in existing user with google id', function () {
    $user = User::factory()->create([
        'google_id' => '123456789',
        'email' => 'john@example.com',
        'onboarding_completed' => true,
    ]);

    $googleUser = mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn('123456789');
    $googleUser->id = '123456789';

    Socialite::shouldReceive('driver')
        ->with('google')
        ->andReturnSelf()
        ->shouldReceive('user')
        ->andReturn($googleUser);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
});

test('google callback links google account to existing user with same email', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'google_id' => null,
        'onboarding_completed' => true,
    ]);

    $googleUser = mock(SocialiteUser::class);
    $googleUser->shouldReceive('getId')->andReturn('123456789');
    $googleUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');
    $googleUser->id = '123456789';
    $googleUser->email = 'john@example.com';
    $googleUser->avatar = 'https://example.com/avatar.jpg';

    Socialite::shouldReceive('driver')
        ->with('google')
        ->andReturnSelf()
        ->shouldReceive('user')
        ->andReturn($googleUser);

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);

    $user->refresh();
    expect($user->google_id)->toBe('123456789');
    expect($user->avatar)->toBe('https://example.com/avatar.jpg');
});

test('google callback handles socialite exception gracefully', function () {
    Socialite::shouldReceive('driver')
        ->with('google')
        ->andReturnSelf()
        ->shouldReceive('user')
        ->andThrow(new Exception('OAuth error'));

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHas('error', 'Unable to login using Google. Please try again.');
});

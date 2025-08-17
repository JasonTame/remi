<?php

use App\Models\User;

test('user is redirected to onboarding when not completed', function () {
    $user = User::factory()->create(['onboarding_completed' => false]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertRedirect('/onboarding');
});

test('user can access dashboard when onboarding is completed', function () {
    $user = User::factory()->create(['onboarding_completed' => true]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
});

test('user can store categories during onboarding', function () {
    $user = User::factory()->create(['onboarding_completed' => false]);

    $categories = [
        ['id' => 'health', 'name' => 'Health', 'color' => 'blue', 'icon' => ''],
        ['id' => 'home', 'name' => 'Home', 'color' => 'green', 'icon' => ''],
    ];

    $response = $this->actingAs($user)->post('/onboarding/categories', [
        'categories' => $categories,
    ]);

    $response->assertRedirect();
    expect($user->fresh()->categories)->toHaveCount(2);
    expect($user->categories->first()->name)->toBe('Health');
});

test('user can store tasks during onboarding', function () {
    $user = User::factory()->create(['onboarding_completed' => false]);

    // Create a category first
    $category = $user->categories()->create([
        'name' => 'Health',
        'color' => 'blue',
    ]);

    $tasks = [
        ['id' => 'dental', 'title' => 'Dental checkup', 'frequency' => 'Every 6 months', 'category' => 'Health'],
    ];

    $response = $this->actingAs($user)->post('/onboarding/tasks', [
        'tasks' => $tasks,
    ]);

    $response->assertRedirect();
    expect($user->fresh()->tasks)->toHaveCount(1);
    expect($user->tasks->first()->title)->toBe('Dental checkup');
});

test('user can complete onboarding', function () {
    $user = User::factory()->create(['onboarding_completed' => false]);

    $response = $this->actingAs($user)->post('/onboarding/complete');

    $response->assertRedirect();
    expect($user->fresh()->onboarding_completed)->toBeTrue();
});

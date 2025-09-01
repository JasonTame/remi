<?php

use App\Models\Task;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['task_limit' => 3]);
    $this->actingAs($this->user);
});

test('user has default task limit of 15', function () {
    $user = User::factory()->create();

    expect($user->task_limit)->toBe(15);
});

test('user can create tasks within limit', function () {
    $response = $this->post(route('tasks.store'), [
        'title' => 'Test Task',
        'timing_description' => 'Every month',
        'description' => 'Test description',
    ]);

    $response->assertRedirect(route('tasks.index'));
    expect($this->user->tasks()->count())->toBe(1);
});

test('user cannot create tasks when limit is reached', function () {
    // Create tasks up to the limit
    Task::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->post(route('tasks.store'), [
        'title' => 'Test Task',
        'timing_description' => 'Every month',
        'description' => 'Test description',
    ]);

    $response->assertSessionHasErrors(['task_limit']);
    expect($this->user->tasks()->count())->toBe(3);
});

test('hasReachedTaskLimit returns correct value', function () {
    expect($this->user->hasReachedTaskLimit())->toBeFalse();

    Task::factory()->count(3)->create(['user_id' => $this->user->id]);

    expect($this->user->fresh()->hasReachedTaskLimit())->toBeTrue();
});

test('getRemainingTasksCount returns correct value', function () {
    expect($this->user->getRemainingTasksCount())->toBe(3);

    Task::factory()->count(2)->create(['user_id' => $this->user->id]);

    expect($this->user->fresh()->getRemainingTasksCount())->toBe(1);

    Task::factory()->create(['user_id' => $this->user->id]);

    expect($this->user->fresh()->getRemainingTasksCount())->toBe(0);
});

test('getTasksCount returns correct value', function () {
    expect($this->user->getTasksCount())->toBe(0);

    Task::factory()->count(2)->create(['user_id' => $this->user->id]);

    expect($this->user->fresh()->getTasksCount())->toBe(2);
});

test('task limit validation shows appropriate error message', function () {
    Task::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->post(route('tasks.store'), [
        'title' => 'Test Task',
        'timing_description' => 'Every month',
    ]);

    $response->assertSessionHasErrors(['task_limit']);
    $errors = session('errors')->getBag('default');
    expect($errors->get('task_limit')[0])->toContain('You have reached your task limit of 3 tasks');
});

test('tasks index page includes task limit information', function () {
    Task::factory()->count(2)->create(['user_id' => $this->user->id]);

    $response = $this->get(route('tasks.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->has('taskLimit')
            ->where('taskLimit.current', 2)
            ->where('taskLimit.limit', 3)
            ->where('taskLimit.remaining', 1)
            ->where('taskLimit.hasReachedLimit', false)
    );
});

test('tasks index shows limit reached when at limit', function () {
    Task::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->get(route('tasks.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->has('taskLimit')
            ->where('taskLimit.current', 3)
            ->where('taskLimit.limit', 3)
            ->where('taskLimit.remaining', 0)
            ->where('taskLimit.hasReachedLimit', true)
    );
});

test('user with higher task limit can create more tasks', function () {
    $premiumUser = User::factory()->create(['task_limit' => 100]);
    $this->actingAs($premiumUser);

    Task::factory()->count(20)->create(['user_id' => $premiumUser->id]);

    $response = $this->post(route('tasks.store'), [
        'title' => 'Test Task',
        'timing_description' => 'Every month',
    ]);

    $response->assertRedirect(route('tasks.index'));
    expect($premiumUser->tasks()->count())->toBe(21);
});

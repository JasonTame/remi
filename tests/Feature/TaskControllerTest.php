<?php

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use App\Services\PrismService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('index displays user tasks', function () {
    $user = User::factory()->create();
    Task::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('tasks.index'));

    $response->assertStatus(200);
    $response->assertInertia(
        fn($assert) => $assert
            ->component('tasks/index')
            ->has('tasks', 3)
    );
});

test('create shows task creation form', function () {
    $user = User::factory()->create();
    Category::factory()->count(2)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('tasks.create'));

    $response->assertStatus(200);
    $response->assertInertia(
        fn($assert) => $assert
            ->component('tasks/create')
            ->has('categories', 2)
    );
});

test('store creates a new task', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user->id]);

    $this->mock(PrismService::class, function ($mock) {
        $mock->shouldReceive('analyzeTiming')
            ->once()
            ->andReturn([
                'estimated_frequency_days' => 30,
                'explanation' => 'This task occurs monthly',
                'confidence' => 8
            ]);
    });

    $response = $this->actingAs($user)->post(route('tasks.store'), [
        'title' => 'Test Task',
        'timing_description' => 'Once a month',
        'category_id' => $category->id,
    ]);

    $response->assertRedirect(route('tasks.index'));
    $this->assertDatabaseHas('tasks', [
        'user_id' => $user->id,
        'title' => 'Test Task',
        'timing_description' => 'Once a month',
        'category_id' => $category->id,
    ]);
});

test('show displays the task details', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('tasks.show', $task));

    $response->assertStatus(200);
    $response->assertInertia(
        fn($assert) => $assert
            ->component('tasks/show')
            ->has(
                'task',
                fn($assert) => $assert
                    ->where('id', $task->id)
                    ->where('title', $task->title)
            )
    );
});

test('edit displays the edit form', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('tasks.edit', $task));

    $response->assertStatus(200);
    $response->assertInertia(
        fn($assert) => $assert
            ->component('tasks/edit')
            ->has(
                'task',
                fn($assert) => $assert
                    ->where('id', $task->id)
                    ->where('title', $task->title)
            )
    );
});

test('update modifies the task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);
    $newCategory = Category::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('tasks.update', $task), [
        'title' => 'Updated Title',
        'timing_description' => 'Every three months',
        'category_id' => $newCategory->id,
    ]);

    $response->assertRedirect(route('tasks.show', $task));
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated Title',
        'timing_description' => 'Every three months',
        'category_id' => $newCategory->id,
    ]);
});

test('destroy deletes the task', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('tasks.destroy', $task));

    $response->assertRedirect(route('tasks.index'));
    $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
});

test('complete marks a task as completed', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user->id, 'last_completed_at' => null]);

    $response = $this->actingAs($user)->post(route('tasks.complete', $task), [
        'notes' => 'Completion notes',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('task_histories', [
        'task_id' => $task->id,
        'notes' => 'Completion notes',
    ]);
    $this->assertNotNull($task->fresh()->last_completed_at);
});

test('users cannot view tasks they do not own', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user1->id]);

    $response = $this->actingAs($user2)->get(route('tasks.show', $task));

    $response->assertStatus(403);
});

test('users cannot edit tasks they do not own', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user1->id]);

    $response = $this->actingAs($user2)->get(route('tasks.edit', $task));

    $response->assertStatus(403);
});

test('users cannot update tasks they do not own', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user1->id]);

    $response = $this->actingAs($user2)->put(route('tasks.update', $task), [
        'title' => 'Updated Title',
        'timing_description' => 'Every day',
    ]);

    $response->assertStatus(403);
});

test('users cannot delete tasks they do not own', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $task = Task::factory()->create(['user_id' => $user1->id]);

    $response = $this->actingAs($user2)->delete(route('tasks.destroy', $task));

    $response->assertStatus(403);
});

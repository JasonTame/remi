<?php

use App\Models\RecommendedTask;
use App\Models\Task;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Services\PrismService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('current shows existing recommendations', function () {
    $user = User::factory()->create();
    $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => $weekStartDate,
    ]);

    $tasks = Task::factory()->count(3)->create(['user_id' => $user->id]);

    $recommendedTasks = $tasks->map(function ($task, $index) use ($weeklyRecommendation) {
        return RecommendedTask::factory()->create([
            'weekly_recommendation_id' => $weeklyRecommendation->id,
            'task_id' => $task->id,
            'priority' => 5 - $index,
            'reason' => "Reason $index",
        ]);
    });

    $response = $this->actingAs($user)->get(route('recommendations.current'));

    $response->assertStatus(200);
    $response->assertInertia(
        fn ($assert) => $assert
            ->component('recommendations/current')
            ->where('weekStartDate', $weekStartDate)
            ->has('recommendedTasks', 3)
    );
});

test('current generates new recommendations when none exist', function () {
    $user = User::factory()->create();
    $tasks = Task::factory()->count(3)->create(['user_id' => $user->id]);

    $this->mock(PrismService::class, function ($mock) {
        $mock->shouldReceive('generateRecommendations')
            ->once()
            ->andReturn([
                ['task_id' => 1, 'priority' => 5, 'reason' => 'High priority'],
                ['task_id' => 2, 'priority' => 3, 'reason' => 'Medium priority'],
            ]);
    });

    $response = $this->actingAs($user)->get(route('recommendations.current'));

    $response->assertStatus(200);
    $this->assertDatabaseHas('weekly_recommendations', [
        'user_id' => $user->id,
    ]);
});

test('generate creates new recommendations', function () {
    $user = User::factory()->create();
    $tasks = Task::factory()->count(3)->create(['user_id' => $user->id]);
    $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

    // Create an existing recommendation that should be replaced
    $existingRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
        'week_start_date' => $weekStartDate,
    ]);

    RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $existingRecommendation->id,
        'task_id' => $tasks[0]->id,
    ]);

    $this->mock(PrismService::class, function ($mock) use ($tasks) {
        $mock->shouldReceive('generateRecommendations')
            ->once()
            ->andReturn([
                ['task_id' => $tasks[0]->id, 'priority' => 5, 'reason' => 'New reason'],
                ['task_id' => $tasks[1]->id, 'priority' => 4, 'reason' => 'Another reason'],
            ]);
    });

    $response = $this->actingAs($user)->post(route('recommendations.generate'));

    $response->assertRedirect(route('recommendations.current'));

    // Should have replaced the old recommendation
    $this->assertDatabaseMissing('weekly_recommendations', [
        'id' => $existingRecommendation->id,
    ]);

    // Should have created a new one
    $this->assertDatabaseHas('weekly_recommendations', [
        'user_id' => $user->id,
        'week_start_date' => $weekStartDate,
    ]);
});

test('completeTask marks a recommended task as completed', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create([
        'user_id' => $user->id,
        'last_completed_at' => null,
    ]);

    $weeklyRecommendation = WeeklyRecommendation::factory()->create([
        'user_id' => $user->id,
    ]);

    $recommendedTask = RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
        'completed' => false,
    ]);

    $response = $this->actingAs($user)->post(route('recommended-tasks.complete', $recommendedTask));

    $response->assertRedirect();

    // The recommended task should be completed
    $this->assertDatabaseHas('recommended_tasks', [
        'id' => $recommendedTask->id,
        'completed' => true,
    ]);

    // A task history entry should be created
    $this->assertDatabaseHas('task_histories', [
        'task_id' => $task->id,
    ]);

    // The task's last_completed_at should be updated
    $this->assertNotNull($task->fresh()->last_completed_at);
});

test('users cannot complete recommended tasks they do not own', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $task = Task::factory()->create(['user_id' => $user1->id]);
    $weeklyRecommendation = WeeklyRecommendation::factory()->create(['user_id' => $user1->id]);
    $recommendedTask = RecommendedTask::factory()->create([
        'weekly_recommendation_id' => $weeklyRecommendation->id,
        'task_id' => $task->id,
    ]);

    $response = $this->actingAs($user2)->post(route('recommended-tasks.complete', $recommendedTask));

    $response->assertStatus(403);
});

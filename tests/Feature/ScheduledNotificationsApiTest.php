<?php

use App\Jobs\ProcessScheduledNotificationsJob;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Queue::fake();
});

it('can trigger scheduled notifications with valid token', function () {
    config(['schedule.trigger_token' => 'test-token-123']);

    $response = $this->postJson('/api/trigger/scheduled-notifications', [], [
        'X-Trigger-Token' => 'test-token-123',
    ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'Scheduled notifications job dispatched successfully',
        ])
        ->assertJsonStructure([
            'success',
            'message',
            'timestamp',
        ]);

    Queue::assertPushed(ProcessScheduledNotificationsJob::class);
});

it('rejects requests without valid token', function () {
    config(['schedule.trigger_token' => 'test-token-123']);

    $response = $this->postJson('/api/trigger/scheduled-notifications', [], [
        'X-Trigger-Token' => 'wrong-token',
    ]);

    $response->assertUnauthorized()
        ->assertJson([
            'success' => false,
            'message' => 'Unauthorized',
        ]);

    Queue::assertNotPushed(ProcessScheduledNotificationsJob::class);
});

it('rejects requests without token header', function () {
    config(['schedule.trigger_token' => 'test-token-123']);

    $response = $this->postJson('/api/trigger/scheduled-notifications');

    $response->assertUnauthorized()
        ->assertJson([
            'success' => false,
            'message' => 'Unauthorized',
        ]);

    Queue::assertNotPushed(ProcessScheduledNotificationsJob::class);
});

it('handles job dispatch exceptions gracefully', function () {
    config(['schedule.trigger_token' => 'test-token-123']);

    // Mock Queue to throw an exception
    Queue::shouldReceive('push')
        ->andThrow(new \Exception('Queue connection failed'));

    $response = $this->postJson('/api/trigger/scheduled-notifications', [], [
        'X-Trigger-Token' => 'test-token-123',
    ]);

    $response->assertStatus(500)
        ->assertJson([
            'success' => false,
        ])
        ->assertJsonStructure([
            'success',
            'message',
            'timestamp',
        ]);
});

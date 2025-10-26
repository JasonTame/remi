<?php

use App\Http\Controllers\Api\ScheduledNotificationsController;
use App\Http\Controllers\Api\TaskHistoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Scheduled Notifications Trigger
Route::post('/trigger/scheduled-notifications', [ScheduledNotificationsController::class, 'trigger'])
    ->name('api.trigger.scheduled-notifications');

// Task History API Routes
Route::prefix('users/{userId}')->group(function () {
    // Get all task history for a user
    Route::get('/task-history', [TaskHistoryController::class, 'getUserTaskHistory'])
        ->name('api.users.task-history');

    // Get task history with filters and pagination
    Route::get('/task-history/filtered', [TaskHistoryController::class, 'getUserTaskHistoryWithFilters'])
        ->name('api.users.task-history.filtered');
});

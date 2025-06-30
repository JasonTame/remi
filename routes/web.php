<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskHistoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Task routes
    Route::resource('tasks', TaskController::class);
    Route::post('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::post('tasks/{task}/skip', [TaskController::class, 'skip'])->name('tasks.skip');

    // Task History route
    Route::get('/task-history', [TaskHistoryController::class, 'index'])->name('task-history');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';

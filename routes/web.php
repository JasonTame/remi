<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\WeeklyRecommendationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Task routes
    Route::resource('tasks', TaskController::class);
    Route::post('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');

    // Weekly recommendation routes
    Route::get('recommendations', [WeeklyRecommendationController::class, 'current'])->name('recommendations.current');
    Route::post('recommendations/generate', [WeeklyRecommendationController::class, 'generate'])->name('recommendations.generate');
    Route::post('recommended-tasks/{recommendedTask}/complete', [WeeklyRecommendationController::class, 'completeTask'])->name('recommended-tasks.complete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

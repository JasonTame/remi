<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PrivacyController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskHistoryController;
use App\Http\Controllers\TermsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
});

Route::get('/privacy', [PrivacyController::class, 'index'])->name('privacy');
Route::get('/terms', [TermsController::class, 'index'])->name('terms');

Route::middleware(['auth', 'verified'])->group(function () {
    // Onboarding route and API endpoints (no onboarding middleware needed here)
    Route::get('/onboarding', function () {
        return Inertia::render('onboarding');
    })->name('onboarding');

    // Onboarding API routes
    Route::prefix('onboarding')->name('onboarding.')->group(function () {
        Route::post('/categories', [OnboardingController::class, 'storeCategories'])->name('categories.store');
        Route::post('/tasks', [OnboardingController::class, 'storeTasks'])->name('tasks.store');
        Route::post('/generate-recommendations', [OnboardingController::class, 'generateRecommendations'])->name('recommendations.generate');
        Route::post('/complete', [OnboardingController::class, 'completeOnboarding'])->name('complete');
        Route::get('/categories', [OnboardingController::class, 'getUserCategories'])->name('categories.index');
    });

    // Routes that require onboarding to be completed
    Route::middleware(['onboarding.completed'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Task routes
        Route::resource('tasks', TaskController::class);
        Route::post('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
        Route::post('tasks/{task}/skip', [TaskController::class, 'skip'])->name('tasks.skip');

        // Task History route
        Route::get('/task-history', [TaskHistoryController::class, 'index'])->name('task-history');
    });
});

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

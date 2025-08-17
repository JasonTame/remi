<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoriesRequest;
use App\Http\Requests\StoreTasksRequest;
use App\Jobs\GenerateTaskRecommendationsJob;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function storeCategories(StoreCategoriesRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $categories = $request->validated()['categories'];

        DB::transaction(function () use ($user, $categories) {
            // Delete existing categories for this user (in case they're updating)
            $user->categories()->delete();

            foreach ($categories as $categoryData) {
                $user->categories()->create([
                    'name' => $categoryData['name'],
                    'color' => $categoryData['color'],
                ]);
            }
        });

        return back()->with('success', 'Categories saved successfully');
    }

    public function storeTasks(StoreTasksRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $tasks = $request->validated()['tasks'];

        DB::transaction(function () use ($user, $tasks) {
            // Delete existing tasks for this user (in case they're updating)
            $user->tasks()->delete();

            foreach ($tasks as $taskData) {
                $category = $user->categories()->where('name', $taskData['category'])->first();

                $user->tasks()->create([
                    'category_id' => $category?->id,
                    'title' => $taskData['title'],
                    'timing_description' => $taskData['frequency'],
                ]);
            }
        });

        return back()->with('success', 'Tasks saved successfully');
    }

    public function generateRecommendations(): RedirectResponse
    {
        $user = Auth::user();

        GenerateTaskRecommendationsJob::dispatch($user->id, true);

        return back()->with('success', 'Weekly recommendations generation started');
    }

    public function completeOnboarding(): RedirectResponse
    {
        $user = Auth::user();

        $user->update([
            'onboarding_completed' => true,
        ]);

        return back()->with('success', 'Onboarding completed successfully');
    }

    public function getUserCategories(): JsonResponse
    {
        $user = Auth::user();

        $categories = $user->categories()->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'color' => $category->color,
            ];
        });

        return response()->json([
            'categories' => $categories,
        ]);
    }
}

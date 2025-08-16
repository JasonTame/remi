<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreCategoryRequest;
use App\Http\Requests\Settings\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display the categories management page.
     */
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $categories = $user->categories()
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'color' => $category->color,
                ];
            });

        return Inertia::render('settings/categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        /** @var \App\Models\User $user */
        $user = $request->user();

        $user->categories()->create([
            'name' => $validated['name'],
            'color' => $validated['color'],
        ]);

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Ensure the category belongs to the authenticated user
        if ($category->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $category->update([
            'name' => $validated['name'],
            'color' => $validated['color'],
        ]);

        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Ensure the category belongs to the authenticated user
        if ($category->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Check if category has tasks
        if ($category->tasks()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete category that has tasks assigned to it.');
        }

        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}

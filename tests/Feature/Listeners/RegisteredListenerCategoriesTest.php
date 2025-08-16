<?php

use App\Enums\CategoryColor;
use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

it('creates default categories when user registers', function () {
    $user = User::factory()->create();

    // Ensure no categories exist initially
    expect($user->categories()->count())->toBe(0);

    // Fire the registered event
    event(new Registered($user));

    // Check that default categories were created
    $user->refresh();
    expect($user->categories()->count())->toBe(4);

    $categories = $user->categories()->get();

    expect($categories->pluck('name')->toArray())->toContain('Medical & Health');
    expect($categories->pluck('name')->toArray())->toContain('Home Maintenance');
    expect($categories->pluck('name')->toArray())->toContain('Administrative & Financial');
    expect($categories->pluck('name')->toArray())->toContain('Personal & Social');

    // Check colors are set correctly
    $medicalCategory = $categories->where('name', 'Medical & Health')->first();
    expect($medicalCategory->color)->toBe(CategoryColor::Blue->value);

    $homeCategory = $categories->where('name', 'Home Maintenance')->first();
    expect($homeCategory->color)->toBe(CategoryColor::Green->value);

    $adminCategory = $categories->where('name', 'Administrative & Financial')->first();
    expect($adminCategory->color)->toBe(CategoryColor::Gray->value);

    $personalCategory = $categories->where('name', 'Personal & Social')->first();
    expect($personalCategory->color)->toBe(CategoryColor::Orange->value);
});

it('creates categories for different users independently', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    // Fire events for both users
    event(new Registered($user1));
    event(new Registered($user2));

    // Both users should have their own categories
    expect($user1->categories()->count())->toBe(4);
    expect($user2->categories()->count())->toBe(4);

    // Categories should belong to the correct users
    $user1Categories = $user1->categories()->get();
    $user2Categories = $user2->categories()->get();

    foreach ($user1Categories as $category) {
        expect($category->user_id)->toBe($user1->id);
    }

    foreach ($user2Categories as $category) {
        expect($category->user_id)->toBe($user2->id);
    }
});

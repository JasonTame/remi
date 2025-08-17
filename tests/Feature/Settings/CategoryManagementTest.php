<?php

use App\Enums\CategoryColor;
use App\Models\Category;
use App\Models\User;

it('displays categories page with user categories', function () {
    $user = User::factory()->create();
    $categories = Category::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('categories.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('settings/categories')
            ->has('categories', 3)
            ->has('categories.0.id')
            ->has('categories.0.name')
            ->has('categories.0.color')
    );
});

it('can create a new category', function () {
    $user = User::factory()->create();

    $categoryData = [
        'name' => 'Test Category',
        'color' => CategoryColor::Blue->value,
    ];

    $response = $this->actingAs($user)->post(route('categories.store'), $categoryData);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Category created successfully.');

    $this->assertDatabaseHas('categories', [
        'name' => 'Test Category',
        'color' => CategoryColor::Blue->value,
        'user_id' => $user->id,
    ]);
});

it('validates category creation data', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('categories.store'), [
        'name' => '', // Required field
        'color' => 'invalid-color', // Invalid color
    ]);

    $response->assertSessionHasErrors(['name', 'color']);
});

it('prevents duplicate category names for same user', function () {
    $user = User::factory()->create();
    Category::factory()->create(['name' => 'Existing Category', 'user_id' => $user->id]);

    $response = $this->actingAs($user)->post(route('categories.store'), [
        'name' => 'Existing Category',
        'color' => CategoryColor::Blue->value,
    ]);

    $response->assertSessionHasErrors(['name']);
});

it('allows same category name for different users', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    Category::factory()->create(['name' => 'Same Name', 'user_id' => $user1->id]);

    $response = $this->actingAs($user2)->post(route('categories.store'), [
        'name' => 'Same Name',
        'color' => CategoryColor::Blue->value,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
});

it('can update a category', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user->id]);

    $updateData = [
        'name' => 'Updated Category',
        'color' => CategoryColor::Red->value,
    ];

    $response = $this->actingAs($user)->patch(route('categories.update', $category), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Category updated successfully.');

    $category->refresh();
    expect($category->name)->toBe('Updated Category');
    expect($category->color)->toBe(CategoryColor::Red->value);
});

it('prevents updating category that belongs to another user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user1->id]);

    $response = $this->actingAs($user2)->patch(route('categories.update', $category), [
        'name' => 'Hacked Category',
        'color' => CategoryColor::Red->value,
    ]);

    $response->assertForbidden();
});

it('can delete a category without tasks', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete(route('categories.destroy', $category));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Category deleted successfully.');

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});

it('prevents deleting category that has tasks', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user->id]);

    // Create a task with this category
    $user->tasks()->create([
        'title' => 'Test Task',
        'timing_description' => 'Every week',
        'description' => 'Test Description',
        'category_id' => $category->id,
    ]);

    $response = $this->actingAs($user)->delete(route('categories.destroy', $category));

    $response->assertRedirect();
    $response->assertSessionHas('error', 'Cannot delete category that has tasks assigned to it.');

    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});

it('prevents deleting category that belongs to another user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $category = Category::factory()->create(['user_id' => $user1->id]);

    $response = $this->actingAs($user2)->delete(route('categories.destroy', $category));

    $response->assertForbidden();
});

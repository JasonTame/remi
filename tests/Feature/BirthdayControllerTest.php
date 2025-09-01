<?php

use App\Models\Birthday;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create(['onboarding_completed' => true]);
    $this->actingAs($this->user);
});

it('can view birthdays index page', function () {
    Birthday::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->get(route('birthdays.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn($page) => $page
            ->component('birthdays/index')
            ->has('birthdays', 3)
    );
});

it('can create multiple birthdays', function () {
    $birthdaysData = [
        [
            'name' => 'John Doe',
            'birthday' => '1990-05-15',
            'birth_year' => 1990,
            'relationship' => 'Friend',
            'notes' => 'Loves chocolate cake',
        ],
        [
            'name' => 'Jane Smith',
            'birthday' => '1985-12-25',
            'birth_year' => 1985,
            'relationship' => 'Family',
            'notes' => null,
        ],
    ];

    $response = $this->post(route('birthdays.store'), [
        'birthdays' => $birthdaysData,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', '2 birthdays added successfully!');

    $this->assertDatabaseCount('birthdays', 2);

    $this->assertDatabaseHas('birthdays', [
        'user_id' => $this->user->id,
        'name' => 'John Doe',
        'birthday' => '1990-05-15',
        'birth_year' => 1990,
        'relationship' => 'Friend',
        'notes' => 'Loves chocolate cake',
    ]);

    $this->assertDatabaseHas('birthdays', [
        'user_id' => $this->user->id,
        'name' => 'Jane Smith',
        'birthday' => '1985-12-25',
        'birth_year' => 1985,
        'relationship' => 'Family',
        'notes' => null,
    ]);
});

it('can create single birthday', function () {
    $response = $this->post(route('birthdays.store'), [
        'birthdays' => [
            [
                'name' => 'John Doe',
                'birthday' => '1990-05-15',
                'birth_year' => 1990,
                'relationship' => 'Friend',
                'notes' => 'Loves chocolate cake',
            ],
        ],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Birthday added successfully!');

    $this->assertDatabaseCount('birthdays', 1);
});

it('validates required fields when creating birthdays', function () {
    $response = $this->post(route('birthdays.store'), [
        'birthdays' => [
            [
                'name' => '',
                'birthday' => '',
            ],
        ],
    ]);

    $response->assertSessionHasErrors([
        'birthdays.0.name',
        'birthdays.0.birthday',
    ]);
});

it('validates birthday date format', function () {
    $response = $this->post(route('birthdays.store'), [
        'birthdays' => [
            [
                'name' => 'John Doe',
                'birthday' => 'invalid-date',
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['birthdays.0.birthday']);
});

it('validates birth year range', function () {
    $response = $this->post(route('birthdays.store'), [
        'birthdays' => [
            [
                'name' => 'John Doe',
                'birthday' => '1990-05-15',
                'birth_year' => 1800, // Too old
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['birthdays.0.birth_year']);

    $response = $this->post(route('birthdays.store'), [
        'birthdays' => [
            [
                'name' => 'John Doe',
                'birthday' => '1990-05-15',
                'birth_year' => date('Y') + 1, // Future year
            ],
        ],
    ]);

    $response->assertSessionHasErrors(['birthdays.0.birth_year']);
});





it('can update a birthday', function () {
    $birthday = Birthday::factory()->create(['user_id' => $this->user->id]);

    $updateData = [
        'name' => 'Updated Name',
        'birthday' => '1995-06-20',
        'birth_year' => 1995,
        'relationship' => 'Updated Relationship',
        'notes' => 'Updated notes',
    ];

    $response = $this->put(route('birthdays.update', $birthday), $updateData);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Birthday updated successfully!');

    $this->assertDatabaseHas('birthdays', array_merge(
        ['id' => $birthday->id],
        $updateData
    ));
});

it('cannot update another users birthday', function () {
    $otherUser = User::factory()->create();
    $birthday = Birthday::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->put(route('birthdays.update', $birthday), [
        'name' => 'Updated Name',
        'birthday' => '1995-06-20',
    ]);

    $response->assertForbidden();
});

it('can delete a birthday', function () {
    $birthday = Birthday::factory()->create(['user_id' => $this->user->id]);

    $response = $this->delete(route('birthdays.destroy', $birthday));

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Birthday deleted successfully!');

    $this->assertDatabaseMissing('birthdays', ['id' => $birthday->id]);
});

it('cannot delete another users birthday', function () {
    $otherUser = User::factory()->create();
    $birthday = Birthday::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->delete(route('birthdays.destroy', $birthday));

    $response->assertForbidden();
});

it('shows upcoming birthdays on dashboard', function () {
    // Create a birthday that's upcoming (in 5 days)
    $upcomingDate = now()->addDays(5);
    Birthday::factory()->create([
        'user_id' => $this->user->id,
        'birthday' => $upcomingDate->format('Y-m-d'),
        'name' => 'Upcoming Birthday',
    ]);

    // Create a birthday that's not upcoming (in 30 days)
    $farDate = now()->addDays(30);
    Birthday::factory()->create([
        'user_id' => $this->user->id,
        'birthday' => $farDate->format('Y-m-d'),
        'name' => 'Far Birthday',
    ]);

    $response = $this->get(route('dashboard'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn($page) => $page
            ->component('dashboard')
            ->has('upcomingBirthdays', 1)
            ->where('upcomingBirthdays.0.name', 'Upcoming Birthday')
    );
});

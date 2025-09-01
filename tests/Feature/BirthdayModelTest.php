<?php

use App\Models\Birthday;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('calculates age correctly when birth year is provided', function () {
    $user = User::factory()->create();
    $birthday = Birthday::factory()->create([
        'user_id' => $user->id,
        'birthday' => '1990-05-15',
        'birth_year' => 1990,
    ]);

    $expectedAge = Carbon::now()->year - 1990;
    expect($birthday->age)->toBe($expectedAge);
});

it('returns null age when birth year is not provided', function () {
    $user = User::factory()->create();
    $birthday = Birthday::factory()->create([
        'user_id' => $user->id,
        'birthday' => '2000-05-15',
        'birth_year' => null,
    ]);

    expect($birthday->age)->toBeNull();
});

it('calculates next birthday correctly', function () {
    $user = User::factory()->create();

    // Create a birthday for May 15th
    $birthday = Birthday::factory()->create([
        'user_id' => $user->id,
        'birthday' => '1990-05-15',
        'birth_year' => 1990,
    ]);

    $today = Carbon::today();
    $thisYear = $today->year;
    $expectedNextBirthday = Carbon::createFromDate($thisYear, 5, 15);

    if ($expectedNextBirthday->isPast()) {
        $expectedNextBirthday->addYear();
    }

    expect($birthday->next_birthday->format('Y-m-d'))->toBe($expectedNextBirthday->format('Y-m-d'));
});

it('belongs to a user', function () {
    $user = User::factory()->create();
    $birthday = Birthday::factory()->create(['user_id' => $user->id]);

    expect($birthday->user)->toBeInstanceOf(User::class);
    expect($birthday->user->id)->toBe($user->id);
});

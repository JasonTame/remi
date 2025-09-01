<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Birthday>
 */
class BirthdayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $birthday = fake()->dateTimeBetween('-80 years', 'now');

        return [
            'name' => fake()->name(),
            'birthday' => $birthday->format('Y-m-d'),
            'birth_year' => fake()->boolean(70) ? $birthday->format('Y') : null,
            'relationship' => fake()->randomElement([
                'Family',
                'Friend',
                'Colleague',
                'Partner',
                'Sibling',
                'Parent',
                'Child',
                'Cousin',
                'Neighbor',
                'Other'
            ]),
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }

    public function withoutBirthYear(): static
    {
        return $this->state(fn(array $attributes) => [
            'birth_year' => null,
        ]);
    }

    public function family(): static
    {
        return $this->state(fn(array $attributes) => [
            'relationship' => fake()->randomElement(['Parent', 'Sibling', 'Child', 'Cousin']),
        ]);
    }

    public function friend(): static
    {
        return $this->state(fn(array $attributes) => [
            'relationship' => 'Friend',
        ]);
    }
}

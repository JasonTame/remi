<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => null,
            'title' => $this->faker->sentence(4),
            'timing_description' => $this->faker->randomElement([
                'Every month',
                'Once a week',
                'Every 3 months',
                'Twice a year',
                'Every 2-3 weeks',
            ]),
            'description' => $this->faker->optional(0.7)->sentence(10),
            'last_completed_at' => $this->faker->optional(0.7)->dateTimeBetween('-6 months', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function withCategory(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'category_id' => Category::factory()->create([
                    'user_id' => $attributes['user_id'],
                ]),
            ];
        });
    }
}

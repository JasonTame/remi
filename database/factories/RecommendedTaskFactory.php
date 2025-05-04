<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\WeeklyRecommendation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RecommendedTask>
 */
class RecommendedTaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'weekly_recommendation_id' => WeeklyRecommendation::factory(),
            'task_id' => Task::factory(),
            'priority' => $this->faker->numberBetween(1, 5),
            'reason' => $this->faker->sentence(),
            'completed' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Mark the recommended task as completed
     */
    public function completed(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'completed' => true,
            ];
        });
    }

    /**
     * Set a specific priority
     */
    public function priority(int $priority): self
    {
        return $this->state(function (array $attributes) use ($priority) {
            return [
                'priority' => $priority,
            ];
        });
    }
}

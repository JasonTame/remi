<?php

namespace Database\Factories;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskHistory>
 */
class TaskHistoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'task_id' => Task::factory(),
            'completed_at' => Carbon::now()->subDays($this->faker->numberBetween(1, 90)),
            'notes' => $this->faker->optional(0.7)->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Complete the task on a specific date
     */
    public function completedOn(Carbon $date): self
    {
        return $this->state(function (array $attributes) use ($date) {
            return [
                'completed_at' => $date,
            ];
        });
    }

    /**
     * Add specific notes
     */
    public function withNotes(string $notes): self
    {
        return $this->state(function (array $attributes) use ($notes) {
            return [
                'notes' => $notes,
            ];
        });
    }
}

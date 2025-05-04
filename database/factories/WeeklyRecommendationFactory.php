<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WeeklyRecommendation>
 */
class WeeklyRecommendationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'week_start_date' => Carbon::now()->startOfWeek()->format('Y-m-d'),
            'generated_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }

    /**
     * Set a specific week start date
     */
    public function forWeek(string $weekStartDate): self
    {
        return $this->state(function (array $attributes) use ($weekStartDate) {
            return [
                'week_start_date' => $weekStartDate,
            ];
        });
    }
}

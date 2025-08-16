<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotificationPreference>
 */
class NotificationPreferenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'notification_class' => \App\Mail\WeeklyRecommendations::class,
            'is_enabled' => $this->faker->boolean(80),
            'cron_expression' => $this->faker->randomElement([
                '0 8 * * 1',  // Monday 8am
                '0 13 * * 2', // Tuesday 1pm
                '0 18 * * 5', // Friday 6pm
            ]),
        ];
    }

    /**
     * Indicate that the notification preference is enabled.
     */
    public function enabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => true,
        ]);
    }

    /**
     * Indicate that the notification preference is disabled.
     */
    public function disabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_enabled' => false,
        ]);
    }

    /**
     * Set the notification preference for weekly recommendations.
     */
    public function weeklyRecommendations(): static
    {
        return $this->state(fn () => [
            'notification_class' => \App\Mail\WeeklyRecommendations::class,
            'cron_expression' => '0 8 * * 1', // Monday 8am GMT
        ]);
    }
}

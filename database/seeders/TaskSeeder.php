<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the first user
        $user = User::first();

        if (!$user) {
            $this->command->info('No users found. Please run UserSeeder first.');
            return;
        }

        // Get default category if it exists
        $defaultCategory = Category::first();

        $tasks = [
            [
                'title' => 'Schedule dental checkup',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2024, 11, 15),
                'user_id' => $user->id,
                'category_id' => $defaultCategory ? $defaultCategory->id : null,
            ],
            [
                'title' => 'Change air filters',
                'timing_description' => 'Every 3 months',
                'last_completed_at' => Carbon::create(2025, 3, 1),
                'user_id' => $user->id,
                'category_id' => $defaultCategory ? $defaultCategory->id : null,
            ],
            [
                'title' => 'Call parents',
                'timing_description' => 'Every 2 weeks',
                'last_completed_at' => Carbon::create(2025, 5, 25),
                'user_id' => $user->id,
                'category_id' => $defaultCategory ? $defaultCategory->id : null,
            ],
            [
                'title' => 'Car maintenance',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2024, 12, 10),
                'user_id' => $user->id,
                'category_id' => $defaultCategory ? $defaultCategory->id : null,
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create($taskData);
        }
    }
}

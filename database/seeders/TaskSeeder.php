<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the first user
        $user = User::first();

        if (! $user) {
            $this->command->info('No users found. Please run UserSeeder first.');

            return;
        }

        $categories = Category::all();

        if (! $categories->count()) {
            $this->command->info('No categories found. Please run CategorySeeder first.');

            return;
        }


        $tasks = [
            [
                'title' => 'Schedule dental checkup',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2024, 11, 15),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Health')->first()->id,
            ],
            [
                'title' => 'Change air filters',
                'timing_description' => 'Every 3 months',
                'last_completed_at' => Carbon::create(2025, 3, 1),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home')->first()->id,
            ],
            [
                'title' => 'Call parents',
                'timing_description' => 'Every 2 weeks',
                'last_completed_at' => Carbon::create(2025, 5, 25),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal')->first()->id,
            ],
            [
                'title' => 'Car maintenance',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2024, 12, 10),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Admin')->first()->id,
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create($taskData);
        }
    }
}

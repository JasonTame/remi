<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\TaskHistory;
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
                'history' => [
                    ['completed_at' => Carbon::create(2024, 5, 10), 'notes' => 'Regular cleaning and checkup'],
                    ['completed_at' => Carbon::create(2024, 11, 15), 'notes' => 'Small cavity filled'],
                ]
            ],
            [
                'title' => 'Change air filters',
                'timing_description' => 'Every 3 months',
                'last_completed_at' => Carbon::create(2025, 3, 1),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 12, 1), 'notes' => 'Replaced all HVAC filters'],
                    ['completed_at' => Carbon::create(2025, 3, 1), 'notes' => 'Spring filter replacement'],
                ]
            ],
            [
                'title' => 'Call parents',
                'timing_description' => 'Every 2 weeks',
                'last_completed_at' => Carbon::create(2025, 5, 25),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 5, 11), 'notes' => 'Caught up on family news'],
                    ['completed_at' => Carbon::create(2025, 5, 25), 'notes' => 'Discussed holiday plans'],
                ]
            ],
            [
                'title' => 'Car maintenance',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2024, 12, 10),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Admin')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 6, 15), 'notes' => 'Oil change and tire rotation'],
                    ['completed_at' => Carbon::create(2024, 12, 10), 'notes' => 'Full service including brake inspection'],
                ]
            ],
            [
                'title' => 'System updates and backups',
                'timing_description' => 'Every month',
                'last_completed_at' => Carbon::create(2025, 5, 15),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Admin')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 4, 15), 'notes' => 'Updated OS and backed up important files'],
                    ['completed_at' => Carbon::create(2025, 5, 15), 'notes' => 'Security updates and cloud backup verification'],
                ]
            ],
            [
                'title' => 'Deep clean house',
                'timing_description' => 'Every 2 months',
                'last_completed_at' => Carbon::create(2025, 4, 20),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 2, 15), 'notes' => 'Spring cleaning - deep cleaned all rooms'],
                    ['completed_at' => Carbon::create(2025, 4, 20), 'notes' => 'Focus on kitchen and bathrooms'],
                ]
            ],
            [
                'title' => 'Review and organize finances',
                'timing_description' => 'Every month',
                'last_completed_at' => Carbon::create(2025, 5, 30),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Admin')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 4, 28), 'notes' => 'Reviewed monthly expenses and updated budget'],
                    ['completed_at' => Carbon::create(2025, 5, 30), 'notes' => 'Paid bills and reviewed investment portfolio'],
                ]
            ],
            [
                'title' => 'Exercise routine',
                'timing_description' => 'Every 3 days',
                'last_completed_at' => Carbon::create(2025, 6, 18),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Health')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 6, 15), 'notes' => '45-minute cardio and strength training'],
                    ['completed_at' => Carbon::create(2025, 6, 18), 'notes' => 'Yoga and stretching session'],
                ]
            ],
            [
                'title' => 'Water and care for plants',
                'timing_description' => 'Every week',
                'last_completed_at' => Carbon::create(2025, 6, 16),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 6, 9), 'notes' => 'Watered all plants and added fertilizer'],
                ]
            ],
        ];

        foreach ($tasks as $taskData) {
            // Extract history data before creating the task
            $historyData = $taskData['history'] ?? [];
            unset($taskData['history']);

            // Create the task
            $task = Task::create($taskData);

            // Create history entries for this task
            foreach ($historyData as $history) {
                TaskHistory::create([
                    'task_id' => $task->id,
                    'completed_at' => $history['completed_at'],
                    'notes' => $history['notes'] ?? null,
                ]);
            }
        }

        $this->command->info('Created ' . count($tasks) . ' tasks with their completion history.');
    }
}

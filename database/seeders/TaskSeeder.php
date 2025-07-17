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
            // Medical & Health
            [
                'title' => 'Dental Checkup',
                'description' => 'Regular cleaning and checkup with dentist',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2024, 11, 15),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Medical & Health')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 5, 10), 'notes' => 'Regular cleaning, no issues found'],
                    ['completed_at' => Carbon::create(2024, 11, 15), 'notes' => 'Cleaning and fluoride treatment'],
                ],
            ],
            [
                'title' => 'Eye Exam',
                'description' => 'Comprehensive eye exam and vision check',
                'timing_description' => 'Every 2 years',
                'last_completed_at' => Carbon::create(2024, 8, 20),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Medical & Health')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2022, 7, 15), 'notes' => 'Vision unchanged, no prescription update needed'],
                    ['completed_at' => Carbon::create(2024, 8, 20), 'notes' => 'Slight prescription change, new glasses ordered'],
                ],
            ],
            [
                'title' => 'Annual Physical',
                'description' => 'Complete health checkup with blood work and vitals',
                'timing_description' => 'Once a year',
                'last_completed_at' => Carbon::create(2024, 9, 12),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Medical & Health')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2023, 10, 5), 'notes' => 'All vitals normal, cholesterol slightly elevated'],
                    ['completed_at' => Carbon::create(2024, 9, 12), 'notes' => 'Excellent health, cholesterol improved'],
                ],
            ],
            [
                'title' => 'Dermatologist Appointment',
                'description' => 'Full body skin check for moles and suspicious spots',
                'timing_description' => 'Once a year',
                'last_completed_at' => Carbon::create(2024, 6, 8),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Medical & Health')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2023, 7, 3), 'notes' => 'No concerning spots found, recommended annual follow-up'],
                    ['completed_at' => Carbon::create(2024, 6, 8), 'notes' => 'All clear, continue yearly screenings'],
                ],
            ],

            // Home Maintenance
            [
                'title' => 'Change HVAC Filters',
                'description' => 'Replace air conditioning and heating system filters',
                'timing_description' => 'Every 3 months',
                'last_completed_at' => Carbon::create(2025, 5, 15),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home Maintenance')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 11, 15), 'notes' => 'Replaced all filters before winter'],
                    ['completed_at' => Carbon::create(2025, 2, 15), 'notes' => 'Winter filter replacement'],
                    ['completed_at' => Carbon::create(2025, 5, 15), 'notes' => 'Spring filter change, switched to higher efficiency'],
                ],
            ],
            [
                'title' => 'Clean Out Gutters',
                'description' => 'Remove leaves and debris from roof gutters',
                'timing_description' => 'Twice a year in spring and fall',
                'last_completed_at' => Carbon::create(2024, 10, 25),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home Maintenance')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 4, 20), 'notes' => 'Spring cleaning, removed winter debris'],
                    ['completed_at' => Carbon::create(2024, 10, 25), 'notes' => 'Fall cleaning, heavy leaf accumulation removed'],
                ],
            ],
            [
                'title' => 'Deep Clean Carpets',
                'description' => 'Professional carpet cleaning or thorough vacuum and steam clean',
                'timing_description' => 'Every 6 months',
                'last_completed_at' => Carbon::create(2025, 3, 10),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home Maintenance')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 9, 15), 'notes' => 'Professional steam cleaning, removed pet stains'],
                    ['completed_at' => Carbon::create(2025, 3, 10), 'notes' => 'Deep clean with rented machine'],
                ],
            ],
            [
                'title' => 'Test Smoke Detectors',
                'description' => 'Check batteries and test all smoke alarm functionality',
                'timing_description' => 'Every 3 months',
                'last_completed_at' => Carbon::create(2025, 6, 1),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home Maintenance')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 12, 1), 'notes' => 'All detectors working, replaced bedroom battery'],
                    ['completed_at' => Carbon::create(2025, 3, 1), 'notes' => 'All tests passed, no maintenance needed'],
                    ['completed_at' => Carbon::create(2025, 6, 1), 'notes' => 'Replaced kitchen detector battery'],
                ],
            ],
            [
                'title' => 'Service Car',
                'description' => 'Oil change, tire rotation, and general maintenance check',
                'timing_description' => 'Every 3-4 months',
                'last_completed_at' => Carbon::create(2025, 4, 22),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Home Maintenance')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 12, 15), 'notes' => 'Full service, brake pads replaced'],
                    ['completed_at' => Carbon::create(2025, 4, 22), 'notes' => 'Oil change and tire rotation, all good'],
                ],
            ],

            // Administrative & Financial
            [
                'title' => 'File Tax Returns',
                'description' => 'Prepare and submit annual income tax returns',
                'timing_description' => 'Once a year in early spring',
                'last_completed_at' => Carbon::create(2024, 3, 28),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Administrative & Financial')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2023, 4, 5), 'notes' => 'Filed on time, received small refund'],
                    ['completed_at' => Carbon::create(2024, 3, 28), 'notes' => 'Early filing, larger refund this year'],
                ],
            ],
            [
                'title' => 'Review Insurance Policies',
                'description' => 'Check coverage levels and rates for auto, home, and health insurance',
                'timing_description' => 'Once a year',
                'last_completed_at' => Carbon::create(2024, 7, 15),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Administrative & Financial')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2023, 8, 10), 'notes' => 'Switched auto insurance, saved $200/year'],
                    ['completed_at' => Carbon::create(2024, 7, 15), 'notes' => 'Increased home coverage, rates stayed same'],
                ],
            ],
            [
                'title' => 'Backup Computer Files',
                'description' => 'Full backup of important documents and photos to external drive',
                'timing_description' => 'Once a month',
                'last_completed_at' => Carbon::create(2025, 6, 15),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Administrative & Financial')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 4, 15), 'notes' => 'Full backup completed, organized photo folders'],
                    ['completed_at' => Carbon::create(2025, 5, 15), 'notes' => 'Monthly backup, added cloud sync verification'],
                    ['completed_at' => Carbon::create(2025, 6, 15), 'notes' => 'Backup successful, external drive space checked'],
                ],
            ],

            // Personal & Social
            [
                'title' => 'Call Parents',
                'description' => 'Catch up phone call to check in with mom and dad',
                'timing_description' => 'Once a week',
                'last_completed_at' => Carbon::create(2025, 6, 16),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal & Social')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 6, 2), 'notes' => 'Long chat about family updates'],
                    ['completed_at' => Carbon::create(2025, 6, 9), 'notes' => 'Quick check-in, planning summer visit'],
                    ['completed_at' => Carbon::create(2025, 6, 16), 'notes' => 'Discussed garden and travel plans'],
                ],
            ],
            [
                'title' => 'Organize Photo Albums',
                'description' => 'Sort through phone photos and organize into albums',
                'timing_description' => 'Every 2-3 months',
                'last_completed_at' => Carbon::create(2025, 3, 25),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal & Social')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 12, 20), 'notes' => 'Organized holiday photos and created albums'],
                    ['completed_at' => Carbon::create(2025, 3, 25), 'notes' => 'Sorted winter photos and backed up to cloud'],
                ],
            ],
            [
                'title' => 'Check in with College Friends',
                'description' => 'Send messages or arrange video call with old college buddies',
                'timing_description' => 'Every couple of months',
                'last_completed_at' => Carbon::create(2025, 4, 18),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal & Social')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2025, 2, 14), 'notes' => 'Group video call, caught up on everyone\'s news'],
                    ['completed_at' => Carbon::create(2025, 4, 18), 'notes' => 'Individual messages sent, planning reunion'],
                ],
            ],
            [
                'title' => 'Plan Weekend Getaway',
                'description' => 'Research and book a short trip or staycation',
                'timing_description' => 'Every few months',
                'last_completed_at' => Carbon::create(2025, 2, 10),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal & Social')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 10, 15), 'notes' => 'Booked mountain cabin for fall colors trip'],
                    ['completed_at' => Carbon::create(2025, 2, 10), 'notes' => 'Planned local staycation with museum visits'],
                ],
            ],
            [
                'title' => 'Donate Unused Clothes',
                'description' => 'Go through closet and donate items that no longer fit or aren\'t worn',
                'timing_description' => 'Twice a year',
                'last_completed_at' => Carbon::create(2025, 4, 5),
                'user_id' => $user->id,
                'category_id' => $categories->where('name', 'Personal & Social')->first()->id,
                'history' => [
                    ['completed_at' => Carbon::create(2024, 10, 12), 'notes' => 'Fall closet cleanout, donated 2 bags to charity'],
                    ['completed_at' => Carbon::create(2025, 4, 5), 'notes' => 'Spring cleaning, donated winter clothes and shoes'],
                ],
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

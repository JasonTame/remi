<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Agents\TaskRecommendationAgent;
use App\Services\TaskService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateTaskRecommendations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-task-recommendations {user_id : The ID of the user to generate recommendations for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate task recommendations for a user using TaskRecommendationAgent';

    /**
     * Execute the console command.
     */
    public function handle(TaskRecommendationAgent $taskRecommendationAgent, TaskService $taskService)
    {
        $userId = $this->argument('user_id');
        $user = User::find($userId);

        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return 1;
        }

        $this->info("Generating recommendations for user: {$user->name}");

        // Determine the current week's start date (Monday)
        $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

        // Check if recommendations already exist for this user and week
        $existingRecommendation = WeeklyRecommendation::where('user_id', $userId)
            ->where('week_start_date', $weekStartDate)
            ->first();

        if ($existingRecommendation) {
            if (!$this->confirm("Recommendations already exist for this week. Do you want to regenerate them?")) {
                $this->info("Operation canceled.");
                return 0;
            }

            // Delete existing recommended tasks
            $existingRecommendation->recommendedTasks()->delete();
            $existingRecommendation->delete();
        }

        // Check if user has tasks
        $taskCount = Task::where('user_id', $userId)->count();

        if ($taskCount === 0) {
            $this->warn("No tasks found for this user.");
            return 0;
        }

        // Fetch tasks that are due for completion (default: 7 days)
        $this->info("Fetching tasks that are due for completion...");
        $tasks = $taskService->getTasksDueForUser($user, 7);

        if ($tasks->isEmpty()) {
            $this->info("No tasks are currently due for completion.");
            return 0;
        }

        $this->info("Found {$tasks->count()} tasks that are due for completion.");

        // Create a new weekly recommendation
        $weeklyRecommendation = WeeklyRecommendation::create([
            'user_id' => $userId,
            'week_start_date' => $weekStartDate,
            'generated_at' => now(),
        ]);

        // Generate recommendations using TaskRecommendationAgent with task data
        $this->info("Generating AI recommendations...");
        try {
            $recommendations = $taskRecommendationAgent->generateWeeklyRecommendations($user, $weekStartDate, $tasks);

            if (empty($recommendations)) {
                $this->info("No recommendations were generated for this week.");
                return 0;
            }

            // Create recommended tasks
            $count = 0;
            foreach ($recommendations as $recommendation) {
                if (!isset($recommendation['task_id'], $recommendation['priority'], $recommendation['reason'])) {
                    $this->warn("Skipping recommendation with missing required fields: " . json_encode($recommendation));
                    continue;
                }

                $weeklyRecommendation->recommendedTasks()->create([
                    'task_id' => $recommendation['task_id'],
                    'priority' => $recommendation['priority'],
                    'reason' => $recommendation['reason'],
                    'completed' => false,
                ]);
                $count++;
            }

            if ($count > 0) {
                $this->info("Created {$count} task recommendations for the week starting {$weekStartDate}.");
            } else {
                $this->warn("No valid recommendations were created.");
            }
        } catch (\Exception $e) {
            $this->error("Error generating recommendations: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}

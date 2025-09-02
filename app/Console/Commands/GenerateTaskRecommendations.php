<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\RecommendedTask;
use App\Models\Task;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Services\TaskService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use JasonTame\LangGraphClient\Exceptions\LangGraphException;
use JasonTame\LangGraphClient\Facades\LangGraphClient;

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
    protected $description = 'Generate task recommendations for a user using Remi AI Task Suggestion Agent API';

    /**
     * Execute the console command.
     */
    public function handle(TaskService $taskService)
    {
        $userId = $this->argument('user_id');
        $user = User::find($userId);

        if (! $user) {
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
            if (! $this->confirm('Recommendations already exist for this week. Do you want to regenerate them?')) {
                $this->info('Operation canceled.');

                return 0;
            }

            // Delete existing recommended tasks
            $existingRecommendation->recommendedTasks()->delete();
            $existingRecommendation->delete();
        }

        // Check if user has tasks
        $taskCount = Task::where('user_id', $userId)->count();

        if ($taskCount === 0) {
            $this->warn('No tasks found for this user.');

            return 0;
        }

        // Fetch tasks that are due for completion (default: 7 days)
        $this->info('Fetching tasks that are due for completion...');
        $tasks = $taskService->getTasksDueForUser($user, 7);

        if ($tasks->isEmpty()) {
            $this->info('No tasks are currently due for completion.');

            return 0;
        }

        $this->info("Found {$tasks->count()} tasks that are due for completion.");

        // Prepare data for API request
        $this->info('Preparing data for API request...');
        $apiData = $this->prepareApiData($user, $weekStartDate, $tasks);

        $this->info('Generating AI recommendations via Remi AI (LangGraph)...');
        try {
            $this->info('Creating thread for task recommendations...');
            $thread = LangGraphClient::threads()->create([
                'metadata' => ['purpose' => 'task_recommendations', 'user_id' => $userId],
            ]);

            $this->info('Creating and waiting for run completion with LangGraph SDK...');
            $runResult = LangGraphClient::runs()->wait($thread['thread_id'], [
                'assistant_id' => 'task_suggestion_agent',
                'input' => [
                    'request' => $apiData,
                ],
                'config' => [
                    'configurable' => (object) [],
                ],
            ]);

            $this->info('Run completed successfully! Fetching AI response...');

            $threadState = LangGraphClient::threads()->state($thread['thread_id']);

            $apiResponse = [
                'run_result' => $runResult,
                'messages' => $threadState['values']['messages'] ?? [],
            ];

            // Extract recommendations from the AI message content
            $recommendations = $this->extractRecommendationsFromMessages($apiResponse['messages'] ?? []);

            if (empty($recommendations)) {
                $this->warn('No recommendations found in the response.');
                $this->info('Full response structure for debugging:');
                $this->info(json_encode($apiResponse, JSON_PRETTY_PRINT));

                return 0;
            }

            $this->info('Successfully extracted ' . count($recommendations) . ' recommendations!');

            // Create a new weekly recommendation
            $weeklyRecommendation = WeeklyRecommendation::create([
                'user_id' => $userId,
                'week_start_date' => $weekStartDate,
                'generated_at' => now(),
            ]);

            // Create recommended tasks from API response
            $count = 0;
            foreach ($recommendations as $recommendedTask) {
                if (! isset($recommendedTask['task_id'], $recommendedTask['priority'], $recommendedTask['reason'])) {
                    $this->warn('Skipping recommendation with missing required fields: ' . json_encode($recommendedTask));

                    continue;
                }

                $weeklyRecommendation->recommendedTasks()->create([
                    'task_id' => $recommendedTask['task_id'],
                    'priority' => $recommendedTask['priority'],
                    'reason' => $recommendedTask['reason'],
                    'completed' => false,
                ]);
                $count++;
            }

            if ($count > 0) {
                $this->info("Created {$count} task recommendations for the week starting {$weekStartDate}.");
            } else {
                $this->warn('No valid recommendations were created.');
            }

            // Clean up the temporary thread
            try {
                LangGraphClient::threads()->delete($thread['thread_id']);
                $this->info('Cleaned up temporary thread.');
            } catch (\Exception $e) {
                // Log but don't fail the command if cleanup fails
                Log::warning('Failed to clean up temporary thread', [
                    'thread_id' => $thread['thread_id'],
                    'error' => $e->getMessage(),
                ]);
            }
        } catch (LangGraphException $e) {
            $this->error('Error calling LangGraph API: ' . $e->getMessage());
            Log::error('GenerateTaskRecommendations API Error', [
                'error' => $e->getMessage(),
                'error_type' => $e->getErrorType(),
                'response_data' => $e->getResponseData(),
                'user_id' => $userId,
                'week_start_date' => $weekStartDate,
            ]);

            return 1;
        } catch (\Exception $e) {
            $this->error('Unexpected error: ' . $e->getMessage());
            Log::error('GenerateTaskRecommendations Unexpected Error', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'week_start_date' => $weekStartDate,
            ]);

            return 1;
        }

        return 0;
    }

    /**
     * Prepare data for the API request
     */
    private function prepareApiData(User $user, string $weekStartDate, $tasks): array
    {
        // Get all categories for the user
        $categories = Category::where('user_id', $user->id)->get();

        $sixMonthsAgo = Carbon::now()->subMonths(6);

        // Get skipped tasks from the last 6 months
        $skippedTasks = RecommendedTask::whereHas('task', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->whereNotNull('skipped_at')
            ->where('skipped_at', '>=', $sixMonthsAgo)
            ->with(['task'])
            ->orderBy('skipped_at', 'desc')
            ->get();

        // Format tasks for API
        $formattedTasks = $tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'user_id' => $task->user_id,
                'category_id' => $task->category_id,
                'title' => $task->title,
                'timing_description' => $task->timing_description,
                'description' => $task->description,
                'last_completed_at' => $task->last_completed_at?->toISOString(),
                'created_at' => $task->created_at->toISOString(),
                'updated_at' => $task->updated_at->toISOString(),
            ];
        })->toArray();

        // Format categories for API
        $formattedCategories = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'user_id' => $category->user_id,
                'name' => $category->name,
                'color' => $category->color,
                'created_at' => $category->created_at->toISOString(),
                'updated_at' => $category->updated_at->toISOString(),
            ];
        })->toArray();

        // Format skipped tasks for API
        $formattedSkippedTasks = $skippedTasks->map(function ($skippedTask) {
            return [
                'id' => $skippedTask->id,
                'user_id' => $skippedTask->user_id,
                'task_id' => $skippedTask->task_id,
                'task_title' => $skippedTask->task->title,
                'priority' => $skippedTask->priority,
                'reason' => $skippedTask->reason,
                'skip_reason' => $skippedTask->skip_reason,
                'skipped_at' => $skippedTask->skipped_at->toISOString(),
                'created_at' => $skippedTask->created_at->toISOString(),
                'updated_at' => $skippedTask->updated_at->toISOString(),
            ];
        })->toArray();

        return [
            'user_id' => $user->id,
            'week_start_date' => Carbon::parse($weekStartDate)->startOfWeek()->toISOString(),
            'tasks' => $formattedTasks,
            'categories' => $formattedCategories,
            'skipped_tasks' => $formattedSkippedTasks,
        ];
    }

    /**
     * Extract recommendations from the AI messages array
     */
    private function extractRecommendationsFromMessages(array $messages): array
    {
        // Find the last AI message
        $aiMessage = null;
        foreach (array_reverse($messages) as $message) {
            if (isset($message['type']) && $message['type'] === 'ai') {
                $aiMessage = $message;
                break;
            }
        }

        if (! $aiMessage || ! isset($aiMessage['content'])) {
            return [];
        }

        $content = $aiMessage['content'];

        // First, try to extract JSON from markdown code block
        if (preg_match('/```json\s*(\[.*?\])\s*```/s', $content, $matches)) {
            $jsonString = $matches[1];
            $recommendations = json_decode($jsonString, true);

            if (is_array($recommendations)) {
                return $recommendations;
            }
        }

        // If no markdown code block found, try to extract plain JSON array
        // This pattern handles both single-line and multi-line JSON arrays
        if (preg_match('/(\[.*?\])/s', $content, $matches)) {
            $jsonString = $matches[1];
            $recommendations = json_decode($jsonString, true);

            if (is_array($recommendations)) {
                return $recommendations;
            }
        }

        return [];
    }
}

<?php

namespace App\Jobs;

use App\Models\Category;
use App\Models\RecommendedTask;
use App\Models\Task;
use App\Models\User;
use App\Models\WeeklyRecommendation;
use App\Services\TaskService;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use JasonTame\LangGraphClient\Facades\LangGraphClient;
use JasonTame\LangGraphClient\Exceptions\LangGraphException;

class GenerateTaskRecommendationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $userId;

    protected bool $regenerate;

    /**
     * Create a new job instance.
     */
    public function __construct(int $userId, bool $regenerate = false)
    {
        $this->userId = $userId;
        $this->regenerate = $regenerate;
    }

    /**
     * Execute the job.
     */
    public function handle(TaskService $taskService): void
    {
        $user = User::find($this->userId);

        if (! $user) {
            Log::error("GenerateTaskRecommendationsJob: User with ID {$this->userId} not found.");

            return;
        }

        Log::info("GenerateTaskRecommendationsJob: Generating recommendations for user: {$user->name}", [
            'user_id' => $this->userId,
            'regenerate' => $this->regenerate,
        ]);

        // Determine the current week's start date (Monday)
        $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

        // Check if recommendations already exist for this user and week
        $existingRecommendation = WeeklyRecommendation::where('user_id', $this->userId)
            ->where('week_start_date', $weekStartDate)
            ->first();

        if ($existingRecommendation && ! $this->regenerate) {
            Log::info('GenerateTaskRecommendationsJob: Recommendations already exist for this week and regenerate is false. Exiting early.', [
                'user_id' => $this->userId,
                'week_start_date' => $weekStartDate,
            ]);

            return;
        }

        if ($existingRecommendation && $this->regenerate) {
            Log::info('GenerateTaskRecommendationsJob: Regenerating existing recommendations.', [
                'user_id' => $this->userId,
                'week_start_date' => $weekStartDate,
            ]);

            // Delete existing recommended tasks
            $existingRecommendation->recommendedTasks()->delete();
            $existingRecommendation->delete();
        }

        // Check if user has tasks
        $taskCount = Task::where('user_id', $this->userId)->count();

        if ($taskCount === 0) {
            Log::warning('GenerateTaskRecommendationsJob: No tasks found for this user.', [
                'user_id' => $this->userId,
            ]);

            return;
        }

        // Fetch tasks that are due for completion (default: 7 days)
        Log::info('GenerateTaskRecommendationsJob: Fetching tasks that are due for completion...', [
            'user_id' => $this->userId,
        ]);

        $tasks = $taskService->getTasksDueForUser($user, 7);

        if ($tasks->isEmpty()) {
            Log::info('GenerateTaskRecommendationsJob: No tasks are currently due for completion.', [
                'user_id' => $this->userId,
            ]);

            return;
        }

        Log::info("GenerateTaskRecommendationsJob: Found {$tasks->count()} tasks that are due for completion.", [
            'user_id' => $this->userId,
            'task_count' => $tasks->count(),
        ]);

        // Prepare data for API request
        Log::info('GenerateTaskRecommendationsJob: Preparing data for API request...', [
            'user_id' => $this->userId,
        ]);

        $apiData = $this->prepareApiData($user, $weekStartDate, $tasks);

        // Generate recommendations using Remi AI (LangGraph)
        Log::info('GenerateTaskRecommendationsJob: Generating AI recommendations via Remi AI (LangGraph)...', [
            'user_id' => $this->userId,
        ]);

        try {
            Log::info('GenerateTaskRecommendationsJob: Creating thread for task recommendations...', [
                'user_id' => $this->userId,
            ]);
            $thread = LangGraphClient::threads()->create([
                'metadata' => ['purpose' => 'task_recommendations', 'user_id' => $this->userId]
            ]);

            Log::info('GenerateTaskRecommendationsJob: Creating and waiting for run completion with LangGraph SDK...', [
                'user_id' => $this->userId,
                'thread_id' => $thread['thread_id'],
            ]);
            $runResult = LangGraphClient::runs()->wait($thread['thread_id'], [
                'assistant_id' => 'task_suggestion_agent',
                'input' => [
                    'request' => $apiData
                ],
                'config' => [
                    'configurable' => (object)[]
                ]
            ]);

            Log::info('GenerateTaskRecommendationsJob: Run completed successfully! Fetching AI response...', [
                'user_id' => $this->userId,
                'thread_id' => $thread['thread_id'],
            ]);

            $threadState = LangGraphClient::threads()->state($thread['thread_id']);

            $apiResponse = [
                'run_result' => $runResult,
                'messages' => $threadState['values']['messages'] ?? []
            ];

            // Extract recommendations from the AI message content
            $recommendations = $this->extractRecommendationsFromMessages($apiResponse['messages'] ?? []);

            if (empty($recommendations)) {
                Log::warning('GenerateTaskRecommendationsJob: No recommendations found in the response.', [
                    'user_id' => $this->userId,
                    'full_response' => $apiResponse,
                ]);
                return;
            }

            Log::info("GenerateTaskRecommendationsJob: Successfully extracted " . count($recommendations) . " recommendations!", [
                'user_id' => $this->userId,
                'recommendations_count' => count($recommendations),
            ]);

            // Create a new weekly recommendation
            $weeklyRecommendation = WeeklyRecommendation::create([
                'user_id' => $this->userId,
                'week_start_date' => $weekStartDate,
                'generated_at' => now(),
            ]);

            // Create recommended tasks from API response
            $count = 0;
            foreach ($recommendations as $recommendedTask) {
                if (! isset($recommendedTask['task_id'], $recommendedTask['priority'], $recommendedTask['reason'])) {
                    Log::warning('GenerateTaskRecommendationsJob: Skipping recommendation with missing required fields', [
                        'user_id' => $this->userId,
                        'recommendation' => $recommendedTask,
                    ]);

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
                Log::info("GenerateTaskRecommendationsJob: Created {$count} task recommendations for the week starting {$weekStartDate}.", [
                    'user_id' => $this->userId,
                    'week_start_date' => $weekStartDate,
                    'recommendations_count' => $count,
                ]);
            } else {
                Log::warning('GenerateTaskRecommendationsJob: No valid recommendations were created.', [
                    'user_id' => $this->userId,
                ]);
            }

            // Clean up the temporary thread
            try {
                LangGraphClient::threads()->delete($thread['thread_id']);
                Log::info('GenerateTaskRecommendationsJob: Cleaned up temporary thread.', [
                    'user_id' => $this->userId,
                    'thread_id' => $thread['thread_id'],
                ]);
            } catch (\Exception $e) {
                // Log but don't fail the job if cleanup fails
                Log::warning('GenerateTaskRecommendationsJob: Failed to clean up temporary thread', [
                    'thread_id' => $thread['thread_id'],
                    'error' => $e->getMessage(),
                    'user_id' => $this->userId,
                ]);
            }
        } catch (LangGraphException $e) {
            Log::error('GenerateTaskRecommendationsJob: Error calling LangGraph API', [
                'error' => $e->getMessage(),
                'error_type' => $e->getErrorType(),
                'response_data' => $e->getResponseData(),
                'user_id' => $this->userId,
                'week_start_date' => $weekStartDate,
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('GenerateTaskRecommendationsJob: Unexpected error', [
                'error' => $e->getMessage(),
                'user_id' => $this->userId,
                'week_start_date' => $weekStartDate,
            ]);
            throw $e;
        }
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

        if (!$aiMessage || !isset($aiMessage['content'])) {
            return [];
        }

        $content = $aiMessage['content'];

        // Extract JSON from markdown code block
        if (preg_match('/```json\s*(\[.*?\])\s*```/s', $content, $matches)) {
            $jsonString = $matches[1];
            $recommendations = json_decode($jsonString, true);

            if (is_array($recommendations)) {
                return $recommendations;
            }
        }

        return [];
    }
}

<?php

namespace App\Agents;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\NumberSchema;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;

class TaskRecommendationAgent
{
    /**
     * Generate task recommendations for a user for a given week
     */
    public function generateWeeklyRecommendations(User|int $user, string $weekStartDate, Collection $tasks): array
    {
        $userId = $user instanceof User ? $user->id : $user;
        $userName = $user instanceof User ? $user->name : "User {$userId}";

        if ($tasks->isEmpty()) {
            Log::info('TaskRecommendationAgent - No tasks provided for recommendations');

            return [];
        }

        $prompt = $this->buildWeeklyRecommendationPrompt($weekStartDate, $userName, $tasks);

        return $this->generateRecommendationsFromTasks($prompt, $tasks);
    }

    /**
     * Generate task recommendations based on custom criteria
     */
    public function generateCustomRecommendations(User|int $user, Collection $tasks, array $criteria = []): array
    {
        $userId = $user instanceof User ? $user->id : $user;
        $userName = $user instanceof User ? $user->name : "User {$userId}";
        $maxTasks = $criteria['max_tasks'] ?? 5;
        $focusArea = $criteria['focus_area'] ?? 'general productivity';

        if ($tasks->isEmpty()) {
            Log::info('TaskRecommendationAgent - No tasks provided for custom recommendations');

            return [];
        }

        $prompt = $this->buildCustomRecommendationPrompt($focusArea, $maxTasks, $userName, $tasks);

        return $this->generateRecommendationsFromTasks($prompt, $tasks);
    }

    /**
     * Get recommendations for urgent tasks (overdue by more than specified days)
     */
    public function getUrgentTaskRecommendations(User|int $user, Collection $tasks, int $overdueDays = 14): array
    {
        $userId = $user instanceof User ? $user->id : $user;
        $userName = $user instanceof User ? $user->name : "User {$userId}";

        if ($tasks->isEmpty()) {
            Log::info('TaskRecommendationAgent - No tasks provided for urgent recommendations');

            return [];
        }

        $prompt = $this->buildUrgentTaskPrompt($overdueDays, $userName, $tasks);

        return $this->generateRecommendationsFromTasks($prompt, $tasks);
    }

    /**
     * Generate recommendations from provided tasks
     */
    private function generateRecommendationsFromTasks(string $prompt, Collection $tasks): array
    {
        // Define the schema for task recommendations
        $taskSchema = new ObjectSchema(
            name: 'task_recommendation',
            description: 'A recommended task with priority and reason',
            properties: [
                new NumberSchema('task_id', 'The ID of the task'),
                new NumberSchema('priority', 'Priority level (1-5)'),
                new StringSchema('reason', 'The reason for recommending this task'),
            ],
            requiredFields: ['task_id', 'priority', 'reason']
        );

        $recommendationsSchema = new ArraySchema(
            name: 'recommendations',
            description: 'List of task recommendations',
            items: $taskSchema
        );

        $structuredResponse = Prism::structured()
            ->using(Provider::OpenAI, 'gpt-4.1-mini')
            ->withPrompt($prompt)
            ->withSchema($recommendationsSchema)
            ->asStructured();

        // Debug: Log the structured response
        Log::info('TaskRecommendationAgent - Structured Response:', [
            'structured' => $structuredResponse->structured,
            'text' => $structuredResponse->text ?? 'no text',
            'finish_reason' => $structuredResponse->finishReason->name ?? 'unknown',
        ]);

        $recommendations = $structuredResponse->structured ?? [];

        // Check if the structured response contains the schema format with "items"
        if (is_array($recommendations) && isset($recommendations['items'])) {
            $recommendations = $recommendations['items'];
        }

        // Ensure we return an array and validate the structure
        if (! is_array($recommendations)) {
            Log::warning('TaskRecommendationAgent - Structured response is not an array:', [
                'type' => gettype($recommendations),
                'value' => $recommendations,
            ]);

            return [];
        }

        // Get valid task IDs from the provided tasks
        $validTaskIds = $tasks->pluck('id')->toArray();

        Log::info('TaskRecommendationAgent - Validation data:', [
            'valid_task_ids' => $validTaskIds,
            'raw_recommendations' => $recommendations,
        ]);

        // Filter out any invalid recommendations
        $validRecommendations = array_filter($recommendations, function ($rec) use ($validTaskIds) {
            $isValid = is_array($rec) &&
                isset($rec['task_id'], $rec['priority'], $rec['reason']) &&
                is_numeric($rec['task_id']) &&
                is_numeric($rec['priority']) &&
                in_array((int) $rec['task_id'], $validTaskIds);

            // Debug each recommendation validation
            if (! $isValid) {
                Log::warning('TaskRecommendationAgent - Invalid recommendation:', [
                    'recommendation' => $rec,
                    'is_array' => is_array($rec),
                    'has_required_fields' => isset($rec['task_id'], $rec['priority'], $rec['reason']),
                    'task_id_numeric' => isset($rec['task_id']) ? is_numeric($rec['task_id']) : false,
                    'priority_numeric' => isset($rec['priority']) ? is_numeric($rec['priority']) : false,
                    'task_id_in_valid_list' => isset($rec['task_id']) ? in_array((int) $rec['task_id'], $validTaskIds) : false,
                ]);
            }

            return $isValid;
        });

        Log::info('TaskRecommendationAgent - Final recommendations:', [
            'total_received' => count($recommendations),
            'valid_recommendations' => count($validRecommendations),
            'recommendations' => $validRecommendations,
        ]);

        return array_values($validRecommendations);
    }

    /**
     * Format tasks for prompt context
     */
    private function formatTasksForPrompt(Collection $tasks): string
    {
        return $tasks->map(function (Task $task) {
            $lastCompleted = $task->last_completed_at
                ? $task->last_completed_at->format('Y-m-d')
                : 'Never';

            $daysSinceCompletion = $task->last_completed_at
                ? now()->diffInDays($task->last_completed_at)
                : 'Unknown';

            $category = $task->category ? $task->category->name : 'No Category';

            return "Task ID: {$task->id}\n".
                "Title: {$task->title}\n".
                "Timing Description: {$task->timing_description}\n".
                "Last Completed: {$lastCompleted}\n".
                "Days Since Completion: {$daysSinceCompletion}\n".
                "Category: {$category}\n";
        })->join("\n");
    }

    /**
     * Build prompt for weekly recommendations
     */
    private function buildWeeklyRecommendationPrompt(string $weekStartDate, string $userName, Collection $tasks): string
    {
        $formattedTasks = $this->formatTasksForPrompt($tasks);

        return <<<EOT
You are helping {$userName} plan their tasks for the week starting {$weekStartDate}.

Here are their current tasks that are due or overdue:

{$formattedTasks}

Based on these tasks, recommend 3-5 tasks that should be prioritized for this week. For each task, consider:
1. How long since last completion
2. The timing description requirements
3. Priority based on timing patterns and urgency

For each recommended task, provide:
- task_id: The exact task ID from the list above
- priority: A number from 1-5 (1 being highest priority)
- reason: A clear explanation of why this task should be prioritized

Only recommend tasks from the provided list above.
EOT;
    }

    /**
     * Build prompt for custom recommendations
     */
    private function buildCustomRecommendationPrompt(string $focusArea, int $maxTasks, string $userName, Collection $tasks): string
    {
        $formattedTasks = $this->formatTasksForPrompt($tasks);

        return <<<EOT
You are helping {$userName} focus on {$focusArea}.

Here are their current tasks that are due or overdue:

{$formattedTasks}

Based on these tasks and the focus area of "{$focusArea}", recommend up to {$maxTasks} tasks that align with this focus.

For each recommended task, provide:
- task_id: The exact task ID from the list above
- priority: A number from 1-5 (1 being highest priority)
- reason: A clear explanation of why this task aligns with the focus area

Only recommend tasks from the provided list above.
EOT;
    }

    /**
     * Build prompt for urgent task recommendations
     */
    private function buildUrgentTaskPrompt(int $overdueDays, string $userName, Collection $tasks): string
    {
        $formattedTasks = $this->formatTasksForPrompt($tasks);

        return <<<EOT
You are helping {$userName} identify critically urgent tasks that are overdue by more than {$overdueDays} days.

Here are their current tasks that are due or overdue:

{$formattedTasks}

Focus on tasks that:
- Are significantly overdue
- Could have negative consequences if delayed further
- Should be addressed immediately

For each urgent task, provide:
- task_id: The exact task ID from the list above
- priority: A number from 1-5 (1 being highest priority)
- reason: A clear explanation of why this task is critically urgent

Only recommend tasks from the provided list above.
EOT;
    }
}

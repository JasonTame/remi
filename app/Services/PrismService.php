<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Schema\NumberSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\ObjectSchema;

class PrismService
{
    public function __construct(
        private Prism $prism
    ) {}

    /**
     * Generate task recommendations based on user's tasks
     */
    public function generateRecommendations(Collection $tasks, string $weekStartDate): array
    {
        $prompt = $this->buildRecommendationPrompt($tasks, $weekStartDate);

        // Define the schema for task recommendations
        $taskSchema = new ObjectSchema(
            name: 'task_recommendation',
            description: 'A recommended task with priority and reason',
            properties: [
                new NumberSchema('task_id', 'The ID of the task'),
                new NumberSchema('priority', 'Priority level (1-5)'),
                new StringSchema('reason', 'The reason for recommending this task')
            ],
            requiredFields: ['task_id', 'priority', 'reason']
        );

        $recommendationsSchema = new ArraySchema(
            name: 'recommendations',
            description: 'List of task recommendations for the week',
            items: $taskSchema
        );

        $response = $this->prism->structured()
            ->using(Provider::OpenAI, 'gpt-4.1-mini')
            ->withPrompt($prompt)
            ->withSchema($recommendationsSchema)
            ->asStructured();

        return $response->structured;
    }

    /**
     * Build prompt for recommendation generation
     */
    private function buildRecommendationPrompt(Collection $tasks, string $weekStartDate): string
    {
        $tasksText = $tasks->map(function ($task) {
            $lastCompleted = $task->last_completed_at ? $task->last_completed_at->format('Y-m-d') : 'Never';
            return "Task ID: {$task->id}\nTitle: {$task->title}\nTiming Description: {$task->timing_description}\nLast Completed: {$lastCompleted}\nCategory: " . ($task->category ? $task->category->name : 'None') . "\n";
        })->join("\n");

        return <<<EOT
You are a scheduling assistant helping to prioritize tasks for the week starting {$weekStartDate}.
Below is a list of tasks with their timing descriptions and when they were last completed.

{$tasksText}

Based on the timing descriptions and last completion dates, recommend which tasks should be prioritized this week. DO NOT overwhelm the user with too many tasks - try keep it to 3-5 tasks at a maximum.
For each recommended task, provide:
1. The task_id
2. A priority level (1-5, with 1 being the highest priority)
3. A brief reason for the recommendation

Respond with an array of task recommendations, focusing only on tasks that should reasonably be done this week. If the task was already completed this week, do not recommend it.

If no tasks are recommended, respond with an empty array.
EOT;
    }
}

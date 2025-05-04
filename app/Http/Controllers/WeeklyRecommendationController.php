<?php

namespace App\Http\Controllers;

use App\Models\RecommendedTask;
use App\Models\WeeklyRecommendation;
use App\Services\PrismService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WeeklyRecommendationController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private PrismService $prismService
    ) {}

    /**
     * Display the current week's task recommendations.
     */
    public function current()
    {
        $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

        // Find or create weekly recommendation
        $weeklyRecommendation = $this->findOrGenerateRecommendation($weekStartDate);

        // Load the recommended tasks with their task information
        $recommendedTasks = $weeklyRecommendation->recommendedTasks()
            ->with(['task', 'task.category'])
            ->orderByDesc('priority')
            ->get();

        return Inertia::render('recommendations/current', [
            'weekStartDate' => $weekStartDate,
            'recommendedTasks' => $recommendedTasks,
            'weeklyRecommendation' => $weeklyRecommendation
        ]);
    }

    /**
     * Generate new recommendations for the current week.
     */
    public function generate()
    {
        $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

        // Generate fresh recommendations
        $weeklyRecommendation = $this->generateRecommendations($weekStartDate, true);

        return redirect()->route('recommendations.current')
            ->with('success', 'New recommendations generated successfully.');
    }

    /**
     * Mark a recommended task as completed.
     */
    public function completeTask(RecommendedTask $recommendedTask)
    {
        $this->authorize('update', $recommendedTask);

        // Mark the recommended task as completed
        $recommendedTask->update(['completed' => true]);

        // Create a task history entry and update the last completed timestamp
        $task = $recommendedTask->task;
        $task->history()->create([
            'completed_at' => now(),
        ]);

        $task->update([
            'last_completed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Task marked as completed.');
    }

    /**
     * Find existing recommendation or generate a new one.
     */
    private function findOrGenerateRecommendation(string $weekStartDate): WeeklyRecommendation
    {
        $user = Auth::user();

        // Try to find existing recommendation for this week
        $weeklyRecommendation = $user->weeklyRecommendations()
            ->where('week_start_date', $weekStartDate)
            ->first();

        // If none exists, generate new recommendations
        if (!$weeklyRecommendation) {
            $weeklyRecommendation = $this->generateRecommendations($weekStartDate);
        }

        return $weeklyRecommendation;
    }

    /**
     * Generate new recommendations using the LLM.
     */
    private function generateRecommendations(string $weekStartDate, bool $force = false): WeeklyRecommendation
    {
        $user = Auth::user();

        // If forcing regeneration, delete existing recommendation
        if ($force) {
            $user->weeklyRecommendations()
                ->where('week_start_date', $weekStartDate)
                ->delete();
        }

        // Get all user tasks
        $tasks = $user->tasks()->with('category')->get();

        // Create new weekly recommendation
        $weeklyRecommendation = $user->weeklyRecommendations()->create([
            'week_start_date' => $weekStartDate,
            'generated_at' => now(),
        ]);

        // Generate recommendations using LLM
        $recommendations = $this->prismService->generateRecommendations($tasks, $weekStartDate);

        // Create recommended tasks
        foreach ($recommendations as $recommendation) {
            $weeklyRecommendation->recommendedTasks()->create([
                'task_id' => $recommendation['task_id'],
                'priority' => $recommendation['priority'],
                'reason' => $recommendation['reason'],
                'completed' => false,
            ]);
        }

        return $weeklyRecommendation->load('recommendedTasks.task');
    }
}

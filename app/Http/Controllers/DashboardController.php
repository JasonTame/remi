<?php

namespace App\Http\Controllers;

use App\Models\WeeklyRecommendation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        $weekStartDate = Carbon::now()->startOfWeek()->format('Y-m-d');

        // Get the current week's recommendation
        $weeklyRecommendation = WeeklyRecommendation::where('user_id', $user->id)
            ->where('week_start_date', $weekStartDate)
            ->first();

        $pendingTasks = [];
        $completedTasks = [];
        $skippedTasks = [];

        if ($weeklyRecommendation) {
            $allRecommendedTasks = $weeklyRecommendation->recommendedTasks()
                ->with(['task', 'task.category'])
                ->orderBy('priority')
                ->get()
                ->map(function ($recommendedTask) {
                    return [
                        'id' => $recommendedTask->id,
                        'task_id' => $recommendedTask->task_id,
                        'title' => $recommendedTask->task->title,
                        'lastCompleted' => $recommendedTask->task->last_completed_at,
                        'category' => $recommendedTask->task->category ? $recommendedTask->task->category->name : null,
                        'priority' => $recommendedTask->priority,
                        'reason' => $recommendedTask->reason,
                        'completed' => $recommendedTask->completed,
                        'skipped_at' => $recommendedTask->skipped_at,
                        'skip_reason' => $recommendedTask->skip_reason,
                    ];
                });

            // Separate tasks by their status
            foreach ($allRecommendedTasks as $task) {
                if ($task['completed']) {
                    $completedTasks[] = $task;
                } elseif ($task['skipped_at'] !== null) {
                    $skippedTasks[] = $task;
                } else {
                    $pendingTasks[] = $task;
                }
            }
        }

        return Inertia::render('dashboard', [
            'pendingTasks' => $pendingTasks,
            'completedTasks' => $completedTasks,
            'skippedTasks' => $skippedTasks,
            'weekStartDate' => $weekStartDate,
            'hasRecommendations' => ! empty($pendingTasks) || ! empty($completedTasks) || ! empty($skippedTasks),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\TaskHistory;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskHistoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the calendar view with task history.
     */
    public function index()
    {
        $taskHistory = TaskHistory::whereHas('task', function ($query) {
            $query->where('user_id', Auth::id());
        })
            ->with(['task.category'])
            ->orderBy('completed_at', 'desc')
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'task_id' => $history->task_id,
                    'completed_at' => $history->completed_at->toISOString(),
                    'notes' => $history->notes,
                    'task' => [
                        'id' => $history->task->id,
                        'title' => $history->task->title,
                        'timing_description' => $history->task->timing_description,
                        'description' => $history->task->description,
                        'last_completed_at' => $history->task->last_completed_at?->toISOString(),
                        'category' => $history->task->category ? [
                            'id' => $history->task->category->id,
                            'name' => $history->task->category->name,
                            'color' => $history->task->category->color,
                            'user_id' => $history->task->category->user_id,
                        ] : null,
                    ],
                ];
            });

        return Inertia::render('task-history', [
            'taskHistory' => $taskHistory,
        ]);
    }
}

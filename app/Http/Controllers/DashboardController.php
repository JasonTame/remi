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

        $weeklyRecommendation = WeeklyRecommendation::where('user_id', $user->id)
            ->where('week_start_date', $weekStartDate)
            ->first();

        if (! $weeklyRecommendation) {
            return Inertia::render('dashboard', [
                'pendingTasks' => [],
                'completedTasks' => [],
                'skippedTasks' => [],
                'weekStartDate' => $weekStartDate,
                'hasRecommendations' => false,
            ]);
        }

        $allRecommendedTasks = $weeklyRecommendation->recommendedTasks()
            ->with(['task', 'task.category'])
            ->orderBy('priority')
            ->get();

        return Inertia::render('dashboard', [
            'pendingTasks' => $allRecommendedTasks->filter(fn ($task) => ! $task->completed && $task->skipped_at === null)->pluck('dashboard_data')->values(),
            'completedTasks' => $allRecommendedTasks->filter(fn ($task) => $task->completed)->pluck('dashboard_data')->values(),
            'skippedTasks' => $allRecommendedTasks->filter(fn ($task) => $task->skipped_at !== null)->pluck('dashboard_data')->values(),
            'weekStartDate' => $weekStartDate,
            'hasRecommendations' => $allRecommendedTasks->isNotEmpty(),
        ]);
    }
}

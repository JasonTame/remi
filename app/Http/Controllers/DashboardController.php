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

        // Get upcoming birthdays
        $upcomingBirthdays = $user->birthdays()
            ->upcoming(14)
            ->orderByRaw("
                CASE 
                    WHEN DATE(EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(EXTRACT(MONTH FROM birthday)::text, 2, '0') || '-' || LPAD(EXTRACT(DAY FROM birthday)::text, 2, '0')) >= CURRENT_DATE
                    THEN DATE(EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(EXTRACT(MONTH FROM birthday)::text, 2, '0') || '-' || LPAD(EXTRACT(DAY FROM birthday)::text, 2, '0'))
                    ELSE DATE((EXTRACT(YEAR FROM NOW()) + 1)::text || '-' || LPAD(EXTRACT(MONTH FROM birthday)::text, 2, '0') || '-' || LPAD(EXTRACT(DAY FROM birthday)::text, 2, '0'))
                END
            ")
            ->get()
            ->map(function ($birthday) {
                return [
                    'id' => $birthday->id,
                    'name' => $birthday->name,
                    'birthday' => $birthday->birthday->format('m-d'),
                    'birth_year' => $birthday->birth_year,
                    'relationship' => $birthday->relationship,
                    'age' => $birthday->age,
                    'next_birthday' => $birthday->next_birthday->format('Y-m-d'),
                    'days_until_birthday' => $birthday->days_until_birthday,
                ];
            });

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
                'upcomingBirthdays' => $upcomingBirthdays,
            ]);
        }

        $allRecommendedTasks = $weeklyRecommendation->recommendedTasks()
            ->with(['task', 'task.category'])
            ->orderBy('priority', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'pendingTasks' => $allRecommendedTasks->filter(fn ($task) => ! $task->completed && $task->skipped_at === null)->pluck('dashboard_data')->values(),
            'completedTasks' => $allRecommendedTasks->filter(fn ($task) => $task->completed)->pluck('dashboard_data')->values(),
            'skippedTasks' => $allRecommendedTasks->filter(fn ($task) => $task->skipped_at !== null)->pluck('dashboard_data')->values(),
            'weekStartDate' => $weekStartDate,
            'hasRecommendations' => $allRecommendedTasks->isNotEmpty(),
            'upcomingBirthdays' => $upcomingBirthdays,
        ]);
    }
}

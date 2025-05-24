<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    /**
     * Fetch tasks for a user that are due or overdue based on days since last completion
     */
    public function getTasksDueForUser(User|int $user, int $daysAgo = 7, ?int $categoryId = null): Collection
    {
        $userId = $user instanceof User ? $user->id : $user;
        $cutoffDate = now()->subDays($daysAgo);

        $query = Task::where('user_id', $userId)
            ->with(['category'])
            ->where(function ($q) use ($cutoffDate) {
                $q->whereNull('last_completed_at')
                    ->orWhere('last_completed_at', '<', $cutoffDate);
            });

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        return $query->orderBy('title')->get();
    }

    /**
     * Get all tasks for a user
     */
    public function getAllTasksForUser(User|int $user): Collection
    {
        $userId = $user instanceof User ? $user->id : $user;

        return Task::where('user_id', $userId)
            ->with(['category'])
            ->orderBy('title')
            ->get();
    }

    /**
     * Get tasks by category for a user
     */
    public function getTasksByCategory(User|int $user, int $categoryId): Collection
    {
        $userId = $user instanceof User ? $user->id : $user;

        return Task::where('user_id', $userId)
            ->where('category_id', $categoryId)
            ->with(['category'])
            ->orderBy('title')
            ->get();
    }
}

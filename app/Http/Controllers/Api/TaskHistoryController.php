<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskHistoryController extends Controller
{
    /**
     * Get task history for a specific user.
     */
    public function getUserTaskHistory(Request $request, int $userId): JsonResponse
    {
        try {
            // Find the user
            $user = User::findOrFail($userId);

            // Get all task history for the user with related task and category information
            $taskHistory = $user->tasks()
                ->with(['history', 'category'])
                ->get()
                ->flatMap(function ($task) {
                    return $task->history->map(function ($history) use ($task) {
                        return [
                            'id' => $history->id,
                            'completed_at' => $history->completed_at,
                            'notes' => $history->notes,
                            'task' => [
                                'id' => $task->id,
                                'title' => $task->title,
                                'timing_description' => $task->timing_description,
                                'category' => $task->category ? [
                                    'id' => $task->category->id,
                                    'name' => $task->category->name,
                                    'color' => $task->category->color,
                                ] : null,
                            ],
                        ];
                    });
                })
                ->sortByDesc('completed_at')
                ->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'task_history' => $taskHistory,
                    'total_completions' => $taskHistory->count(),
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving task history.',
            ], 500);
        }
    }

    /**
     * Get task history for a specific user with pagination and filtering options.
     */
    public function getUserTaskHistoryWithFilters(Request $request, int $userId): JsonResponse
    {
        try {
            // Find the user
            $user = User::findOrFail($userId);

            // Get pagination parameters
            $perPage = $request->get('per_page', 15);
            $page = $request->get('page', 1);

            // Get filter parameters
            $taskId = $request->get('task_id');
            $categoryId = $request->get('category_id');
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            // Build the query
            $query = $user->tasks()->with(['history', 'category']);

            // Apply filters
            if ($taskId) {
                $query->where('id', $taskId);
            }

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            $tasks = $query->get();

            // Filter task history based on date range
            $taskHistory = $tasks->flatMap(function ($task) use ($startDate, $endDate) {
                $historyQuery = $task->history();

                if ($startDate) {
                    $historyQuery->where('completed_at', '>=', $startDate);
                }

                if ($endDate) {
                    $historyQuery->where('completed_at', '<=', $endDate);
                }

                return $historyQuery->get()->map(function ($history) use ($task) {
                    return [
                        'id' => $history->id,
                        'completed_at' => $history->completed_at,
                        'notes' => $history->notes,
                        'task' => [
                            'id' => $task->id,
                            'title' => $task->title,
                            'timing_description' => $task->timing_description,
                            'category' => $task->category ? [
                                'id' => $task->category->id,
                                'name' => $task->category->name,
                                'color' => $task->category->color,
                            ] : null,
                        ],
                    ];
                });
            })->sortByDesc('completed_at');

            // Manual pagination
            $total = $taskHistory->count();
            $paginatedHistory = $taskHistory->slice(($page - 1) * $perPage, $perPage)->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'task_history' => $paginatedHistory,
                    'pagination' => [
                        'current_page' => (int) $page,
                        'per_page' => (int) $perPage,
                        'total' => $total,
                        'last_page' => ceil($total / $perPage),
                        'has_more' => $page * $perPage < $total,
                    ],
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving task history.',
            ], 500);
        }
    }
}

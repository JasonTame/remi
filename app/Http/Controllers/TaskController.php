<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the tasks.
     */
    public function index()
    {
        $user = Auth::user();
        $tasks = $user->tasks()
            ->with('category')
            ->orderBy('last_completed_at', 'desc')
            ->paginate(10);

        $categories = $user->categories()->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
            'taskLimit' => [
                'current' => $user->getTasksCount(),
                'limit' => $user->task_limit,
                'remaining' => $user->getRemainingTasksCount(),
                'hasReachedLimit' => $user->hasReachedTaskLimit(),
            ],
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();

        Auth::user()->tasks()->create([
            'title' => $validated['title'],
            'timing_description' => $validated['timing_description'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'last_completed_at' => $validated['last_completed_at'] ?? null,
        ]);

        return redirect()->route('tasks.index')->with('type', 'success')->with('message', 'Task created successfully.');
    }

    /**
     * Update the specified task in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validated();

        $task->update([
            'title' => $validated['title'],
            'timing_description' => $validated['timing_description'],
            'description' => $validated['description'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'last_completed_at' => $validated['last_completed_at'] ?? null,
        ]);

        return redirect()->route('tasks.index', $task)->with('type', 'success')->with('message', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index')->with('type', 'success')->with('message', 'Task deleted successfully.');
    }

    /**
     * Mark a task as completed.
     */
    public function complete(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $task->history()->create([
            'completed_at' => $request->input('completed_at') ?? now(),
            'notes' => $request->input('notes'),
        ]);

        $task->update([
            'last_completed_at' => $request->input('completed_at') ?? now(),
        ]);

        $task->recommendedTasks()->update([
            'completed' => true,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('type', 'success')
            ->with('message', 'Task marked as completed.');
    }

    /**
     * Mark a task as skipped.
     */
    public function skip(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $task->recommendedTasks()->update([
            'skipped_at' => $request->input('skipped_at') ?? now(),
            'skip_reason' => $request->input('reason'),
        ]);

        return redirect()
            ->route('dashboard')
            ->with('type', 'success')
            ->with('message', 'Task skipped.');
    }
}

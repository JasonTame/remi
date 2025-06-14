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
        $tasks = Auth::user()->tasks()
            ->with('category')
            ->orderBy('title')
            ->get();

        $categories = Auth::user()->categories()->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'categories' => $categories,
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
            'category_id' => $validated['category_id'] ?? null,
            'last_completed_at' => $validated['last_completed_at'] ?? null,
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load(['category', 'history']);

        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
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
            'category_id' => $validated['category_id'] ?? null,
            'last_completed_at' => $validated['last_completed_at'] ?? null,
        ]);

        return redirect()->route('tasks.index', $task)->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }

    /**
     * Mark a task as completed.
     */
    public function complete(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        // Create task history entry
        $task->history()->create([
            'completed_at' => now(),
            'notes' => $request->input('notes'),
        ]);

        // Update the last completed timestamp
        $task->update([
            'last_completed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Task marked as completed.');
    }
}

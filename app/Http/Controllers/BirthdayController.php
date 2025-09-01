<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBirthdayRequest;
use App\Models\Birthday;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BirthdayController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $birthdays = Auth::user()
            ->birthdays()
            ->orderBy('birthday')
            ->get()
            ->map(function ($birthday) {
                return [
                    'id' => $birthday->id,
                    'name' => $birthday->name,
                    'birthday' => $birthday->birthday->format('Y-m-d'),
                    'birth_year' => $birthday->birth_year,
                    'relationship' => $birthday->relationship,
                    'notes' => $birthday->notes,
                    'age' => $birthday->age,
                    'next_birthday' => $birthday->next_birthday->format('Y-m-d'),
                    'days_until_birthday' => $birthday->days_until_birthday,
                ];
            });

        return Inertia::render('birthdays/index', [
            'birthdays' => $birthdays,
        ]);
    }

    /**
     * Store newly created resources in storage.
     */
    public function store(StoreBirthdayRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        Birthday::create([
            'user_id' => $request->user()->id,
            'name' => $validatedData['name'],
            'birthday' => $validatedData['birthday'],
            'birth_year' => $validatedData['birth_year'] ?? null,
            'relationship' => $validatedData['relationship'] ?? null,
            'notes' => $validatedData['notes'] ?? null,
        ]);

        return redirect()->back()->with(
            'success',
            'Birthday added successfully!'
        );
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Birthday $birthday): RedirectResponse
    {
        $this->authorize('update', $birthday);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date_format:Y-m-d'],
            'birth_year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            'relationship' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $birthday->update($validated);

        return redirect()->back()->with('success', 'Birthday updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Birthday $birthday): RedirectResponse
    {
        $this->authorize('delete', $birthday);

        $birthday->delete();

        return redirect()->back()->with('success', 'Birthday deleted successfully!');
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTasksRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tasks' => ['required', 'array', 'min:1'],
            'tasks.*.id' => ['required', 'string'],
            'tasks.*.title' => ['required', 'string', 'max:255'],
            'tasks.*.frequency' => ['required', 'string', 'max:255'],
            'tasks.*.category' => ['required', 'string', 'max:255'],
        ];
    }
}

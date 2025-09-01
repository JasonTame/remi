<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBirthdayRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date_format:Y-m-d'],
            'birth_year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            'relationship' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'birthday.required' => 'Birthday date is required.',
            'birthday.date_format' => 'Birthday must be in YYYY-MM-DD format.',
            'birth_year.min' => 'Birth year must be 1900 or later.',
            'birth_year.max' => 'Birth year cannot be in the future.',
        ];
    }
}

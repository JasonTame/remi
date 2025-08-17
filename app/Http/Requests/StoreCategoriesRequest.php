<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoriesRequest extends FormRequest
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
            'categories' => ['required', 'array', 'min:1'],
            'categories.*.id' => ['required', 'string'],
            'categories.*.name' => ['required', 'string', 'max:255'],
            'categories.*.color' => ['required', 'string', 'max:50'],
            'categories.*.icon' => ['nullable', 'string', 'max:50'],
        ];
    }
}

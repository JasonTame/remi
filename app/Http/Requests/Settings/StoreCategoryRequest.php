<?php

namespace App\Http\Requests\Settings;

use App\Enums\CategoryColor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->where(function ($query) {
                    /** @var \App\Models\User $user */
                    $user = $this->user();

                    return $query->where('user_id', $user->id);
                }),
            ],
            'color' => [
                'required',
                'string',
                Rule::enum(CategoryColor::class),
            ],
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
            'name.required' => 'Category name is required.',
            'name.string' => 'Category name must be a string.',
            'name.max' => 'Category name cannot exceed 255 characters.',
            'name.unique' => 'You already have a category with this name.',
            'color.required' => 'Category color is required.',
            'color.string' => 'Category color must be a string.',
            'color.enum' => 'Category color must be a valid color option.',
        ];
    }
}

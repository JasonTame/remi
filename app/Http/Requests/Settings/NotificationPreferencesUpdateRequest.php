<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class NotificationPreferencesUpdateRequest extends FormRequest
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
            'weekly_digest' => ['required', 'boolean'],
            'digest_day' => ['required', 'string', 'in:sunday,monday,tuesday,wednesday,thursday,friday,saturday'],
            'digest_time' => ['required', 'string', 'in:morning,afternoon,evening'],
            'task_reminder' => ['required', 'boolean'],
            'reminder_day' => ['required', 'string', 'in:sunday,monday,tuesday,wednesday,thursday,friday,saturday'],
            'reminder_time' => ['required', 'string', 'in:morning,afternoon,evening'],
            'push_notifications' => ['required', 'boolean'],
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
            'weekly_digest.required' => 'Weekly digest preference is required.',
            'weekly_digest.boolean' => 'Weekly digest preference must be true or false.',
            'digest_day.required' => 'Digest day is required.',
            'digest_day.in' => 'Digest day must be a valid day of the week.',
            'digest_time.required' => 'Digest time is required.',
            'digest_time.in' => 'Digest time must be morning, afternoon, or evening.',
            'task_reminder.required' => 'Task reminder preference is required.',
            'task_reminder.boolean' => 'Task reminder preference must be true or false.',
            'reminder_day.required' => 'Reminder day is required.',
            'reminder_day.in' => 'Reminder day must be a valid day of the week.',
            'reminder_time.required' => 'Reminder time is required.',
            'reminder_time.in' => 'Reminder time must be morning, afternoon, or evening.',
            'push_notifications.required' => 'Push notification preference is required.',
            'push_notifications.boolean' => 'Push notification preference must be true or false.',
        ];
    }
}

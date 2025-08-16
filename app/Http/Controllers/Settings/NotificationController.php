<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\CronExpressionHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\NotificationPreferencesUpdateRequest;
use App\Mail\WeeklyRecommendations;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display the notification preferences page.
     */
    public function show(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Get existing preferences or set defaults
        $weeklyDigestPreference = $user->notificationPreferences()
            ->where('notification_class', WeeklyRecommendations::class)
            ->first();

        $cronExpression = $weeklyDigestPreference?->cron_expression ?? '0 8 * * 1'; // Default: Monday 8am GMT

        $preferences = [
            'weekly_digest' => $weeklyDigestPreference?->is_enabled ?? true,
            'digest_day' => CronExpressionHelper::cronToDayOfWeek($cronExpression),
            'digest_time' => CronExpressionHelper::cronToTimeOfDay($cronExpression),
            'push_notifications' => false, // TODO: Implement push notifications later
        ];

        return Inertia::render('settings/notifications', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update the notification preferences.
     */
    public function update(NotificationPreferencesUpdateRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $validated = $request->validated();

        // Convert UI values to cron expression
        $cronExpression = CronExpressionHelper::buildCronExpression(
            $validated['digest_day'],
            $validated['digest_time']
        );

        // Update or create weekly digest preference
        $user->notificationPreferences()->updateOrCreate(
            ['notification_class' => WeeklyRecommendations::class],
            [
                'is_enabled' => $validated['weekly_digest'],
                'cron_expression' => $cronExpression,
            ]
        );

        return redirect()->back()->with('success', 'Notification preferences updated successfully.');
    }
}

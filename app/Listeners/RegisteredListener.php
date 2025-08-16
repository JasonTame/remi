<?php

namespace App\Listeners;

use App\Mail\OnboardingWelcome;
use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;

class RegisteredListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        // Send welcome email
        Mail::to($event->user->email)->send(new OnboardingWelcome($event->user));

        // Create default notification preferences
        $this->createDefaultNotificationPreferences($event->user);
    }

    /**
     * Create default notification preferences for the user.
     */
    private function createDefaultNotificationPreferences($user): void
    {
        NotificationPreference::create([
            'user_id' => $user->id,
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Monday 8am GMT
        ]);
    }
}

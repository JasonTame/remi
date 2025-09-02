<?php

namespace App\Listeners;

use App\Services\PostHogService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;

class PostHogIdentifyUserListener
{
    /**
     * Create the event listener.
     */
    public function __construct(
        private PostHogService $postHogService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(Login|Registered $event): void
    {
        // Identify the user with PostHog
        $this->postHogService->identify($event->user);

        // Capture the login/registration event
        $eventName = $event instanceof Registered ? 'User Registered' : 'User Logged In';

        $this->postHogService->capture($event->user, $eventName, [
            'login_method' => $event->user->google_id ? 'google' : 'email',
            'timestamp' => now()->toISOString(),
        ]);
    }
}

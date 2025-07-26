<?php

namespace App\Listeners;

use App\Mail\OnboardingWelcome;
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
        Mail::to($event->user->email)->send(new OnboardingWelcome($event->user));
    }
}

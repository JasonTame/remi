<?php

namespace App\Providers;

use App\Listeners\PostHogIdentifyUserListener;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use PostHog\PostHog;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Only initialize PostHog if API key is configured
        if (config('posthog.api_key')) {
            PostHog::init(
                config('posthog.api_key'),
                [
                    'host' => 'https://eu.i.posthog.com',
                ]
            );
        }

        // Register PostHog user identification listeners
        Event::listen([Login::class, Registered::class], PostHogIdentifyUserListener::class);

        // Customize email verification notification to use our pre-compiled MJML template
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject('Verify Your Email Address - Remi')
                ->view(['html' => 'emails.verify-email-compiled'], [
                    'verificationUrl' => $url,
                    'user' => $notifiable,
                ]);
        });
    }
}

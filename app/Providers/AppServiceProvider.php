<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use PostHog\PostHog;
use Illuminate\Support\ServiceProvider;

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
        PostHog::init(
            config('posthog.api_key'),
            [
                'host' => 'https://eu.i.posthog.com'
            ]
        );

        // Customize email verification notification to use our pre-compiled MJML template
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new \Illuminate\Notifications\Messages\MailMessage)
                ->subject('Verify Your Email Address - Remi')
                ->view(['html' => 'emails.verify-email-compiled'], [
                    'verificationUrl' => $url,
                    'user' => $notifiable
                ]);
        });
    }
}

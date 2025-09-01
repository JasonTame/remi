<?php

namespace App\Providers;

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
    }
}

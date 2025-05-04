<?php

namespace App\Providers;

use App\Services\PrismService;
use Illuminate\Support\ServiceProvider;
use Prism\Prism\Prism;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(PrismService::class, function ($app) {
            return new PrismService($app->make(Prism::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

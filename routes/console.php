<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Define the application's command schedule
// Process scheduled notifications every hour
// This will now handle both generating recommendations AND sending notifications
// based on each user's individual notification preferences
Schedule::command('notifications:process-scheduled')
    ->hourly()
    ->name('process-scheduled-notifications')
    ->withoutOverlapping();

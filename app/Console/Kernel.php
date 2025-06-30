<?php

namespace App\Console;

use App\Jobs\GenerateTaskRecommendationsJob;
use App\Models\User;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Generate task recommendations for all users every Monday at 6am GMT
        $schedule->call(function () {
            Log::info('Starting weekly task recommendations generation for all users');

            $userCount = 0;

            User::chunk(100, function ($users) use (&$userCount) {
                foreach ($users as $user) {
                    GenerateTaskRecommendationsJob::dispatch($user->id);
                    $userCount++;
                }
            });

            Log::info("Queued task recommendation jobs for {$userCount} users");
        })
            ->weekly()
            ->mondays()
            ->at('06:00')
            ->timezone('GMT')
            ->name('generate-weekly-task-recommendations')
            ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}

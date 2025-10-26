<?php

namespace App\Jobs;

use App\Services\NotificationSchedulerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessScheduledNotificationsJob implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The maximum number of seconds the job can run before timing out.
     */
    public int $timeout = 300; // 5 minutes

    /**
     * Get the unique ID for the job to prevent duplicates.
     */
    public function uniqueId(): string
    {
        return 'process-scheduled-notifications-'.now()->format('Y-m-d-H');
    }

    /**
     * Execute the job.
     */
    public function handle(NotificationSchedulerService $notificationService): void
    {
        Log::info('ProcessScheduledNotificationsJob: Starting to process scheduled notifications');

        try {
            $notificationService->processPendingNotifications();
            Log::info('ProcessScheduledNotificationsJob: Successfully processed scheduled notifications');
        } catch (\Exception $e) {
            Log::error('ProcessScheduledNotificationsJob: Failed to process scheduled notifications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e; // Re-throw to trigger job retry
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessScheduledNotificationsJob: Job failed after all retries', [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}

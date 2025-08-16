<?php

namespace App\Console\Commands;

use App\Services\NotificationSchedulerService;
use Illuminate\Console\Command;

class ProcessScheduledNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:process-scheduled 
                            {--dry-run : Show what would be processed without actually sending notifications}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and send scheduled notifications based on user preferences';

    /**
     * Execute the console command.
     */
    public function handle(NotificationSchedulerService $notificationService): int
    {
        $this->info('Processing scheduled notifications...');

        if ($this->option('dry-run')) {
            $pendingCount = $notificationService->getPendingNotificationCount();
            $this->info("Dry run: {$pendingCount} notifications would be processed.");

            return self::SUCCESS;
        }

        try {
            $notificationService->processPendingNotifications();
            $this->info('Scheduled notifications processed successfully.');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Failed to process scheduled notifications: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}

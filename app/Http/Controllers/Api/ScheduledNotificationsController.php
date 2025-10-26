<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessScheduledNotificationsJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ScheduledNotificationsController extends Controller
{
    /**
     * Trigger the scheduled notifications job.
     */
    public function trigger(Request $request): JsonResponse
    {
        // Validate the trigger token
        $token = $request->header('X-Trigger-Token');
        if ($token !== config('schedule.trigger_token')) {
            Log::warning('Unauthorized attempt to trigger scheduled notifications', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        try {
            ProcessScheduledNotificationsJob::dispatch();

            Log::info('Scheduled notifications job dispatched successfully via API trigger');

            return response()->json([
                'success' => true,
                'message' => 'Scheduled notifications job dispatched successfully',
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to dispatch scheduled notifications job via API trigger', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to dispatch job: ' . $e->getMessage(),
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }
}

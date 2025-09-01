<?php

use App\Mail\RecommendedTaskReminder;
use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add default task reminder preferences for existing users
        $users = User::all();

        foreach ($users as $user) {
            // Check if user already has a task reminder preference
            $existingPreference = NotificationPreference::where('user_id', $user->id)
                ->where('notification_class', RecommendedTaskReminder::class)
                ->first();

            // Only create if it doesn't exist
            if (! $existingPreference) {
                NotificationPreference::create([
                    'user_id' => $user->id,
                    'notification_class' => RecommendedTaskReminder::class,
                    'is_enabled' => true,
                    'cron_expression' => '0 8 * * 5', // Friday 8am GMT
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove all task reminder preferences
        NotificationPreference::where('notification_class', RecommendedTaskReminder::class)
            ->delete();
    }
};

<?php

namespace Database\Seeders;

use App\Mail\WeeklyRecommendations;
use App\Models\NotificationPreference;
use App\Models\User;
use Creativeorange\Gravatar\Facades\Gravatar;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = 'jason@useremi.app';
        $avatar = Gravatar::get($email);

        $user = User::factory()->create([
            'name' => 'Jason Tame',
            'email' => $email,
            'avatar' => $avatar,
            'password' => bcrypt('password'),
        ]);

        // Create a default notification preference for the user
        NotificationPreference::create([
            'user_id' => $user->id,
            'notification_class' => WeeklyRecommendations::class,
            'is_enabled' => true,
            'cron_expression' => '0 8 * * 1', // Monday 8am GMT
        ]);
    }
}

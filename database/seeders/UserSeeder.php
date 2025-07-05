<?php

namespace Database\Seeders;

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

        User::factory()->create([
            'name' => 'Jason Tame',
            'email' => $email,
            'avatar' => $avatar,
            'password' => bcrypt('password'),
        ]);
    }
}

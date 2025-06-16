<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use App\Enums\CategoryColor;

use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            $this->command->info('No users found. Please run UserSeeder first.');

            return;
        }

        $categories = [
            [
                'name' => 'Health',
                'color' => CategoryColor::Blue->value,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Home',
                'color' => CategoryColor::Green->value,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Tech',
                'color' => CategoryColor::Red->value,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Personal',
                'color' => CategoryColor::Orange->value,
                'user_id' => $user->id,
            ],
            [
                'name' => 'Admin',
                'color' => CategoryColor::Gray->value,
                'user_id' => $user->id,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

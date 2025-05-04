<?php

namespace App\Policies;

use App\Models\RecommendedTask;
use App\Models\User;

class RecommendedTaskPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RecommendedTask $recommendedTask): bool
    {
        return $user->id === $recommendedTask->weeklyRecommendation->user_id;
    }
}

<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'onboarding_completed',
        'google_id',
        'email_verified_at',
        'task_limit',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'onboarding_completed' => 'boolean',
        'task_limit' => 'integer',
    ];

    /**
     * Get all of the user's tasks.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get all of the user's categories.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Get all of the user's weekly recommendations.
     */
    public function weeklyRecommendations(): HasMany
    {
        return $this->hasMany(WeeklyRecommendation::class);
    }

    /**
     * Get all of the user's notification preferences.
     */
    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(NotificationPreference::class);
    }

    /**
     * Get all of the user's birthdays.
     */
    public function birthdays(): HasMany
    {
        return $this->hasMany(Birthday::class);
    }

    /**
     * Check if the user has reached their task limit.
     */
    public function hasReachedTaskLimit(): bool
    {
        return $this->tasks()->count() >= $this->task_limit;
    }

    /**
     * Get the number of remaining tasks the user can create.
     */
    public function getRemainingTasksCount(): int
    {
        return max(0, $this->task_limit - $this->tasks()->count());
    }

    /**
     * Get the current task count for the user.
     */
    public function getTasksCount(): int
    {
        return $this->tasks()->count();
    }
}

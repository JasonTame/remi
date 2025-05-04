<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecommendedTask extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'weekly_recommendation_id',
        'task_id',
        'priority',
        'reason',
        'completed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'priority' => 'integer',
        'completed' => 'boolean',
    ];

    /**
     * Get the weekly recommendation that owns the recommended task.
     */
    public function weeklyRecommendation(): BelongsTo
    {
        return $this->belongsTo(WeeklyRecommendation::class);
    }

    /**
     * Get the task that this recommendation refers to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}

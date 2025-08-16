<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notification_class',
        'is_enabled',
        'cron_expression',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the notification class instance
     */
    public function getNotificationInstance(): string
    {
        return $this->notification_class;
    }

    /**
     * Check if this preference is for a specific notification class
     */
    public function isForNotification(string $notificationClass): bool
    {
        return $this->notification_class === $notificationClass;
    }
}

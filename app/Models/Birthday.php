<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Birthday extends Model
{
    /** @use HasFactory<\Database\Factories\BirthdayFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'birthday',
        'birth_year',
        'relationship',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'birthday' => 'date',
            'birth_year' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getAgeAttribute(): ?int
    {
        if (! $this->birth_year) {
            return null;
        }

        return Carbon::now()->year - $this->birth_year;
    }

    public function getNextBirthdayAttribute(): Carbon
    {
        $today = Carbon::today();
        $thisYear = $today->year;

        $nextBirthday = Carbon::createFromDate($thisYear, $this->birthday->month, $this->birthday->day);

        if ($nextBirthday->isPast()) {
            $nextBirthday->addYear();
        }

        return $nextBirthday;
    }

    public function getDaysUntilBirthdayAttribute(): int
    {
        return Carbon::today()->diffInDays($this->next_birthday);
    }

    public function isUpcoming(int $withinDays = 14): bool
    {
        return $this->days_until_birthday <= $withinDays;
    }

    public function scopeUpcoming($query, int $withinDays = 14)
    {
        $today = Carbon::today();
        $endDate = $today->copy()->addDays($withinDays);

        return $query->where(function ($q) use ($today, $endDate) {
            // Handle birthdays in current year
            $q->whereRaw("
                DATE(? || '-' || LPAD(EXTRACT(MONTH FROM birthday)::text, 2, '0') || '-' || LPAD(EXTRACT(DAY FROM birthday)::text, 2, '0')) 
                BETWEEN ? AND ?
            ", [$today->year, $today->toDateString(), $endDate->toDateString()])
                // Handle birthdays that cross into next year
                ->orWhereRaw("
                DATE(? || '-' || LPAD(EXTRACT(MONTH FROM birthday)::text, 2, '0') || '-' || LPAD(EXTRACT(DAY FROM birthday)::text, 2, '0')) 
                BETWEEN ? AND ?
            ", [$today->year + 1, $today->toDateString(), $endDate->toDateString()]);
        });
    }
}

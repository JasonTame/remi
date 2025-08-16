<?php

namespace App\Helpers;

class CronExpressionHelper
{
    /**
     * Convert cron expression to day of week for UI.
     */
    public static function cronToDayOfWeek(string $cronExpression): string
    {
        $parts = explode(' ', $cronExpression);
        $dayOfWeek = $parts[4] ?? '1';

        return match ($dayOfWeek) {
            '0' => 'sunday',
            '1' => 'monday',
            '2' => 'tuesday',
            '3' => 'wednesday',
            '4' => 'thursday',
            '5' => 'friday',
            '6' => 'saturday',
            default => 'monday',
        };
    }

    /**
     * Convert cron expression to time of day for UI.
     */
    public static function cronToTimeOfDay(string $cronExpression): string
    {
        $parts = explode(' ', $cronExpression);
        $hour = (int) ($parts[1] ?? 8);

        return match (true) {
            $hour >= 6 && $hour < 12 => 'morning',
            $hour >= 12 && $hour < 18 => 'afternoon',
            default => 'evening',
        };
    }

    /**
     * Build cron expression from UI values.
     */
    public static function buildCronExpression(string $dayOfWeek, string $timeOfDay): string
    {
        $dayNumber = match ($dayOfWeek) {
            'sunday' => '0',
            'monday' => '1',
            'tuesday' => '2',
            'wednesday' => '3',
            'thursday' => '4',
            'friday' => '5',
            'saturday' => '6',
            default => '1',
        };

        $hour = match ($timeOfDay) {
            'morning' => '8',
            'afternoon' => '13',
            'evening' => '18',
            default => '8',
        };

        return "0 {$hour} * * {$dayNumber}";
    }

    /**
     * Validate if a cron expression is properly formatted.
     */
    public static function isValidCronExpression(string $cronExpression): bool
    {
        if (empty(trim($cronExpression))) {
            return false;
        }

        $parts = explode(' ', $cronExpression);

        if (count($parts) !== 5) {
            return false;
        }

        // Basic validation - ensure no empty parts
        foreach ($parts as $part) {
            $trimmed = trim($part);
            if ($trimmed === '') {
                return false;
            }
        }

        return true;
    }
}

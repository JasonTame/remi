<?php

use App\Helpers\CronExpressionHelper;

describe('CronExpressionHelper', function () {
    describe('cronToDayOfWeek', function () {
        it('converts cron day numbers to day names correctly', function () {
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 0'))->toBe('sunday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 1'))->toBe('monday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 2'))->toBe('tuesday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 3'))->toBe('wednesday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 4'))->toBe('thursday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 5'))->toBe('friday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 6'))->toBe('saturday');
        });

        it('defaults to monday for invalid day numbers', function () {
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * 7'))->toBe('monday');
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * * invalid'))->toBe('monday');
        });

        it('handles malformed cron expressions gracefully', function () {
            expect(CronExpressionHelper::cronToDayOfWeek('0 8 * *'))->toBe('monday');
            expect(CronExpressionHelper::cronToDayOfWeek(''))->toBe('monday');
        });
    });

    describe('cronToTimeOfDay', function () {
        it('converts morning hours correctly', function () {
            expect(CronExpressionHelper::cronToTimeOfDay('0 6 * * 1'))->toBe('morning');
            expect(CronExpressionHelper::cronToTimeOfDay('0 8 * * 1'))->toBe('morning');
            expect(CronExpressionHelper::cronToTimeOfDay('0 11 * * 1'))->toBe('morning');
        });

        it('converts afternoon hours correctly', function () {
            expect(CronExpressionHelper::cronToTimeOfDay('0 12 * * 1'))->toBe('afternoon');
            expect(CronExpressionHelper::cronToTimeOfDay('0 13 * * 1'))->toBe('afternoon');
            expect(CronExpressionHelper::cronToTimeOfDay('0 17 * * 1'))->toBe('afternoon');
        });

        it('converts evening hours correctly', function () {
            expect(CronExpressionHelper::cronToTimeOfDay('0 18 * * 1'))->toBe('evening');
            expect(CronExpressionHelper::cronToTimeOfDay('0 20 * * 1'))->toBe('evening');
            expect(CronExpressionHelper::cronToTimeOfDay('0 23 * * 1'))->toBe('evening');
        });

        it('defaults to evening for early morning hours', function () {
            expect(CronExpressionHelper::cronToTimeOfDay('0 0 * * 1'))->toBe('evening');
            expect(CronExpressionHelper::cronToTimeOfDay('0 5 * * 1'))->toBe('evening');
        });

        it('handles malformed cron expressions gracefully', function () {
            expect(CronExpressionHelper::cronToTimeOfDay('0 * * 1'))->toBe('evening'); // * is not a valid hour, defaults to 8 but treated as invalid
            expect(CronExpressionHelper::cronToTimeOfDay(''))->toBe('morning'); // Empty defaults to hour 8
        });
    });

    describe('buildCronExpression', function () {
        it('builds correct cron expressions for all day/time combinations', function () {
            $testCases = [
                ['sunday', 'morning', '0 8 * * 0'],
                ['monday', 'morning', '0 8 * * 1'],
                ['tuesday', 'morning', '0 8 * * 2'],
                ['wednesday', 'morning', '0 8 * * 3'],
                ['thursday', 'morning', '0 8 * * 4'],
                ['friday', 'morning', '0 8 * * 5'],
                ['saturday', 'morning', '0 8 * * 6'],
                ['monday', 'afternoon', '0 13 * * 1'],
                ['tuesday', 'afternoon', '0 13 * * 2'],
                ['wednesday', 'afternoon', '0 13 * * 3'],
                ['thursday', 'afternoon', '0 13 * * 4'],
                ['friday', 'afternoon', '0 13 * * 5'],
                ['saturday', 'afternoon', '0 13 * * 6'],
                ['sunday', 'afternoon', '0 13 * * 0'],
                ['monday', 'evening', '0 18 * * 1'],
                ['tuesday', 'evening', '0 18 * * 2'],
                ['wednesday', 'evening', '0 18 * * 3'],
                ['thursday', 'evening', '0 18 * * 4'],
                ['friday', 'evening', '0 18 * * 5'],
                ['saturday', 'evening', '0 18 * * 6'],
                ['sunday', 'evening', '0 18 * * 0'],
            ];

            foreach ($testCases as [$day, $time, $expectedCron]) {
                expect(CronExpressionHelper::buildCronExpression($day, $time))->toBe($expectedCron);
            }
        });

        it('handles invalid inputs with defaults', function () {
            expect(CronExpressionHelper::buildCronExpression('invalid_day', 'morning'))->toBe('0 8 * * 1');
            expect(CronExpressionHelper::buildCronExpression('monday', 'invalid_time'))->toBe('0 8 * * 1');
            expect(CronExpressionHelper::buildCronExpression('invalid_day', 'invalid_time'))->toBe('0 8 * * 1');
        });
    });

    describe('isValidCronExpression', function () {
        it('validates correct cron expressions', function () {
            expect(CronExpressionHelper::isValidCronExpression('0 8 * * 1'))->toBeTrue();
            expect(CronExpressionHelper::isValidCronExpression('30 14 * * 5'))->toBeTrue();
            expect(CronExpressionHelper::isValidCronExpression('0 0 1 1 *'))->toBeTrue();
            expect(CronExpressionHelper::isValidCronExpression('*/5 * * * *'))->toBeTrue();
        });

        it('rejects invalid cron expressions', function () {
            expect(CronExpressionHelper::isValidCronExpression('0 8 * *'))->toBeFalse(); // Too few parts
            expect(CronExpressionHelper::isValidCronExpression('0 8 * * 1 extra'))->toBeFalse(); // Too many parts
            expect(CronExpressionHelper::isValidCronExpression(''))->toBeFalse(); // Empty string
            expect(CronExpressionHelper::isValidCronExpression('0  * * 1'))->toBeFalse(); // Empty part
        });
    });

    describe('round-trip conversion', function () {
        it('maintains consistency when converting to UI and back to cron', function () {
            $originalCrons = [
                '0 8 * * 1',  // Monday morning
                '0 13 * * 3', // Wednesday afternoon
                '0 18 * * 5', // Friday evening
                '0 8 * * 0',  // Sunday morning
            ];

            foreach ($originalCrons as $originalCron) {
                $dayOfWeek = CronExpressionHelper::cronToDayOfWeek($originalCron);
                $timeOfDay = CronExpressionHelper::cronToTimeOfDay($originalCron);
                $rebuiltCron = CronExpressionHelper::buildCronExpression($dayOfWeek, $timeOfDay);

                expect($rebuiltCron)->toBe($originalCron);
            }
        });
    });
});

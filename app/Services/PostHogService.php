<?php

namespace App\Services;

use App\Models\User;
use PostHog\PostHog;

class PostHogService
{
    /**
     * Identify a user with PostHog.
     */
    public function identify(User $user): void
    {
        if (! config('posthog.api_key')) {
            return;
        }

        PostHog::identify([
            'distinctId' => (string) $user->id,
            'properties' => [
                'email' => $user->email,
                'name' => $user->name,
                'created_at' => $user->created_at?->toISOString(),
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'onboarding_completed' => $user->onboarding_completed,
                'task_limit' => $user->task_limit,
                'task_count' => $user->getTasksCount(),
                'google_id' => $user->google_id ? 'connected' : null,
            ],
        ]);
    }

    /**
     * Capture an event for a user.
     *
     * @param  array<string, mixed>  $properties
     */
    public function capture(User $user, string $event, array $properties = []): void
    {
        if (! config('posthog.api_key')) {
            return;
        }

        PostHog::capture([
            'distinctId' => (string) $user->id,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    /**
     * Capture an event without a user (anonymous).
     *
     * @param  array<string, mixed>  $properties
     */
    public function captureAnonymous(string $distinctId, string $event, array $properties = []): void
    {
        if (! config('posthog.api_key')) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => $properties,
        ]);
    }

    /**
     * Alias an anonymous user to a registered user.
     */
    public function alias(string $anonymousId, User $user): void
    {
        if (! config('posthog.api_key')) {
            return;
        }

        PostHog::alias([
            'distinctId' => (string) $user->id,
            'alias' => $anonymousId,
        ]);
    }
}

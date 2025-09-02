<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'posthog' => [
                'user_id' => $request->user()?->id,
                'user_email' => $request->user()?->email,
                'user_name' => $request->user()?->name,
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'type' => fn () => $request->session()->get('type'),
            ],
            'notifications' => fn () => $request->user() ? [
                'data' => $request->user()->notifications()
                    ->orderBy('created_at', 'desc')
                    ->limit(50)
                    ->get()
                    ->map(function ($notification) {
                        return [
                            'id' => $notification->id,
                            'type' => $notification->data['type'] ?? 'unknown',
                            'title' => $notification->data['title'] ?? '',
                            'message' => $notification->data['message'] ?? '',
                            'icon' => $notification->data['icon'] ?? '🔔',
                            'action_url' => $notification->data['action_url'] ?? null,
                            'read_at' => $notification->read_at,
                            'created_at' => $notification->created_at,
                            'data' => $notification->data,
                        ];
                    }),
                'unread_count' => $request->user()->unreadNotifications()->count(),
            ] : ['data' => [], 'unread_count' => 0],
        ];
    }
}

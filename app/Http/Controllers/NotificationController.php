<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $notification = $user->notifications()->find($id);

        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }

    /**
     * Delete a specific notification.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $notification = $user->notifications()->find($id);

        if ($notification) {
            $notification->delete();
        }

        return back();
    }
}

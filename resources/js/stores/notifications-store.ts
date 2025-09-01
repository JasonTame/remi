import { create } from "zustand";

export interface Notification {
	id: string;
	type: string;
	title: string;
	message: string;
	icon: string;
	action_url?: string;
	read_at: string | null;
	created_at: string;
	data: Record<string, unknown>;
}

interface NotificationsState {
	notifications: Notification[];
	unreadCount: number;
	setNotifications: (
		notifications: Notification[],
		unreadCount: number,
	) => void;
	markAsRead: (notificationId: string) => void;
	markAllAsRead: () => void;
	removeNotification: (notificationId: string) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
	notifications: [],
	unreadCount: 0,
	setNotifications: (notifications, unreadCount) =>
		set({ notifications, unreadCount }),
	markAsRead: (notificationId) =>
		set((state) => ({
			notifications: state.notifications.map((notification) =>
				notification.id === notificationId
					? { ...notification, read_at: new Date().toISOString() }
					: notification,
			),
			unreadCount: Math.max(0, state.unreadCount - 1),
		})),
	markAllAsRead: () =>
		set((state) => ({
			notifications: state.notifications.map((notification) => ({
				...notification,
				read_at: notification.read_at || new Date().toISOString(),
			})),
			unreadCount: 0,
		})),
	removeNotification: (notificationId) =>
		set((state) => {
			const notification = state.notifications.find(
				(n) => n.id === notificationId,
			);
			const wasUnread = notification && !notification.read_at;
			return {
				notifications: state.notifications.filter(
					(n) => n.id !== notificationId,
				),
				unreadCount: wasUnread
					? Math.max(0, state.unreadCount - 1)
					: state.unreadCount,
			};
		}),
}));

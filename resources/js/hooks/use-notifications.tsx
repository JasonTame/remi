import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

import { useNotificationsStore } from "@/stores/notifications-store";

interface NotificationsData {
	data: Array<{
		id: string;
		type: string;
		title: string;
		message: string;
		icon: string;
		action_url?: string;
		read_at: string | null;
		created_at: string;
		data: Record<string, unknown>;
	}>;
	unread_count: number;
}

export function useNotifications() {
	const { notifications } = usePage<{
		notifications: NotificationsData;
	}>().props;

	const { setNotifications } = useNotificationsStore();

	// Initialize store with Inertia props
	useEffect(() => {
		if (notifications) {
			setNotifications(notifications.data, notifications.unread_count);
		}
	}, [notifications, setNotifications]);

	return useNotificationsStore();
}

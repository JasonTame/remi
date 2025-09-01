import { router, useForm } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useNotifications } from "@/hooks/use-notifications";

export function NotificationsDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		removeNotification,
	} = useNotifications();

	const markAsReadForm = useForm();
	const markAllAsReadForm = useForm();
	const deleteForm = useForm();

	const handleMarkAsRead = (notificationId: string) => {
		markAsRead(notificationId);
		markAsReadForm.patch(route("notifications.mark-as-read", notificationId), {
			preserveScroll: true,
			preserveState: true,
		});
	};

	const handleMarkAllAsRead = () => {
		markAllAsRead();
		markAllAsReadForm.patch(route("notifications.mark-all-as-read"), {
			preserveScroll: true,
			preserveState: true,
		});
	};

	const handleDeleteNotification = (notificationId: string) => {
		removeNotification(notificationId);
		deleteForm.delete(route("notifications.destroy", notificationId), {
			preserveScroll: true,
			preserveState: true,
		});
	};

	const handleNotificationClick = (notification: (typeof notifications)[0]) => {
		// Mark as read if unread
		if (!notification.read_at) {
			handleMarkAsRead(notification.id);
		}

		// Navigate to action URL if provided
		if (notification.action_url) {
			setIsOpen(false);
			router.visit(notification.action_url);
		}
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
						>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="font-semibold">Notifications</h3>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleMarkAllAsRead}
							className="text-xs"
						>
							Mark all read
						</Button>
					)}
				</div>

				<ScrollArea className="h-96">
					{notifications.length === 0 ? (
						<div className="p-4 text-center text-muted-foreground">
							No notifications yet
						</div>
					) : (
						<div className="divide-y">
							{notifications.map((notification) => (
								<button
									key={notification.id}
									type="button"
									className={`w-full p-4 hover:bg-muted/50 cursor-pointer transition-colors text-left ${
										!notification.read_at
											? "bg-blue-50/50 dark:bg-blue-950/20"
											: ""
									}`}
									onClick={() => handleNotificationClick(notification)}
								>
									<div className="flex items-start gap-3">
										<div className="text-lg flex-shrink-0">
											{notification.icon}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1">
													<p className="font-medium text-sm leading-tight">
														{notification.title}
													</p>
													<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
														{notification.message}
													</p>
													<p className="text-xs text-muted-foreground mt-2">
														{formatDistanceToNow(
															new Date(notification.created_at),
															{
																addSuffix: true,
															},
														)}
													</p>
												</div>
												<div className="flex items-center gap-1 flex-shrink-0">
													{!notification.read_at && (
														<Button
															variant="ghost"
															size="sm"
															onClick={(e) => {
																e.stopPropagation();
																handleMarkAsRead(notification.id);
															}}
															className="h-6 w-6 p-0"
														>
															<Check className="h-3 w-3" />
														</Button>
													)}
													<Button
														variant="ghost"
														size="sm"
														onClick={(e) => {
															e.stopPropagation();
															handleDeleteNotification(notification.id);
														}}
														className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</div>
											</div>
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

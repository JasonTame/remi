import { Head, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

import AppLayout from "@/layouts/main-layout";
import SettingsLayout from "@/layouts/settings/layout";

import InputError from "@/components/form/input-error";
import HeadingSmall from "@/components/shared/heading-small";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useFlashMessages } from "@/hooks/use-flash-messages";

type NotificationForm = {
	weekly_digest: boolean;
	digest_day: string;
	digest_time: string;
	task_reminder: boolean;
	reminder_day: string;
	reminder_time: string;
	push_notifications: boolean;
};

type NotificationPreferences = {
	weekly_digest: boolean;
	digest_day: string;
	digest_time: string;
	task_reminder: boolean;
	reminder_day: string;
	reminder_time: string;
	push_notifications: boolean;
};

type Props = {
	preferences: NotificationPreferences;
};

export default function Notifications({ preferences }: Props) {
	useFlashMessages();

	const { data, setData, patch, processing, errors } = useForm<
		Required<NotificationForm>
	>({
		weekly_digest: preferences.weekly_digest,
		digest_day: preferences.digest_day,
		digest_time: preferences.digest_time,
		task_reminder: preferences.task_reminder,
		reminder_day: preferences.reminder_day,
		reminder_time: preferences.reminder_time,
		push_notifications: preferences.push_notifications,
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		patch(route("notifications.update"), {
			preserveScroll: true,
		});
	};

	return (
		<AppLayout title="Notification preferences">
			<Head title="Notification preferences" />

			<SettingsLayout>
				<Card>
					<CardHeader>
						<HeadingSmall
							title="Notification preferences"
							description="Manage how and when Remi reminds you about tasks"
						/>
					</CardHeader>
					<CardContent>
						<form onSubmit={submit} className="space-y-6">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Email notifications</h3>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="weekly-digest" className="font-medium">
											Weekly digest
										</Label>
										<p className="text-sm text-muted-foreground">
											Receive a summary of your suggested tasks for the week
										</p>
									</div>
									<Switch
										id="weekly-digest"
										checked={data.weekly_digest}
										onCheckedChange={(checked: boolean) =>
											setData("weekly_digest", checked)
										}
									/>
								</div>
								<InputError message={errors.weekly_digest} />
							</div>

							<div className="space-y-4 pt-6 border-t">
								<h3 className="text-lg font-semibold">Weekly digest timing</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="digest-day">Day of week</Label>
										<Select
											value={data.digest_day}
											onValueChange={(value) => setData("digest_day", value)}
										>
											<SelectTrigger id="digest-day">
												<SelectValue placeholder="Select day" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="sunday">Sunday</SelectItem>
												<SelectItem value="monday">Monday</SelectItem>
												<SelectItem value="tuesday">Tuesday</SelectItem>
												<SelectItem value="wednesday">Wednesday</SelectItem>
												<SelectItem value="thursday">Thursday</SelectItem>
												<SelectItem value="friday">Friday</SelectItem>
												<SelectItem value="saturday">Saturday</SelectItem>
											</SelectContent>
										</Select>
										<InputError message={errors.digest_day} />
									</div>

									<div className="space-y-2">
										<Label htmlFor="digest-time">Time of day</Label>
										<Select
											value={data.digest_time}
											onValueChange={(value) => setData("digest_time", value)}
										>
											<SelectTrigger id="digest-time">
												<SelectValue placeholder="Select time" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="morning">
													Morning (8:00 AM)
												</SelectItem>
												<SelectItem value="afternoon">
													Afternoon (1:00 PM)
												</SelectItem>
												<SelectItem value="evening">
													Evening (6:00 PM)
												</SelectItem>
											</SelectContent>
										</Select>
										<InputError message={errors.digest_time} />
									</div>
								</div>
							</div>

							<div className="space-y-4 pt-6 border-t">
								<h3 className="text-lg font-semibold">Task reminders</h3>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="task-reminder" className="font-medium">
											Weekly task reminder
										</Label>
										<p className="text-sm text-muted-foreground">
											Get a gentle nudge about incomplete tasks from your weekly
											recommendations
										</p>
									</div>
									<Switch
										id="task-reminder"
										checked={data.task_reminder}
										onCheckedChange={(checked: boolean) =>
											setData("task_reminder", checked)
										}
									/>
								</div>
								<InputError message={errors.task_reminder} />
							</div>

							<div className="space-y-4 pt-6 border-t">
								<h3 className="text-lg font-semibold">Task reminder timing</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="reminder-day">Day of week</Label>
										<Select
											value={data.reminder_day}
											onValueChange={(value) => setData("reminder_day", value)}
										>
											<SelectTrigger id="reminder-day">
												<SelectValue placeholder="Select day" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="sunday">Sunday</SelectItem>
												<SelectItem value="monday">Monday</SelectItem>
												<SelectItem value="tuesday">Tuesday</SelectItem>
												<SelectItem value="wednesday">Wednesday</SelectItem>
												<SelectItem value="thursday">Thursday</SelectItem>
												<SelectItem value="friday">Friday</SelectItem>
												<SelectItem value="saturday">Saturday</SelectItem>
											</SelectContent>
										</Select>
										<InputError message={errors.reminder_day} />
									</div>

									<div className="space-y-2">
										<Label htmlFor="reminder-time">Time of day</Label>
										<Select
											value={data.reminder_time}
											onValueChange={(value) => setData("reminder_time", value)}
										>
											<SelectTrigger id="reminder-time">
												<SelectValue placeholder="Select time" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="morning">
													Morning (8:00 AM)
												</SelectItem>
												<SelectItem value="afternoon">
													Afternoon (1:00 PM)
												</SelectItem>
												<SelectItem value="evening">
													Evening (6:00 PM)
												</SelectItem>
											</SelectContent>
										</Select>
										<InputError message={errors.reminder_time} />
									</div>
								</div>
							</div>

							<div className="space-y-4 pt-6 border-t">
								<h3 className="text-lg font-semibold">Push notifications</h3>

								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="push-enabled" className="font-medium">
											Enable push notifications
										</Label>
										<p className="text-sm text-muted-foreground">
											Receive notifications on your device
										</p>
									</div>
									<Switch
										id="push-enabled"
										checked={data.push_notifications}
										onCheckedChange={(checked: boolean) =>
											setData("push_notifications", checked)
										}
									/>
								</div>
								<InputError message={errors.push_notifications} />
							</div>

							<Button type="submit" disabled={processing}>
								Save preferences
							</Button>
						</form>
					</CardContent>
				</Card>
			</SettingsLayout>
		</AppLayout>
	);
}

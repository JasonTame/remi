import { Cake, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Birthday {
	id: number;
	name: string;
	birthday: string;
	birth_year?: number;
	relationship?: string;
	age?: number;
	next_birthday: string;
	days_until_birthday: number;
}

interface UpcomingBirthdaysSectionProps {
	birthdays: Birthday[];
	onAddBirthdays: () => void;
}

export function UpcomingBirthdaysSection({
	birthdays,
	onAddBirthdays,
}: UpcomingBirthdaysSectionProps) {
	if (birthdays.length === 0) {
		return (
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle className="flex items-center gap-2 text-lg font-medium">
						<Cake className="h-5 w-5 text-pink-500" />
						Upcoming Birthdays
					</CardTitle>
					<Button
						onClick={onAddBirthdays}
						size="sm"
						variant="outline"
						className="gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Birthday
					</Button>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<Cake className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="text-lg font-medium">No upcoming birthdays</h3>
						<p className="text-muted-foreground mt-2 max-w-md text-sm">
							No upcoming birthdays in the next 2 weeks
						</p>
						<p className="text-muted-foreground mt-1 text-sm">
							Add birthdays to never forget to celebrate!
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<CardTitle className="flex items-center gap-2 text-lg font-medium">
					<Cake className="h-5 w-5 text-pink-500" />
					Upcoming Birthdays
				</CardTitle>
				<Button
					onClick={onAddBirthdays}
					size="sm"
					variant="outline"
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Birthdays
				</Button>
			</CardHeader>
			<CardContent className="space-y-3">
				{birthdays.map((birthday) => (
					<BirthdayCard key={birthday.id} birthday={birthday} />
				))}
			</CardContent>
		</Card>
	);
}

function BirthdayCard({ birthday }: { birthday: Birthday }) {
	const isToday = birthday.days_until_birthday === 0;
	const isTomorrow = birthday.days_until_birthday === 1;

	let timeText = "";
	if (isToday) {
		timeText = "Today";
	} else if (isTomorrow) {
		timeText = "Tomorrow";
	} else {
		timeText = `In ${birthday.days_until_birthday} days`;
	}

	return (
		<div
			className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
				isToday
					? "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-950"
					: "border-border bg-card hover:bg-accent"
			}`}
		>
			<div className="flex items-center gap-3">
				<div
					className={`flex h-10 w-10 items-center justify-center rounded-full ${
						isToday
							? "bg-pink-500 text-white"
							: "bg-muted text-muted-foreground"
					}`}
				>
					<Cake className="h-4 w-4" />
				</div>
				<div>
					<div className="flex items-center gap-2">
						<span className="font-medium">{birthday.name}</span>
						{birthday.relationship && (
							<span className="text-muted-foreground text-xs">
								({birthday.relationship})
							</span>
						)}
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>{birthday.birthday}</span>
						{birthday.age !== null && (
							<span>• Turning {(birthday.age || 0) + 1}</span>
						)}
					</div>
				</div>
			</div>
			<div className="text-right">
				<div
					className={`text-sm font-medium ${
						isToday ? "text-pink-600 dark:text-pink-400" : ""
					}`}
				>
					{timeText}
				</div>
			</div>
		</div>
	);
}

import { Head } from "@inertiajs/react";
import { addMonths, subMonths } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";

import MainLayout from "@/layouts/main-layout";

import { AddBirthdayDialog } from "@/components/birthdays/add-birthday-dialog";
import { EditBirthdayDialog } from "@/components/birthdays/edit-birthday-dialog";
import { BirthdayCalendar } from "@/components/calendar/birthday-calendar";
import { CalendarHeader } from "@/components/calendar/header";
import { Button } from "@/components/ui/button";

import { useFlashMessages } from "@/hooks/use-flash-messages";

interface Birthday {
	id: number;
	name: string;
	birthday: string;
	birth_year?: number;
	relationship?: string;
	notes?: string;
	age?: number;
	next_birthday: string;
	days_until_birthday: number;
}

interface BirthdaysIndexProps {
	birthdays: Birthday[];
}

export default function BirthdaysIndex({ birthdays }: BirthdaysIndexProps) {
	useFlashMessages();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(
		null,
	);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);

	const handleBirthdayClick = (birthday: Birthday) => {
		setSelectedBirthday(birthday);
		setEditDialogOpen(true);
	};

	const handlePreviousMonth = () => {
		setCurrentDate(subMonths(currentDate, 1));
	};

	const handleNextMonth = () => {
		setCurrentDate(addMonths(currentDate, 1));
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	return (
		<MainLayout title="Birthdays">
			<Head title="Birthdays" />

			<div className="h-full space-y-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-foreground">
							Birthdays
						</h1>
						<p className="text-muted-foreground">
							View and manage your birthday reminders. Click on a birthday to
							edit.
						</p>
					</div>
					<Button onClick={() => setAddDialogOpen(true)} className="gap-2">
						<Plus className="h-4 w-4" />
						Add Birthday
					</Button>
				</div>

				<div className="space-y-4">
					<CalendarHeader
						currentDate={currentDate}
						onPreviousMonth={handlePreviousMonth}
						onNextMonth={handleNextMonth}
						onToday={handleToday}
					/>

					<div className="border border-input rounded shadow">
						<BirthdayCalendar
							currentDate={currentDate}
							birthdays={birthdays}
							onBirthdayClick={handleBirthdayClick}
						/>
					</div>
				</div>

				{/* Statistics */}
				{birthdays.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-card border rounded-lg p-4">
							<div className="text-2xl font-semibold text-foreground">
								{birthdays.length}
							</div>
							<p className="text-sm text-muted-foreground">Total Birthdays</p>
						</div>
						<div className="bg-card border rounded-lg p-4">
							<div className="text-2xl font-semibold text-foreground">
								{birthdays.filter((b) => b.days_until_birthday <= 30).length}
							</div>
							<p className="text-sm text-muted-foreground">This Month</p>
						</div>
						<div className="bg-card border rounded-lg p-4">
							<div className="text-2xl font-semibold text-foreground">
								{birthdays.filter((b) => b.days_until_birthday <= 7).length}
							</div>
							<p className="text-sm text-muted-foreground">This Week</p>
						</div>
					</div>
				)}

				{/* Empty state */}
				{birthdays.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
						<div className="text-6xl mb-4">🎂</div>
						<h3 className="text-xl font-medium">No birthdays yet</h3>
						<p className="text-muted-foreground mt-2 max-w-md">
							Add birthdays to track upcoming celebrations and never miss an
							important day.
						</p>
						<Button
							onClick={() => setAddDialogOpen(true)}
							className="mt-4 gap-2"
						>
							<Plus className="h-4 w-4" />
							Add Your First Birthday
						</Button>
					</div>
				)}
			</div>

			<AddBirthdayDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

			<EditBirthdayDialog
				birthday={selectedBirthday}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
			/>
		</MainLayout>
	);
}

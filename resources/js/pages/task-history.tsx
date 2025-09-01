import { Head } from "@inertiajs/react";
import { addMonths, subMonths } from "date-fns";
import { useState } from "react";

import MainLayout from "@/layouts/main-layout";

import { Calendar } from "@/components/calendar";
import { CalendarHeader } from "@/components/calendar/header";
import { TaskViewDialog } from "@/components/tasks/task-view-dialog";

import type { Task } from "@/types";

interface TaskHistory {
	id: number;
	task_id: number;
	completed_at: string;
	notes?: string;
	task: Task;
}

interface TaskHistoryProps {
	taskHistory: TaskHistory[];
}

export default function TaskHistory({ taskHistory }: TaskHistoryProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);

	const handleViewTask = (task: Task) => {
		setSelectedTask(task);
		setViewDialogOpen(true);
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
		<MainLayout title="Task History">
			<Head title="Task History" />

			<div className="h-full space-y-6 p-6">
				<p className="text-muted-foreground">
					View your task completion history. Calendar shows data up to the
					current week.
				</p>

				<div className="space-y-4">
					<CalendarHeader
						currentDate={currentDate}
						onPreviousMonth={handlePreviousMonth}
						onNextMonth={handleNextMonth}
						onToday={handleToday}
						restrictFutureNavigation={true}
					/>

					<div className="border border-input rounded shadow">
						<Calendar
							currentDate={currentDate}
							taskHistory={taskHistory}
							onTaskClick={handleViewTask}
						/>
					</div>
					{/* <CalendarLegend /> */}
				</div>
			</div>
			{selectedTask && (
				<TaskViewDialog
					task={selectedTask}
					open={viewDialogOpen}
					onOpenChange={setViewDialogOpen}
				/>
			)}
		</MainLayout>
	);
}

"use client";

import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek,
} from "date-fns";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { getCategoryColor } from "@/lib/utils/tasks/get-category-color";

import { useIsMobile } from "@/hooks/use-mobile";

import type { Task } from "@/types";

interface TaskHistory {
	id: number;
	task_id: number;
	completed_at: string;
	notes?: string;
	task: Task;
}

interface CalendarProps {
	currentDate: Date;
	taskHistory: TaskHistory[];
	onTaskClick?: (task: Task) => void;
}

export function Calendar({
	currentDate,
	taskHistory,
	onTaskClick,
}: CalendarProps) {
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

	const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

	const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const isMobile = useIsMobile();
	const mobileWeekdays = ["M", "T", "W", "T", "F", "S", "S"];

	// Get completed tasks for a specific day
	const getTasksForDay = (day: Date) => {
		const completedTasks = taskHistory.filter((history) =>
			isSameDay(new Date(history.completed_at), day),
		);

		return { completedTasks };
	};

	return (
		<div className="calendar">
			<div className="grid grid-cols-7 gap-px bg-muted rounded-t-md overflow-hidden">
				{(isMobile ? mobileWeekdays : weekdays).map((day) => (
					<div
						key={day}
						className="bg-muted-foreground/5 p-2 text-center text-sm font-medium"
					>
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-px bg-muted rounded-b-md overflow-hidden">
				{days.map((day) => {
					const { completedTasks } = getTasksForDay(day);
					const isCurrentMonth = isSameMonth(day, currentDate);
					const isSelected = isSameDay(day, currentDate);
					const isTodayDate = isToday(day);
					const totalTasks = completedTasks.length;

					return (
						<div
							key={day.toISOString()}
							className={cn(
								"min-h-[80px] sm:min-h-[120px] bg-card p-3",
								!isCurrentMonth && "text-muted-foreground bg-muted/50",
								isSelected && "bg-accent/20",
							)}
						>
							<div className="flex justify-between">
								<span
									className={cn(
										"text-sm font-medium",
										isTodayDate &&
											"bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center",
									)}
								>
									{format(day, "d")}
								</span>
							</div>

							{/* Mobile view - just show count */}
							{isMobile && totalTasks > 0 && (
								<div className="mt-1 flex gap-1 flex-wrap">
									{completedTasks.length > 0 && (
										<div className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300">
											{completedTasks.length}
										</div>
									)}
								</div>
							)}

							{/* Desktop view - show task details */}
							{!isMobile && (
								<div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
									{completedTasks.map((history) => (
										<TooltipProvider key={`completed-${history.id}`}>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														type="button"
														className={cn(
															"text-xs p-1 rounded border-l-2 truncate cursor-pointer",
															"bg-green-50 border-green-300 text-green-800 hover:bg-green-100",
															"dark:bg-green-900/20 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30",
														)}
														onClick={() => onTaskClick?.(history.task)}
														onKeyDown={(e) => {
															if (e.key === "Enter" || e.key === " ") {
																onTaskClick?.(history.task);
															}
														}}
														tabIndex={0}
													>
														<div className="flex items-center gap-1">
															<span
																className={cn(
																	"inline-block w-2 h-2 rounded-full flex-shrink-0",
																	history.task.category?.color
																		? getCategoryColor(
																				history.task.category.color,
																			).split(" ")[0]
																		: "bg-gray-400",
																)}
															/>
															{history.task.title}
														</div>
													</button>
												</TooltipTrigger>
												<TooltipContent>
													<p>{history.task.title} (Completed)</p>
													{history.notes && (
														<p className="text-xs text-muted-foreground mt-1">
															{history.notes}
														</p>
													)}
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

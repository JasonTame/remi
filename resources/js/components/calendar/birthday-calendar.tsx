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
import { Gift } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import { useIsMobile } from "@/hooks/use-mobile";

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

interface BirthdayCalendarProps {
	currentDate: Date;
	birthdays: Birthday[];
	onBirthdayClick?: (birthday: Birthday) => void;
}

export function BirthdayCalendar({
	currentDate,
	birthdays,
	onBirthdayClick,
}: BirthdayCalendarProps) {
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(monthStart);
	const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

	const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

	const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const isMobile = useIsMobile();
	const mobileWeekdays = ["M", "T", "W", "T", "F", "S", "S"];

	// Get birthdays for a specific day (regardless of year)
	const getBirthdaysForDay = (day: Date) => {
		const dayString = format(day, "MM-dd");
		return birthdays.filter((birthday) => {
			const birthdayString = format(new Date(birthday.birthday), "MM-dd");
			return birthdayString === dayString;
		});
	};

	// Calculate age for a birthday on a specific date
	const getAgeOnDate = (birthday: Birthday, date: Date) => {
		if (!birthday.birth_year) return null;
		return date.getFullYear() - birthday.birth_year;
	};

	return (
		<div className="calendar">
			<div className="grid grid-cols-7 gap-px bg-muted rounded-t-md overflow-hidden">
				{(isMobile ? mobileWeekdays : weekdays).map((day) => (
					<div
						key={day}
						className="bg-muted-foreground/5 text-foreground p-2 text-center text-sm font-medium"
					>
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-px bg-muted rounded-b-md overflow-hidden">
				{days.map((day) => {
					const dayBirthdays = getBirthdaysForDay(day);
					const isCurrentMonth = isSameMonth(day, currentDate);
					const isSelected = isSameDay(day, currentDate);
					const isTodayDate = isToday(day);
					const totalBirthdays = dayBirthdays.length;

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
										"text-sm font-medium text-foreground",
										isTodayDate &&
											"bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center",
									)}
								>
									{format(day, "d")}
								</span>
							</div>

							{/* Mobile view - just show count */}
							{isMobile && totalBirthdays > 0 && (
								<div className="mt-1 flex gap-1 flex-wrap">
									<div className="text-xs px-1.5 py-0.5 rounded-full bg-pink-100 border border-pink-300 text-pink-800 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-300 flex items-center gap-1">
										<Gift className="h-3 w-3" />
										{totalBirthdays}
									</div>
								</div>
							)}

							{/* Desktop view - show birthday details */}
							{!isMobile && (
								<div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto">
									{dayBirthdays.map((birthday) => {
										const ageOnDate = getAgeOnDate(birthday, day);
										const ageText = ageOnDate ? ` (${ageOnDate})` : "";

										return (
											<TooltipProvider key={birthday.id}>
												<Tooltip>
													<TooltipTrigger asChild>
														<button
															type="button"
															onClick={() => onBirthdayClick?.(birthday)}
															className={cn(
																"w-full text-left text-xs rounded px-2 py-1 border transition-colors hover:opacity-80",
																"bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-300",
															)}
														>
															<div className="flex items-center gap-1 truncate">
																<Gift className="h-3 w-3 shrink-0" />
																<span className="truncate">
																	{birthday.name}
																	{ageText}
																</span>
															</div>
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<div className="space-y-1">
															<div className="font-medium">
																{birthday.name}
																{ageText && (
																	<span className="text-muted-foreground">
																		{ageText}
																	</span>
																)}
															</div>
															{birthday.relationship && (
																<div className="text-sm text-muted-foreground">
																	{birthday.relationship}
																</div>
															)}
															{birthday.notes && (
																<div className="text-sm text-muted-foreground">
																	{birthday.notes}
																</div>
															)}
														</div>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

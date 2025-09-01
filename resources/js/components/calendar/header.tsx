"use client";

import { format, isAfter, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
	currentDate: Date;
	onPreviousMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
	restrictFutureNavigation?: boolean;
}

export function CalendarHeader({
	currentDate,
	onPreviousMonth,
	onNextMonth,
	onToday,
	restrictFutureNavigation = false,
}: CalendarHeaderProps) {
	const today = new Date();
	const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
	const selectedWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

	// Disable next button if the current date would go beyond the current week (only for historical views)
	const canGoNext = restrictFutureNavigation
		? !isAfter(selectedWeekStart, currentWeekStart)
		: true;

	return (
		<div className="flex items-center justify-between mb-6">
			<h2 className="text-xl font-semibold">
				{format(currentDate, "MMMM yyyy")}
			</h2>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={onToday}>
					Today
				</Button>
				<div className="flex items-center">
					<Button variant="ghost" size="icon" onClick={onPreviousMonth}>
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous month</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={onNextMonth}
						disabled={!canGoNext}
						className={!canGoNext ? "opacity-50 cursor-not-allowed" : ""}
					>
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Next month</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

import { Head } from "@inertiajs/react";
import { Ban, Trophy } from "lucide-react";

import MainLayout from "@/layouts/main-layout";

import { CompletedTasksSection } from "@/components/dashboard/completed-tasks-section";
import { PendingTasksSection } from "@/components/dashboard/pending-tasks-section";
import { SkippedTasksSection } from "@/components/dashboard/skipped-tasks-section";

import { getWeekRange } from "@/lib/utils/tasks/get-week-range";

import { useFlashMessages } from "@/hooks/use-flash-messages";

import type { RecommendedTask } from "@/types";

interface PageProps {
	pendingTasks: RecommendedTask[];
	completedTasks: RecommendedTask[];
	skippedTasks: RecommendedTask[];
	weekStartDate: string;
	hasRecommendations: boolean;
}

export default function Dashboard({
	pendingTasks,
	completedTasks,
	skippedTasks,
	weekStartDate,
	hasRecommendations,
}: PageProps) {
	useFlashMessages();
	const weekRange = getWeekRange(weekStartDate);

	return (
		<MainLayout title="Dashboard">
			<Head title="Dashboard" />
			<div className="h-full space-y-8 p-6">
				<div className="space-y-2">
					<h2 className="text-muted-foreground text-lg">{weekRange}</h2>
					<h3 className="text-2xl font-semibold text-foreground">
						Remi suggests these tasks this week:
					</h3>
				</div>

				{!hasRecommendations && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<Ban className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="text-xl font-medium">No recommendations</h3>
						<p className="text-muted-foreground mt-2 max-w-md">
							You don't have any task recommendations for this week.
						</p>
					</div>
				)}

				<PendingTasksSection tasks={pendingTasks} />

				{/* All tasks completed/skipped message */}
				{pendingTasks.length === 0 &&
					(completedTasks.length > 0 || skippedTasks.length > 0) && (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Trophy className="text-primary mb-4 h-12 w-12" />
							<h3 className="text-xl font-medium">Great work!</h3>
							<p className="text-muted-foreground mt-2 max-w-md">
								You've completed or addressed all your recommended tasks for
								this week. Check back next week for new recommendations.
							</p>
						</div>
					)}

				<CompletedTasksSection tasks={completedTasks} />

				<SkippedTasksSection tasks={skippedTasks} />
			</div>
		</MainLayout>
	);
}

import type { RecommendedTask } from "@/types";
import { RecommendedTaskCard } from "./task-card";

interface PendingTasksSectionProps {
	tasks: RecommendedTask[];
}

export function PendingTasksSection({ tasks }: PendingTasksSectionProps) {
	if (tasks.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{tasks.map((task) => (
					<RecommendedTaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}

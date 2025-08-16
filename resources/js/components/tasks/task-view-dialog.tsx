import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import type { Task } from "@/types";
import { TaskDetail } from "./task-detail";

type Props = {
	task: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};
export const TaskViewDialog = ({ task, open, onOpenChange }: Props) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[550px]">
				<DialogHeader>
					<DialogTitle>Task Details</DialogTitle>
				</DialogHeader>
				{task && <TaskDetail task={task} />}
			</DialogContent>
		</Dialog>
	);
};

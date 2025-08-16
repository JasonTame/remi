import type { Category, Task } from "@/types";
import { TaskDeleteDialog } from "./task-delete-dialog";
import { TaskEditDialog } from "./task-edit-dialog";
import { TaskViewDialog } from "./task-view-dialog";

type Props = {
	viewDialogOpen: boolean;
	editDialogOpen: boolean;
	deleteDialogOpen: boolean;
	selectedTask: Task;
	categories: Category[];
	setViewDialogOpen: (open: boolean) => void;
	setEditDialogOpen: (open: boolean) => void;
	setDeleteDialogOpen: (open: boolean) => void;
};
export const TaskDialogs = ({
	viewDialogOpen,
	editDialogOpen,
	deleteDialogOpen,
	selectedTask,
	categories,
	setViewDialogOpen,
	setEditDialogOpen,
	setDeleteDialogOpen,
}: Props) => {
	return (
		<>
			<TaskDeleteDialog
				task={selectedTask}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			/>
			<TaskViewDialog
				task={selectedTask}
				open={viewDialogOpen}
				onOpenChange={setViewDialogOpen}
			/>
			<TaskEditDialog
				task={selectedTask}
				categories={categories}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
			/>
		</>
	);
};

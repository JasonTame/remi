import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { formatDate } from "@/lib/helpers/format";
import { getCategoryColor } from "@/lib/utils/tasks/get-category-color";

import type { Category, Task } from "@/types";
import { TaskDialogs } from "./task-dialogs";

type Props = {
	tasks: Task[];
	categories: Category[];
	sortOrder: "asc" | "desc";
	onSortChange: (order: "asc" | "desc") => void;
};

export const TaskTable = ({
	tasks,
	categories,
	sortOrder,
	onSortChange,
}: Props) => {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleViewTask = (task: Task) => {
		setSelectedTask(task);
		setViewDialogOpen(true);
	};

	const handleEditTask = (task: Task) => {
		setSelectedTask(task);
		setEditDialogOpen(true);
	};

	const handleDeleteTask = (task: Task) => {
		setSelectedTask(task);
		setDeleteDialogOpen(true);
	};

	const toggleSortOrder = () => {
		onSortChange(sortOrder === "asc" ? "desc" : "asc");
	};

	return (
		<>
			<div className="overflow-hidden rounded-md border bg-white dark:bg-gray-800">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[300px]">Title</TableHead>
								<TableHead>Category</TableHead>
								<TableHead className="cursor-pointer" onClick={toggleSortOrder}>
									<div className="flex items-center">
										Last Completed
										<ArrowUpDown className="ml-2 h-4 w-4" />
									</div>
								</TableHead>
								<TableHead>Frequency</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="font-medium">{task.title}</TableCell>
									<TableCell>
										{task.category ? (
											<Badge className={getCategoryColor(task.category.color)}>
												{task.category.name}
											</Badge>
										) : (
											<span className="text-muted-foreground">-</span>
										)}
									</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span>
												{task.last_completed_at
													? formatDate(task.last_completed_at, "dd/MM/yyyy")
													: "Never"}
											</span>
											<span className="text-muted-foreground text-xs">
												{task.last_completed_at
													? formatDistanceToNow(task.last_completed_at, {
															addSuffix: true,
														})
													: "Never"}
											</span>
										</div>
									</TableCell>

									<TableCell>{task.timing_description}</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleViewTask(task)}
											>
												<Eye className="h-4 w-4" />
												<span className="sr-only">View</span>
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">More options</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => handleEditTask(task)}
													>
														<Pencil className="mr-2 h-4 w-4" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteTask(task)}
													>
														<Trash className="mr-2 h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			{selectedTask && (
				<TaskDialogs
					deleteDialogOpen={deleteDialogOpen}
					viewDialogOpen={viewDialogOpen}
					editDialogOpen={editDialogOpen}
					selectedTask={selectedTask}
					categories={categories}
					setViewDialogOpen={setViewDialogOpen}
					setEditDialogOpen={setEditDialogOpen}
					setDeleteDialogOpen={setDeleteDialogOpen}
				/>
			)}
		</>
	);
};

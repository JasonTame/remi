import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";

import AppLayout from "@/layouts/main-layout";

import CategoryFilter from "@/components/tasks/category-filter";
import { TaskCreate } from "@/components/tasks/task-create";
import { TaskList } from "@/components/tasks/task-list";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import { useFlashMessages } from "@/hooks/use-flash-messages";

import type { Category, Paginator, Task, TaskLimit } from "@/types";

interface PageProps {
	tasks: Paginator<Task>;
	categories: Category[];
	taskLimit: TaskLimit;
}

export default function Index({ tasks, categories, taskLimit }: PageProps) {
	useFlashMessages();

	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const filteredTasks = selectedCategory
		? tasks.data.filter((task) => task.category?.id === selectedCategory)
		: tasks.data;

	// Handle pagination
	const handlePageChange = (url: string | null) => {
		if (url) {
			Inertia.visit(url, { preserveScroll: true, preserveState: true });
		}
	};

	return (
		<AppLayout
			title="Tasks"
			breadcrumbs={[{ title: "Tasks", href: route("tasks.index") }]}
			showAddButton={!taskLimit.hasReachedLimit}
			onAddClick={() => setIsCreateDialogOpen(true)}
		>
			<div className="py-6">
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					{/* Task Limit Display */}
					<div className="mb-6 rounded-lg border bg-card p-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-sm font-medium">Task Usage</h3>
								<p className="text-sm text-muted-foreground">
									{taskLimit.current} of {taskLimit.limit} tasks used
								</p>
							</div>
							<div className="text-right">
								<div className="text-sm font-medium">
									{taskLimit.remaining} remaining
								</div>
								{taskLimit.hasReachedLimit && (
									<div className="text-xs text-destructive">
										Limit reached - upgrade to create more tasks
									</div>
								)}
							</div>
						</div>
						<div className="mt-2">
							<div className="h-2 w-full rounded-full bg-muted">
								<div
									className={`h-2 rounded-full transition-all ${
										taskLimit.hasReachedLimit
											? "bg-destructive"
											: taskLimit.current / taskLimit.limit > 0.8
												? "bg-warning"
												: "bg-primary"
									}`}
									style={{
										width: `${Math.min(
											(taskLimit.current / taskLimit.limit) * 100,
											100,
										)}%`,
									}}
								/>
							</div>
						</div>
					</div>

					<CategoryFilter
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						categories={categories}
					/>

					<TaskList
						tasks={filteredTasks}
						categories={categories}
						sortOrder="desc"
						onSortChange={() => {}}
					/>

					{/* Pagination Controls */}
					<div className="mt-6 flex justify-center">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() => handlePageChange(tasks.prev_page_url)}
										aria-disabled={!tasks.prev_page_url}
									/>
								</PaginationItem>
								{tasks.links.map((link) => (
									<PaginationItem key={link.url}>
										{link.label.match(/\d+/) ? (
											<PaginationLink
												isActive={link.active}
												onClick={() => handlePageChange(link.url)}
												aria-disabled={!link.url}
											>
												{link.label}
											</PaginationLink>
										) : null}
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										onClick={() => handlePageChange(tasks.next_page_url)}
										aria-disabled={!tasks.next_page_url}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			</div>

			<TaskCreate
				categories={categories}
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
			/>
		</AppLayout>
	);
}

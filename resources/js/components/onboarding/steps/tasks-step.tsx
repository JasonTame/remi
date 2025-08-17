import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useOnboardingStore } from "@/stores/onboarding-store";

export default function TasksStep() {
	const {
		selectedCategories,
		selectedTaskIds,
		customTasks,
		newTaskTitle,
		newTaskFrequency,
		newTaskCategory,
		getAllTasks,
		getFilteredSuggestedTasks,
		toggleTask,
		setNewTaskTitle,
		setNewTaskFrequency,
		setNewTaskCategory,
		addCustomTask,
		removeCustomTask,
	} = useOnboardingStore();

	const filteredSuggestedTasks = getFilteredSuggestedTasks();

	const getCategoryColor = (category: string) => {
		const colorMap: Record<string, string> = {
			"Medical & Health": "bg-blue-500",
			"Home Maintenance": "bg-green-500",
			"Personal & Social": "bg-purple-500",
			Auto: "bg-orange-500",
			Tech: "bg-indigo-500",
			Finance: "bg-emerald-500",
		};
		return colorMap[category] || "bg-gray-500";
	};

	const allTasks = getAllTasks();

	return (
		<div className="space-y-8">
			<div className="text-center space-y-4">
				<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
					Add 3-5 tasks to get started. Use natural language to describe how
					often you want to do them – phrases like "every 6 months", "monthly",
					"about once a quarter", or "twice a year" work perfectly.
				</p>
			</div>

			{/* Quick Start Suggestions */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<svg
						className="w-5 h-5 text-yellow-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Quick Start Suggestions</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
					<h3 className="text-lg font-semibold">Quick Start Suggestions</h3>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					{filteredSuggestedTasks.map((task) => {
						const isSelected = selectedTaskIds.includes(task.id);
						return (
							<button
								type="button"
								key={task.id}
								tabIndex={0}
								onClick={() => toggleTask(task.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										toggleTask(task.id);
									}
								}}
								className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
									isSelected
										? "bg-primary/5 border-primary"
										: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50"
								}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<h4 className="font-medium text-gray-900 dark:text-gray-100">
												{task.title}
											</h4>
											<Badge
												variant="secondary"
												className={`text-white text-xs ${getCategoryColor(task.category)}`}
											>
												{task.category}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{task.frequency}
										</p>
									</div>
									<div className="flex-shrink-0 ml-3">
										{isSelected ? (
											<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
												<svg
													className="w-4 h-4 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>Selected</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
										) : (
											<div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
												<svg
													className="w-4 h-4 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>Add</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 6v6m0 0v6m0-6h6m-6 0H6"
													/>
												</svg>
											</div>
										)}
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Add Custom Task */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Add Custom Task</h3>
				<div className="grid md:grid-cols-3 gap-3">
					<Input
						placeholder="e.g., Schedule dental checkup"
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
					/>
					<Input
						placeholder="e.g., Every 6 months"
						value={newTaskFrequency}
						onChange={(e) => setNewTaskFrequency(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								addCustomTask();
							}
						}}
					/>
					<Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
						<SelectTrigger>
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							{selectedCategories.map((category) => (
								<SelectItem key={category.id} value={category.name}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Button
					onClick={addCustomTask}
					disabled={
						!newTaskTitle.trim() ||
						!newTaskFrequency.trim() ||
						!newTaskCategory.trim()
					}
					className="w-full flex items-center gap-2"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Add Task</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					Add Task
				</Button>

				{/* Custom Tasks */}
				{customTasks.length > 0 && (
					<div className="space-y-2">
						{customTasks.map((task) => (
							<div
								key={task.id}
								className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
							>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-medium">{task.title}</h4>
										<Badge variant="outline">Custom</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{task.frequency}
									</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => removeCustomTask(task.id)}
									className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Remove Task</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</Button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Your Tasks Summary */}
			{selectedTaskIds.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">
						Your Tasks ({selectedTaskIds.length})
					</h3>
					<div className="space-y-3">
						{selectedTaskIds.map((taskId) => {
							const task = allTasks.find((t) => t.id === taskId);
							if (!task) return null;
							return (
								<div
									key={taskId}
									className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg"
								>
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-medium">{task.title}</h4>
											<Badge
												variant="secondary"
												className={`text-white text-xs ${getCategoryColor(task.category)}`}
											>
												{task.category}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{task.frequency}
										</p>
									</div>
									<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
										<svg
											className="w-4 h-4 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Task Selected</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Frequency Examples */}
			<div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<svg
						className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Frequency Examples</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
							Frequency Examples
						</h4>
						<ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
							<li>• "Every 6 months" or "Twice a year"</li>
							<li>• "Monthly" or "Once a month"</li>
							<li>• "Every few weeks" or "About monthly"</li>
							<li>• "Quarterly" or "Every 3 months"</li>
							<li>• "Weekly" or "Once a week"</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

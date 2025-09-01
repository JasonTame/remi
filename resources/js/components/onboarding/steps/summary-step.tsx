import { Badge } from "@/components/ui/badge";

import { getCategoryColor } from "@/lib/utils/tasks/get-category-color";

import { useOnboardingStore } from "@/stores/onboarding-store";

export default function SummaryStep() {
	const { selectedTasks, selectedCategories } = useOnboardingStore();
	const getTaskCategoryColor = (category: string) => {
		const colorMap: Record<string, string> = {
			Health: "bg-blue-500",
			Home: "bg-green-500",
			Personal: "bg-purple-500",
			Auto: "bg-orange-500",
			Tech: "bg-indigo-500",
			Finance: "bg-emerald-500",
		};
		return colorMap[category] || "bg-gray-500";
	};

	return (
		<div className="space-y-8">
			{/* Success Message */}
			<div className="text-center space-y-6">
				<div className="flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl scale-150" />
						<div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-lg border">
							<svg
								className="w-12 h-12 text-green-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Success</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<h2 className="text-3xl font-bold text-foreground">
						You're All Set! <span className="text-2xl">🎉</span>
					</h2>
					<p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
						Remi is now ready to help you remember your important tasks. Here's
						what you've set up.
					</p>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid md:grid-cols-2 gap-8">
				{/* Tasks Added */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<svg
							className="w-5 h-5 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Tasks Added</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
						<h3 className="md:text-lg font-semibold text-foreground">
							Tasks Added ({selectedTasks.length})
						</h3>
					</div>

					{selectedTasks.length > 0 ? (
						<div className="space-y-3">
							{selectedTasks.map((task) => (
								<div
									key={task.id}
									className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
								>
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-medium text-gray-900 dark:text-gray-100">
											{task.title}
										</h4>
										<Badge
											variant="secondary"
											className={`text-white text-xs ${getTaskCategoryColor(task.category)}`}
										>
											{task.category}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{task.frequency}
									</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">
							No tasks added yet. You can add tasks later from your dashboard.
						</p>
					)}
				</div>

				{/* Categories Selected */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<svg
							className="w-5 h-5 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Categories Selected</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11H5m14-7H3a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"
							/>
						</svg>
						<h3 className="md:text-lg font-semibold text-foreground">
							Categories Selected ({selectedCategories.length})
						</h3>
					</div>

					{selectedCategories.length > 0 ? (
						<div className="flex flex-wrap gap-2">
							{selectedCategories.map((category) => (
								<div
									key={category.id}
									className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border"
								>
									<div
										className={`w-4 h-4 rounded-full ${getCategoryColor(category.color).split(" ")[0]}`}
									/>
									<span className="font-medium text-sm text-foreground">
										{category.name}
									</span>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground text-sm">
							No categories selected. You can add categories later from
							settings.
						</p>
					)}
				</div>
			</div>

			{/* What Happens Next */}
			<div className="space-y-6">
				<h3 className="text-xl font-semibold text-center text-foreground">
					What Happens Next?
				</h3>

				<div className="grid md:grid-cols-3 gap-6">
					<div className="text-center space-y-3">
						<div className="flex justify-center">
							<div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
								<svg
									className="w-8 h-8 text-blue-600 dark:text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Weekly Emails</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
						</div>
						<h4 className="font-semibold text-foreground">Weekly Emails</h4>
						<p className="text-sm text-muted-foreground">
							Every Monday, you'll get a friendly email with task suggestions
							for the week
						</p>
					</div>

					<div className="text-center space-y-3">
						<div className="flex justify-center">
							<div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full">
								<svg
									className="w-8 h-8 text-purple-600 dark:text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>AI Learning</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
						</div>
						<h4 className="font-semibold text-foreground">AI Learning</h4>
						<p className="text-sm text-muted-foreground">
							As you complete tasks, Remi learns your patterns and improves its
							suggestions
						</p>
					</div>

					<div className="text-center space-y-3">
						<div className="flex justify-center">
							<div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
								<svg
									className="w-8 h-8 text-green-600 dark:text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Track Progress</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
									/>
								</svg>
							</div>
						</div>
						<h4 className="font-semibold text-foreground">Track Progress</h4>
						<p className="text-sm text-muted-foreground">
							View your completion history and see your habits improve over time
						</p>
					</div>
				</div>
			</div>

			{/* Ready to Start */}
			<div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
				<div className="text-center space-y-4">
					<h4 className="md:text-lg font-semibold text-foreground">
						Ready to start remembering better?
					</h4>
					<p className="text-muted-foreground">
						Your dashboard is ready with your tasks. Remi's AI is now analyzing
						your tasks to create personalized weekly suggestions. You can always
						add more tasks, adjust categories, or modify your notification
						preferences in settings.
					</p>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>• Week range: Aug 11 - Aug 17, 2025</p>
						<p>
							• Categories:{" "}
							{selectedCategories.map((cat) => cat.name).join(", ") ||
								"None selected"}
						</p>
						<p>• Next email: Monday, Aug 18</p>
					</div>
				</div>
			</div>
		</div>
	);
}

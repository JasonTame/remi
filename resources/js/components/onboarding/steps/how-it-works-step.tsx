export default function HowItWorksStep() {
	return (
		<div className="space-y-8">
			<div className="text-center mb-12">
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Four simple steps to never forget important tasks again
				</p>
			</div>

			<div className="space-y-8">
				{/* Step 1 */}
				<div className="flex items-start gap-6 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Add Tasks</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-sm font-medium text-blue-600 dark:text-blue-400">
								Step 1
							</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							Add Your Tasks
						</h3>
						<p className="text-muted-foreground">
							Describe tasks in natural language like 'dental checkup every 6
							months' or 'call mom weekly'
						</p>
					</div>
				</div>

				{/* Step 2 */}
				<div className="flex items-start gap-6 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
							<svg
								className="w-6 h-6"
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
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-sm font-medium text-purple-600 dark:text-purple-400">
								Step 2
							</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							AI Learns Patterns
						</h3>
						<p className="text-muted-foreground">
							Remi's AI understands your timing and learns from your completion
							patterns
						</p>
					</div>
				</div>

				{/* Step 3 */}
				<div className="flex items-start gap-6 p-6 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Weekly Suggestions</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-sm font-medium text-orange-600 dark:text-orange-400">
								Step 3
							</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							Get Weekly Suggestions
						</h3>
						<p className="text-muted-foreground">
							Receive friendly emails with tasks you might want to tackle – no
							pressure!
						</p>
					</div>
				</div>

				{/* Step 4 */}
				<div className="flex items-start gap-6 p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Complete & Track</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-sm font-medium text-green-600 dark:text-green-400">
								Step 4
							</span>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							Complete & Track
						</h3>
						<p className="text-muted-foreground">
							Mark tasks complete when you do them. Remi adjusts future
							suggestions accordingly
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

import { AppLogo } from "@/components/app/logo";

export default function IntroStep() {
	return (
		<div className="text-center space-y-8">
			{/* Logo and Welcome */}
			<div className="space-y-6">
				<div className="flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150" />
						<div className="relative bg-white dark:bg-gray-800 rounded-full p-8 shadow-lg">
							<AppLogo className="h-20 w-20 text-primary" />
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-4xl font-bold">
						Welcome to
						<br />
						<span className="text-primary font-comfortaa">Remi</span>
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Flexible Reminders for Real Life
					</p>
				</div>
			</div>

			{/* Description */}
			<div className="max-w-3xl mx-auto space-y-6">
				<p className="text-lg text-muted-foreground leading-relaxed">
					Remi helps you remember life's important but irregular tasks – things
					like dental checkups, car maintenance, and catching up with friends.
					Unlike rigid schedulers, Remi understands natural language and
					provides gentle weekly suggestions.
				</p>

				{/* Feature highlights */}
				<div className="grid md:grid-cols-3 gap-8 mt-12">
					<div className="space-y-3">
						<div className="flex justify-center">
							<div className="bg-pink-100 dark:bg-pink-900/20 p-3 rounded-full">
								<svg
									className="w-6 h-6 text-pink-600 dark:text-pink-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>AI-Powered</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
						</div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100">
							AI-Powered
						</h3>
						<p className="text-sm text-muted-foreground">
							Understands "every 6 months" naturally
						</p>
					</div>

					<div className="space-y-3">
						<div className="flex justify-center">
							<div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
								<svg
									className="w-6 h-6 text-orange-600 dark:text-orange-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Weekly Digest</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						</div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100">
							Weekly Digest
						</h3>
						<p className="text-sm text-muted-foreground">
							Gentle suggestions, not rigid deadlines
						</p>
					</div>

					<div className="space-y-3">
						<div className="flex justify-center">
							<div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
								<svg
									className="w-6 h-6 text-green-600 dark:text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Flexible Timing</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
						</div>
						<h3 className="font-semibold text-gray-900 dark:text-gray-100">
							Flexible Timing
						</h3>
						<p className="text-sm text-muted-foreground">
							Perfect for irregular tasks
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

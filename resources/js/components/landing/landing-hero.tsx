import { Link } from "@inertiajs/react";
import { ArrowRight, Brain, Calendar, Clock } from "lucide-react";

import { AppLogo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";

export function LandingHero() {
	return (
		<section className="relative py-20 overflow-hidden">
			<div className="absolute inset-0 z-10">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full blur-3xl"></div>

				<div className="absolute top-40 -left-20 w-60 h-60 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-2xl"></div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
				<div className="mx-auto max-w-4xl text-center">
					<div className="mb-8 flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-primary/20 rounded-full blur-2xl"></div>
							<div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full p-6 border border-white/20">
								<AppLogo className="h-24 w-24 text-primary" />
							</div>
						</div>
					</div>

					<h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-6">
						<span className="block">Flexible Reminders</span>
						<span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							for Real Life
						</span>
					</h1>

					<p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground mb-10">
						Never forget life's important but irregular tasks again. Remi uses
						AI to understand your natural language and provides gentle weekly
						reminders for things like dental checkups, car maintenance, and
						catching up with friends.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
						<Button
							asChild
							size="lg"
							className="text-lg px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
						>
							<Link href="/register">
								{" "}
								Get Started
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Link href="/login">
							<Button
								variant="outline"
								size="lg"
								className="text-lg px-8 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 hover:bg-white/70 dark:hover:bg-gray-900/70 hover:text-primary"
							>
								I already have an account
							</Button>
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
						<div className="relative shadow-lg">
							<div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 rounded-2xl blur-xl"></div>
							<div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col items-center text-center h-full">
								<div className="mb-4 p-3 bg-gradient-to-br from-primary to-primary/80 rounded-full">
									<Brain className="h-6 w-6 text-white" />
								</div>
								<h3 className="font-semibold mb-2">AI-Powered</h3>
								<p className="text-sm text-muted-foreground">
									Understands "every 6 months" or "about once a quarter"
								</p>
							</div>
						</div>
						<div className="relative shadow-lg">
							<div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-secondary/5 rounded-2xl blur-xl"></div>
							<div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col items-center text-center h-full">
								<div className="mb-4 p-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-full">
									<Calendar className="h-6 w-6 text-white" />
								</div>
								<h3 className="font-semibold mb-2">Weekly Digest</h3>
								<p className="text-sm text-muted-foreground">
									Get gentle suggestions, not rigid deadlines
								</p>
							</div>
						</div>
						<div className="relative shadow-lg">
							<div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-accent/5 rounded-2xl blur-xl"></div>
							<div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col items-center text-center h-full">
								<div className="mb-4 p-3 bg-gradient-to-br from-accent to-accent/80 rounded-full">
									<Clock className="h-6 w-6 text-white" />
								</div>
								<h3 className="font-semibold mb-2">Flexible Timing</h3>
								<p className="text-sm text-muted-foreground">
									Perfect for irregular but important tasks
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

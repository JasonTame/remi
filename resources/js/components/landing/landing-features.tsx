import {
	BarChart3,
	Bell,
	MessageSquare,
	Shield,
	Smartphone,
	Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandingFeatures() {
	const features = [
		{
			id: 1,
			icon: MessageSquare,
			title: "Natural Language",
			description:
				"Just say 'every 6 months' or 'about once a quarter' - Remi understands how you naturally think about time.",
			gradient: "from-blue-500 to-blue-600",
			bgGradient: "from-blue-500/10 to-blue-600/5",
		},
		{
			id: 2,
			icon: Bell,
			title: "Gentle Reminders",
			description:
				"Get weekly suggestions instead of nagging notifications. Remi suggests, you decide when to act.",
			gradient: "from-secondary to-secondary/80",
			bgGradient: "from-secondary/10 to-secondary/5",
		},
		{
			id: 3,
			icon: BarChart3,
			title: "Track Your Patterns",
			description:
				"See your completion history and understand your habits with beautiful, insightful charts.",
			gradient: "from-accent to-accent/80",
			bgGradient: "from-accent/10 to-accent/5",
		},
		{
			id: 4,
			icon: Smartphone,
			title: "Mobile Friendly",
			description:
				"Access your tasks anywhere with a responsive design that works perfectly on all your devices.",
			gradient: "from-purple-500 to-purple-600",
			bgGradient: "from-purple-500/10 to-purple-600/5",
		},
		{
			id: 5,
			icon: Shield,
			title: "Privacy First",
			description:
				"Your data stays yours. We use privacy-focused design and never sell your information.",
			gradient: "from-primary to-primary/80",
			bgGradient: "from-primary/10 to-primary/5",
		},
		{
			id: 6,
			icon: Zap,
			title: "Quick Capture",
			description:
				"Add new tasks in seconds. No complex setup or rigid categories - just natural, simple task creation.",
			gradient: "from-yellow-500 to-orange-500",
			bgGradient: "from-yellow-500/10 to-orange-500/5",
		},
	];

	return (
		<section
			id="features"
			className="py-20 bg-linear-to-br from-neutral-50/50 to-neutral-100/50 dark:from-gray-950/50 dark:to-gray-900/50 relative overflow-hidden"
		>
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-20 right-10 w-72 h-72 bg-linear-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-tr from-primary/15 to-secondary/10 rounded-full blur-3xl"></div>

				<svg
					className="absolute top-1/3 right-1/4 w-40 h-40 text-primary/5"
					viewBox="0 0 200 200"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Features</title>
					<path
						fill="currentColor"
						d="M41.5,-71.8C54.4,-64.7,65.8,-54.1,73.2,-41.1C80.6,-28.1,84,-12.7,83.8,2.9C83.6,18.5,79.8,34.3,72.4,47.6C65,60.9,54,71.7,41.1,78.2C28.2,84.7,13.4,86.9,-1.8,89.7C-17,92.5,-34,95.9,-47.2,89.4C-60.4,82.9,-69.8,66.5,-75.6,49.2C-81.4,31.9,-83.6,13.7,-82.2,-3.8C-80.8,-21.3,-75.8,-38.1,-67.2,-51.4C-58.6,-64.7,-46.4,-74.5,-33.1,-81.6C-19.8,-88.7,-5.4,-93.1,7.8,-104.2C21,-115.3,28.6,-78.9,41.5,-71.8Z"
						transform="translate(100 100)"
					/>
				</svg>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
						Everything you need to{" "}
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							remember better
						</span>
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Remi is designed around how you naturally think about recurring
						tasks, not rigid scheduling systems.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature) => (
						<div key={feature.id} className="relative group">
							<div
								className={`absolute inset-0 bg-linear-to-br ${feature.bgGradient} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300`}
							></div>
							<Card className="relative h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 group-hover:scale-105">
								<CardHeader>
									<div
										className={`mb-4 p-3 bg-linear-to-br ${feature.gradient} rounded-full w-fit shadow-lg`}
									>
										<feature.icon className="h-6 w-6 text-white" />
									</div>
									<CardTitle className="text-xl">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{feature.description}</p>
								</CardContent>
							</Card>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

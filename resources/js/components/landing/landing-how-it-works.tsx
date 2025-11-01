import { Brain, Check, Mail, PlusCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function LandingHowItWorks() {
	const steps = [
		{
			id: 1,
			icon: PlusCircle,
			title: "Add Your Tasks",
			description:
				"Simply describe your recurring tasks in natural language. 'Dental checkup every 6 months' or 'Call mom weekly' - Remi gets it.",
			color: "bg-linear-to-br from-blue-500 to-blue-600",
			bgGradient: "from-blue-500/15 to-blue-600/10",
		},
		{
			id: 2,
			icon: Brain,
			title: "AI Learns Your Patterns",
			description:
				"Remi's AI understands your timing preferences and learns from your completion patterns to make better suggestions.",
			color: "bg-linear-to-br from-purple-500 to-purple-600",
			bgGradient: "from-purple-500/15 to-purple-600/10",
		},
		{
			id: 3,
			icon: Mail,
			title: "Get Weekly Suggestions",
			description:
				"Every week, receive a friendly email with tasks Remi thinks you might want to tackle. No pressure, just gentle reminders.",
			color: "bg-linear-to-br from-secondary to-secondary/80",
			bgGradient: "from-secondary/15 to-secondary/10",
		},
		{
			id: 4,
			icon: Check,
			title: "Complete & Track",
			description:
				"Mark tasks complete when you do them. Remi tracks your patterns and adjusts future suggestions accordingly.",
			color: "bg-linear-to-br from-accent to-accent/80",
			bgGradient: "from-accent/15 to-accent/10",
		},
	];

	return (
		<section id="how-it-works" className="py-20 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-accent/10 to-secondary/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-primary/10 to-accent/5 rounded-full blur-3xl"></div>

				{/* Flowing curves */}
				<svg
					className="absolute top-0 left-0 w-full h-full"
					viewBox="0 0 1200 800"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Flowing curves</title>
					<defs>
						<linearGradient id="curve1" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop
								offset="0%"
								stopColor="rgb(96, 125, 139)"
								stopOpacity="0.05"
							/>
							<stop
								offset="100%"
								stopColor="rgb(226, 125, 96)"
								stopOpacity="0.02"
							/>
						</linearGradient>
					</defs>
					<path
						d="M0,400 Q300,200 600,300 T1200,250 L1200,0 L0,0 Z"
						fill="url(#curve1)"
					/>
				</svg>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
						How{" "}
						<span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
							Remi works
						</span>
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Four simple steps to never forget important tasks again
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{steps.map((step, index) => (
						<div key={step.id} className="relative group">
							<div
								className={`absolute inset-0 bg-linear-to-br ${step.bgGradient} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300`}
							></div>

							<Card className="z-20 relative shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 group-hover:scale-105">
								<CardContent className="p-6 text-center">
									<div className="mb-6 flex justify-center">
										<div className={`p-4 ${step.color} rounded-full shadow-lg`}>
											<step.icon className="h-8 w-8 text-white" />
										</div>
									</div>
									<div className="mb-4 text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
										Step {index + 1}
									</div>
									<h3 className="text-xl font-semibold mb-3">{step.title}</h3>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{step.description}
									</p>
								</CardContent>
							</Card>

							{index < steps.length - 1 && (
								<div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-secondary/20 transform -translate-y-1/2"></div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

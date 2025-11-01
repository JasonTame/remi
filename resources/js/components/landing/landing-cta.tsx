import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

import { AppLogo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
	return (
		<section className="py-20 relative overflow-hidden">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary via-primary/90 to-secondary px-8 py-16 sm:px-16">
					<div className="absolute inset-0">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-2xl"></div>
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

						<svg
							className="absolute top-4 right-8 w-32 h-32 text-white/5"
							viewBox="0 0 200 200"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Remi Logo</title>
							<path
								fill="currentColor"
								d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.8,-0.2C89.6,15.9,86.6,31.8,78.9,45.2C71.2,58.6,58.8,69.5,44.7,76.4C30.6,83.3,15.3,86.2,-0.1,86.3C-15.5,86.4,-31,83.7,-44.8,76.8C-58.6,69.9,-70.7,58.8,-78.5,45.4C-86.3,32,-89.8,16.3,-89.6,0.7C-89.4,-14.9,-85.5,-29.8,-77.8,-43.2C-70.1,-56.6,-58.6,-68.5,-44.8,-75.7C-31,-82.9,-15.5,-85.4,-0.1,-85.2C15.3,-85,30.6,-82.1,44.7,-76.4Z"
								transform="translate(100 100)"
							/>
						</svg>

						<svg
							id="eiMnLj69ETB1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 200 200"
							shapeRendering="geometricPrecision"
							textRendering="geometricPrecision"
							className="absolute bottom-8 left-12 w-24 h-24 text-white/10"
						>
							<title>Remi Logo</title>
							<path
								fill="currentColor"
								d="M37.1,-63.2c11.7,7,22.3,16.8,28.7,29.1s8.6,27.1,8,41.6-4,28.7-11.7,40.3-19.7,20.6-33,25-27.9,4.2-42.2,2.1-28.3-6.1-39.7-13.7-20.2-18.8-24.8-31.4-5-26.6-2.2-39.6s8.8-25,17.4-34.4s18.601614-15.679066,31.6-23s17.143612-7.320934,30.8-7.320934s25.4,4.320934,37.1,11.320934Z"
								transform="translate(100 100)"
							/>
						</svg>
					</div>

					<div className="relative mx-auto max-w-2xl text-center">
						<div className="mb-6 flex justify-center">
							<div className="relative">
								<div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
								<div className="relative bg-white/90 backdrop-blur-sm rounded-full p-4 border border-white/20">
									<AppLogo className="h-16 w-16 text-white" />
								</div>
							</div>
						</div>
						<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
							Ready to remember better?
						</h2>
						<p className="text-lg leading-8 text-white/90 mb-8">
							Start your free account today and let Remi help you stay on top of
							life's irregular but important commitments.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/register">
								<Button
									size="lg"
									variant="secondary"
									className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90 shadow-lg"
								>
									Get started for free
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
							<Link href="/login">
								<Button
									size="lg"
									variant="outline"
									className="text-lg px-8 py-3 border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
								>
									Sign in
								</Button>
							</Link>
						</div>
						<p className="mt-6 text-sm text-white/70">
							No credit card required • Free forever • Cancel anytime
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

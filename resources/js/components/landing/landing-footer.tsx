import { Link } from "@inertiajs/react";

import { AppLogo } from "@/components/app/logo";

export function LandingFooter() {
	return (
		<footer className="bg-white dark:bg-gray-900 border-t">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<AppLogo className="h-8 w-8 text-primary" />
							<span className="app-title text-xl font-bold text-primary">
								Remi
							</span>
						</Link>
						<p className="text-muted-foreground mb-4 max-w-md">
							Flexible reminders for real life. Never forget important but
							irregular tasks again with AI-powered suggestions that understand
							how you naturally think about time.
						</p>
						<p className="text-sm text-muted-foreground">
							© 2025 Remi. All rights reserved.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="#features"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Features
								</Link>
							</li>
							<li>
								<Link
									href="#how-it-works"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									How it works
								</Link>
							</li>
							<li>
								<Link
									href="/register"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Get started
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Support</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/help"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="text-muted-foreground hover:text-primary transition-colors"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}

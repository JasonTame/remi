import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900">
			<Head title="Privacy Policy" />

			{/* Header */}
			<div className="bg-white dark:bg-gray-900 border-b">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Link
							href="/"
							className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Remi
						</Link>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="max-w-4xl mx-auto">
					<article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-8 md:p-12">
						<h1 className="text-3xl font-bold mb-2">Privacy Policy for Remi</h1>
						<p className="text-muted-foreground mb-8">
							<strong>Last updated:</strong> August 2025
						</p>

						<div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
							<section>
								<h2 className="text-xl font-semibold mb-4">Overview</h2>
								<p>
									Remi is a personal reminder app that helps you remember
									important tasks using AI-powered natural language processing.
									This privacy policy explains how we collect, use, and protect
									your information.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Information We Collect
								</h2>

								<h3 className="text-lg font-medium mb-3">
									Information You Provide
								</h3>
								<ul className="list-disc pl-6 space-y-2 mb-6">
									<li>
										<strong>Email Address</strong>: Required for account
										creation and authentication
									</li>
									<li>
										<strong>Task Information</strong>: The reminders and tasks
										you create in the app
									</li>
									<li>
										<strong>Account Preferences</strong>: Your settings and
										preferences within the app
									</li>
								</ul>

								<h3 className="text-lg font-medium mb-3">
									Information We Collect Automatically
								</h3>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>Usage Analytics</strong>: We use PostHog to collect
										anonymous usage data to improve the app, including:
										<ul className="list-disc pl-6 mt-2 space-y-1">
											<li>How you interact with app features</li>
											<li>Performance metrics</li>
											<li>General usage patterns</li>
										</ul>
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									How We Use Your Information
								</h2>
								<p className="mb-4">We use your information to:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Provide and maintain the Remi service</li>
									<li>Authenticate your account and keep it secure</li>
									<li>Send you reminders and notifications</li>
									<li>Improve our app's functionality and user experience</li>
									<li>Analyze usage patterns to enhance our services</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Information Sharing
								</h2>
								<p className="mb-4">
									We do not sell, trade, or share your personal information with
									third parties, except:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>PostHog</strong>: For analytics purposes (anonymized
										usage data only)
									</li>
									<li>
										<strong>Service Providers</strong>: Essential services that
										help us operate the app
									</li>
									<li>
										<strong>Legal Requirements</strong>: If required by law or
										to protect our rights
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Data Security</h2>
								<p>
									We implement appropriate security measures to protect your
									personal information against unauthorized access, alteration,
									disclosure, or destruction. However, no internet transmission
									is 100% secure.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Your Rights</h2>
								<p className="mb-4">You have the right to:</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Access your personal data</li>
									<li>Correct inaccurate information</li>
									<li>Delete your account and associated data</li>
									<li>Opt out of certain communications</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Data Retention</h2>
								<p>
									We retain your information only as long as necessary to
									provide our services or as required by law. You can delete
									your account at any time.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Contact Us</h2>
								<p>
									If you have questions about this privacy policy or your data,
									please contact us at: support@remi.app
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Changes to This Policy
								</h2>
								<p>
									We may update this privacy policy from time to time. We will
									notify users of any material changes by updating the "Last
									updated" date.
								</p>
							</section>

							<hr className="my-8 border-gray-200 dark:border-gray-700" />

							<p className="text-sm text-muted-foreground italic">
								This policy applies to the Remi web application and any related
								services.
							</p>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}

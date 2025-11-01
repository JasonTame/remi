import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
	return (
		<div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900">
			<Head title="Terms of Service" />

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
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-foreground">
				<div className="max-w-4xl mx-auto">
					<article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-8 md:p-12">
						<h1 className="text-3xl font-bold mb-2">
							Terms of Service for Remi
						</h1>
						<p className="text-muted-foreground mb-8">
							<strong>Last updated:</strong> August 2025
						</p>

						<div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
							<section>
								<h2 className="text-xl font-semibold mb-4">
									Acceptance of Terms
								</h2>
								<p>
									By accessing and using Remi, you accept and agree to be bound
									by these Terms of Service. If you do not agree to these terms,
									please do not use the service.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Description of Service
								</h2>
								<p>
									Remi is a web application that helps users manage reminders
									and tasks using AI-powered natural language processing. The
									service is currently provided free of charge.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">User Accounts</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										You must provide a valid email address to create an account
									</li>
									<li>
										You are responsible for maintaining the security of your
										account
									</li>
									<li>
										You must not share your account credentials with others
									</li>
									<li>
										You must notify us immediately of any unauthorized use of
										your account
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Acceptable Use</h2>
								<p className="mb-4">
									You agree to use Remi only for lawful purposes and in
									accordance with these terms. You will not:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Use the service for any illegal or unauthorized purpose
									</li>
									<li>Attempt to gain unauthorized access to our systems</li>
									<li>
										Upload or share content that is harmful, offensive, or
										violates others' rights
									</li>
									<li>Interfere with or disrupt the service or servers</li>
									<li>
										Use automated tools to access the service without permission
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Content and Data</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										You retain ownership of the content you create (your tasks
										and reminders)
									</li>
									<li>
										You grant us the right to process and store your content to
										provide the service
									</li>
									<li>
										We may delete inactive accounts or content that violates
										these terms
									</li>
									<li>You are responsible for backing up any important data</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Service Availability
								</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										We strive to keep Remi available, but cannot guarantee 100%
										uptime
									</li>
									<li>
										We may temporarily suspend the service for maintenance or
										updates
									</li>
									<li>
										We reserve the right to modify or discontinue features with
										reasonable notice
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Intellectual Property
								</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Remi and its features are owned by us and protected by
										intellectual property laws
									</li>
									<li>
										You may not copy, modify, or create derivative works of our
										service
									</li>
									<li>
										Any feedback you provide about Remi may be used by us
										without compensation
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Disclaimers</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										Remi is provided "as is" without warranties of any kind
									</li>
									<li>
										We do not guarantee the accuracy or reliability of reminders
									</li>
									<li>You use the service at your own risk</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Limitation of Liability
								</h2>
								<p>
									To the maximum extent permitted by law, we shall not be liable
									for any indirect, incidental, or consequential damages arising
									from your use of Remi.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Termination</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>You may delete your account at any time</li>
									<li>We may terminate accounts that violate these terms</li>
									<li>
										Upon termination, your access to the service will cease
									</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
								<p>
									We may update these terms from time to time. Continued use of
									the service after changes constitutes acceptance of the new
									terms.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-4">
									Contact Information
								</h2>
								<p>
									If you have questions about these terms, please contact us at:
									support@remi.app
								</p>
							</section>

							<hr className="my-8 border-gray-200 dark:border-gray-700" />

							<p className="text-sm text-muted-foreground italic">
								By using Remi, you acknowledge that you have read and understood
								these Terms of Service.
							</p>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}

import { Link, router } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

import { AppLogo } from "@/components/app/logo";
import { ModeToggle } from "@/components/app/mode-toggle";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
	currentStep: number;
	totalSteps: number;
	title: string;
	onNext?: () => void;
	onPrevious?: () => void;
	nextLabel?: string;
	previousLabel?: string;
	showPrevious?: boolean;
	showNext?: boolean;
	isLoading?: boolean;
}

export default function OnboardingLayout({
	children,
	currentStep,
	totalSteps,
	title,
	onNext,
	onPrevious,
	nextLabel = "Next",
	previousLabel = "Previous",
	showPrevious = true,
	showNext = true,
	isLoading = false,
}: PropsWithChildren<OnboardingLayoutProps>) {
	const progressPercentage = (currentStep / totalSteps) * 100;

	const handleSkipOnboarding = () => {
		router.post(
			"/onboarding/complete",
			{},
			{
				onSuccess: () => {
					router.visit("/dashboard");
				},
			},
		);
	};

	return (
		<div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900 flex flex-col pb-2">
			{/* Header */}
			<div className="flex items-center justify-between p-6">
				<Link href="/" className="flex items-center gap-3">
					<AppLogo className="h-8 w-8 text-primary" />
					<span className="app-title text-xl font-bold text-primary font-comfortaa">
						Remi
					</span>
				</Link>
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleSkipOnboarding}
						className="text-muted-foreground hover:text-foreground"
					>
						Skip onboarding
					</Button>
					<span className="text-sm text-muted-foreground">
						Step {currentStep} of {totalSteps}
					</span>
					<ModeToggle />
				</div>
			</div>

			{/* Progress Bar */}
			<div className="px-6 mb-8">
				<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
					<div
						className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 px-6 py-8">
				<div className="w-full max-w-4xl mx-auto">
					<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border p-8 md:p-12 mb-8">
						<div className="text-center mb-4">
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
								{title}
							</h1>
						</div>

						{children}

						{/* Navigation */}
						<div className="flex items-center justify-between mt-12 pt-8 border-t">
							<div>
								{showPrevious && currentStep > 1 && (
									<Button
										variant="outline"
										onClick={onPrevious}
										className="flex items-center gap-2"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Previous</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 19l-7-7 7-7"
											/>
										</svg>
										{previousLabel}
									</Button>
								)}
							</div>
							<div>
								{showNext && (
									<Button
										onClick={onNext}
										className="flex items-center gap-2"
										disabled={isLoading}
									>
										{isLoading ? "Loading..." : nextLabel}
										{!isLoading && currentStep < totalSteps && (
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<title>Next</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										)}
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

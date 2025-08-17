import OnboardingLayout from "@/components/onboarding/onboarding-layout";
import CategoriesStep from "@/components/onboarding/steps/categories-step";
import HowItWorksStep from "@/components/onboarding/steps/how-it-works-step";
import IntroStep from "@/components/onboarding/steps/intro-step";
import SummaryStep from "@/components/onboarding/steps/summary-step";
import TasksStep from "@/components/onboarding/steps/tasks-step";

import {
	STEP_TITLES,
	TOTAL_STEPS,
	useOnboardingStore,
} from "@/stores/onboarding-store";

export default function Onboarding() {
	const { currentStep, isLoading, handleNext, handlePrevious, getNextLabel } =
		useOnboardingStore();

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return <IntroStep />;
			case 2:
				return <HowItWorksStep />;
			case 3:
				return <CategoriesStep />;
			case 4:
				return <TasksStep />;
			case 5:
				return <SummaryStep />;
			default:
				return <IntroStep />;
		}
	};

	return (
		<OnboardingLayout
			currentStep={currentStep}
			totalSteps={TOTAL_STEPS}
			title={STEP_TITLES[currentStep as keyof typeof STEP_TITLES]}
			onNext={handleNext}
			onPrevious={handlePrevious}
			nextLabel={getNextLabel()}
			showPrevious={currentStep > 1}
			showNext={true}
			isLoading={isLoading}
		>
			{renderCurrentStep()}
		</OnboardingLayout>
	);
}

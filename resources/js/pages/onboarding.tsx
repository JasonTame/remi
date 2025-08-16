import { router } from "@inertiajs/react";
import { useState } from "react";

import OnboardingLayout from "@/components/onboarding/onboarding-layout";
import CategoriesStep from "@/components/onboarding/steps/categories-step";
import HowItWorksStep from "@/components/onboarding/steps/how-it-works-step";
import IntroStep from "@/components/onboarding/steps/intro-step";
import SummaryStep from "@/components/onboarding/steps/summary-step";
import TasksStep from "@/components/onboarding/steps/tasks-step";

const TOTAL_STEPS = 5;

const STEP_TITLES = {
	1: "Welcome to Remi",
	2: "How Remi Works",
	3: "Choose Your Categories",
	4: "Create Your First Tasks",
	5: "You're All Set!",
};

interface Category {
	id: string;
	name: string;
	color: string;
	icon: string;
}

interface Task {
	id: string;
	title: string;
	frequency: string;
	category: string;
}

export default function Onboarding() {
	const [currentStep, setCurrentStep] = useState(1);
	const [selectedCategories] = useState<Category[]>([]);
	const [selectedTasks] = useState<Task[]>([]);

	const handleNext = () => {
		if (currentStep < TOTAL_STEPS) {
			setCurrentStep(currentStep + 1);
		} else {
			// Complete onboarding and redirect to dashboard
			router.visit("/dashboard");
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const getNextLabel = () => {
		switch (currentStep) {
			case 1:
				return "Let's get started";
			case 5:
				return "Go to Dashboard";
			default:
				return "Next";
		}
	};

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
				return (
					<SummaryStep
						selectedTasks={selectedTasks}
						selectedCategories={selectedCategories}
					/>
				);
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
		>
			{renderCurrentStep()}
		</OnboardingLayout>
	);
}

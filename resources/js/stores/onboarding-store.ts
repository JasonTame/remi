import { router } from "@inertiajs/react";
import { create } from "zustand";

// Types
export interface Category {
	id: string;
	name: string;
	description?: string;
	color: string;
	icon?: string;
}

export interface Task {
	id: string;
	title: string;
	frequency: string;
	category: string;
	description?: string;
}

export interface CustomTask extends Task {}

export interface CustomCategory extends Category {}

// Step configuration
export const TOTAL_STEPS = 5;
export const STEP_TITLES = {
	1: "Welcome to Remi",
	2: "How Remi Works",
	3: "Choose Your Categories",
	4: "Create Your First Tasks",
	5: "You're All Set!",
} as const;

// Suggested data
export const SUGGESTED_CATEGORIES: Category[] = [
	{
		id: "health",
		name: "Medical & Health",
		description: "Medical appointments, checkups, wellness",
		color: "blue",
		icon: "",
	},
	{
		id: "home",
		name: "Home Maintenance",
		description: "Maintenance, cleaning, repairs",
		color: "green",
		icon: "",
	},
	{
		id: "personal",
		name: "Personal & Social",
		description: "Relationships, self-care, hobbies",
		color: "purple",
		icon: "",
	},
	{
		id: "auto",
		name: "Auto",
		description: "Car maintenance, registration, insurance",
		color: "orange",
		icon: "",
	},
	{
		id: "documents",
		name: "Documents",
		description: "Renewals, filing, paperwork",
		color: "gray",
		icon: "",
	},
	{
		id: "tech",
		name: "Tech",
		description: "Backups, updates, digital maintenance",
		color: "indigo",
		icon: "",
	},
	{
		id: "finance",
		name: "Administrative & Financial",
		description: "Bills, investments, budgeting",
		color: "red",
		icon: "",
	},
];

export const SUGGESTED_TASKS: Task[] = [
	{
		id: "dental-checkup",
		title: "Schedule dental checkup",
		frequency: "Every 6 months",
		category: "Medical & Health",
		description:
			"Regular dental cleanings and checkups to maintain oral health, prevent cavities, and catch dental issues early. Most dentists recommend visits every 6 months.",
	},
	{
		id: "eye-exam",
		title: "Annual eye exam",
		frequency: "Every year",
		category: "Medical & Health",
		description:
			"Comprehensive eye examination to check vision, screen for eye diseases like glaucoma or macular degeneration, and update prescriptions for glasses or contacts.",
	},
	{
		id: "clean-refrigerator",
		title: "Clean refrigerator",
		frequency: "Every 3 months",
		category: "Home Maintenance",
		description:
			"Deep clean refrigerator interior, check expiration dates, wipe down shelves and drawers, and clean coils for optimal efficiency and food safety.",
	},
	{
		id: "deep-clean-kitchen",
		title: "Deep clean kitchen",
		frequency: "Every 3 months",
		category: "Home Maintenance",
		description:
			"Thorough kitchen cleaning including oven, stovetop, cabinets, backsplash, and appliances. Goes beyond daily cleaning to maintain hygiene and appliance longevity.",
	},
	{
		id: "call-parents",
		title: "Call parents",
		frequency: "Weekly",
		category: "Personal & Social",
		description:
			"Regular check-in calls with parents to maintain family relationships, stay connected, and ensure their wellbeing. Frequency can be adjusted based on family dynamics.",
	},
	{
		id: "plan-vacation",
		title: "Plan vacation",
		frequency: "Every 6 months",
		category: "Personal & Social",
		description:
			"Research and plan upcoming vacations or time off to ensure work-life balance, mental health, and quality time with family or friends. Includes booking and itinerary planning.",
	},
	{
		id: "car-maintenance",
		title: "Car maintenance",
		frequency: "Every 6 months",
		category: "Auto",
		description:
			"Regular vehicle maintenance including oil changes, tire rotation, fluid checks, and general inspection to ensure safety, reliability, and extend vehicle lifespan.",
	},
	{
		id: "renew-registration",
		title: "Renew car registration",
		frequency: "Every year",
		category: "Auto",
		description:
			"Annual vehicle registration renewal with DMV/local authorities. Important for legal compliance and avoiding fines. Timing varies by state and registration date.",
	},
	{
		id: "backup-computer",
		title: "Backup computer files",
		frequency: "Monthly",
		category: "Tech",
		description:
			"Regular backup of important files, documents, photos, and data to external drive or cloud storage to prevent data loss from hardware failure or accidents.",
	},
	{
		id: "update-passwords",
		title: "Update passwords",
		frequency: "Every 3 months",
		category: "Tech",
		description:
			"Regular password updates for important accounts, especially financial and work-related. Helps maintain security and reduce risk of unauthorized access.",
	},
	{
		id: "review-budget",
		title: "Review monthly budget",
		frequency: "Monthly",
		category: "Administrative & Financial",
		description:
			"Monthly review of income, expenses, and spending patterns to stay on track with financial goals, identify areas for improvement, and adjust budget as needed.",
	},
	{
		id: "review-investments",
		title: "Review investments",
		frequency: "Quarterly",
		category: "Administrative & Financial",
		description:
			"Quarterly review of investment portfolio performance, rebalancing if needed, and ensuring alignment with long-term financial goals and risk tolerance.",
	},
];

export const COLOR_OPTIONS = [
	{ value: "blue", label: "Blue" },
	{ value: "green", label: "Green" },
	{ value: "red", label: "Red" },
	{ value: "orange", label: "Orange" },
	{ value: "gray", label: "Gray" },
	{ value: "purple", label: "Purple" },
	{ value: "indigo", label: "Indigo" },
];

// Store interface
interface OnboardingState {
	// Navigation
	currentStep: number;
	isLoading: boolean;

	// Categories
	selectedCategories: Category[];
	selectedCategoryIds: string[];
	customCategories: CustomCategory[];
	newCategoryName: string;
	newCategoryColor: string;

	// Tasks
	selectedTasks: Task[];
	selectedTaskIds: string[];
	customTasks: CustomTask[];
	newTaskTitle: string;
	newTaskFrequency: string;
	newTaskCategory: string;
	newTaskDescription: string;

	// Computed getters
	getAllCategories: () => Category[];
	getAllTasks: () => Task[];
	getFilteredSuggestedTasks: () => Task[];
	getNextLabel: () => string;

	// Navigation actions
	setCurrentStep: (step: number) => void;
	setIsLoading: (loading: boolean) => void;
	handleNext: () => void;
	handlePrevious: () => void;

	// Category actions
	toggleCategory: (categoryId: string) => void;
	setNewCategoryName: (name: string) => void;
	setNewCategoryColor: (color: string) => void;
	addCustomCategory: () => void;
	removeCustomCategory: (categoryId: string) => void;

	// Task actions
	toggleTask: (taskId: string) => void;
	setNewTaskTitle: (title: string) => void;
	setNewTaskFrequency: (frequency: string) => void;
	setNewTaskCategory: (category: string) => void;
	setNewTaskDescription: (description: string) => void;
	addCustomTask: () => void;
	removeCustomTask: (taskId: string) => void;

	// API actions
	saveCategories: () => Promise<void>;
	saveTasks: () => Promise<void>;
	generateRecommendations: () => Promise<void>;
	completeOnboarding: () => void;

	// Reset
	reset: () => void;
}

// Store implementation
export const useOnboardingStore = create<OnboardingState>((set, get) => ({
	// Initial state
	currentStep: 1,
	isLoading: false,

	selectedCategories: [],
	selectedCategoryIds: [],
	customCategories: [],
	newCategoryName: "",
	newCategoryColor: "blue",

	selectedTasks: [],
	selectedTaskIds: [],
	customTasks: [],
	newTaskTitle: "",
	newTaskFrequency: "",
	newTaskCategory: "",
	newTaskDescription: "",

	// Computed getters
	getAllCategories: () => {
		const { customCategories } = get();
		return [...SUGGESTED_CATEGORIES, ...customCategories];
	},

	getAllTasks: () => {
		const { customTasks, getAllCategories } = get();
		const availableCategoryNames = getAllCategories().map((cat) => cat.name);
		const filteredSuggestedTasks = SUGGESTED_TASKS.filter((task) =>
			availableCategoryNames.includes(task.category),
		);
		return [...filteredSuggestedTasks, ...customTasks];
	},

	getFilteredSuggestedTasks: () => {
		const { selectedCategories } = get();
		const selectedCategoryNames = selectedCategories.map((cat) => cat.name);
		return SUGGESTED_TASKS.filter((task) =>
			selectedCategoryNames.includes(task.category),
		);
	},

	getNextLabel: () => {
		const { currentStep, isLoading } = get();
		switch (currentStep) {
			case 1:
				return "Let's get started";
			case 4:
				return isLoading ? "Generating recommendations..." : "Next";
			case 5:
				return "Get Started";
			default:
				return "Next";
		}
	},

	// Navigation actions
	setCurrentStep: (step) => set({ currentStep: step }),
	setIsLoading: (loading) => set({ isLoading: loading }),

	handleNext: () => {
		const {
			currentStep,
			isLoading,
			selectedCategories,
			selectedTasks,
			saveCategories,
			saveTasks,
			generateRecommendations,
			completeOnboarding,
		} = get();

		if (isLoading) return;

		set({ isLoading: true });

		if (currentStep === 3) {
			// Save categories when moving from categories step
			if (selectedCategories.length > 0) {
				saveCategories()
					.then(() => {
						set({ currentStep: currentStep + 1, isLoading: false });
					})
					.catch((error) => {
						console.error("Error saving categories:", error);
						set({ isLoading: false });
					});
			} else {
				set({ currentStep: currentStep + 1, isLoading: false });
			}
		} else if (currentStep === 4) {
			// Save tasks and generate recommendations
			if (selectedTasks.length > 0) {
				saveTasks()
					.then(() => generateRecommendations())
					.then(() => {
						set({ currentStep: currentStep + 1, isLoading: false });
					})
					.catch((error) => {
						console.error(
							"Error saving tasks or generating recommendations:",
							error,
						);
						// Still move to summary even if recommendations fail
						set({ currentStep: currentStep + 1, isLoading: false });
					});
			} else {
				set({ currentStep: currentStep + 1, isLoading: false });
			}
		} else if (currentStep === 5) {
			// Complete onboarding
			completeOnboarding();
		} else {
			// For other steps, just move to the next step
			if (currentStep < TOTAL_STEPS) {
				set({ currentStep: currentStep + 1, isLoading: false });
			} else {
				set({ isLoading: false });
			}
		}
	},

	handlePrevious: () => {
		const { currentStep } = get();
		if (currentStep > 1) {
			set({ currentStep: currentStep - 1 });
		}
	},

	// Category actions
	toggleCategory: (categoryId) => {
		const { selectedCategoryIds, getAllCategories } = get();
		const newSelectedIds = selectedCategoryIds.includes(categoryId)
			? selectedCategoryIds.filter((id) => id !== categoryId)
			: [...selectedCategoryIds, categoryId];

		const allCategories = getAllCategories();
		const newSelectedCategories = allCategories.filter((cat) =>
			newSelectedIds.includes(cat.id),
		);

		set({
			selectedCategoryIds: newSelectedIds,
			selectedCategories: newSelectedCategories,
		});
	},

	setNewCategoryName: (name) => set({ newCategoryName: name }),
	setNewCategoryColor: (color) => set({ newCategoryColor: color }),

	addCustomCategory: () => {
		const {
			newCategoryName,
			newCategoryColor,
			customCategories,
			selectedCategoryIds,
		} = get();

		if (newCategoryName.trim()) {
			const newCategory: CustomCategory = {
				id: `custom-${Date.now()}`,
				name: newCategoryName.trim(),
				description: "Custom category",
				color: newCategoryColor,
				icon: "",
			};

			const newCustomCategories = [...customCategories, newCategory];
			const newSelectedIds = [...selectedCategoryIds, newCategory.id];

			// Update categories and selections
			set({
				customCategories: newCustomCategories,
				selectedCategoryIds: newSelectedIds,
				newCategoryName: "",
				newCategoryColor: "blue",
			});

			// Update selected categories with the new state
			const allCategories = [...SUGGESTED_CATEGORIES, ...newCustomCategories];
			const newSelectedCategories = allCategories.filter((cat) =>
				newSelectedIds.includes(cat.id),
			);
			set({ selectedCategories: newSelectedCategories });
		}
	},

	removeCustomCategory: (categoryId) => {
		const { customCategories, selectedCategoryIds } = get();

		const newCustomCategories = customCategories.filter(
			(cat) => cat.id !== categoryId,
		);
		const newSelectedIds = selectedCategoryIds.filter(
			(id) => id !== categoryId,
		);

		set({
			customCategories: newCustomCategories,
			selectedCategoryIds: newSelectedIds,
		});

		// Update selected categories
		const allCategories = [...SUGGESTED_CATEGORIES, ...newCustomCategories];
		const newSelectedCategories = allCategories.filter((cat) =>
			newSelectedIds.includes(cat.id),
		);
		set({ selectedCategories: newSelectedCategories });
	},

	// Task actions
	toggleTask: (taskId) => {
		const { selectedTaskIds, getAllTasks } = get();
		const newSelectedIds = selectedTaskIds.includes(taskId)
			? selectedTaskIds.filter((id) => id !== taskId)
			: [...selectedTaskIds, taskId];

		const allTasks = getAllTasks();
		const newSelectedTasks = allTasks.filter((task) =>
			newSelectedIds.includes(task.id),
		);

		set({
			selectedTaskIds: newSelectedIds,
			selectedTasks: newSelectedTasks,
		});
	},

	setNewTaskTitle: (title) => set({ newTaskTitle: title }),
	setNewTaskFrequency: (frequency) => set({ newTaskFrequency: frequency }),
	setNewTaskCategory: (category) => set({ newTaskCategory: category }),
	setNewTaskDescription: (description) =>
		set({ newTaskDescription: description }),

	addCustomTask: () => {
		const {
			newTaskTitle,
			newTaskFrequency,
			newTaskCategory,
			newTaskDescription,
			customTasks,
			selectedTaskIds,
			getAllTasks,
		} = get();

		if (
			newTaskTitle.trim() &&
			newTaskFrequency.trim() &&
			newTaskCategory.trim()
		) {
			const newTask: CustomTask = {
				id: `custom-${Date.now()}`,
				title: newTaskTitle.trim(),
				frequency: newTaskFrequency.trim(),
				category: newTaskCategory,
				description: newTaskDescription.trim() || undefined,
			};

			const newCustomTasks = [...customTasks, newTask];
			const newSelectedIds = [...selectedTaskIds, newTask.id];

			set({
				customTasks: newCustomTasks,
				selectedTaskIds: newSelectedIds,
				newTaskTitle: "",
				newTaskFrequency: "",
				newTaskCategory: "",
				newTaskDescription: "",
			});

			// Update selected tasks
			const allTasks = [...getAllTasks(), newTask];
			const newSelectedTasks = allTasks.filter((task) =>
				newSelectedIds.includes(task.id),
			);
			set({ selectedTasks: newSelectedTasks });
		}
	},

	removeCustomTask: (taskId) => {
		const { customTasks, selectedTaskIds, getFilteredSuggestedTasks } = get();

		const newCustomTasks = customTasks.filter((task) => task.id !== taskId);
		const newSelectedIds = selectedTaskIds.filter((id) => id !== taskId);

		set({
			customTasks: newCustomTasks,
			selectedTaskIds: newSelectedIds,
		});

		// Update selected tasks
		const allTasks = [...getFilteredSuggestedTasks(), ...newCustomTasks];
		const newSelectedTasks = allTasks.filter((task) =>
			newSelectedIds.includes(task.id),
		);
		set({ selectedTasks: newSelectedTasks });
	},

	// API actions
	saveCategories: async () => {
		const { selectedCategories } = get();
		return new Promise<void>((resolve, reject) => {
			router.post(
				"/onboarding/categories",
				{
					categories: selectedCategories.map((cat) => ({
						id: cat.id,
						name: cat.name,
						color: cat.color,
						icon: cat.icon || "",
					})),
				},
				{
					onSuccess: () => resolve(),
					onError: (errors) => reject(errors),
				},
			);
		});
	},

	saveTasks: async () => {
		const { selectedTasks } = get();
		return new Promise<void>((resolve, reject) => {
			router.post(
				"/onboarding/tasks",
				{
					tasks: selectedTasks.map((task) => ({
						id: task.id,
						title: task.title,
						frequency: task.frequency,
						category: task.category,
						description: task.description || "",
					})),
				},
				{
					onSuccess: () => resolve(),
					onError: (errors) => reject(errors),
				},
			);
		});
	},

	generateRecommendations: async () => {
		return new Promise<void>((resolve, reject) => {
			router.post(
				"/onboarding/generate-recommendations",
				{},
				{
					onSuccess: () => resolve(),
					onError: (errors) => reject(errors),
				},
			);
		});
	},

	completeOnboarding: () => {
		router.post(
			"/onboarding/complete",
			{},
			{
				onSuccess: () => {
					router.visit("/dashboard");
				},
				onError: (errors) => {
					console.error("Error completing onboarding:", errors);
					set({ isLoading: false });
				},
			},
		);
	},

	// Reset
	reset: () => {
		set({
			currentStep: 1,
			isLoading: false,
			selectedCategories: [],
			selectedCategoryIds: [],
			customCategories: [],
			newCategoryName: "",
			newCategoryColor: "blue",
			selectedTasks: [],
			selectedTaskIds: [],
			customTasks: [],
			newTaskTitle: "",
			newTaskFrequency: "",
			newTaskCategory: "",
			newTaskDescription: "",
		});
	},
}));

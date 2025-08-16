import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { getCategoryColor } from "@/lib/utils/tasks/get-category-color";

interface Category {
	id: string;
	name: string;
	description: string;
	color: string;
	icon: string;
}

const SUGGESTED_CATEGORIES: Category[] = [
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

const colorOptions = [
	{ value: "blue", label: "Blue" },
	{ value: "green", label: "Green" },
	{ value: "red", label: "Red" },
	{ value: "orange", label: "Orange" },
	{ value: "gray", label: "Gray" },
	{ value: "purple", label: "Purple" },
	{ value: "indigo", label: "Indigo" },
];

export default function CategoriesStep() {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [customCategories, setCustomCategories] = useState<Category[]>([]);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryColor, setNewCategoryColor] = useState("blue");

	const toggleCategory = (categoryId: string) => {
		setSelectedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId],
		);
	};

	const addCustomCategory = () => {
		if (newCategoryName.trim()) {
			const newCategory: Category = {
				id: `custom-${Date.now()}`,
				name: newCategoryName.trim(),
				description: "Custom category",
				color: newCategoryColor,
				icon: "",
			};
			setCustomCategories((prev) => [...prev, newCategory]);
			setSelectedCategories((prev) => [...prev, newCategory.id]);
			setNewCategoryName("");
			setNewCategoryColor("blue");
		}
	};

	const removeCustomCategory = (categoryId: string) => {
		setCustomCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
		setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
	};

	const getColorClasses = (color: string, isSelected: boolean) => {
		const baseClasses = "transition-all duration-200 cursor-pointer";
		const colorMap = {
			blue: isSelected
				? "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700",
			green: isSelected
				? "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700",
			purple: isSelected
				? "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700",
			orange: isSelected
				? "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700",
			gray: isSelected
				? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
			indigo: isSelected
				? "bg-indigo-100 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700",
			red: isSelected
				? "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-600"
				: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-700",
		};
		return `${baseClasses} ${colorMap[color as keyof typeof colorMap] || colorMap.gray}`;
	};

	const allCategories = [...SUGGESTED_CATEGORIES, ...customCategories];

	return (
		<div className="space-y-8">
			<div className="text-center">
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Select categories that match your lifestyle. This will help organize
					your tasks and make them easier to find.
				</p>
			</div>

			{/* Available Categories */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<svg
						className="w-5 h-5 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Available Categories</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 11H5m14-7H3a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"
						/>
					</svg>
					<h3 className="text-lg font-semibold">Available Categories</h3>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					{SUGGESTED_CATEGORIES.map((category) => {
						const isSelected = selectedCategories.includes(category.id);
						return (
							<button
								type="button"
								key={category.id}
								tabIndex={0}
								onClick={() => toggleCategory(category.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										toggleCategory(category.id);
									}
								}}
								className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getColorClasses(category.color, isSelected)}`}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										<div
											className={`w-4 h-4 rounded-full mt-1 ${getCategoryColor(category.color).split(" ")[0]}`}
										/>
										<div>
											<div className="flex items-center gap-2 mb-1">
												<h4 className="font-medium text-gray-900 dark:text-gray-100">
													{category.name}
												</h4>
											</div>
											<p className="text-sm text-muted-foreground">
												{category.description}
											</p>
										</div>
									</div>
									<div className="flex-shrink-0">
										{isSelected ? (
											<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
												<svg
													className="w-4 h-4 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>Selected</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
										) : (
											<div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
												<svg
													className="w-4 h-4 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>Add</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 6v6m0 0v6m0-6h6m-6 0H6"
													/>
												</svg>
											</div>
										)}
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Add Custom Category */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Add Custom Category</h3>
				<div className="space-y-3">
					<div>
						<Label htmlFor="category-name">Category Name</Label>
						<Input
							id="category-name"
							placeholder="e.g., Pets, Garden, Hobbies"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && newCategoryName.trim()) {
									addCustomCategory();
								}
							}}
						/>
					</div>
					<div>
						<Label htmlFor="category-color">Color</Label>
						<Select
							value={newCategoryColor}
							onValueChange={setNewCategoryColor}
						>
							<SelectTrigger id="category-color">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{colorOptions.map((color) => (
									<SelectItem key={color.value} value={color.value}>
										<div className="flex items-center gap-2">
											<div
												className={`w-3 h-3 rounded-full ${getCategoryColor(color.value).split(" ")[0]}`}
											/>
											{color.label}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button
						onClick={addCustomCategory}
						disabled={!newCategoryName.trim()}
						className="w-full flex items-center gap-2"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Add Category</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add Category
					</Button>
				</div>

				{/* Custom Categories */}
				{customCategories.length > 0 && (
					<div className="space-y-2">
						{customCategories.map((category) => (
							<div
								key={category.id}
								className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-4 h-4 rounded-full ${getCategoryColor(category.color).split(" ")[0]}`}
									/>
									<span className="font-medium">{category.name}</span>
									<Badge variant="outline">Custom</Badge>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => removeCustomCategory(category.id)}
									className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>Remove Category</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</Button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Selected Categories Summary */}
			{selectedCategories.length > 0 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">
						Selected Categories ({selectedCategories.length})
					</h3>
					<div className="flex flex-wrap gap-2">
						{selectedCategories.map((categoryId) => {
							const category = allCategories.find(
								(cat) => cat.id === categoryId,
							);
							if (!category) return null;
							return (
								<div
									key={categoryId}
									className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full border"
								>
									<div
										className={`w-3 h-3 rounded-full ${getCategoryColor(category.color).split(" ")[0]}`}
									/>
									<span className="text-sm font-medium">{category.name}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Optional Step Notice */}
			<div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<svg
						className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Optional Step</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
							Optional Step
						</h4>
						<p className="text-sm text-yellow-700 dark:text-yellow-300">
							Categories help organize your tasks and make them easier to find.
							You can skip this step and add categories later, or create more
							custom categories as you add tasks.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

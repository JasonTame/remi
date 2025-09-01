import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import type { Category } from "@/types";

interface CategoryFilterProps {
	selectedCategory: number | null;
	setSelectedCategory: (category: number | null) => void;
	categories: Category[];
}

const CategoryFilter = ({
	selectedCategory,
	setSelectedCategory,
	categories,
}: CategoryFilterProps) => {
	return (
		<div className="mb-4 max-w-md flex flex-col space-y-2">
			<Label htmlFor="category_filter">Filter by Category</Label>
			<Select
				name="category_filter"
				value={selectedCategory?.toString() || ""}
				onValueChange={(value) =>
					setSelectedCategory(value ? Number(value) : null)
				}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a category" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Categories</SelectItem>
					{categories.map((category) => (
						<SelectItem key={category.id} value={category.id.toString()}>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default CategoryFilter;

import { router, useForm } from "@inertiajs/react";
import { Calendar, Trash2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Birthday {
	id: number;
	name: string;
	birthday: string;
	birth_year?: number;
	relationship?: string;
	notes?: string;
	age?: number;
	next_birthday: string;
	days_until_birthday: number;
}

interface EditBirthdayDialogProps {
	birthday: Birthday | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const relationshipOptions = [
	"Family",
	"Friend",
	"Colleague",
	"Partner",
	"Sibling",
	"Parent",
	"Child",
	"Cousin",
	"Neighbor",
	"Other",
];

export function EditBirthdayDialog({
	birthday,
	open,
	onOpenChange,
}: EditBirthdayDialogProps) {
	const {
		data,
		setData,
		delete: destroy,
		processing,
		reset,
		errors,
	} = useForm({
		name: "",
		birthday: "",
		birth_year: "",
		relationship: "",
		notes: "",
	});

	// Reset form when birthday changes
	useEffect(() => {
		if (birthday) {
			setData({
				name: birthday.name,
				birthday: birthday.birthday,
				birth_year: birthday.birth_year?.toString() || "",
				relationship: birthday.relationship || "",
				notes: birthday.notes || "",
			});
		}
	}, [birthday, setData]);

	const handleSubmit = () => {
		if (!birthday) return;

		const updateData = {
			name: data.name,
			birthday: data.birthday,
			birth_year: data.birth_year ? parseInt(data.birth_year, 10) : null,
			relationship: data.relationship || null,
			notes: data.notes || null,
		};

		router.put(route("birthdays.update", birthday.id), updateData, {
			onSuccess: () => {
				onOpenChange(false);
				reset();
			},
		});
	};

	const handleDelete = () => {
		if (!birthday) return;

		if (
			confirm(`Are you sure you want to delete ${birthday.name}'s birthday?`)
		) {
			destroy(route("birthdays.destroy", birthday.id), {
				onSuccess: () => {
					onOpenChange(false);
					reset();
				},
			});
		}
	};

	if (!birthday) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-foreground">
						<Calendar className="h-5 w-5" />
						Edit Birthday
					</DialogTitle>
					<DialogDescription>
						Update {birthday.name}'s birthday information.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">
							Name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="name"
							value={data.name}
							onChange={(e) => setData("name", e.target.value)}
							placeholder="e.g., John Smith"
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="birthday">
							Birthday <span className="text-destructive">*</span>
						</Label>
						<Input
							id="birthday"
							type="date"
							value={data.birthday}
							onChange={(e) => setData("birthday", e.target.value)}
						/>
						{errors.birthday && (
							<p className="text-sm text-destructive">{errors.birthday}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="birth-year">Birth Year (optional)</Label>
						<Input
							id="birth-year"
							type="number"
							placeholder="e.g., 1990"
							min="1900"
							max={new Date().getFullYear()}
							value={data.birth_year}
							onChange={(e) => setData("birth_year", e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							Add birth year to show age on birthdays
						</p>
						{errors.birth_year && (
							<p className="text-sm text-destructive">{errors.birth_year}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="relationship">Relationship</Label>
						<Select
							value={data.relationship}
							onValueChange={(value) => setData("relationship", value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select relationship" />
							</SelectTrigger>
							<SelectContent>
								{relationshipOptions.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Notes (optional)</Label>
						<Textarea
							id="notes"
							placeholder="e.g., Loves chocolate cake, prefers small gatherings"
							value={data.notes}
							onChange={(e) => setData("notes", e.target.value)}
							rows={2}
						/>
					</div>
				</div>

				<DialogFooter className="flex justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={handleDelete}
						disabled={processing}
						className="gap-2 text-destructive hover:text-destructive"
					>
						<Trash2 className="h-4 w-4" />
						Delete
					</Button>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={!data.name || !data.birthday || processing}
							className="gap-2"
						>
							{processing ? (
								<>
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

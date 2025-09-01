import { useForm } from "@inertiajs/react";
import { Calendar } from "lucide-react";

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

interface AddBirthdayDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const relationshipOptions = [
	"Family",
	"Friend",
	"Colleague",
	"Partner",
	"Acquaintance",
	"Other",
];

const remindOptions = [
	{ value: "0", label: "On the day" },
	{ value: "1", label: "1 day before" },
	{ value: "3", label: "3 days before" },
	{ value: "7", label: "1 week before" },
	{ value: "14", label: "2 weeks before" },
];

export function AddBirthdayDialog({
	open,
	onOpenChange,
}: AddBirthdayDialogProps) {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		birthday: "",
		birth_year: "",
		relationship: "",
		notes: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		console.log("Submitting data:", data);

		post(route("birthdays.store"), {
			onSuccess: () => {
				console.log("Birthday created successfully!");
				onOpenChange(false);
				reset();
			},
			onError: (errors) => {
				console.error("Validation errors:", errors);
			},
		});
	};

	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (!newOpen) {
			reset();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Add Birthday
					</DialogTitle>
					<DialogDescription>
						Add a new birthday to track and get reminders.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* General error display */}
					{Object.keys(errors).length > 0 && (
						<div className="rounded-md bg-destructive/15 p-3">
							<div className="text-sm text-destructive">
								<p className="font-medium">Please fix the following errors:</p>
								<ul className="mt-1 list-disc list-inside space-y-1">
									{Object.entries(errors).map(([field, message]) => (
										<li key={field}>
											<span className="capitalize">
												{field.replace("_", " ")}
											</span>
											: {message}
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							value={data.name}
							onChange={(e) => setData("name", e.target.value)}
							placeholder="Enter person's name"
							required
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="birthday">Birthday *</Label>
						<Input
							id="birthday"
							type="date"
							value={data.birthday}
							onChange={(e) => setData("birthday", e.target.value)}
							required
						/>
						{errors.birthday && (
							<p className="text-sm text-destructive">{errors.birthday}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="birth_year">Birth Year (Optional)</Label>
						<Input
							id="birth_year"
							type="number"
							value={data.birth_year}
							onChange={(e) => setData("birth_year", e.target.value)}
							placeholder="e.g., 1990"
							min="1900"
							max={new Date().getFullYear()}
						/>
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
						{errors.relationship && (
							<p className="text-sm text-destructive">{errors.relationship}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							value={data.notes}
							onChange={(e) => setData("notes", e.target.value)}
							placeholder="Any additional notes..."
							rows={3}
						/>
						{errors.notes && (
							<p className="text-sm text-destructive">{errors.notes}</p>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!data.name || !data.birthday || processing}
						>
							{processing ? "Saving..." : "Save Birthday"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

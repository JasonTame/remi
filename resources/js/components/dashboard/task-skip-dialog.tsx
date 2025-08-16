import { useForm } from "@inertiajs/react";
import { Label } from "@radix-ui/react-label";

import { InputDatePicker } from "@/components/form/input-date-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { RecommendedTask } from "@/types";

type TaskSkipDialogProps = {
	task: RecommendedTask;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};
export const TaskSkipDialog = ({
	task,
	open,
	onOpenChange,
}: TaskSkipDialogProps) => {
	const { data, setData, post, processing } = useForm({
		skipped_at: new Date(),
		reason: "",
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		post(route("tasks.skip", task.task_id), {
			onSuccess: () => {
				onOpenChange(false);
			},
		});
	}

	const handleDateChange = (date: Date | undefined) => {
		setData("skipped_at", date || new Date());
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Skip Task</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Task Title</Label>
						<Input id="title" value={task.title} disabled />
					</div>
					<InputDatePicker
						id="skipped_at"
						label="Skipped At"
						value={data.skipped_at ?? new Date()}
						onChange={handleDateChange}
						placeholder="Select skip date"
					/>
					<div className="space-y-2">
						<Label htmlFor="reason">Reason for Skipping (Optional)</Label>
						<Textarea
							id="reason"
							value={data.reason}
							onChange={(e) => setData("reason", e.target.value)}
							placeholder="Why are you skipping this task?"
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={processing} variant="destructive">
							Skip Task
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

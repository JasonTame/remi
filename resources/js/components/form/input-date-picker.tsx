import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

type InputDatePickerProps = {
	id?: string;
	label?: string;
	value?: Date | string | null;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
	className?: string;
	required?: boolean;
};

export function InputDatePicker({
	id,
	label,
	value,
	onChange,
	placeholder = "Pick a date",
	disabled = false,
	error,
	className,
	required = false,
}: InputDatePickerProps) {
	const [open, setOpen] = React.useState(false);

	// Convert string value to Date object if needed
	const dateValue = React.useMemo(() => {
		if (!value) return undefined;
		if (value instanceof Date) return value;
		if (typeof value === "string") {
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? undefined : date;
		}
		return undefined;
	}, [value]);

	const handleSelect = (date: Date | undefined) => {
		onChange?.(date);
		setOpen(false);
	};

	return (
		<div className={cn("space-y-2", className)}>
			{label && (
				<Label
					htmlFor={id}
					className={cn(
						required &&
							"after:content-['*'] after:ml-0.5 after:text-destructive",
					)}
				>
					{label}
				</Label>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={id}
						variant="outline"
						disabled={disabled}
						className={cn(
							"w-full justify-start text-left font-normal",
							!dateValue && "text-muted-foreground",
							error && "border-destructive focus-visible:ring-destructive",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={dateValue}
						onSelect={handleSelect}
						disabled={disabled}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			{error && <p className="text-sm font-medium text-destructive">{error}</p>}
		</div>
	);
}

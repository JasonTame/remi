import { useForm } from '@inertiajs/react';

import { InputDatePicker } from '@/components/form/input-date-picker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { Category, Task } from '@/types';

import { Textarea } from '../ui/textarea';

interface TaskEditProps {
    task: Task;
    categories: Category[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TaskEditDialog({ task, categories, open, onOpenChange }: TaskEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        timing_description: task.timing_description,
        description: task.description || '',
        category_id: task.category?.id?.toString() || '',
        last_completed_at: task.last_completed_at ? new Date(task.last_completed_at) : undefined,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('tasks.update', task.id), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    const handleLastCompletedChange = (date: Date | undefined) => {
        setData('last_completed_at', date);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Task Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. 'Schedule a dental checkup'"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">
                            Category <span className="text-red-500">*</span>
                        </Label>
                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timing_description">
                            Timing Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="timing_description"
                            value={data.timing_description}
                            onChange={(e) => setData('timing_description', e.target.value)}
                            placeholder="Describe how often this task should be done (e.g., 'Every month', 'Once a year in spring', etc.)"
                            required
                        />
                        {errors.timing_description && <p className="text-sm text-red-600">{errors.timing_description}</p>}
                    </div>

                    <InputDatePicker
                        id="last_completed_at"
                        label="Last Completed At (optional)"
                        value={data.last_completed_at}
                        onChange={handleLastCompletedChange}
                        placeholder="Select last completion date"
                        error={errors.last_completed_at}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        <p className="text-sm text-muted-foreground">
                            This is a description of the task. It will be displayed in the task details view.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category, Task } from '@/types';
import { useForm } from '@inertiajs/react';

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
        category_id: task.category?.id?.toString() || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('tasks.update', task.id), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category</Label>
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
                        <Label htmlFor="timing_description">Timing Description</Label>
                        <textarea
                            id="timing_description"
                            value={data.timing_description}
                            onChange={(e) => setData('timing_description', e.target.value)}
                            rows={4}
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe how often this task should be done (e.g., 'Every month', 'Once a year in spring', etc.)"
                            required
                        />
                        {errors.timing_description && <p className="text-sm text-red-600">{errors.timing_description}</p>}
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

import { useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';

import { InputDatePicker } from '@/components/form/input-date-picker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { RecommendedTask } from '@/types';

type TaskCompleteDialogProps = {
    task: RecommendedTask;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};
export const TaskCompleteDialog = ({ task, open, onOpenChange }: TaskCompleteDialogProps) => {
    const { data, setData, post, processing } = useForm({
        completed_at: new Date(),
        notes: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('tasks.complete', task.task_id), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    }

    const handleDateChange = (date: Date | undefined) => {
        setData('completed_at', date || new Date());
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Complete Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" value={task.title} disabled />
                    </div>
                    <InputDatePicker
                        id="completed_at"
                        label="Completed At"
                        value={data.completed_at ?? new Date()}
                        onChange={handleDateChange}
                        placeholder="Select completion date"
                    />
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Complete
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

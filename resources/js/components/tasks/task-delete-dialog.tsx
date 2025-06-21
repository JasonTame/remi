import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/types';
import { useForm } from '@inertiajs/react';

type Props = {
    task: Task;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const TaskDeleteDialog = ({ task, open, onOpenChange }: Props) => {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('tasks.destroy', task.id), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to delete "{task.title}"? This action cannot be undone.</DialogDescription>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

import { TaskDetail } from '@/components/tasks/task-detail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/format';
import type { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, Check, Eye, MoreHorizontal, Pencil } from 'lucide-react';
import { useState } from 'react';

type Props = {
    tasks: Task[];
    sortOrder: 'asc' | 'desc';
    onSortChange: (order: 'asc' | 'desc') => void;
};

export const TaskTable = ({ tasks, sortOrder, onSortChange }: Props) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            Health: 'bg-blue-500 hover:bg-blue-600',
            Home: 'bg-green-500 hover:bg-green-600',
            Personal: 'bg-purple-500 hover:bg-purple-600',
            Auto: 'bg-orange-500 hover:bg-orange-600',
            Documents: 'bg-gray-500 hover:bg-gray-600',
            Tech: 'bg-indigo-500 hover:bg-indigo-600',
        };

        return colors[category] || 'bg-primary hover:bg-primary/80';
    };

    const handleViewTask = (task: Task) => {
        setSelectedTask(task);
        setViewDialogOpen(true);
    };

    const toggleSortOrder = () => {
        onSortChange(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <>
            <div className="overflow-hidden rounded-md border bg-white dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="cursor-pointer" onClick={toggleSortOrder}>
                                    <div className="flex items-center">
                                        Last Completed
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell>
                                        {task.category ? (
                                            <Badge className={getCategoryColor(task.category.name)}>{task.category.name}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{task.last_completed_at ? formatDate(task.last_completed_at, 'dd/MM/yyyy') : 'Never'}</span>
                                            <span className="text-muted-foreground text-xs">
                                                {task.last_completed_at ? formatDistanceToNow(task.last_completed_at, { addSuffix: true }) : 'Never'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>{task.timing_description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewTask(task)}>
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View</span>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">More options</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Mark as complete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Task Details</DialogTitle>
                    </DialogHeader>
                    {selectedTask && <TaskDetail task={selectedTask} />}
                </DialogContent>
            </Dialog>
        </>
    );
};

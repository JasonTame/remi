import { Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { formatDate } from '@/lib/helpers/format';
import { getCategoryColor } from '@/lib/utils/tasks/get-category-color';

import type { Category, Task } from '@/types';

import { TaskDialogs } from './task-dialogs';

type Props = {
    tasks: Task[];
    categories: Category[];
};
export const TaskCards = ({ tasks, categories }: Props) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleViewTask = (task: Task) => {
        setSelectedTask(task);
        setViewDialogOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setEditDialogOpen(true);
    };

    const handleDeleteTask = (task: Task) => {
        setSelectedTask(task);
        setDeleteDialogOpen(true);
    };

    return (
        <>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="mb-2 flex items-start justify-between">
                                <h3 className="font-medium">{task.title}</h3>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="-mr-2">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewTask(task)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteTask(task)}>
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {task.category && (
                                    <div>
                                        <span className="text-muted-foreground">Category:</span>
                                        <div className="mt-1">
                                            <Badge className={getCategoryColor(task.category.color)}>{task.category.name}</Badge>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="text-muted-foreground">Last completed:</span>
                                    <div className="mt-1">{task.last_completed_at ? formatDate(task.last_completed_at, 'dd/MM/yyyy') : 'Never'}</div>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Frequency:</span>
                                    <div className="mt-1">{task.timing_description}</div>
                                </div>
                            </div>

                            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => handleViewTask(task)}>
                                View details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedTask && (
                <TaskDialogs
                    deleteDialogOpen={deleteDialogOpen}
                    viewDialogOpen={viewDialogOpen}
                    editDialogOpen={editDialogOpen}
                    selectedTask={selectedTask}
                    categories={categories}
                    setViewDialogOpen={setViewDialogOpen}
                    setEditDialogOpen={setEditDialogOpen}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                />
            )}
        </>
    );
};

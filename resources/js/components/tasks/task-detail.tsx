import { format, formatDistanceToNow } from 'date-fns';
import { BarChart2, Calendar, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { getCategoryColor } from '@/lib/utils/tasks/get-category-color';

import type { Task } from '@/types';

interface TaskDetailProps {
    task: Task;
}

export function TaskDetail({ task }: TaskDetailProps) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-2 text-xl font-semibold">{task.title}</h3>
                {task.category && <Badge className={getCategoryColor(task.category.name)}>{task.category.name}</Badge>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last completed
                    </div>
                    <p className="font-medium">{task.last_completed_at ? format(task.last_completed_at, 'PPP') : 'Never'}</p>
                    <p className="text-muted-foreground text-sm">
                        {task.last_completed_at ? formatDistanceToNow(task.last_completed_at, { addSuffix: true }) : 'Never'}
                    </p>
                </div>

                <div className="space-y-1">
                    <div className="text-muted-foreground flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Frequency
                    </div>
                    <p>{task.timing_description}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="text-muted-foreground flex items-center text-sm">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Completion history
                </div>
                <div className="text-muted-foreground flex h-24 items-center justify-center rounded-md border">
                    Completion history chart would go here
                </div>
            </div>
        </div>
    );
}

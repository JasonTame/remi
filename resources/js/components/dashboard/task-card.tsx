import { formatDistanceToNow } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getPriorityLabel } from '@/lib/utils/tasks/get-priority-label';

import { RecommendedTask } from '@/types';

import { TaskCompleteDialog } from './task-complete-dialog';

type Props = {
    task: RecommendedTask;
};
export const RecommendedTaskCard = ({ task }: Props) => {
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

    const handleComplete = () => {
        setCompleteDialogOpen(true);
    };

    return (
        <>
            <Card key={task.id} className={`overflow-hidden ${task.completed ? 'bg-muted/50' : ''}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <span className="bg-accent/20 text-accent-foreground rounded-full px-2 py-1 text-xs">{getPriorityLabel(task.priority)}</span>
                    </div>
                    {task.category && <div className="text-muted-foreground text-xs">{task.category}</div>}
                </CardHeader>
                <CardContent className="space-y-4">
                    {task.lastCompleted && (
                        <div className="text-muted-foreground text-sm">
                            <Clock className="mr-1 inline-block h-3 w-3" />
                            Last completed: {formatDistanceToNow(new Date(task.lastCompleted))} ago
                        </div>
                    )}
                    <p className="text-sm">{task.reason}</p>
                    <div className="flex gap-2">
                        {!task.completed ? (
                            <>
                                <Button className="bg-accent hover:bg-accent/90 flex-1" onClick={handleComplete}>
                                    <Check className="mr-1 h-4 w-4" />
                                    Complete
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Skip
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" className="flex-1" disabled>
                                Completed
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            <TaskCompleteDialog task={task} open={completeDialogOpen} onOpenChange={setCompleteDialogOpen} />
        </>
    );
};

import { formatDistanceToNow } from 'date-fns';
import { Check, Clock, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { getPriorityColor, getPriorityLabel } from '@/lib/utils/tasks/get-priority-formatting';

import { RecommendedTask } from '@/types';

import { TaskCompleteDialog } from './task-complete-dialog';
import { TaskSkipDialog } from './task-skip-dialog';

type Props = {
    task: RecommendedTask;
};
export const RecommendedTaskCard = ({ task }: Props) => {
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
    const [skipDialogOpen, setSkipDialogOpen] = useState(false);

    const handleComplete = () => {
        setCompleteDialogOpen(true);
    };

    const handleSkip = () => {
        setSkipDialogOpen(true);
    };

    const isCompleted = task.completed;
    const isSkipped = task.skipped_at !== null;

    return (
        <>
            <Card key={task.id} className={`overflow-hidden ${isCompleted ? 'bg-muted/50' : isSkipped ? 'bg-orange-50/50 border-orange-200' : ''}`}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <span className={cn('bg-accent/20 text-accent-foreground rounded-full px-2 py-1 text-xs', getPriorityColor(task.priority))}>
                            {getPriorityLabel(task.priority)}
                        </span>
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
                    {isSkipped && (
                        <div className="text-orange-600 text-sm space-y-1">
                            <div>
                                <X className="mr-1 inline-block h-3 w-3" />
                                Skipped: {formatDistanceToNow(new Date(task.skipped_at!))} ago
                            </div>
                            {task.skip_reason && <div className="text-orange-500 text-xs pl-4">Reason: {task.skip_reason}</div>}
                        </div>
                    )}
                    <p className="text-sm">{task.reason}</p>
                    <div className="flex gap-2">
                        {!isCompleted && !isSkipped ? (
                            <>
                                <Button className="bg-accent hover:bg-accent/90 flex-1" onClick={handleComplete}>
                                    <Check className="mr-1 h-4 w-4" />
                                    Complete
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={handleSkip}>
                                    <X className="mr-1 h-4 w-4" />
                                    Skip
                                </Button>
                            </>
                        ) : isCompleted ? (
                            <Button variant="outline" className="flex-1" disabled>
                                Completed
                            </Button>
                        ) : (
                            <Button variant="outline" className="flex-1 text-orange-600 border-orange-200" disabled>
                                Skipped
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            <TaskCompleteDialog task={task} open={completeDialogOpen} onOpenChange={setCompleteDialogOpen} />
            <TaskSkipDialog task={task} open={skipDialogOpen} onOpenChange={setSkipDialogOpen} />
        </>
    );
};

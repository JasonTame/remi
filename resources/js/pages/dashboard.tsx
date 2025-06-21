import { Head } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Clock, Trophy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import MainLayout from '@/layouts/main-layout';

interface RecommendedTask {
    id: number;
    task_id: number;
    title: string;
    lastCompleted: string | null;
    category: string | null;
    priority: number;
    reason: string;
    completed: boolean;
}

interface PageProps {
    recommendedTasks: RecommendedTask[];
    weekStartDate: string;
    hasRecommendations: boolean;
}

export default function Dashboard({ recommendedTasks, weekStartDate, hasRecommendations }: PageProps) {
    const [open, setOpen] = useState(false);

    // Parse the week start date and calculate the end date
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const weekRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    // Helper to get a label based on priority
    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 1:
                return 'High Priority';
            case 2:
                return 'Medium Priority';
            case 3:
                return 'Normal Priority';
            case 4:
                return 'Low Priority';
            case 5:
                return 'Optional';
            default:
                return 'Normal Priority';
        }
    };

    return (
        <MainLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="h-full space-y-6 p-6">
                <div className="space-y-2">
                    <h2 className="text-muted-foreground text-lg">{weekRange}</h2>
                    <h3 className="text-2xl font-semibold">Remi suggests these tasks this week:</h3>
                </div>

                {!hasRecommendations && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Trophy className="text-muted-foreground mb-4 h-12 w-12" />
                        <h3 className="text-xl font-medium">No recommendations yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            You don't have any task recommendations for this week. Run the recommendation generator to get started.
                        </p>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedTasks.map((task) => (
                        <Card key={task.id} className={`overflow-hidden ${task.completed ? 'bg-muted/50' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-xl">{task.title}</CardTitle>
                                    <span className="bg-accent/20 text-accent-foreground rounded-full px-2 py-1 text-xs">
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
                                <p className="text-sm">{task.reason}</p>
                                <div className="flex gap-2">
                                    {!task.completed ? (
                                        <>
                                            <Button className="bg-accent hover:bg-accent/90 flex-1">
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
                    ))}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    {/* <TaskForm onSubmit={() => setOpen(false)} /> */}
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}

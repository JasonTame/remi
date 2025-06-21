import { Head } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import { useState } from 'react';

import MainLayout from '@/layouts/main-layout';

import { RecommendedTaskCard } from '@/components/dashboard/task-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { RecommendedTask } from '@/types';

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
                        <RecommendedTaskCard key={task.id} task={task} />
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

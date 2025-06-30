import { Head } from '@inertiajs/react';
import { CheckCircle, Trophy, XCircle } from 'lucide-react';

import MainLayout from '@/layouts/main-layout';

import { RecommendedTaskCard } from '@/components/dashboard/task-card';

import { useFlashMessages } from '@/hooks/use-flash-messages';

import { RecommendedTask } from '@/types';

interface PageProps {
    pendingTasks: RecommendedTask[];
    completedTasks: RecommendedTask[];
    skippedTasks: RecommendedTask[];
    weekStartDate: string;
    hasRecommendations: boolean;
}

export default function Dashboard({ pendingTasks, completedTasks, skippedTasks, weekStartDate, hasRecommendations }: PageProps) {
    useFlashMessages();

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
            <div className="h-full space-y-8 p-6">
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

                {/* Pending Tasks Section */}
                {pendingTasks.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Recommended Tasks</h4>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pendingTasks.map((task) => (
                                <RecommendedTaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}

                {/* All tasks completed/skipped message */}
                {pendingTasks.length === 0 && (completedTasks.length > 0 || skippedTasks.length > 0) && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Trophy className="text-primary mb-4 h-12 w-12" />
                        <h3 className="text-xl font-medium">Great work!</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">
                            You've completed or addressed all your recommended tasks for this week. Check back next week for new recommendations.
                        </p>
                    </div>
                )}

                {/* Completed Tasks Section */}
                {completedTasks.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h4 className="text-lg font-medium">Completed Tasks</h4>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{completedTasks.length}</span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {completedTasks.map((task) => (
                                <RecommendedTaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Skipped Tasks Section */}
                {skippedTasks.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-orange-600" />
                            <h4 className="text-lg font-medium">Skipped Tasks</h4>
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{skippedTasks.length}</span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {skippedTasks.map((task) => (
                                <RecommendedTaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

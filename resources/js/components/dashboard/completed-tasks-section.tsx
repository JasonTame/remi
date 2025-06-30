import { CheckCircle } from 'lucide-react';

import { RecommendedTask } from '@/types';

import { RecommendedTaskCard } from './task-card';

interface CompletedTasksSectionProps {
    tasks: RecommendedTask[];
}

export function CompletedTasksSection({ tasks }: CompletedTasksSectionProps) {
    if (tasks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-medium">Completed Tasks</h4>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                    <RecommendedTaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}

import { XCircle } from 'lucide-react';

import { RecommendedTask } from '@/types';

import { RecommendedTaskCard } from './task-card';

interface SkippedTasksSectionProps {
    tasks: RecommendedTask[];
}

export function SkippedTasksSection({ tasks }: SkippedTasksSectionProps) {
    if (tasks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-orange-600" />
                <h4 className="text-lg font-medium">Skipped Tasks</h4>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                    <RecommendedTaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}

'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import type { Task } from '@/types';
import { TaskCards } from './task-cards';
import { TaskTable } from './task-table';

interface TaskListProps {
    tasks: Task[];
    sortOrder: 'asc' | 'desc';
    onSortChange: (order: 'asc' | 'desc') => void;
}

export function TaskList({ tasks, sortOrder, onSortChange }: TaskListProps) {
    const isMobile = useIsMobile();

    // Mobile card view
    if (isMobile) {
        return <TaskCards tasks={tasks} />;
    }

    // Desktop table view
    return <TaskTable tasks={tasks} sortOrder={sortOrder} onSortChange={onSortChange} />;
}

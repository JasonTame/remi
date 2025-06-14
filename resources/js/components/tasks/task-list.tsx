'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import type { Category, Task } from '@/types';
import { TaskCards } from './task-cards';
import { TaskTable } from './task-table';

interface TaskListProps {
    tasks: Task[];
    categories: Category[];
    sortOrder: 'asc' | 'desc';
    onSortChange: (order: 'asc' | 'desc') => void;
}

export function TaskList({ tasks, categories, sortOrder, onSortChange }: TaskListProps) {
    const isMobile = useIsMobile();

    // Mobile card view
    if (isMobile) {
        return <TaskCards tasks={tasks} categories={categories} />;
    }

    // Desktop table view
    return <TaskTable tasks={tasks} categories={categories} sortOrder={sortOrder} onSortChange={onSortChange} />;
}

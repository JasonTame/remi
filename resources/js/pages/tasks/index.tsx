import { useState } from 'react';

import CategoryFilter from '@/components/tasks/category-filter';
import { TaskCreate } from '@/components/tasks/task-create';
import { TaskList } from '@/components/tasks/task-list';

import AppLayout from '@/layouts/main-layout';
import { type Category, type Task } from '@/types';

interface PageProps {
    tasks: Task[];
    categories: Category[];
}

export default function Index({ tasks, categories }: PageProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const filteredTasks = selectedCategory ? tasks.filter((task) => task.category?.id === selectedCategory) : tasks;

    return (
        <AppLayout
            title="Tasks"
            breadcrumbs={[{ title: 'Tasks', href: route('tasks.index') }]}
            showAddButton={true}
            onAddClick={() => setIsCreateDialogOpen(true)}
        >
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />

                    <TaskList tasks={filteredTasks} categories={categories} sortOrder="desc" onSortChange={() => {}} />
                </div>
            </div>

            <TaskCreate categories={categories} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </AppLayout>
    );
}

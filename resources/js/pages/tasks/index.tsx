import CategoryFilter from '@/components/tasks/category-filter';
import { TaskList } from '@/components/tasks/task-list';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/main-layout';
import { type Category, type Task } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface PageProps {
    tasks: Task[];
    categories: Category[];
}

export default function Index({ tasks, categories }: PageProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const filteredTasks = selectedCategory ? tasks.filter((task) => task.category?.id === selectedCategory) : tasks;

    return (
        <AppLayout title="Tasks" breadcrumbs={[{ title: 'Tasks', href: route('tasks.index') }]}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
                        <Button asChild>
                            <Link href={route('tasks.create')}>Create New Task</Link>
                        </Button>
                    </div>

                    <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />

                    <TaskList tasks={filteredTasks} sortOrder="desc" onSortChange={() => {}} />
                </div>
            </div>
        </AppLayout>
    );
}

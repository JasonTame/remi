import AppLayout from '@/layouts/main-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    timing_description: string;
    last_completed_at: string | null;
    category: Category | null;
}

interface PageProps {
    tasks: Task[];
    categories: Category[];
}

export default function Index({ tasks, categories }: PageProps) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Filter tasks by selected category
    const filteredTasks = selectedCategory ? tasks.filter((task) => task.category?.id === selectedCategory) : tasks;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tasks', href: route('tasks.index') }]}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
                        <Link
                            href={route('tasks.create')}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900"
                        >
                            Create New Task
                        </Link>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-4">
                        <label htmlFor="category_filter" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filter by Category
                        </label>
                        <select
                            id="category_filter"
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                            className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Task List */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            {filteredTasks.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                >
                                                    Title
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                >
                                                    Category
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                >
                                                    Last Completed
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                            {filteredTasks.map((task) => (
                                                <tr key={task.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link
                                                            href={route('tasks.show', task.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            {task.title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{task.category ? task.category.name : '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {task.last_completed_at ? new Date(task.last_completed_at).toLocaleDateString() : 'Never'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                        <Link
                                                            href={route('tasks.edit', task.id)}
                                                            className="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Link
                                                            href={route('tasks.show', task.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-6 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">No tasks found.</p>
                                    <Link
                                        href={route('tasks.create')}
                                        className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900"
                                    >
                                        Create Your First Task
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

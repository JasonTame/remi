import { useForm } from '@inertiajs/react';

import AppLayout from '@/layouts/main-layout';

interface Category {
    id: number;
    name: string;
}

interface PageProps {
    categories: Category[];
}

export default function Create({ categories }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        timing_description: '',
        category_id: '',
        last_completed_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tasks', href: route('tasks.index') },
                { title: 'Create New Task', href: route('tasks.create') },
            ]}
        >
            <div className="mx-auto w-2xl py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6">
                        <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Create New Task</h1>

                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Task Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.title}</p>}
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.category_id}</p>}
                            </div>

                            {/* Timing Description */}
                            <div className="mb-6">
                                <label htmlFor="timing_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Timing Description
                                </label>
                                <textarea
                                    id="timing_description"
                                    value={data.timing_description}
                                    onChange={(e) => setData('timing_description', e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Describe how often this task should be done (e.g., 'Every month', 'Once a year in spring', etc.)"
                                    required
                                />
                                {errors.timing_description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.timing_description}</p>
                                )}
                            </div>

                            {/* Last Completed At */}
                            <div className="mb-6">
                                <label htmlFor="last_completed_at" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Last Completed At
                                </label>
                                <input
                                    type="date"
                                    id="last_completed_at"
                                    value={data.last_completed_at}
                                    onChange={(e) => setData('last_completed_at', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="mr-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

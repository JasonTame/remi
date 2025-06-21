import { Link, useForm } from '@inertiajs/react';

import AppLayout from '@/layouts/main-layout';

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

interface RecommendedTask {
    id: number;
    task: Task;
    priority: number;
    reason: string;
    completed: boolean;
}

interface PageProps {
    weekStartDate: string;
    recommendedTasks: RecommendedTask[];
}

export default function Current({ weekStartDate, recommendedTasks }: PageProps) {
    const { post, processing } = useForm();

    const handleComplete = (recommendedTaskId: number) => {
        post(route('recommended-tasks.complete', recommendedTaskId));
    };

    // Format the date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Calculate week end date
    const weekStartDateObj = new Date(weekStartDate);
    const weekEndDateObj = new Date(weekStartDateObj);
    weekEndDateObj.setDate(weekEndDateObj.getDate() + 6);

    const weekEndDate = weekEndDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Get pending tasks (not completed)
    const pendingTasks = recommendedTasks.filter((task) => !task.completed);

    // Get completed tasks
    const completedTasks = recommendedTasks.filter((task) => task.completed);

    return (
        <AppLayout breadcrumbs={[{ title: 'Weekly Recommendations', href: route('recommendations.current') }]}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Weekly Recommendations</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Week of {formatDate(weekStartDate)} to {weekEndDate}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href={route('tasks.index')}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-25 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                View All Tasks
                            </Link>
                            <Link
                                href={route('recommendations.generate')}
                                method="post"
                                as="button"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900"
                            >
                                Generate New Recommendations
                            </Link>
                        </div>
                    </div>

                    {recommendedTasks.length === 0 ? (
                        <div className="bg-white p-6 text-center shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <p className="mb-4 text-gray-500 dark:text-gray-400">No recommendations generated yet.</p>
                            <Link
                                href={route('recommendations.generate')}
                                method="post"
                                as="button"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none active:bg-indigo-900"
                            >
                                Generate Recommendations
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Pending Tasks */}
                            <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                                <div className="p-6">
                                    <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                        Tasks To Complete ({pendingTasks.length})
                                    </h2>

                                    {pendingTasks.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                        >
                                                            Priority
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                        >
                                                            Task
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
                                                            Recommendation Reason
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
                                                    {pendingTasks.map((recommendedTask) => (
                                                        <tr key={recommendedTask.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs leading-5 font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                                    {recommendedTask.priority}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Link
                                                                    href={route('tasks.show', recommendedTask.task.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    {recommendedTask.task.title}
                                                                </Link>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {recommendedTask.task.category ? recommendedTask.task.category.name : '-'}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{recommendedTask.reason}</p>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {recommendedTask.task.last_completed_at
                                                                    ? formatDate(recommendedTask.task.last_completed_at)
                                                                    : 'Never'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleComplete(recommendedTask.id)}
                                                                    disabled={processing}
                                                                    className="inline-flex items-center rounded border border-transparent bg-green-600 px-3 py-1.5 text-xs leading-4 font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                                                >
                                                                    Mark Completed
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">All tasks completed! Great job!</p>
                                    )}
                                </div>
                            </div>

                            {/* Completed Tasks */}
                            {completedTasks.length > 0 && (
                                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                                    <div className="p-6">
                                        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                            Completed Tasks ({completedTasks.length})
                                        </h2>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                        >
                                                            Task
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
                                                            Priority
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                                        >
                                                            Last Completed
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                                    {completedTasks.map((recommendedTask) => (
                                                        <tr key={recommendedTask.id} className="bg-gray-50 dark:bg-gray-900">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Link
                                                                    href={route('tasks.show', recommendedTask.task.id)}
                                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                                >
                                                                    {recommendedTask.task.title}
                                                                </Link>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {recommendedTask.task.category ? recommendedTask.task.category.name : '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs leading-5 font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                    {recommendedTask.priority}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {recommendedTask.task.last_completed_at
                                                                    ? formatDate(recommendedTask.task.last_completed_at)
                                                                    : 'Never'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

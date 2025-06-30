import { Head } from '@inertiajs/react';
import { addMonths, isAfter, startOfWeek, subMonths } from 'date-fns';
import { useState } from 'react';

import MainLayout from '@/layouts/main-layout';

import { Calendar } from '@/components/calendar';
import { CalendarHeader } from '@/components/calendar/header';
import { CalendarLegend } from '@/components/calendar/legend';

import type { Task } from '@/types';

interface TaskHistory {
    id: number;
    task_id: number;
    completed_at: string;
    notes?: string;
    task: Task;
}

interface TaskHistoryProps {
    taskHistory: TaskHistory[];
}

export default function TaskHistory({ taskHistory }: TaskHistoryProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        const nextMonth = addMonths(currentDate, 1);
        const today = new Date();
        const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const nextMonthWeekStart = startOfWeek(nextMonth, { weekStartsOn: 1 });

        // Only allow navigation if it doesn't go beyond the current week
        if (!isAfter(nextMonthWeekStart, currentWeekStart)) {
            setCurrentDate(nextMonth);
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleTaskClick = (task: Task) => {
        console.log('Task clicked:', task);
        // You can add task detail modal or navigation here
    };

    return (
        <MainLayout title="Task History">
            <Head title="Task History" />

            <div className="h-full space-y-6 p-6">
                <p className="text-muted-foreground">View your task completion history. Calendar shows data up to the current week.</p>

                <div className="space-y-4">
                    <CalendarHeader
                        currentDate={currentDate}
                        onPreviousMonth={handlePreviousMonth}
                        onNextMonth={handleNextMonth}
                        onToday={handleToday}
                    />

                    <div className="border border-input rounded shadow">
                        <Calendar currentDate={currentDate} taskHistory={taskHistory} onTaskClick={handleTaskClick} />
                    </div>
                    <CalendarLegend />
                </div>
            </div>
        </MainLayout>
    );
}

export function CalendarLegend() {
    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-300 dark:bg-green-900/20 dark:border-green-700"></div>
                <span>Completed tasks</span>
            </div>
        </div>
    );
}

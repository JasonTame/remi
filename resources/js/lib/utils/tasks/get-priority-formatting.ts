export const getPriorityLabel = (priority: number) => {
    switch (priority) {
        case 5:
            return 'Critical/Overdue';
        case 4:
            return 'Important';
        case 3:
            return 'Moderate';
        case 2:
            return 'Low';
        case 1:
            return 'Optional';
        default:
            return 'Optional';
    }
};

export const getPriorityColor = (priority: number) => {
    switch (priority) {
        case 5:
            return 'bg-red-400 hover:bg-red-500';
        case 4:
            return 'bg-yellow-400 hover:bg-yellow-500';
        case 3:
            return 'bg-green-400 hover:bg-green-500';
        case 2:
            return 'bg-blue-400 hover:bg-blue-500';
        case 1:
            return 'bg-gray-400 hover:bg-gray-500';
        default:
            return 'bg-gray-400 hover:bg-gray-500';
    }
};

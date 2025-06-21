/**
 * Get the label for a priority level
 * @param priority - The priority level
 * @returns The label for the priority level
 */
export const getPriorityLabel = (priority: number) => {
    switch (priority) {
        case 1:
            return 'High Priority';
        case 2:
            return 'Medium Priority';
        case 3:
            return 'Normal Priority';
        case 4:
            return 'Low Priority';
        case 5:
            return 'Optional';
        default:
            return 'Normal Priority';
    }
};

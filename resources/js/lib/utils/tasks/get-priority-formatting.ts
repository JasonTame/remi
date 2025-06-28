export const getPriorityLabel = (priority: number) => {
    switch (priority) {
        case 1:
            return 'Urgent';
        case 2:
            return 'High';
        case 3:
            return 'Medium';
        case 4:
            return 'Low';
        case 5:
            return 'Optional';
        default:
            return 'Optional';
    }
};

export const getPriorityColor = (priority: number) => {
    switch (priority) {
        case 1:
            return 'bg-red-400 hover:bg-red-500';
        case 2:
            return 'bg-yellow-400 hover:bg-yellow-500';
        case 3:
            return 'bg-green-400 hover:bg-green-500';
        case 4:
            return 'bg-blue-400 hover:bg-blue-500';
        case 5:
            return 'bg-gray-400 hover:bg-gray-500';
        default:
            return 'bg-gray-400 hover:bg-gray-500';
    }
};

// export const getPriorityFormat = (priority: number): PriorityFormat => {
//     switch (priority) {
//         case 1:
//             return { label: 'High', color: 'red' };
//         case 2:
//             return { label: 'Medium', color: 'yellow' };
//         case 3:
//             return { label: 'Normal', color: 'green' };
//         case 4:
//             return { label: 'Low', color: 'blue' };
//         case 5:
//             return { label: 'Optional', color: 'gray' };
//         default:
//             return { label: 'Normal', color: 'green' };
//     }
// };

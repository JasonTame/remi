export const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
        blue: 'bg-blue-500 hover:bg-blue-600',
        green: 'bg-green-500 hover:bg-green-600',
        red: 'bg-red-500 hover:bg-red-600',
        orange: 'bg-orange-500 hover:bg-orange-600',
        gray: 'bg-gray-500 hover:bg-gray-600',
        purple: 'bg-purple-500 hover:bg-purple-600',
        indigo: 'bg-indigo-500 hover:bg-indigo-600',
    };

    return colors[color] || 'bg-primary hover:bg-primary/80';
};

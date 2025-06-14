export const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        Health: 'bg-blue-500 hover:bg-blue-600',
        Home: 'bg-green-500 hover:bg-green-600',
        Personal: 'bg-purple-500 hover:bg-purple-600',
        Auto: 'bg-orange-500 hover:bg-orange-600',
        Documents: 'bg-gray-500 hover:bg-gray-600',
        Tech: 'bg-indigo-500 hover:bg-indigo-600',
    };

    return colors[category] || 'bg-primary hover:bg-primary/80';
};

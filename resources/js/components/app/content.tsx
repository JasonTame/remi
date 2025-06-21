import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    children: React.ReactNode;
}

export function AppContent({ children, ...props }: AppContentProps) {
    return (
        <main className="mx-auto flex h-screen w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl bg-neutral-50 dark:bg-gray-950" {...props}>
            {children}
        </main>
    );
}

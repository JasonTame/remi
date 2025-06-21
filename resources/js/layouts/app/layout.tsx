import { type PropsWithChildren } from 'react';

import { AppContent } from '@/components/app/content';
import { AppHeader } from '@/components/app/header';
import { AppShell } from '@/components/app/shell';
import { AppSidebar } from '@/components/app/sidebar';

interface AppLayoutProps extends PropsWithChildren {
    children: React.ReactNode;
    title: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
}

export default function AppLayout({ children, title, showAddButton, onAddClick }: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent>
                <AppHeader title={title} showAddButton={showAddButton} onAddClick={onAddClick} />
                {children}
            </AppContent>
        </AppShell>
    );
}

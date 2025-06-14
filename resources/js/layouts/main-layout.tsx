import AppLayout from '@/layouts/app/layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    breadcrumbs?: BreadcrumbItem[];
}

export default function MainLayout({ children, title, showAddButton, onAddClick, ...props }: AppLayoutProps) {
    return (
        <AppLayout title={title} showAddButton={showAddButton} onAddClick={onAddClick} {...props}>
            {children}
        </AppLayout>
    );
}

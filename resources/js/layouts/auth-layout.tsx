import { type PropsWithChildren } from 'react';

import { AppLogo } from '@/components/app/logo';
import { ModeToggle } from '@/components/app/mode-toggle';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="flex items-center gap-3">
                        <AppLogo className="h-12 w-12 text-primary" />
                        <span className="app-title text-3xl font-bold text-primary">Remi</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border">{children}</div>
            </div>
        </div>
    );
}

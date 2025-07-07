import { Link } from '@inertiajs/react';

import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
    currentPath: string;
}

const settingsLinks = [
    { href: '/settings/profile', label: 'Profile' },
    { href: '/settings/password', label: 'Password' },
    { href: '/settings/notifications', label: 'Notifications' },
    { href: '/settings/task-preferences', label: 'Task Preferences' },
];

export function SettingsSidebar({ currentPath }: SettingsSidebarProps) {
    return (
        <aside className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
            <div className="p-4 border-b">
                <h2 className="font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your profile and account settings</p>
            </div>
            <nav className="p-2">
                <ul className="space-y-1">
                    {settingsLinks.map((link) => {
                        const isActive = currentPath === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        'block px-3 py-2 rounded-md text-sm transition-colors',
                                        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

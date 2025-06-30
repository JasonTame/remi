import { Link } from '@inertiajs/react';
import { Calendar, Clock, Home, Settings } from 'lucide-react';

import { AppLogo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="border-b p-4">
                <Link href="/" className="flex items-center gap-2">
                    <AppLogo className="text-primary h-8 w-10" />
                    <span className="app-title text-primary text-xl font-bold font-comfortaa">Remi</span>
                </Link>
                <p className="text-muted-foreground mt-1 text-xs">Flexible Reminders for Real Life</p>
            </div>
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/tasks">
                        <Clock className="mr-2 h-4 w-4" />
                        All Tasks
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/task-history">
                        <Calendar className="mr-2 h-4 w-4" />
                        History
                    </Link>
                </Button>
            </nav>
            <div className="border-t p-4 flex-shrink-0">
                <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </Button>
            </div>
        </div>
    );
}

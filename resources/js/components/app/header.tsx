import { Link } from '@inertiajs/react';
import { Bell, PlusCircle } from 'lucide-react';

import { ModeToggle } from '@/components/app/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
    title: string;
    showAddButton?: boolean;
    avatar?: string;
    onAddClick?: () => void;
}

export function AppHeader({ title, showAddButton = false, onAddClick, avatar }: HeaderProps) {
    return (
        <header className="flex items-center justify-between border-b bg-white p-4 lg:p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex items-center gap-2">
                {showAddButton && (
                    <Button onClick={onAddClick} className="gap-1">
                        <PlusCircle className="h-4 w-4" />
                        Add Task
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="bg-secondary absolute top-1 right-1 h-2 w-2 rounded-full"></span>
                </Button>
                <ModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8 p-1 border border-gray-200">
                                <AvatarImage src={avatar} alt="@user" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={route('logout')} method="post" as="button">
                                Log out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

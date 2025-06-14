import { Bell, PlusCircle } from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';
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
    onAddClick?: () => void;
}

export function AppHeader({ title, showAddButton = false, onAddClick }: HeaderProps) {
    return (
        <header className="flex items-center justify-between border-b bg-white p-4 dark:bg-gray-900">
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
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
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
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

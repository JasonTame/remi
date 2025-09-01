import { Link } from "@inertiajs/react";
import { Menu, PlusCircle } from "lucide-react";

import { ModeToggle } from "@/components/app/mode-toggle";
import { NotificationsDropdown } from "@/components/app/notifications-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
	title: string;
	showAddButton?: boolean;
	avatar?: string;
	onAddClick?: () => void;
	onMenuClick?: () => void;
}

export function AppHeader({
	title,
	showAddButton = false,
	onAddClick,
	avatar,
	onMenuClick,
}: HeaderProps) {
	return (
		<header className="flex items-center justify-between border-b bg-white p-4 lg:p-6 dark:bg-gray-900">
			<div className="flex items-center gap-3">
				{/* Mobile hamburger menu */}
				<Button
					variant="ghost"
					size="sm"
					className="lg:hidden"
					onClick={onMenuClick}
				>
					<Menu className="h-5 w-5" />
				</Button>
				<h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">
					{title}
				</h1>
			</div>
			<div className="flex items-center gap-2">
				{showAddButton && (
					<Button onClick={onAddClick} className="gap-1" size="sm">
						<PlusCircle className="h-4 w-4" />
						<span className="hidden sm:inline">Add Task</span>
					</Button>
				)}
				<NotificationsDropdown />
				<ModeToggle />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-8 w-8 rounded-full">
							<Avatar className="h-8 w-8 border border-gray-200">
								<AvatarImage src={avatar} alt="@user" />
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Link href={route("profile.edit")}>Profile</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link href={route("logout")} method="post" as="button">
								Log out
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

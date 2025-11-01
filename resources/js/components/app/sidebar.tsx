import { Link, usePage } from "@inertiajs/react";
import { Cake, Calendar, Clock, Home, Settings, X } from "lucide-react";
import { useEffect } from "react";

import { AppLogo } from "@/components/app/logo";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
	const { url } = usePage();

	const isActive = (path: string) => {
		return url.startsWith(path);
	};

	const isActiveClass = "font-semibold text-primary";

	// Close sidebar on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			// Prevent body scroll when sidebar is open on mobile
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	// Close sidebar when clicking on a link (mobile)
	const handleLinkClick = () => {
		if (window.innerWidth < 1024) {
			onClose();
		}
	};

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={onClose}
					aria-label="Close sidebar"
				/>
			)}

		{/* Sidebar */}
		<div
			className={`
				fixed inset-y-0 left-0 z-50 flex h-screen-safe w-64 flex-col border-r bg-white dark:bg-gray-900 flex-shrink-0 transform transition-transform duration-300 ease-in-out
				lg:relative lg:translate-x-0 lg:z-auto
				${isOpen ? "translate-x-0" : "-translate-x-full"}
			`}
		>
				{/* Mobile close button */}
				<div className="flex items-center justify-between border-b p-4 lg:justify-start">
					<Link
						href="/"
						className="flex items-center gap-2"
						onClick={handleLinkClick}
					>
						<AppLogo className="text-primary h-8 w-10" />
						<span className="app-title text-primary text-xl font-bold font-comfortaa">
							Remi
						</span>
					</Link>
					<Button
						variant="ghost"
						size="sm"
						className="lg:hidden"
						onClick={onClose}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-muted-foreground px-4 py-4 text-xs">
					Flexible Reminders for Real Life
				</p>

				<nav className="flex-1 space-y-2 p-4 overflow-y-auto">
					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link
							href="/dashboard"
							className={isActive("/dashboard") ? isActiveClass : ""}
							onClick={handleLinkClick}
						>
							<Home className="mr-2 h-4 w-4" />
							Dashboard
						</Link>
					</Button>
					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link
							href="/tasks"
							className={isActive("/tasks") ? isActiveClass : ""}
							onClick={handleLinkClick}
						>
							<Clock className="mr-2 h-4 w-4" />
							All Tasks
						</Link>
					</Button>
					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link
							href="/birthdays"
							className={isActive("/birthdays") ? isActiveClass : ""}
							onClick={handleLinkClick}
						>
							<Cake className="mr-2 h-4 w-4" />
							Birthdays
						</Link>
					</Button>
					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link
							href="/task-history"
							className={isActive("/task-history") ? isActiveClass : ""}
							onClick={handleLinkClick}
						>
							<Calendar className="mr-2 h-4 w-4" />
							History
						</Link>
					</Button>
				</nav>
				<div className="border-t p-4 flex-shrink-0">
					<Button variant="ghost" className="w-full justify-start" asChild>
						<Link
							href="/settings"
							className={isActive("/settings") ? isActiveClass : ""}
							onClick={handleLinkClick}
						>
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</Link>
					</Button>
				</div>
			</div>
		</>
	);
}

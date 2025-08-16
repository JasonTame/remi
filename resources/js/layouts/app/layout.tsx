import { usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";

import { AppContent } from "@/components/app/content";
import { AppHeader } from "@/components/app/header";
import { AppSidebar } from "@/components/app/sidebar";
import { Toaster } from "@/components/ui/sonner";

import type { SharedData } from "@/types";

interface AppLayoutProps extends PropsWithChildren {
	children: React.ReactNode;
	title: string;
	showAddButton?: boolean;
	onAddClick?: () => void;
}

export default function AppLayout({
	children,
	title,
	showAddButton,
	onAddClick,
}: AppLayoutProps) {
	const { auth } = usePage<SharedData>().props;

	return (
		<div className="flex h-screen w-full overflow-hidden">
			<AppSidebar />
			<div className="flex flex-1 flex-col">
				<AppHeader
					title={title}
					showAddButton={showAddButton}
					onAddClick={onAddClick}
					avatar={auth.user.avatar}
				/>
				<div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-gray-950">
					<AppContent>{children}</AppContent>
				</div>
				<Toaster />
			</div>
		</div>
	);
}

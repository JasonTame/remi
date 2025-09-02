import { usePage } from "@inertiajs/react";

import { PostHogIdentificationWrapper } from "@/components/posthog-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

import type { SharedData } from "@/types";

interface AppShellProps {
	children: React.ReactNode;
	variant?: "header" | "sidebar";
}

export function AppShell({ children, variant = "header" }: AppShellProps) {
	const isOpen = usePage<SharedData>().props.sidebarOpen;

	if (variant === "header") {
		return (
			<PostHogIdentificationWrapper>
				<div className="flex min-h-screen w-full flex-col">{children}</div>
			</PostHogIdentificationWrapper>
		);
	}

	return (
		<PostHogIdentificationWrapper>
			<SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>
		</PostHogIdentificationWrapper>
	);
}

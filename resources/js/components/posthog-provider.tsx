import type { ReactNode } from "react";

import { usePostHogIdentification } from "../hooks/use-posthog";

interface PostHogIdentificationWrapperProps {
	children: ReactNode;
}

export function PostHogIdentificationWrapper({
	children,
}: PostHogIdentificationWrapperProps) {
	usePostHogIdentification();

	return <>{children}</>;
}

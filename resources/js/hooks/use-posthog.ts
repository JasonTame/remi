import { usePage } from "@inertiajs/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

interface PostHogPageData {
	posthog: {
		user_id: number | null;
		user_email: string | null;
		user_name: string | null;
	};
	[key: string]: unknown;
}

export function usePostHogIdentification() {
	const posthog = usePostHog();
	const { props } = usePage<PostHogPageData>();

	useEffect(() => {
		if (!posthog) return;

		const { user_id, user_email, user_name } = props.posthog;

		if (user_id) {
			// User is authenticated - identify them
			posthog.identify(user_id.toString(), {
				email: user_email,
				name: user_name,
			});
		} else {
			// User is not authenticated - reset to anonymous
			posthog.reset();
		}
	}, [posthog, props.posthog]);

	return posthog;
}

export function usePostHogCapture() {
	const posthog = usePostHog();
	const { props } = usePage<PostHogPageData>();

	const capture = (event: string, properties?: Record<string, unknown>) => {
		if (!posthog) return;

		const { user_id } = props.posthog;

		posthog.capture(event, {
			...properties,
			user_id: user_id?.toString(),
		});
	};

	return { capture, posthog };
}

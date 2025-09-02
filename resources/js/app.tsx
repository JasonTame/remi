import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import "../css/app.css";

import { PostHogProvider } from "posthog-js/react";

import { initializeTheme } from "./hooks/use-appearance";
import { initializeFonts } from "./hooks/use-fonts";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const posthogOptions = {
	api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) =>
		resolvePageComponent(
			`./pages/${name}.tsx`,
			import.meta.glob("./pages/**/*.tsx"),
		),
	setup({ el, App, props }) {
		const root = createRoot(el);

		root.render(
			<PostHogProvider
				apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
				options={posthogOptions}
			>
				<App {...props} />
			</PostHogProvider>,
		);
	},
	progress: {
		color: "#4B5563",
	},
});

// This will set light / dark mode on load...
initializeTheme();

// This will initialize fonts on load...
initializeFonts();

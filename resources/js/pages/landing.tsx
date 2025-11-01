import { usePage } from "@inertiajs/react";

import { LandingCTA } from "@/components/landing/landing-cta";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";

import type { SharedData } from "@/types";

export default function LandingPage() {
	const { auth } = usePage<SharedData>().props;

	return (
		<div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-gray-950 dark:to-gray-900">
			<LandingHeader auth={auth} />
			<main>
				<LandingHero />
				<LandingFeatures />
				<LandingHowItWorks />
				<LandingCTA />
			</main>
			<LandingFooter />
		</div>
	);
}

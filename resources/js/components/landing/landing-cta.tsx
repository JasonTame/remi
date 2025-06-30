import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { AppLogo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';

export function LandingCTA() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 sm:px-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
                    <div className="relative mx-auto max-w-2xl text-center">
                        <div className="mb-6 flex justify-center">
                            <AppLogo className="h-16 w-16 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">Ready to remember better?</h2>
                        <p className="text-lg leading-8 text-white/90 mb-8">
                            Join thousands of people who never forget important tasks anymore. Start your free account today and let Remi help you
                            stay on top of life's irregular but important commitments.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                                    Get started for free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                                >
                                    Sign in
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-6 text-sm text-white/70">No credit card required • Free forever • Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

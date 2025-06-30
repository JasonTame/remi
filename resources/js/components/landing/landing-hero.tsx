import { Link } from '@inertiajs/react';
import { ArrowRight, Brain, Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AppLogo } from '../app/logo';

export function LandingHero() {
    return (
        <section className="relative py-20 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl"></div>
                            <AppLogo className="relative h-24 w-24 text-primary" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-6">
                        <span className="block">Flexible Reminders</span>
                        <span className="block text-primary">for Real Life</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground mb-10">
                        Never forget life's important but irregular tasks again. Remi uses AI to understand your natural language and provides gentle
                        weekly reminders for things like dental checkups, car maintenance, and catching up with friends.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link href="/register">
                            <Button size="lg" className="text-lg px-8 py-3">
                                Start remembering better
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                                I already have an account
                            </Button>
                        </Link>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-primary/10 rounded-full">
                                <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">AI-Powered</h3>
                            <p className="text-sm text-muted-foreground">Understands "every 6 months" or "about once a quarter"</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-secondary/10 rounded-full">
                                <Calendar className="h-6 w-6 text-secondary" />
                            </div>
                            <h3 className="font-semibold mb-2">Weekly Digest</h3>
                            <p className="text-sm text-muted-foreground">Get gentle suggestions, not rigid deadlines</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-accent/10 rounded-full">
                                <Clock className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="font-semibold mb-2">Flexible Timing</h3>
                            <p className="text-sm text-muted-foreground">Perfect for irregular but important tasks</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

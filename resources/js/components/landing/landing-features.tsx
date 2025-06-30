import { BarChart3, Bell, MessageSquare, Shield, Smartphone, Zap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LandingFeatures() {
    const features = [
        {
            icon: MessageSquare,
            title: 'Natural Language',
            description: "Just say 'every 6 months' or 'about once a quarter' - Remi understands how you naturally think about time.",
        },
        {
            icon: Bell,
            title: 'Gentle Reminders',
            description: 'Get weekly suggestions instead of nagging notifications. Remi suggests, you decide when to act.',
        },
        {
            icon: BarChart3,
            title: 'Track Your Patterns',
            description: 'See your completion history and understand your habits with beautiful, insightful charts.',
        },
        {
            icon: Smartphone,
            title: 'Mobile Friendly',
            description: 'Access your tasks anywhere with a responsive design that works perfectly on all your devices.',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your data stays yours. We use privacy-focused design and never sell your information.',
        },
        {
            icon: Zap,
            title: 'Quick Capture',
            description: 'Add new tasks in seconds. No complex setup or rigid categories - just natural, simple task creation.',
        },
    ];

    return (
        <section id="features" className="py-20 bg-white/50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
                        Everything you need to remember better
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Remi is designed around how you naturally think about recurring tasks, not rigid scheduling systems.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

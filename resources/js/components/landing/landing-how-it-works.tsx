import { Brain, Check, Mail, PlusCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function LandingHowItWorks() {
    const steps = [
        {
            icon: PlusCircle,
            title: 'Add Your Tasks',
            description:
                "Simply describe your recurring tasks in natural language. 'Dental checkup every 6 months' or 'Call mom weekly' - Remi gets it.",
            color: 'bg-blue-500',
        },
        {
            icon: Brain,
            title: 'AI Learns Your Patterns',
            description: "Remi's AI understands your timing preferences and learns from your completion patterns to make better suggestions.",
            color: 'bg-purple-500',
        },
        {
            icon: Mail,
            title: 'Get Weekly Suggestions',
            description: 'Every week, receive a friendly email with tasks Remi thinks you might want to tackle. No pressure, just gentle reminders.',
            color: 'bg-secondary',
        },
        {
            icon: Check,
            title: 'Complete & Track',
            description: 'Mark tasks complete when you do them. Remi tracks your patterns and adjusts future suggestions accordingly.',
            color: 'bg-accent',
        },
    ];

    return (
        <section id="how-it-works" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">How Remi works</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Four simple steps to never forget important tasks again</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                                <CardContent className="p-6 text-center">
                                    <div className="mb-6 flex justify-center">
                                        <div className={`p-4 ${step.color} rounded-full`}>
                                            <step.icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="mb-4 text-sm font-semibold text-primary">Step {index + 1}</div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                                </CardContent>
                            </Card>

                            {/* Connector line for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform -translate-y-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

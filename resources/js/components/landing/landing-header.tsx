'use client';

import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { AppLogo } from '@/components/app/logo';
import { ModeToggle } from '@/components/app/mode-toggle';
import { Button } from '@/components/ui/button';

export function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 w-auto lg:w-[250px]">
                        <AppLogo className="h-8 w-8 text-primary" />
                        <span className="app-title text-xl font-bold text-primary">Remi</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                            How it works
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center justify-center gap-4 w-auto lg:w-[250px]">
                        <Link href="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link href="/register">
                            <Button>Get started</Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-t bg-white dark:bg-gray-900 py-4">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="#features"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                How it works
                            </Link>
                            <Link
                                href="#testimonials"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Reviews
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t  ">
                                <Link href="/login">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="w-full">Get started</Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

import { type PropsWithChildren } from 'react';

import { SettingsSidebar } from '@/components/settings/settings-sidebar';
import { Separator } from '@/components/ui/separator';

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="bg-neutral-50 px-4 py-6 dark:bg-gray-950">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <SettingsSidebar currentPath={currentPath} />

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}

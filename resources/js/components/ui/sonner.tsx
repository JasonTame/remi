import { AlertTriangle, CheckCircle, Info, Loader, XCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            icons={{
                success: <CheckCircle className="h-4 w-4 text-green-500" />,
                info: <Info className="h-4 w-4 text-blue-500" />,
                warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
                error: <XCircle className="h-4 w-4 text-red-500" />,
                loading: <Loader className="h-4 w-4 animate-spin text-gray-500" />,
            }}
            {...props}
        />
    );
};

export { Toaster };

import { useEffect } from 'react';

// We'll use this hook to load the fonts needed for our theme
export function useFonts() {
    useEffect(() => {
        // You can load fonts dynamically here if needed
        // Example:
        // const inter = new FontFace('Inter', 'url(/fonts/Inter.woff2)');
        // const nunito = new FontFace('Nunito', 'url(/fonts/Nunito.woff2)');
        // const comfortaa = new FontFace('Comfortaa', 'url(/fonts/Comfortaa.woff2)');
        //
        // Promise.all([
        //   inter.load(),
        //   nunito.load(),
        //   comfortaa.load(),
        // ]).then((fonts) => {
        //   fonts.forEach((font) => {
        //     document.fonts.add(font);
        //   });
        // });

        // Or you can just set CSS variables for the fonts
        document.documentElement.style.setProperty('--font-nunito', '"Nunito", sans-serif');
        document.documentElement.style.setProperty('--font-comfortaa', '"Comfortaa", cursive');
    }, []);
}

// Initialize fonts on first load
export function initializeFonts() {
    document.documentElement.style.setProperty('--font-nunito', '"Nunito", sans-serif');
    document.documentElement.style.setProperty('--font-comfortaa', '"Comfortaa", cursive');
}

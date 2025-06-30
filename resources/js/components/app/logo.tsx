import type React from 'react';

export function AppLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160" {...props}>
            <style>{`.primary { fill: #607D8B; } .secondary { fill: #E27D60; }.eye { fill: #FFFFFF; }`}</style>

            <path
                className="primary"
                d="M190,130h-15c0-30-8-50-18-50c-25,0-5,60-30,60
        c-25,0-10-30-40-30s-15,30-40,30c-30,0-40-95,40-100c-1,4-1,8-1,12c0,5,1,10,3,15c2,5,5,9,9,12
        c2,1.5,4,3,7,4c3,1,5,1,8,0.5c3-0.5,5-1.5,7-3c2-1.5,4-3,5-5c-15,18-35,2-35-25c0-4,0.5-7.5,1.5-10.5
        c6-18,28-17,35-4C210,78,200,105,190,130z M170"
            />

            <circle className="eye" cx="135" cy="55" r="3.5" />
        </svg>
    );
}

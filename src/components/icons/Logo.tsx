import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
 >
    <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
    </defs>
    <path 
        fill="url(#logoGradient)"
        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.4,85.29-52.8,52.8a12,12,0,0,1-17,0h0a12,12,0,0,1,0-17l34-33.9-42.8-.2a44,44,0,1,0-44.22,44H72a56,56,0,1,1,56-56,12,12,0,0,1,0,24H83.54l34.57,34.57,26.8-26.8a12,12,0,1,1,17,17Z"
    />
 </svg>
);

export default Logo;

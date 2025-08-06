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
        d="M128,24C68.5,24,24,68.5,24,128s44.5,104,104,104c59.5,0,104-44.5,104-104S187.5,24,128,24z M184,128h-56 c0-30.9,25.1-56,56-56C184,87.7,184,107.4,184,128z"
    />
 </svg>
);

export default Logo;

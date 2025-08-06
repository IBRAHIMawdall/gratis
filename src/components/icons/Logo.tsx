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
    
    {/* Abstract G Shape */}
    <path 
        d="M128 24C68.5 24 24 68.5 24 128C24 187.5 68.5 232 128 232C154.3 232 178.5 223.7 197.8 209.1L150 128H192C192 72.8 155.2 32 100 32C86.8 32 74.5 35.3 64 41.2C79.8 30.3 102.7 24 128 24Z" 
        fill="url(#logoGradient)" 
    />
 </svg>
);

export default Logo;
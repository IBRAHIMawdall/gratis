import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 2v4M8.5 4.5l3.5 3.5M4.5 8.5l3.5 3.5" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
  </svg>
);

export default Logo;

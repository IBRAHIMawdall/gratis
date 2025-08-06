import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
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
      d="M50,5.1c-24.8,0-44.9,20.2-44.9,44.9s20.2,44.9,44.9,44.9s44.9-20.2,44.9-44.9S74.8,5.1,50,5.1z M69.9,43.2
        c-4.4-3.8-10.4-3.1-14,1.4L44.1,56.3c-2.4,2.9-6.3,3.8-9.5,2.3c-3.3-1.5-5-5.1-4-8.6l7.3-24.9c1.3-4.4,5.8-7.2,10.3-6.5
        c4.4,0.7,7.7,4.4,7.7,8.9v0.2c0,3.5-2.8,6.3-6.3,6.3H48.4l-3.3,11.2l12-10.3c3.6-3.1,8.7-3.7,13-1.4c4.3,2.3,6.8,7,6.1,11.7
        C75.8,50.7,73.4,54,69.9,43.2z"
    />
  </svg>
);

export default Logo;

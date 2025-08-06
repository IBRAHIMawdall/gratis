import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
    </defs>
    <path
        fill="url(#logoGradient)"
        d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 82C29 87 13 71 13 50S29 13 50 13s37 16 37 37-16 37-37 37zm13.3-36.8c-4.2-3.8-10-3-13.4 1.4l-11 11.4c-2.3 2.4-5.7 3.2-8.6 2.1-3-1.1-4.7-4.2-3.9-7.3l7-23.7c1.3-4.2 5.5-6.8 9.8-6.2 4.3.6 7.4 4.2 7.4 8.5v.2c0 3.3-2.7 6-6 6h-1.4l-3.1 10.6 11.4-9.8c3.4-2.9 8.3-3.5 12.4-1.3 4.1 2.2 6.5 6.6 5.8 11.1-1 4.7-4.3 8-7.2 5.7z"
    />
  </svg>
);

export default Logo;

import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
 >
    {/* Smiling G character */}
    <g transform="translate(20, 40)">
      <path d="M104.6,33.2C95.4,13.2,74.2,0,50,0C22.4,0,0,22.4,0,50s22.4,50,50,50c24.2,0,45.4-13.2,54.6-33.2" fill="#4285F4"/>
      <path d="M50,15c19.3,0,35,15.7,35,35S69.3,85,50,85s-35-15.7-35-35S30.7,15,50,15z" fill="#E3F2FD"/>
      <path d="M67.5,60C61.2,66.3,56,69,50,69s-11.2-2.7-17.5-9C31.2,58.8,30,56.8,30,55c0-4,5-5,10-5s10,1,10,1s5-1,10-1s10,1,10,1s5,1,10,5C80,56.8,78.8,58.8,67.5,60z" fill="#4285F4"/>
      <circle cx="38" cy="42" r="5" fill="#4285F4"/>
      <circle cx="62" cy="42" r="5" fill="#4285F4"/>
    </g>

    {/* Rest of the text */}
    <text x="175" y="52%" dominantBaseline="middle" textAnchor="middle" fontSize="90" fontFamily="Poppins, sans-serif" fontWeight="bold">
      <tspan fill="#34A853">r</tspan>
      <tspan fill="#FBBC05">a</tspan>
      <tspan fill="#EA4335">t</tspan>
      <tspan fill="#4285F4">i</tspan>
      <tspan fill="#34A853">s</tspan>
    </text>
 </svg>
);

export default Logo;

import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
 >
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="120" fontFamily="Poppins, sans-serif" fontWeight="bold">
      <tspan fill="#4285F4">G</tspan>
      <tspan fill="#DB4437">r</tspan>
      <tspan fill="#F4B400">a</tspan>
      <tspan fill="#4285F4">t</tspan>
      <tspan fill="#0F9D58">i</tspan>
      <tspan fill="#DB4437">s</tspan>
    </text>
 </svg>
);

export default Logo;

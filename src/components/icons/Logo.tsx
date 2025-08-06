import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
 >
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="120" fontFamily="Poppins, sans-serif" fontWeight="bold">
      <tspan fill="#3B82F6">G</tspan>
      <tspan fill="#10B981">r</tspan>
      <tspan fill="#F59E0B">a</tspan>
      <tspan fill="#6366F1">t</tspan>
      <tspan fill="#84CC16">i</tspan>
      <tspan fill="#EC4899">s</tspan>
    </text>
 </svg>
);

export default Logo;

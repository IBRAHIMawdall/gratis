import React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
 >
    {/* Abstract G + Magnifying glass */}
    <g transform="translate(10, 20) scale(1.2)">
        <path d="M58.3,9.2C30.5,9.2,9.2,30.5,9.2,58.3s21.3,49.1,49.1,49.1c13.4,0,25.6-5.4,34.7-14.1l29.4,29.4c3.6,3.6,9.4,3.6,13,0s3.6-9.4,0-13l-29.4-29.4c8.7-9.1,14.1-21.3,14.1-34.7C107.4,30.5,86.1,9.2,58.3,9.2z M58.3,92.6c-19,0-34.3-15.4-34.3-34.3S39.3,24,58.3,24s34.3,15.4,34.3,34.3S77.3,92.6,58.3,92.6z" fill="#4285F4"/>
        <path d="M58.3,34c-13.4,0-24.3,10.9-24.3,24.3h48.6C82.6,44.9,71.7,34,58.3,34z" fill="#E3F2FD"/>
    </g>

    {/* Rest of the text */}
    <text x="178" y="53%" dominantBaseline="middle" textAnchor="middle" fontSize="90" fontFamily="Poppins, sans-serif" fontWeight="bold" fill="#34A853">
      ratis
    </text>
 </svg>
);

export default Logo;

// Import React, needed for defining the component
import React from 'react';

// Define a functional component that returns your SVG
const WalletIcon = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.66667 10.6667V5.33333C6.66667 4.6 7.26 4 8 4H14V3.33333C14 2.6 13.4 2 12.6667 2H3.33333C2.59333 2 2 2.6 2 3.33333V12.6667C2 13.4 2.59333 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V12H8C7.26 12 6.66667 11.4 6.66667 10.6667ZM8.66667 5.33333C8.3 5.33333 8 5.63333 8 6V10C8 10.3667 8.3 10.6667 8.66667 10.6667H14.6667V5.33333H8.66667ZM10.6667 9C10.1133 9 9.66667 8.55333 9.66667 8C9.66667 7.44667 10.1133 7 10.6667 7C11.22 7 11.6667 7.44667 11.6667 8C11.6667 8.55333 11.22 9 10.6667 9Z'
        fill='#A9A9A9'
      />
    </svg>
  );
};

// Export the component for use in other parts of your application
export default WalletIcon;

import {useState, useEffect} from 'react';

function useIsMobile(threshold = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < threshold;
    }
    return false; // Default value during server-side rendering
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < threshold);
    };

    window.addEventListener('resize', handleResize);

    // Call handler immediately so state gets updated with initial window size
    handleResize();

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [threshold]);

  return isMobile;
}

export default useIsMobile;

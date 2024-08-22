import React, {useState, useEffect} from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down'); // New state to track scroll direction

  // Show button when page is scrolled up to a given distance
  const toggleVisibility = () => {
    if (window.scrollY > 150) {
      setIsVisible(true);
      setScrollDirection('up');
    } else if (window.scrollY < 150) {
      setIsVisible(true);
      setScrollDirection('down');
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top or bottom based on the current direction
  const scrollTo = () => {
    if (scrollDirection === 'up') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight, // Scroll to the bottom of the document body
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <div onClick={scrollTo} className='back-to-top'>
          {scrollDirection === 'up' ? '↑' : '↓'}{' '}
          {/* Display arrow based on scroll direction */}
        </div>
      )}
    </div>
  );
};

export default BackToTopButton;

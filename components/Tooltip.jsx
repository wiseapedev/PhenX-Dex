import React, {useState, useRef, useEffect} from 'react';

const Tooltip = ({info}) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null); // Reference to the tooltip container

  // Function to handle outside clicks
  const handleClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    // Add when mounted
    document.addEventListener('mousedown', handleClickOutside);
    // Return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={tooltipRef} // Attach the ref
      className='tooltip-container'
      onClick={() => setVisible((prev) => !prev)}>
      {!visible && <i className='fas fa-info-circle'></i>}{' '}
      {visible && <div className='tooltip-box'>{info}</div>}
    </div>
  );
};

export default Tooltip;

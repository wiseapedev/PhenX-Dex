import {useRef, useEffect} from 'react';
import dynamic from 'next/dynamic';

function Twitter() {
  // Use a ref to generate a unique ID for each component instance
  const anchorRef = useRef(null);
  const uniqueId = `twitter-timeline-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  useEffect(() => {
    // Function to dynamically load the Twitter script
    const loadTwitterScript = () => {
      // This ensures the code runs only on the client
      if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => {
          window.twttr.widgets.load(anchorRef.current);
        };
        document.body.appendChild(script);
      } else {
        // Load the widget specifically for this instance
        window.twttr.widgets.load(anchorRef.current);
      }
    };

    loadTwitterScript();
  }, []);

  return (
    /*     <div className='twitter-container'>
     */ <a
      ref={anchorRef}
      id={uniqueId}
      className='twitter-timeline'
      data-width='600'
      data-height='500'
      data-theme='dark'
      href='https://twitter.com/PhenX?ref_src=twsrc%5Etfw'>
      Tweets by PhenX
    </a>
    /*     </div>
     */
  );
}

export default dynamic(() => Promise.resolve(Twitter), {ssr: false});

import {useEffect} from 'react';
import dynamic from 'next/dynamic';

function LiveCoinWatch() {
  useEffect(() => {
    const loadLiveCoinWatchScript = () => {
      // Check if the script is already loaded
      if (
        !document.querySelector(
          'script[src="https://www.livecoinwatch.com/static/lcw-widget.js"]'
        )
      ) {
        const script = document.createElement('script');
        script.src = 'https://www.livecoinwatch.com/static/lcw-widget.js';
        script.defer = true;
        document.body.appendChild(script);
      }
    };

    loadLiveCoinWatchScript();
  }, []);

  return (
    <div className='coin-watch'>
      <div
        className='livecoinwatch-widget-5'
        lcw-base='USD'
        lcw-color-tx='#999999'
        lcw-marquee-1='coins'
        lcw-marquee-2='movers'
        lcw-marquee-items='10'
        lcw-platform='ETH'></div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(LiveCoinWatch), {
  ssr: false,
});

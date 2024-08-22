import React, {useState, useEffect} from 'react';

function Iframe({buyToken, chainId, subTab}) {
  function Dexscreener() {
    const [currentTab, setCurrentTab] = useState('Chart');

    const switchTab = (tab) => {
      setCurrentTab(tab);
    };

    let iframeSrc;
    let contractAddress = buyToken;
    let chainName = 'ethereum';
    if (chainId === 8453) {
      chainName = 'base';
    }
    if (currentTab === 'Chart') {
      /*     iframeSrc = `https://dexscreener.com/ethereum/${contractAddress}?embed=1&theme=dark&info=0`; */
      iframeSrc = `https://dexscreener.com/${chainName}/${contractAddress}?embed=1&theme=dark&trades=0&info=0`;
    } else if (currentTab === 'ScanDP') {
      iframeSrc = `https://scan.garudalabs.io/scan?ca=${contractAddress}`;
    } else if (currentTab === 'chartorderbook') {
      iframeSrc = `https://dexscreener.com/${chainName}/${contractAddress}?embed=1&theme=dark&trades=1&info=0&chart=0`;
    } /* else if (currentTab === 'ff') {
    iframeSrc = `https://ff.io/`;
  } */
    useEffect(() => {
      const iframeContainer = document.querySelector('.iframe-container');
      iframeContainer.style.opacity = 0.2;
      setTimeout(() => {
        iframeContainer.style.opacity = 1;
      }, 10);
    }, []);
    return (
      <div className='iframe-container'>
        {' '}
        <div className='tab-selector'>
          <div className='tab-button' onClick={() => switchTab('Chart')}>
            Chart
          </div>
          <div
            className='tab-button'
            onClick={() => switchTab('chartorderbook')}>
            Orderbook
          </div>{' '}
        </div>{' '}
        <iframe src={iframeSrc} title={currentTab} className='iframe'>
          {' '}
        </iframe>
      </div>
    );
  }

  function Dextools() {
    const [currentTab, setCurrentTab] = useState('Chart');

    const switchTab = (tab) => {
      setCurrentTab(tab);
    };

    let iframeSrc;
    const contractAddress = buyToken; // Or your actual variable/token address
    const chainIdToName = {
      1: 'ether', // Ethereum Mainnet
      56: 'bnb', // Binance Smart Chain
      137: 'polygon', // Polygon Mainnet
      8453: 'base', // Add other supported chains as needed
    };

    // Set the appropriate chain name using the `chainId`
    const chainName = chainIdToName[chainId] || 'ether';

    // Specify DEXTools parameters according to your provided example
    const theme = 'dark';
    const chartType = 1; // Candle chart type
    const chartResolution = 30; // Example resolution: 30 minutes
    const drawingToolbars = 'false';

    // Set up the DEXTools URL
    if (currentTab === 'Chart') {
      iframeSrc = `https://www.dextools.io/widget-chart/en/${chainName}/pe-light/${contractAddress}?theme=${theme}&chartType=${chartType}&chartResolution=${chartResolution}&drawingToolbars=${drawingToolbars}`;
    } else if (currentTab === 'ScanDP') {
      iframeSrc = `https://scan.garudalabs.io/scan?ca=${contractAddress}`;
    } else if (currentTab === 'chartorderbook') {
      iframeSrc = `https://www.dextools.io/widget-chart/en/${chainName}/pe-light/${contractAddress}?theme=${theme}&chartType=${chartType}&chartResolution=${chartResolution}&drawingToolbars=${drawingToolbars}`;
    }

    return (
      <div className='iframe-container'>
        {' '}
        <div className='tab-selector'>
          <div className='tab-button' onClick={() => switchTab('Chart')}>
            Chart
          </div>
          <div
            className='tab-button'
            onClick={() => switchTab('chartorderbook')}>
            Orderbook
          </div>{' '}
          {/*       <div className='tab-button' onClick={() => switchTab('ScanDP')}>
          Delayed HP
        </div> */}
          {/*         <div className='tab-button' onClick={() => switchTab('ff')}>
          Fixed Float
        </div>{' '} */}
        </div>{' '}
        <iframe
          src={iframeSrc}
          title={currentTab}
          frameBorder='0'
          className='iframe'>
          {' '}
        </iframe>
      </div>
    );
  }

  if (subTab === 'Dexscreener') {
    return <Dexscreener />;
  } else if (subTab === 'Dextools') {
    return <Dextools />;
  } else {
    return;
  }
}

export default Iframe;

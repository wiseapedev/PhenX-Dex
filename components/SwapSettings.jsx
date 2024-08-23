import {useState, useEffect, useContext, useRef} from 'react';
import {BlockchainContext} from './BlockchainContext';
import {
  Settings,
  Medium,
  Telegram,
  Twitter,
  YouTube,
  Refresh,
  SaverInfoIcon,
  DownArrow,
  SlippageIcon,
} from './SVGMAIN.js';
import {ethers} from 'ethers';
import MemPool from './MemPool';
function SwapSettings({
  setShowChartState,
  showChart,
  setShowAudits,
  showAudits,
}) {
  const {
    savedData,
    updateSavedData,
    updateData,
    savedPriorityGas,
    savedSlippage,
    useAutoGas,
    useAutoSlippage,
    savedAddedPriority,
    provider,
  } = useContext(BlockchainContext);
  const [showSettings, setShowSettings] = useState(false);
  const Settingsicon = useRef(null);
  function CurrentGwei({provider}) {
    const GWEI = useRef(0);
    const [CurrentGwei, setCurrentGwei] = useState(0);

    async function getGasFees() {
      try {
        const feeData = await provider.getFeeData();
        console.log('feeData', feeData);
        const baseFeePerGas = feeData.gasPrice;
        //    console.log('baseFeePerGas', baseFeePerGas);

        const baseFeePerGasGwei = ethers.formatUnits(
          baseFeePerGas?.toString(),
          'gwei'
        );
        //    console.log('baseFeePerGasGwei', baseFeePerGasGwei);
        if (baseFeePerGasGwei !== GWEI.current) {
          GWEI.current = Number(baseFeePerGasGwei).toFixed(2);
          //   console.log('GWEI.current', GWEI.current);
          let currentFee = Number(baseFeePerGasGwei).toFixed(2);
          if (currentFee > 50) {
            currentFee = `${GWEI.current} High`;
          } else if (currentFee > 30) {
            currentFee = `${GWEI.current} High`;
          } else if (currentFee > 20) {
            currentFee = `${GWEI.current} Average`;
          } else {
            currentFee = `${GWEI.current} Low`;
          }

          setCurrentGwei(currentFee);
        }
      } catch (error) {}
    }

    useEffect(() => {
      const interval = setInterval(() => {
        getGasFees();
      }, 13000);
      getGasFees();

      return () => clearInterval(interval);
    }, []);
    return (
      <div className='gwei-info'>(Last Block Base Fee: {CurrentGwei})</div>
    );
  }
  const GasSlipComponent = () => {
    const priorityGasRef = useRef(savedPriorityGas.current);
    const slippageRef = useRef(null);
    const [priorityGas, setPriorityGas] = useState(''); // Initialize priorityGas state
    const [slippage, setSlippage] = useState(0); // Initialize slippage state
    const [autoGas, setAutoGas] = useState(useAutoGas.current);
    const [addedPriority, setAddedPriority] = useState('slow');
    const [autoSlippage, setAutoSlippage] = useState(useAutoSlippage.current);

    useEffect(() => {
      /*       if (savedPriorityGas) {
        let value = savedPriorityGas.current;
        priorityGasRef.current.value = value;
        setPriorityGas(value);
      } */
      if (savedSlippage) {
        let value = savedSlippage.current;
        slippageRef.current.value = value;

        setSlippage(value);
      }
      if (autoGas === true) {
        //  setPriorityGas('Auto');
      }
      if (autoSlippage === true) {
        setSlippage('Auto');
      }
    }, [savedSlippage, savedPriorityGas, autoGas, autoSlippage]);
    /*     useEffect(() => {
          const handle = setInterval(() => {
            if (Number(savedSlippage.current) !== Number(slippage)) {
              setSlippage(Number(savedSlippage.current));
            }
          }, RATE_LIMIT);
          return () => clearInterval(handle);
        }, []); */

    const handlePriorityGasChange = (value) => {
      updateData('savedAddedPriority', undefined);
      setAddedPriority(undefined);
      let priorityGasValue = value;
      setPriorityGas(priorityGasValue);
      console.log('priorityGasValue', priorityGasValue);
      updateData('priorityGas', value);
    };
    const handleAddedPriorityChange = (value) => {
      if (value >= 0.1 && value < 0.2) {
        setAddedPriority('slow');
      } else if (value >= 0.2 && value < 3) {
        setAddedPriority('normal');
      } else if (value >= 3 && value < 5) {
        setAddedPriority('fast');
      } else if (value >= 5) {
        setAddedPriority('instant');
      } else {
        setAddedPriority(undefined);
        handleAutoGasChange(false);
      }
      setPriorityGas('');
      updateData('priorityGas', '');

      updateData('savedAddedPriority', value);
      handleAutoGasChange(true);
    };

    const handleSlippageChange = (value) => {
      setSlippage(value);
      slippageRef.current.value = value;
      updateData('savedSlippage', value);
    };
    const handleAutoGasChange = (value) => {
      setAutoGas(value);
      updateData('useAutoGas', value);
      if (value === false) {
        setAddedPriority(undefined);
      }
    };
    const handleAutoSlippageChange = (value) => {
      setAutoSlippage(value);
      updateData('useAutoSlippage', value);
    };

    function MEV() {
      const switchToAntiMEVRPC = async () => {
        try {
          // Check if Ethereum object is available in window (MetaMask injected)
          if (window.ethereum) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x1', // Example for Ethereum Mainnet; adjust accordingly
                  chainName: 'Ethereum Mainnet (Anti-MEV)',
                  nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH', // 2-6 characters long
                    decimals: 18,
                  },
                  rpcUrls: ['https://rpc.mevblocker.io'],
                  blockExplorerUrls: ['https://etherscan.io'], // Adjust according to the network
                },
              ],
            });
          } else {
            console.error(
              'Ethereum object not found; MetaMask or another compatible wallet may not be installed.'
            );
          }
        } catch (error) {
          console.error('Failed to switch network:', error);
        }
      };

      return (
        <div>
          <div className='mev-button mobhide' onClick={switchToAntiMEVRPC}>
            {' '}
            Anti-Mev
          </div>
        </div>
      );
    }
    {
      (' ');
    }
    {
      /*          <div
                className='mev-button'
                onClick={() => handleAutoGasChange(!autoGas)}>
                Gas: <CurrentGwei />{' '}
              </div> */
    }
    useEffect(() => {
      const iframeContainer = document.querySelector('.swap-upper');
      iframeContainer.style.opacity = 0.2;
      iframeContainer.style.transform = 'translateX(90%)';
      setTimeout(() => {
        iframeContainer.style.opacity = 1;
        iframeContainer.style.transform = 'translateX(0%)';
      }, 10);
    }, []);

    const containerRef = useRef(null);

    // Handler to detect clicks outside of the settings container
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (
          Settingsicon.current &&
          !Settingsicon.current.contains(event.target)
        ) {
          setShowSettings(false);
        }
      }
    };

    useEffect(() => {
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    return (
      <div className='swap-upper' ref={containerRef}>
        <div className='swap-upper-box'>
          <div className='upper-settings'>
            <div className='us-ts'>
              <div className='settings-icon-container'>
                <SaverInfoIcon />
              </div>{' '}
              Auto Gas
            </div>
            <div className='us-te'>
              <CurrentGwei provider={provider} />
            </div>
          </div>{' '}
          <MemPool />{' '}
          {/*      <div className='auto-container'>
            <div
              className={
                addedPriority === 'slow'
                  ? 'auto-button'
                  : 'auto-button-non-active'
              }
              onClick={() => handleAddedPriorityChange(0.1)}>
              Slow
            </div>
            <div
              className={
                addedPriority === 'normal'
                  ? 'auto-button'
                  : 'auto-button-non-active'
              }
              onClick={() => handleAddedPriorityChange(2)}>
              Normal
            </div>
            <div
              className={
                addedPriority === 'fast'
                  ? 'auto-button'
                  : 'auto-button-non-active'
              }
              onClick={() => handleAddedPriorityChange(3)}>
              Fast
            </div>{' '}
            <div
              className={
                addedPriority === 'instant'
                  ? 'auto-button'
                  : 'auto-button-non-active'
              }
              onClick={() => handleAddedPriorityChange(5)}>
              Instant
            </div>{' '}
            <input
              onClick={() => handleAutoGasChange(false)}
              style={{cursor: 'unset'}}
              className='auto-button-non-active'
              ref={priorityGasRef}
              placeholder='custom'
              onChange={(e) => handlePriorityGasChange(e.target.value)}
              type='number'
            />
          </div> */}
        </div>
        <div className='swap-upper-box'>
          <div className='upper-settings'>
            <div className='us-ts'>
              <div className='settings-icon-container'>
                <SlippageIcon />
              </div>{' '}
              Slippage Tolerance
            </div>
            <div className='us-te'></div>
          </div>
          <div className='auto-container'>
            <div
              className={
                slippage === 1 ? 'auto-button' : 'auto-button-non-active'
              }
              onClick={() => handleSlippageChange(1)}>
              1%
            </div>
            <div
              className={
                slippage === 3 ? 'auto-button' : 'auto-button-non-active'
              }
              onClick={() => handleSlippageChange(3)}>
              3%
            </div>
            <div
              className={
                slippage === 7 ? 'auto-button' : 'auto-button-non-active'
              }
              onClick={() => handleSlippageChange(7)}>
              7%
            </div>
            <div
              className={
                slippage === 11 ? 'auto-button' : 'auto-button-non-active'
              }
              onClick={() => handleSlippageChange(11)}>
              11%
            </div>{' '}
            <input
              //   onMouseOver={() => handleAutoGasChange(false)}
              style={{cursor: 'unset'}}
              className='auto-button-non-active'
              ref={slippageRef}
              placeholder='%'
              onChange={(e) => handleSlippageChange(e.target.value)}
              type='number'
              value={slippage}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='swap-icons-container'>
      {' '}
      {showSettings && <GasSlipComponent />}
      <div className='swap-icons-left'>
        <div className='swap-tabs-container'>
          <div className='swap-tab active'>Swap</div>
          <div className='swap-tab'>Limit</div>
          <div className='swap-tab'>Bridge</div>
        </div>
      </div>{' '}
      {/*       <div className='swap-tabs-container'>
        <div className='swap-tab active'>Swap</div>
        <div className='swap-tab'>Limit</div>
        <div className='swap-tab'>Bridge</div>
      </div> */}
      <div className='swap-icons-right'>
        {' '}
        <img
          className='swap-icon'
          src='/audit.png'
          onClick={() => setShowAudits(!showAudits)}
        />{' '}
        <img
          className='swap-icon'
          src='/chart.png'
          onClick={() => setShowChartState(!showChart)}
        />{' '}
        {/*        <div className='icon'>
          <Refresh />
        </div>{' '} */}
        <div
          className='icon'
          ref={Settingsicon}
          onClick={() => setShowSettings(!showSettings)}>
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default SwapSettings;

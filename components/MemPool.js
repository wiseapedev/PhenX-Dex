import {BlockchainContext} from './BlockchainContext';
import {useContext, useEffect, useState} from 'react';
import CountUp from 'react-countup';

function MemPool() {
  const {provider} = useContext(BlockchainContext);
  const [gasData, setGasData] = useState(null);

  async function getGasFees() {
    try {
      const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'bn_gasPrice',
        params: [{chainid: 1}],
      };

      const data = await provider.send(payload.method, payload.params);
      setGasData(data);
    } catch (error) {
      //   console.error('Failed to getGasFees:', error);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getGasFees();
    }, 5000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className='mempool-container'>
      {gasData ? (
        <GasTrackerDisplay gasData={gasData} />
      ) : (
        <div className='small-text'>Computing Live Gas</div>
      )}
    </div>
  );
}

function GasTrackerDisplay({gasData}) {
  const block = gasData.blockPrices[0];
  const lowConfidence = block.estimatedPrices.find((p) => p.confidence === 70);
  const mediumConfidence = block.estimatedPrices.find(
    (p) => p.confidence === 95
  );
  const highConfidence = block.estimatedPrices.find((p) => p.confidence === 99);

  return (
    <div className='gas-tracker'>
      <GasPriceBox
        level='Low'
        phenx='mobhide'
        gasData={lowConfidence}
        baseFee={block.baseFeePerGas}
      />
      <GasPriceBox
        level='PhenX'
        gasData={mediumConfidence}
        baseFee={block.baseFeePerGas}
        phenx='phenx'
      />
      <GasPriceBox
        level='High'
        phenx='mobhide'
        gasData={highConfidence}
        baseFee={block.baseFeePerGas}
      />
    </div>
  );
}

function GasPriceBox({level, phenx, gasData, baseFee}) {
  return (
    <div className={`gas-price-box ${phenx}`}>
      <div className='gas-price-content'>{level}</div>
      <div className='gas-price-content'>
        Priority{` `} {/* {gasData.maxPriorityFeePerGas.toFixed(2)} */}
        <CountUp
          start={0}
          end={gasData.maxPriorityFeePerGas.toFixed(2)}
          duration={2}
          decimals={2}
          prefix='='
        />{' '}
      </div>
      <div className='gas-price-content'>{` ${Math.round(
        gasData.confidence
      )}% Confidence`}</div>
    </div>
  );
}

export default MemPool;

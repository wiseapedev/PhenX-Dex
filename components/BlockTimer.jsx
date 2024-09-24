import React, {useState, useEffect, useRef} from 'react';
import Tooltip from './Tooltip';

function BlockTimer({provider, chain_id}) {
  const [lastBlockTime, setLastBlockTime] = useState(null);
  const [nextBlockEstimate, setNextBlockEstimate] = useState(null);
  const [progress, setProgress] = useState(0);
  const blockNumberRef = useRef(null);
  const lastBlockTimeRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const calculateNextBlockEstimate = () => {
      const now = new Date().getTime();
      const estimatedBlockTime = chain_id === 1 ? 15000 : 2000;
      setNextBlockEstimate(new Date(now + estimatedBlockTime));
      updateProgressBar(now, now + estimatedBlockTime);
    };

    const updateProgressBar = (startTime, endTime) => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);

      progressIntervalRef.current = setInterval(() => {
        const now = new Date().getTime();
        const elapsedTime = now - startTime;
        const totalTime = endTime - startTime;
        const progressPercentage = (elapsedTime / totalTime) * 100;

        setProgress(progressPercentage);

        if (progressPercentage >= 100) {
          clearInterval(progressIntervalRef.current);
          setProgress(100);
        }
      }, 100); // update every 100 ms
    };

    const fetchNewBlockNumber = async () => {
      if (!provider) return;

      try {
        const blockNumber = await provider.getBlockNumber();
        if (blockNumberRef.current !== blockNumber) {
          blockNumberRef.current = blockNumber;
          const now = new Date();

          if (lastBlockTimeRef.current) {
            const timeSinceLastBlock = now - lastBlockTimeRef.current;
            setLastBlockTime(timeSinceLastBlock);
          }

          lastBlockTimeRef.current = now;
          calculateNextBlockEstimate();
        }
      } catch (error) {
        console.error('Failed to fetch new block number:', error);
      }
    };

    const startPolling = () => {
      intervalId = setInterval(fetchNewBlockNumber, 12000);
    };

    const stopPolling = () => {
      clearInterval(intervalId);
    };
    fetchNewBlockNumber();
    startPolling();

    return () => {
      stopPolling();
      clearInterval(progressIntervalRef.current);
    };
  }, [provider]);

  return (
    <div className='saver-info-container'>
      {' '}
      <div className='small-text'>Next Block & Quote Refresh Timer</div>
      <Tooltip info='Initiating trades at the start of a block can minimize the risk of transaction reversals due to slippage, especially with high volume tokens.' />
      {/*       {lastBlockTime && (
        <div className='small-text'>
          Next Block & Quote Refresh Timer
        </div>
      )} */}
      {nextBlockEstimate && (
        <>
          {/*    <div className='small-text'>
            Estimated time for next block:{' '}
            {nextBlockEstimate.toLocaleTimeString()}
          </div> */}

          <div className='progress-bar-background'>
            <div
              className='progress-bar-fill'
              style={{width: `${progress}%`}}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default BlockTimer;

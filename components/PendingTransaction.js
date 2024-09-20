import React, {useState, useEffect} from 'react';

function PendingTransaction({transaction, swapData, chainId}) {
  const [status, setStatus] = useState('pending'); // 'pending', 'confirmed', 'failed'
  const [confirmationCount, setConfirmationCount] = useState(0);

  const hash = transaction.hash;
  let explorerLink = '';
  if (chainId === 1) {
    explorerLink = `https://etherscan.io/tx/${hash}`;
  } else if (chainId === 8453) {
    explorerLink = `https://basescan.org/tx/${hash}`;
  }

  useEffect(() => {
    let isMounted = true;

    const listenForConfirmation = async () => {
      try {
        const txReceipt = await transaction.wait();

        if (isMounted) {
          if (txReceipt.status === 1) {
            setStatus('confirmed');
          } else {
            setStatus('failed'); // transaction failed
          }
        }
      } catch (error) {
        console.error('Error waiting for transaction confirmation:', error);
        if (isMounted) {
          setStatus('failed'); // transaction failed
        }
      }
    };

    listenForConfirmation();

    return () => {
      isMounted = false;
    };
  }, [transaction]);

  return (
    <div className='pending-container'>
      <div className='pending-box'>
        {status === 'pending' && (
          <>
            {' '}
            <div
              className='loader'
              style={{margin: '0', width: '62px', height: '62px'}}
            />
            <p className='pending-text'>Swap submitted</p>
          </>
        )}

        {status === 'confirmed' && (
          <>
            <div
              className='tick-icon'
              style={{margin: '0', width: '62px', height: '62px'}}
            />
            <p className='pending-text-ok'>Transaction Confirmed! </p>
          </>
        )}

        {status === 'failed' && (
          <>
            {/* <ErrorIcon /> */}
            <p className='pending-text-ok'>Transaction Failed </p>
          </>
        )}
        <a
          className='hash-link'
          href={explorerLink}
          target='_blank'
          rel='noreferrer'>
          {' '}
          View on Explorer
        </a>
      </div>
    </div>
  );
}

export default PendingTransaction;

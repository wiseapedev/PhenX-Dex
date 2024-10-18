import {ethers} from 'ethers';
import {use, useContext, useEffect, useState} from 'react';
import ContractLinks from '../ContractLinks';

const isTest = false;
const ShieldIcon = () => {
  /*   return (
    <svg
      stroke='currentColor'
      fill='#235144'
      strokeWidth='0'
      viewBox='0 0 24 24'
      className='text-highlight'
      height='20'
      width='20'
      xmlns='http://www.w3.org/2000/svg'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' />
    </svg>
  ); */
  return '';
};
const CloseIcon = () => {
  /*   return (
    <svg
      stroke='currentColor'
      fill='rgba(255, 0, 0, 0.7)'
      strokeWidth='0'
      viewBox='0 0 24 24'
      className='text-highlight'
      height='25'
      width='20'
      xmlns='http://www.w3.org/2000/svg'>
      <path d='M18.3,5.71a1,1,0,0,0-1.41,0L12,10.59,7.11,5.7A1,1,0,0,0,5.7,7.11L10.59,12,5.7,16.89a1,1,0,1,0,1.41,1.41L12,13.41l4.89,4.89a1,1,0,0,0,1.41-1.41L13.41,12l4.89-4.89A1,1,0,0,0,18.3,5.71Z' />
    </svg>
  ); */
  return '';
};
function Audit({contractAddress, provider, chain_id, authToken}) {
  const [scanMessage, setScanMessage] = useState(null);

  async function scanContract(contractAddress) {
    try {
      const response = await fetch('/api/rpc-call/scan-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
        },
        body: JSON.stringify({contractAddress, chain_id}), // Ensure chain_id is available
      });

      const data = await response.json();

      if (response.ok) {
        return data.result; // Ensure data.result exists in the backend response
      } else {
        console.error('Error scanning contract:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Failed to scan contract:', error);
      return null;
    }
  }

  async function handleScan(contractAddress, attempts = 5, delay = 2000) {
    try {
      if (contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        contractAddress = '0xce3ee7435a5bedbe73b92f39828b0cfd9d0ff568';
      }
      const data = await scanContract(contractAddress);
      const scanMessage = await getMessage(data);
      if (scanMessage === null) {
        throw new Error('Error in getMessage');
      }
      setScanMessage(scanMessage);
    } catch (error) {
      console.error('Error in handleScan:', error.message);
      if (attempts > 0) {
        console.log(
          `Retrying in ${delay / 1000} seconds... attempts left: ${attempts}`
        );
        setTimeout(
          () => handleScan(contractAddress, attempts - 1, delay * 2),
          delay
        );
      } else {
        console.error('Max retry attempts reached. Stopping retries.');
        setScanMessage(
          'Failed to scan after multiple attempts. Please try again later.'
        );
      }
    }
  }

  useEffect(() => {
    if (contractAddress) {
      handleScan(contractAddress);
    }
  }, [contractAddress]);

  async function getMessage(data, contractAddress) {
    let message = null;
    try {
      const formatPercent = (value) =>
        `${(parseFloat(value) * 100).toFixed(2)}%`;

      const formatDate = (dateString) => {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
      };

      const isSignificantShare = (percent) => parseFloat(percent) >= 0.0001;

      let lpLockInfo = [];
      let validHolderFound = false;

      if (data?.lp_holders && data.lp_holders.length > 0) {
        data.lp_holders.forEach((holder) => {
          if (
            holder.tag &&
            holder.is_locked &&
            isSignificantShare(holder.percent)
          ) {
            const lockedPercent = formatPercent(holder.percent);
            if (holder.locked_detail && holder.locked_detail.length > 0) {
              const lockDetails = holder.locked_detail[0];
              lpLockInfo.push(
                <div key={holder.tag}>
                  <div className='quote-line'>
                    <div className='quote-content'>Liquidity Location:</div>
                    <div className='quote-content'> {holder.tag}</div>
                  </div>
                  <div className='quote-line'>
                    <div className='quote-content'>Liquidity % Locked:</div>
                    <div className='quote-content'> {lockedPercent}</div>
                  </div>
                  <div className='quote-line'>
                    <div className='quote-content'>Liquidity Unlock Date:</div>
                    <div className='quote-content'>
                      {' '}
                      {formatDate(lockDetails.end_time)}
                    </div>
                  </div>{' '}
                </div>
              );
            } else {
              lpLockInfo.push(
                <div key={holder.tag}>
                  <div className='quote-line'>
                    <div className='quote-content'>LP Holder:</div>
                    <div className='quote-content'> {holder.tag}</div>
                  </div>
                  <div className='quote-line'>
                    <div className='quote-content'>LP Share:</div>
                    <div className='quote-content'> {lockedPercent}</div>
                  </div>
                  <div className='quote-line'>
                    <div className='quote-content'>
                      Lock-up details not available ⚠️
                    </div>
                  </div>
                </div>
              );
            }
            validHolderFound = true;
          }
        });

        if (!validHolderFound) {
          if (
            contractAddress === '0x98Ce7f261E425AD0cA667e60675938dcffC1571A'
          ) {
            lpLockInfo.push(
              <div key='lp-warning'>
                {' '}
                LP is locked with flokifi for 8 more months
              </div>
            );
          } else {
            lpLockInfo.push(
              <div key='lp-warning'>⚠️ No liquidity lock found ⚠️</div>
            );
          }
        }
      } else {
        if (contractAddress === '0x98Ce7f261E425AD0cA667e60675938dcffC1571A') {
          lpLockInfo.push(
            <div key='lp-warning'>
              {' '}
              LP is locked with flokifi for 8 more months
            </div>
          );
        } else {
          lpLockInfo.push(
            <div key='lp-warning'>⚠️ No liquidity lock found ⚠️</div>
          );
        }
      }

      message = (
        <>
          <div className='quote-content-header'>
            <div>
              {data?.token_name || 'Not Specified'} (
              {data?.token_symbol || 'Not Specified'})
            </div>
            <div>
              Buy:{''} {formatPercent(data.buy_tax || 0)} / Sell:{' '}
              {formatPercent(data.sell_tax || 0)}
            </div>
          </div>
          {lpLockInfo}{' '}
          <div className='flex-wrap'>
            {' '}
            <div
              className={`quick-box ${
                data.is_open_source === '1' ? '' : 'red-tag'
              }`}>
              {data.is_open_source === '1' ? <ShieldIcon /> : <CloseIcon />}{' '}
              Verified Contract
            </div>
            <div
              className={`quick-box ${
                data.owner_address ===
                '0x0000000000000000000000000000000000000000'
                  ? ''
                  : 'red-tag'
              }`}>
              {data.owner_address ===
              '0x0000000000000000000000000000000000000000' ? (
                <ShieldIcon />
              ) : (
                <CloseIcon />
              )}{' '}
              Owner Renounce
            </div>
            {/*             <div
              className={`quick-box ${
                data.hidden_owner === '0' ? '' : 'red-tag'
              }`}>
              {data.hidden_owner === '0' ? <ShieldIcon/> : <CloseIcon/>} Fake Renounce
            </div> */}
            {data.owner_address !==
              '0x0000000000000000000000000000000000000000' && (
              <>
                <div
                  className={`quick-box ${
                    data.is_proxy === '0' ? '' : 'red-tag'
                  }`}>
                  {data.is_proxy === '0' ? <ShieldIcon /> : <CloseIcon />} Proxy
                  Contract
                </div>
                <div
                  className={`quick-box ${
                    data.is_blacklisted === '0' ? '' : 'red-tag'
                  }`}>
                  {data.is_blacklisted === '0' ? <ShieldIcon /> : <CloseIcon />}{' '}
                  Blacklist
                </div>

                <div
                  className={`quick-box ${
                    data.transfer_pausable === '0' ? '' : 'red-tag'
                  }`}>
                  {data.transfer_pausable === '0' ? (
                    <ShieldIcon />
                  ) : (
                    <CloseIcon />
                  )}{' '}
                  Transfer Pause
                </div>
                <div
                  className={`quick-box ${
                    data.is_mintable === '0' ? '' : 'red-tag'
                  }`}>
                  {data.is_mintable === '0' ? <ShieldIcon /> : <CloseIcon />}{' '}
                  Mintable
                </div>
                <div
                  className={`quick-box ${
                    data.slippage_modifiable === '0' ? '' : 'red-tag'
                  }`}>
                  {data.slippage_modifiable === '0' ? (
                    <ShieldIcon />
                  ) : (
                    <CloseIcon />
                  )}{' '}
                  Tax Change
                </div>
                <div
                  className={`quick-box ${
                    data.is_honeypot === '0' ? '' : 'red-tag'
                  }`}>
                  {data.is_honeypot === '0' ? <ShieldIcon /> : <CloseIcon />}{' '}
                  Honeypot Simulation
                </div>
              </>
            )}
          </div>{' '}
        </>
      );
    } catch (error) {
      console.error(error);
      return null;
    }

    return message;
  }
  function FullAudit({contractAddress, provider}) {
    const [showFullAudit, setShowFullAudit] = useState(null);
    const [data, setData] = useState(<div className='loader'></div>);
    useEffect(() => {
      const quoteContainer = document.querySelector('.quote-container');
      if (showFullAudit) {
        quoteContainer.style.minHeight = '400px';
      } else {
        quoteContainer.style.minHeight = '';
      }
    }, [showFullAudit]);
    // Function to toggle the audit visibility
    async function performAudit() {
      setShowFullAudit(true);
      const code = await getCode(contractAddress);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Send JWT token in the Authorization header
        },
        body: JSON.stringify({
          contractCode: code,

          contractAddress,
        }),
      });

      if (!response.ok) {
        // Handle error
        console.error('Failed to analyze contract');
        return;
      }

      const data = await response.json();
      setData(data.report); // Assuming you have a setData function to update your state
    }

    async function getCode(contractAddress) {
      const code = await provider.getCode(contractAddress);
      return code;
    }
    function AuditReport({contractAddress, provider}) {
      return (
        <div className='audit-container'>
          <div className='audit-content' style={{whiteSpace: 'pre-wrap'}}>
            {data}
          </div>
          <div className='audit-button' onClick={() => setShowFullAudit(false)}>
            Close
          </div>
        </div>
      );
    }

    if (!showFullAudit && scanMessage) {
      return (
        <div className='audit-button' onClick={() => performAudit()}>
          <div className='audit-button-text'>Code AI Audit</div>
        </div>
      );
    } else if (showFullAudit) {
      return (
        <AuditReport contractAddress={contractAddress} provider={provider} />
      );
    }
  }

  return (
    <div className='general-box'>
      {/*       <ContractLinks provider={provider} contractAddress={contractAddress} />{' '}
       */}{' '}
      <div className='beta-badge'>Beta</div>
      {!scanMessage && (
        <div className='loader loader11'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {scanMessage && <div className='quote-content'> {scanMessage}</div>}
      {/*       <FullAudit contractAddress={contractAddress} provider={provider} />{' '}
       */}{' '}
    </div>
  );
}

export default Audit;

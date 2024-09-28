import {BlockchainContext} from './BlockchainContext';
import {use, useContext, useEffect, useState} from 'react';

function SwapFeeCompare() {
  const {saverInputAmount, savedInputAmount} = useContext(BlockchainContext);
  const [sellAmount, setSellAmount] = useState(0);

  useEffect(() => {
    const handle = setInterval(() => {
      const dollarInputAmount = Number(saverInputAmount.current);
      const youPayAmount = Number(savedInputAmount.current);

      if ((youPayAmount == 0 || youPayAmount == null) && sellAmount !== 0) {
        setSellAmount(0);
        saverInputAmount.current = 0;
        console.log('youPayAmount:', youPayAmount);
      }

      if (dollarInputAmount !== 0 && dollarInputAmount !== sellAmount) {
        setSellAmount(dollarInputAmount);
        console.log('dollarInputAmount:', dollarInputAmount);
        console.log('sellAmount:', sellAmount);
      }
      if (dollarInputAmount === 0 && sellAmount !== 0) {
        setSellAmount(0);
        console.log('dollarInputAmount:', dollarInputAmount);
      }
    }, 1000);
    return () => clearInterval(handle);
  }, [sellAmount]);

  function SwapFeeItem({name, percentage}) {
    const actualPercentage = percentage / 10; // 0.6 becomes 0.06 i.e 0.6%
    const dollarValue = sellAmount;
    let amountSaved = dollarValue * actualPercentage;
    amountSaved = amountSaved.toFixed(2);

    return (
      <div className='swap-fee-item'>
        <div className='swap-fee-box-left'>
          {' '}
          {/*           <div className='swap-fee-item-name'>Cost</div>
           */}{' '}
          <div className='swap-fee-amount'>${amountSaved}</div>
        </div>
        <div className='swap-fee-box-right'>
          {' '}
          <div className='swap-fee-item-percentage'>{percentage}%</div>
          <div className='swap-fee-item-name'>{name}</div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (sellAmount !== 0) {
      const swapFeeContainer = document.querySelector('.swap-fee-container');
      setTimeout(() => {
        swapFeeContainer.style.opacity = 1;
      }, 100);
    }
  }, [sellAmount]);

  if (sellAmount === 0) {
    return <></>;
  }

  return (
    <div className='swap-fee-container'>
      <div className='swap-fee-title'>Swap Fee Comparison</div>
      <div className='swap-fee-text'>
        Unlike our competitors, we {"don't"} charge any fees, below are examples
        of how much you save by using Phenx.
      </div>
      <div className='swap-fee-item'>
        <div className='swap-fee-box-left'>
          {' '}
          <div className='swap-fee-amount'>$0</div>
        </div>
        <div className='swap-fee-box-right'>
          {' '}
          <div className='swap-fee-item-percentage'>0%</div>
          <div className='phenx'>Phenx</div>
        </div>
      </div>{' '}
      <SwapFeeItem name='Maestro' percentage={1} />
      <SwapFeeItem name='Coinbase' percentage={0.6} />
      <SwapFeeItem name='BananaGun' percentage={0.5} />
      <SwapFeeItem name='Uniswap' percentage={0.25} />
    </div>
  );
}

export default SwapFeeCompare;

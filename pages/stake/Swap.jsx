/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* use client */
import {useState, useEffect, useContext, useRef, useMemo, use} from 'react';
import {ethers} from 'ethers';
import {StakeContext} from '../../stake-page/StakeContext';
import {toast} from 'react-toastify';
import IconLinks from './IconLinks';
import DollarValue from './DollarValue';
import NavBar from '../../components/NavBar';
import FooterBar from '../../components/Footer';

import WalletIcon from './WalletIcon';
import CountUp from 'react-countup';
const Swap = () => {
  const {
    signer,
    provider,
    account,
    stakeData,
    tokenContract,
    stakeContract,
    resetData,
    chainId,
  } = useContext(StakeContext);
  function disableSwapContainer() {
    try {
      const swapContainer = document.querySelector('.StakingCard');
      if (swapContainer) {
        swapContainer.classList.add('disable');
      } else {
        throw new Error('Swap container not found');
      }
    } catch (error) {
      //   console.error('Error disabling swap container:', error);
      // Handle the error as appropriate for your application
    }
  }

  function enableSwapContainer() {
    try {
      const swapContainer = document.querySelector('.StakingCard');
      if (swapContainer) {
        swapContainer.classList.remove('disable');
      } else {
        throw new Error('Swap container not found');
      }
    } catch (error) {
      //   console.error('Error enabling swap container:', error);
      // Handle the error as appropriate for your application
    }
  }
  const [StakeData, setStakeData] = useState(stakeData);
  useEffect(() => {
    setStakeData(stakeData);
  }, [stakeData]);

  useEffect(() => {
    const stakeContainer = document.querySelector('.stake-container');
    //  stakeContainer.style.height = '85vh';
    stakeContainer.style.opacity = '1';
  }, []);

  function StakingCard() {
    const [activeTab, setActiveTab] = useState('stake');

    return (
      <div className='StakingCard'>
        <div className='tabs'>
          <div
            className={activeTab === 'stake' ? 'tab Tactive' : 'tab'}
            onClick={() => setActiveTab('stake')}>
            Stake
          </div>
          <div
            className={activeTab === 'withdraw' ? 'tab Tactive' : 'tab'}
            onClick={() => setActiveTab('withdraw')}>
            Withdraw
          </div>
          <div
            className={activeTab === 'claim' ? 'tab Tactive' : 'tab'}
            onClick={() => setActiveTab('claim')}>
            Claim
          </div>
        </div>
        {activeTab === 'stake' && <DepositSection />}
        {activeTab === 'withdraw' && <WithdrawSection />}
        {activeTab === 'claim' && <ClaimSection />}
      </div>
    );
  }

  function DepositSection() {
    const depositRef = useRef(null);
    async function handleDeposit() {
      try {
        disableSwapContainer();
        console.log('handleDeposit called');
        const decimals = await tokenContract.decimals();
        console.log('decimals:', decimals);
        let value = depositRef.current.value;
        if (!value) {
          toast.error('Please enter a value');
          return;
        }
        value = String(value);
        value = ethers.parseUnits(value, decimals);
        console.log('value:', value);
        const userBalance = await tokenContract.balanceOf(account);
        console.log('userBalance:', userBalance);
        let amountToDepositBI = 0n;

        if (value > userBalance) {
          amountToDepositBI = userBalance;
        } else {
          amountToDepositBI = value;
        }
        console.log('stakeContract.target:', stakeContract);
        const allowance = await tokenContract.allowance(
          account,
          stakeContract.target
        );
        const tenTokens = ethers.parseUnits('10', decimals);
        console.log('allowance:', allowance);
        console.log('amountToDepositBI:', amountToDepositBI);

        if (allowance >= amountToDepositBI) {
          try {
            console.log('calling stakeContract.deposit');
            const tx = await stakeContract
              .connect(signer)
              .deposit(amountToDepositBI);
            console.log('tx:', tx);
            toast.info('Depositing...');
            await tx.wait();
            toast.success('Deposited');
            resetData();
          } catch (error) {
            console.error('Error depositing:', error);
            console.error(error.stack);
            //      toast.error('Error depositing');
            resetData();
          }
        } else {
          try {
            toast.info('Please Approve First');
            console.log('calling tokenContract.approve');
            const amountPlus10 = amountToDepositBI + tenTokens;
            const tx = await tokenContract
              .connect(signer)
              .approve(stakeContract.target, amountPlus10);
            console.log('tx:', tx);
            toast.info('Approving...');
            await tx.wait();
            toast.success('Approved');
          } catch (error) {
            console.error('Error approving:', error);
            console.error(error.stack);
            //     toast.error('Error approving');
          }
        }
      } catch (error) {
        console.error('Error depositing:', error);
        console.error(error.stack);
      } finally {
        enableSwapContainer();
      }
    }
    async function handleMax() {
      try {
        let userBalance = await tokenContract.balanceOf(account);
        let decimals = await tokenContract.decimals();
        userBalance = ethers.formatUnits(userBalance, decimals);
        userBalance = parseFloat(userBalance).toFixed(0);
        userBalance = parseFloat(userBalance);

        depositRef.current.value = userBalance;
      } catch (error) {
        console.error('Error getting user balance:', error);
      }
    }

    function handleInputAmountChange(amount) {
      depositRef.current.value = amount;
    }

    return (
      <div className='flex-col'>
        <div className='token-input-box'>
          <div className='flex-row'>
            <div className='small-text'>You Deposit</div>
            <div className='small-text'></div>
          </div>
          <div className='flex-row'>
            <input
              className='token-input'
              placeholder='0.0'
              type='number'
              ref={depositRef}
              onChange={(e) => handleInputAmountChange(e.target.value)}
            />
            <div
              className='token-select-box'
              //       onClick={() => setShowTokenList('sellToken')}
            >
              <img
                src={'/logo.png'}
                width={25}
                height={25}
                style={{borderRadius: '50%'}}
              />{' '}
              <div className='med-text'>PhenX</div>
            </div>
          </div>
          <div className='flex-row'>
            <div className='small-text'>
              {' '}
              {/*               <DollarValue Token={ALL_TOKENS[sellToken]} />
               */}{' '}
            </div>
            <div className='small-text'>
              <div className='max-row'>
                <div className='max-button' onClick={handleMax}>
                  MAX
                </div>
                <WalletIcon />
                {StakeData.userBalance}
              </div>
            </div>
          </div>
        </div>
        <div className='swap-button' onClick={handleDeposit}>
          Approve / Stake
        </div>
      </div>
    );
  }
  function WithdrawSection() {
    async function handleWithdraw() {
      try {
        console.log('calling stakeContract.withdraw');
        const tx = await stakeContract.connect(signer).withdraw();
        console.log('tx:', tx);
        toast.info('Withdrawing...');
        await tx.wait();
        toast.success('Withdrew');
      } catch (error) {
        console.error('Error withdrawing:', error);
        console.error(error.stack);
      } finally {
        enableSwapContainer();
        resetData();
      }
    }
    async function handleEmergencyWithdraw() {
      try {
        console.log('calling stakeContract.emergencyWithdraw');
        const tx = await stakeContract.connect(signer).emergencyWithdraw();
        console.log('tx:', tx);
        toast.info('Withdrawing...');
        await tx.wait();
        toast.success('Withdrew');
      } catch (error) {
        console.error('Error withdrawing:', error);
        console.error(error.stack);
      } finally {
        enableSwapContainer();
        resetData();
      }
    }
    const [canWithdraw, setCanWithdraw] = useState(false);
    async function checkCanWithdraw() {
      try {
        let unlockEpoch = await stakeContract.holderUnlockTime(account);
        unlockEpoch = Number(unlockEpoch);
        console.log('unlockEpoch:', unlockEpoch);
        const currentEpoch = Math.floor(Date.now() / 1000);
        console.log('currentEpoch:', currentEpoch);
        const canWithdraw = unlockEpoch < currentEpoch;
        console.log('canWithdraw:', canWithdraw);
        setCanWithdraw(canWithdraw);
      } catch (error) {
        /*         console.error('Error checking can withdraw:', error);
        console.error(error.stack);
 */
      }
    }

    useEffect(() => {
      checkCanWithdraw();
    }, [StakeData.userStakedAmount]);

    return (
      <div className='flex-col'>
        <div className='token-input-box'>
          {' '}
          <div className='flex-row'>
            <div className='small-text'>Staked Balance</div>
            <div className='small-text'></div>
          </div>
          <div className='flex-row'>
            <input
              className='token-input'
              placeholder={StakeData.userStakedAmount}
              type='number'
              readOnly={StakeData.userStakedAmount}
              //       ref={inputRef}
              //      onChange={(e) => handleInputAmountChange(e.target.value)}
            />
            <div
              className='token-select-box'
              //       onClick={() => setShowTokenList('sellToken')}
            >
              <img
                src={'/logo.png'}
                width={25}
                height={25}
                style={{borderRadius: '50%'}}
              />{' '}
              <div className='med-text'>PhenX</div>
            </div>
          </div>
          <div className='flex-row'>
            <div className='small-text'>
              {' '}
              {/*               <DollarValue Token={ALL_TOKENS[sellToken]} />
               */}{' '}
              <DollarValue tokenAmount={StakeData.userStakedAmount} />
            </div>
            <div className='small-text'>
              <div className='max-row'>
                {/*                 <div className='max-button'>MAX</div>
                 */}{' '}
                <WalletIcon />
                {StakeData.userBalance}
              </div>
            </div>
          </div>
        </div>
        <div className='general-box'>
          {' '}
          {StakeData.holderUnlockTime !== '01/01/1970, 01:00:00' && (
            <div className='small-text'>
              Your early no-penalty unlock date is {StakeData.holderUnlockTime}.
              If you wish to withdraw staked funds before this date, you will
              incur a fee.
            </div>
          )}
        </div>
        {canWithdraw && StakeData.userStakedAmount !== 0 && (
          <div className='swap-button' onClick={handleWithdraw}>
            Withdraw
          </div>
        )}
        {!canWithdraw && (
          <div className={'swap-button'} onClick={handleEmergencyWithdraw}>
            Emergency Withdraw
          </div>
        )}
      </div>
    );
  }
  function ClaimSection() {
    async function handleClaim() {
      try {
        disableSwapContainer();

        const allowance = await tokenContract.allowance(
          account,
          stakeContract.target
        );
        const decimals = await tokenContract.decimals();

        const oneToken = ethers.parseUnits('1', decimals);
        const tenTokens = ethers.parseUnits('10', decimals);

        if (allowance >= oneToken) {
          try {
            console.log('calling stakeContract.deposit');
            const tx = await stakeContract.connect(signer).deposit(1n);
            console.log('tx:', tx);
            toast.info('Claiming...');
            await tx.wait();
            toast.success('Claimed');
          } catch (error) {
            console.error('Error Claiming:', error);
            console.error(error.stack);
            //       toast.error('Error Claiming');
          }
        } else {
          try {
            const tx = await tokenContract
              .connect(signer)
              .approve(stakeContract.target, tenTokens);
            console.log('tx:', tx);
            toast.info('Approving...');
            await tx.wait();
            toast.success('Approved');
          } catch (error) {
            console.error('Error approving:', error);
            console.error(error.stack);
            //     toast.error('Error approving');
          }
        }
      } catch (error) {
        console.error('Error depositing:', error);
        console.error(error.stack);
      } finally {
        enableSwapContainer();
        resetData();
      }
    }
    return (
      <div className='flex-col'>
        <div className='token-input-box'>
          <div className='flex-row'>
            <div className='small-text'>Pending Rewards</div>
            <div className='small-text'></div>
          </div>
          <div className='flex-row'>
            <input
              className='token-input'
              placeholder={StakeData.pendingRewards}
              type='number'
              readOnly={StakeData.pendingRewards}
              //       ref={inputRef}
              //      onChange={(e) => handleInputAmountChange(e.target.value)}
            />
            <div
              className='token-select-box'
              //       onClick={() => setShowTokenList('sellToken')}
            >
              <img
                src={'/logo.png'}
                width={25}
                height={25}
                style={{borderRadius: '50%'}}
              />{' '}
              <div className='med-text'>PhenX</div>
            </div>
          </div>
          <div className='flex-row'>
            <div className='small-text'>
              {' '}
              {/*               <DollarValue Token={ALL_TOKENS[sellToken]} />
               */}{' '}
              <DollarValue tokenAmount={StakeData.pendingRewards} />
            </div>
            <div className='small-text'>
              <div className='max-row'>
                {/*                 <div className='max-button'>MAX</div>
                 */}{' '}
                <WalletIcon />
                {StakeData.userBalance}
              </div>
            </div>
          </div>
        </div>
        <div className='swap-button' onClick={handleClaim}>
          Claim
        </div>
      </div>
    );
  }

  /*   function estimateRemainingRewardDays() {
    const apy = Number(StakeData.apy) / 100; // 30% -> 0.3
    const totalStaked = Number(StakeData.totalStaked);
    const totalRewards = Number(StakeData.remainingRewards);
    const dailyRewards = (apy * totalStaked) / 365; // 365 days in a year
    const remainingDays = totalRewards / dailyRewards;
    console.log('remainingDays:', remainingDays);
    return remainingDays.toFixed(0);
  } */

  const isEth = chainId === 1;
  return (
    <div className='whole-container'>
      <NavBar />
      {/*       <Dev />
       */}{' '}
      <div className='bg' />{' '}
      {!isEth && (
        <div className='wrong-network-container'>
          {' '}
          <div className='wrong-network-text'> Please switch to ETH</div>{' '}
          <w3m-network-button />
        </div>
      )}
      <div className={`stake-container ${isEth ? '' : 'blur'}`}>
        {' '}
        <div className='main-left'>
          <div className='large-title'>
            Stake PhenX <br /> Earn rewards{' '}
          </div>{' '}
          <div className='small-text'>
            This staking platform presents a great chance for earning passive
            income, offering an attractive annual yield of 30%. To fully
            benefit, tokens need to be locked for a minimum of 30 days. Early
            withdrawals incur a 30% penalty on the staked tokens. No fees are
            charged for depositing or withdrawing, provided the 30-day lock
            period is adhered to.{' '}
          </div>{' '}
          <div className='wrap-infos'>
            <div className='info-box'>
              <div className='info-box-title'>APR </div>
              <CountUp
                start={0}
                end={30}
                duration={5}
                useEasing={true}
                suffix=' %'
              />{' '}
            </div>
            <div className='info-box'>
              <div className='info-box-title'>Total Staked </div>
              <div className='row'>
                <CountUp
                  start={0}
                  end={((StakeData.totalStaked / 1000000) * 100).toFixed(2)}
                  duration={5}
                  useEasing={true}
                  separator=' '
                  decimal='.'
                  decimalPlaces={2}
                  prefix=''
                  suffix=' %'
                />{' '}
              </div>{' '}
            </div>{' '}
            {/*             <div className='info-box'>
              <div className='info-box-title'>Stakers </div>0{' '}
            </div>{' '}
 */}{' '}
            <div className='info-box'>
              <div className='info-box-title'>Earning Token </div>
              PhenX
            </div>{' '}
            <div className='info-box'>
              <div className='info-box-title'>Pool Rewards </div>
              <CountUp
                start={0}
                end={StakeData.remainingRewards}
                duration={5}
                useEasing={true}
                separator=','
              />{' '}
            </div>
            <div className='info-box'>
              <div className='info-box-title'>Lock Duration </div>1 Month
            </div>{' '}
            <div className='info-box'>
              <div className='info-box-title'>Early Exit Fee </div>
              <CountUp
                start={0}
                end={30}
                duration={5}
                useEasing={true}
                separator=','
                suffix=' %'
              />{' '}
            </div>{' '}
          </div>
        </div>
        <div className='main-right'>
          <StakingCard />
        </div>
      </div>{' '}
      <FooterBar />
    </div>
  );
};

export default Swap;

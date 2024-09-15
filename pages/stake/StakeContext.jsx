import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import {ethers} from 'ethers';

import ERC20ABI from './abis/erc20.json';
import stakeABI from './abis/stakeABI.json';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from '@web3modal/ethers/react';
import {BrowserProvider, Contract, formatUnits} from 'ethers';
import {CHAINS} from '../../components/lib/constants';
export const StakeContext = createContext({});

export const StakeProvider = ({children}) => {
  const {address: account, chainId, isConnected} = useWeb3ModalAccount();
  const {walletProvider} = useWeb3ModalProvider();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const tokenContractAddress = '0xd166b7D9824cc5359360B47389AbA9341cE12619';
  const stakeContractAddress = '0xf10b6E95B103f0e06AFB682b170e94162Cfc8dD6';
  // const tokenContractAddress = '0x19968574013275Ab1BA4e0f26E8aaF45cA89B8a7';
  // const stakeContractAddress = '0x5778A71EeBc78A4db6de144755d9b8427C95D6dD';

  const [stakeContract, setStakeContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(() => {
    const setupProvider = async () => {
      if (walletProvider) {
        try {
          // Initialize ethers provider using the walletProvider
          const ethersProvider = new BrowserProvider(walletProvider);
          console.log('Ethers provider:', ethersProvider);
          /*           const providerRPC = CHAINS[1].rpcUrl;

          const provider = new ethers.JsonRpcProvider(providerRPC);
          console.log('Provider:', provider); */

          // Get the signer from the ethers provider
          const signer = await ethersProvider.getSigner();

          setSigner(signer);
          setProvider(ethersProvider);
        } catch (error) {
          console.error('Error setting up provider and signer:', error);
        }
      }
    };

    setupProvider(); // Call the async function
  }, [walletProvider, account]);
  useEffect(() => {
    const init = async () => {
      if (!stakeContract && !tokenContract && provider) {
        await initContracts();
      }
    };
    init();
  }, [account, stakeContract, tokenContract, provider]);

  let isInit = false;
  async function initContracts() {
    if (isInit) {
      return;
    }

    isInit = true;
    if (stakeContract && tokenContract) {
      console.log('Contracts already initialized');
      return;
    }
    console.log('Initializing contracts...');
    console.log('Account:', account);

    try {
      const _stakeContract = new ethers.Contract(
        stakeContractAddress,
        stakeABI,
        provider
      );

      const _tokenContract = new ethers.Contract(
        tokenContractAddress,
        ERC20ABI,
        provider
      );

      setStakeContract(_stakeContract);
      setTokenContract(_tokenContract);
      await delay(1000);
    } catch (error) {
      console.error('Error initializing contracts:', error);
    } finally {
      console.log('Contracts initialized');
      isInit = false;
    }
  }
  const [tokenData, setTokenData] = useState({
    symbol: '',
    userBalanceWei: 0,
    userBalance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (stakeContract && tokenContract && provider) {
        console.log('stakeContract', stakeContract);
        await initTokenData();
        await initStakeData();
      }
    };
    fetchData();
  }, [account, stakeContract, tokenContract, provider]);

  async function initTokenData() {
    const symbol = await tokenContract.symbol();
    const userBalanceWei = await tokenContract.balanceOf(account);
    const decimals = await tokenContract.decimals();
    const userBalance = ethers.formatUnits(decimals, 18);
    setTokenData({
      symbol,
      userBalanceWei,
      userBalance,
      decimals,
    });
    console.log('Token data:', tokenData);
  }
  const [stakeData, setStakeData] = useState({
    apy: 0,
    earlyExit: 0,
    totalStaked: 0,
    remainingRewards: 0,
    lockDuration: 30,
    holderUnlockTime: 0, //epoch
    pendingRewardsWei: 0,
    pendingRewards: 0,
  });
  async function initStakeData() {
    const apy = await getApy();
    const earlyExit = await getEarlyExit();
    const TotalStaked = await getTotalStaked();
    const RemainingRewards = await getRemainingRewards();
    //  const LockDuration = await getLockDuration();
    const HolderUnlockTime = await getHolderUnlockTime();
    const PendingRewardsWei = await getPendingRewardsWei();
    const PendingRewards = await getPendingRewards();
    const UserBalanceWei = await getUserBalanceWei();
    const UserBalance = await getUserBalance();
    const UserStakedAmount = await getUserStakedAmount();
    const UserStakedAmountWei = await getUserStakedAmountWei();
    const UserRewardDebt = await getUserRewardDebt();
    const UserRewardDebtWei = await getUserRewardDebtWei();

    let data = {
      apy: apy,
      earlyExit: earlyExit,
      totalStaked: TotalStaked,
      remainingRewards: RemainingRewards,
      lockDuration: 30,
      holderUnlockTime: HolderUnlockTime,
      pendingRewardsWei: PendingRewardsWei,
      pendingRewards: PendingRewards,
      userBalance: UserBalance,
      userBalanceWei: UserBalanceWei,
      userStakedAmount: UserStakedAmount,
      userStakedAmountWei: UserStakedAmountWei,
      userRewardDebt: UserRewardDebt,
      userRewardDebtWei: UserRewardDebtWei,
    };

    setStakeData(data);
    console.log('Stake data:', data);
  }
  async function resetData() {
    initTokenData();
    initStakeData();
  }
  async function getApy() {
    let apy = 0;
    try {
      apy = await stakeContract.apy();
      return Number(apy);
    } catch (error) {
      console.error('Error getting APY:', error);
      return 0;
    }
  }

  async function getEarlyExit() {
    let earlyExit = 0;
    try {
      earlyExit = await stakeContract.exitPenaltyPerc();
      return earlyExit;
    } catch (error) {
      console.error('Error getting early exit:', error);
      return 0;
    }
  }

  async function getTotalStaked() {
    let totalStaked = 0;
    try {
      totalStaked = await stakeContract.totalStaked();
      const decimals = await tokenContract.decimals();

      totalStaked = ethers.formatUnits(totalStaked, decimals);
      totalStaked = parseFloat(totalStaked).toFixed(0);
      return totalStaked;
    } catch (error) {
      console.error('Error getting total staked:', error);
      return 0;
    }
  }

  async function getRemainingRewards() {
    let remainingRewards = 0;
    try {
      const decimals = await tokenContract.decimals();

      remainingRewards = await stakeContract.rewardsRemaining();
      remainingRewards = ethers.formatUnits(remainingRewards, decimals);
      remainingRewards = parseFloat(remainingRewards).toFixed(0);
      return remainingRewards;
    } catch (error) {
      console.error('Error getting remaining rewards:', error);
      return 0;
    }
  }

  async function getHolderUnlockTime() {
    let holderUnlockTime = 0;
    try {
      holderUnlockTime = await stakeContract.holderUnlockTime(account);
      // epoch to date
      holderUnlockTime = new Date(Number(holderUnlockTime) * 1000);
      holderUnlockTime = holderUnlockTime.toLocaleString();

      return holderUnlockTime;
    } catch (error) {
      console.error('Error getting holder unlock time:', error);
      return 0;
    }
  }

  async function getPendingRewardsWei() {
    let pendingRewardsWei = 0;
    try {
      pendingRewardsWei = await stakeContract.pendingReward(account);
      return pendingRewardsWei;
    } catch (error) {
      console.error('Error getting pending rewards:', error);
      return 0;
    }
  }

  async function getPendingRewards() {
    let pendingRewards = 0;
    try {
      let pendingRewardsWei = await stakeContract.pendingReward(account);
      const decimals = await tokenContract.decimals();

      pendingRewards = ethers.formatUnits(pendingRewardsWei, decimals);
      pendingRewards = parseFloat(pendingRewards).toFixed(9);
      return pendingRewards;
    } catch (error) {
      console.error('Error getting pending rewards:', error);
      return 0;
    }
  }

  async function getUserBalanceWei() {
    let userBalanceWei = 0;
    try {
      userBalanceWei = await tokenContract.balanceOf(account);
      return userBalanceWei;
    } catch (error) {
      console.error('Error getting user balance:', error);
      return 0;
    }
  }

  async function getUserBalance() {
    let userBalance = 0;
    try {
      let userBalanceWei = await tokenContract.balanceOf(account);
      const decimals = await tokenContract.decimals();

      userBalance = ethers.formatUnits(userBalanceWei, decimals);
      userBalance = parseFloat(userBalance).toFixed(0);
      return userBalance;
    } catch (error) {
      console.error('Error getting user balance:', error);
      return 0;
    }
  }

  async function getUserStakedAmountWei() {
    let userStakedAmountWei = 0;
    try {
      userStakedAmountWei = await stakeContract.userInfo(account);
      return userStakedAmountWei[0];
    } catch (error) {
      console.error('Error getting user staked amount:', error);
      return 0;
    }
  }

  async function getUserStakedAmount() {
    let userStakedAmount = 0;
    try {
      let userStakedAmountWei = await stakeContract.userInfo(account);
      const decimals = await tokenContract.decimals();

      userStakedAmount = ethers.formatUnits(userStakedAmountWei[0], decimals);
      userStakedAmount = parseFloat(userStakedAmount).toFixed(0);
      userStakedAmount = parseFloat(userStakedAmount);
      return userStakedAmount;
    } catch (error) {
      console.error('Error getting user staked amount:', error);
      return 0;
    }
  }
  async function getUserRewardDebtWei() {
    let userRewardDebtWei = 0;
    try {
      userRewardDebtWei = await stakeContract.userInfo(account);
      return userRewardDebtWei[1];
    } catch (error) {
      console.error('Error getting user reward debt:', error);
      return 0;
    }
  }

  async function getUserRewardDebt() {
    let userRewardDebt = 0;
    try {
      let userRewardDebtWei = await stakeContract.userInfo(account);
      const decimals = await tokenContract.decimals();

      userRewardDebt = ethers.formatUnits(userRewardDebtWei[1], decimals);
      userRewardDebt = parseFloat(userRewardDebt).toFixed(0);
      return userRewardDebt;
    } catch (error) {
      console.error('Error getting user reward debt:', error);
      return 0;
    }
  }

  return (
    <StakeContext.Provider
      value={{
        provider,
        account,
        signer,
        tokenData,
        stakeData,
        tokenContract,
        stakeContract,
        resetData,
      }}>
      {children}
    </StakeContext.Provider>
  );
};

StakeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* eslint-disable react-hooks/exhaustive-deps */

import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import StakeABI from './StakeABI.json'

const RPC = process.env.REACT_APP_QUICKNODE_MAINNET_RPC_URL
const ABI = StakeABI
const stakeAddress = '0xd6A07b8065f9e8386A9a5bBA6A754a10A9CD1074'
const poolId = 78
const provider = new ethers.providers.JsonRpcProvider(RPC)

const ERC20ABI = [
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint)',
  'function approve(address spender, uint amount) external returns (bool)',
]

async function initStakeData() {
  const stakeContract = new ethers.Contract(stakeAddress, ABI, provider)
  const stakeData = await stakeContract.poolInfo(poolId)

  const poolInfo = {
    stakingTokenAddress: stakeData.stakingToken,
    rewardTokenAddress: stakeData.rewardToken,
    //   lastRewardTimestamp: stakeData.lastRewardTimestamp.toString(),
    accTokenPerShare: stakeData.accTokenPerShare.toString(),
    startTime: stakeData.startTime.toString(),
    endTime: stakeData.endTime.toString(),
    precision: stakeData.precision.toString(),
    totalStaked: stakeData.totalStaked.toString(),
    totalReward: stakeData.totalReward.toString(),
    ownerAddress: stakeData.owner,
  }

  return poolInfo
}

async function formatStakeData(account) {
  const poolInfo = await initStakeData()
  const epochStartDate = poolInfo.startTime
  console.log('epochStartDate', epochStartDate)
  const currentEpoch = Math.floor(Date.now() / 1000)
  console.log('currentEpoch', currentEpoch)
  const epochEndDate = poolInfo.endTime
  console.log('epochEndDate', epochEndDate)

  const stakeTokenContract = new ethers.Contract(poolInfo.stakingTokenAddress, ERC20ABI, provider)
  const userLPBalance = await stakeTokenContract.balanceOf(account)
  const rewardTokenContract = new ethers.Contract(poolInfo.rewardTokenAddress, ERC20ABI, provider)
  const stakeTokenDecimals = await stakeTokenContract.decimals()
  console.log('stakeTokenDecimals', stakeTokenDecimals)
  const rewardTokenDecimals = await rewardTokenContract.decimals()
  console.log('rewardTokenDecimals', rewardTokenDecimals)
  let rewardsInStakeContract = poolInfo.totalReward
  rewardsInStakeContract = ethers.utils.formatUnits(rewardsInStakeContract, rewardTokenDecimals)
  console.log('rewardsInStakeContract', rewardsInStakeContract)
  let remainingTokenRewards = await rewardTokenContract.balanceOf(stakeAddress)
  remainingTokenRewards = ethers.utils.formatUnits(remainingTokenRewards, rewardTokenDecimals)
  console.log('remainingTokenRewards', remainingTokenRewards)
  let totalLpSupply = await stakeTokenContract.totalSupply()
  totalLpSupply = ethers.utils.formatUnits(totalLpSupply, stakeTokenDecimals)
  console.log('totalLpSupply', totalLpSupply)
  let stakeContractLpBalance = await stakeTokenContract.balanceOf(stakeAddress)
  stakeContractLpBalance = ethers.utils.formatUnits(stakeContractLpBalance, stakeTokenDecimals)
  let percentOfLpInStakeContract = (stakeContractLpBalance / totalLpSupply) * 100
  console.log('percentOfLpInStakeContract', percentOfLpInStakeContract)
  // 1.7% ATM
  let totalSupplyRewardToken = await rewardTokenContract.totalSupply()
  totalSupplyRewardToken = ethers.utils.formatUnits(totalSupplyRewardToken, rewardTokenDecimals)
  console.log('totalSupplyRewardToken', totalSupplyRewardToken)
  let totalTokensCalFromLpPercent = (totalSupplyRewardToken * percentOfLpInStakeContract) / 100
  console.log('totalTokensCalFromLpPercent', totalTokensCalFromLpPercent)

  const totalStake = parseFloat(totalTokensCalFromLpPercent)
  const totalRewards = parseFloat(remainingTokenRewards)
  const epochsInYear = 52.17

  let apr = (totalRewards / totalStake) * epochsInYear * 100 * 12
  apr = apr.toFixed(2)

  console.log('APR:', apr)
  let totalRewardformatted = ethers.utils.formatUnits(poolInfo.totalReward, rewardTokenDecimals)
  totalRewardformatted = Number(totalRewardformatted).toFixed(2)

  const stakeContract = new ethers.Contract(stakeAddress, ABI, provider)
  const userInfo = await stakeContract.userInfo(account, poolId)
  console.log('userInfo', userInfo)
  let amount = userInfo.amount
  amount = Number(amount)
  console.log('amount', amount)
  let userStakedLP
  let userPendingRewards
  if (amount) {
    userStakedLP = ethers.utils.formatUnits(amount, stakeTokenDecimals)
    userPendingRewards = await stakeContract.pendingReward(account, poolId)
    userPendingRewards = ethers.utils.formatUnits(userPendingRewards, rewardTokenDecimals)
    userPendingRewards = Number(userPendingRewards).toFixed(4)
  } else {
    userStakedLP = 0
    userPendingRewards = 0
  }

  const formattedPoolInfo = {
    apr,
    startTime: new Date(parseInt(poolInfo.startTime) * 1000).toLocaleString(),
    endTime: new Date(parseInt(poolInfo.endTime) * 1000).toLocaleString(),
    totalReward: totalRewardformatted,
    remainingTokenRewards: Number(remainingTokenRewards - 100).toFixed(2),
    lpPercentStaked: percentOfLpInStakeContract.toFixed(2),
    userLPBalance: userLPBalance === 0 ? 0 : ethers.utils.formatUnits(userLPBalance, stakeTokenDecimals),
    userStakedLP,
    userPendingRewards,
  }

  return formattedPoolInfo
}

function LPStake() {
  const { account, provider } = useWeb3React()
  const [poolInfo, setPoolInfo] = useState(null)

  useEffect(() => {
    if (account) {
      console.log('account', account)
      formatStakeData(account).then(setPoolInfo)
    }
  }, [account])
  async function deposit(account, provider) {
    const poolInfo = await initStakeData()
    const stakeTokenContract = new ethers.Contract(poolInfo.stakingTokenAddress, ERC20ABI, provider)
    const userLPBalance = await stakeTokenContract.balanceOf(account)
    const stakeContract = new ethers.Contract(stakeAddress, ABI, provider.getSigner())
    const deposit = await stakeContract.deposit(userLPBalance, poolId)
    await deposit.wait()
    formatStakeData(account).then(setPoolInfo)

    console.log('deposited')
  }
  async function approve(account, provider) {
    const oneToken = ethers.utils.parseUnits('1', 18)
    const poolInfo = await initStakeData()
    const stakeTokenContract = new ethers.Contract(poolInfo.stakingTokenAddress, ERC20ABI, provider.getSigner())
    const approve = await stakeTokenContract.approve(stakeAddress, oneToken)
    await approve.wait()
    formatStakeData(account).then(setPoolInfo)

    console.log('approved')
  }
  async function withdraw(account, provider) {
    const stakeContract = new ethers.Contract(stakeAddress, ABI, provider.getSigner())
    const userInfo = await stakeContract.userInfo(account, poolId)
    const amount = userInfo.amount
    const withdraw = await stakeContract.withdraw(amount, poolId)
    await withdraw.wait()
    formatStakeData(account).then(setPoolInfo)

    console.log('userInfo', userInfo)
    console.log('amount', amount)
  }
  async function claim(account, provider) {
    const stakeContract = new ethers.Contract(stakeAddress, ABI, provider.getSigner())
    const userInfo = await stakeContract.userInfo(account, poolId)
    console.log('userInfo', userInfo)
    let amount = userInfo.amount

    amount = Number(amount)
    console.log('amount', amount)
    if (!amount) return

    const withdraw = await stakeContract.withdraw('1', poolId)
    await withdraw.wait()
    formatStakeData(account).then(setPoolInfo)

    console.log('userInfo', userInfo)
    console.log('amount', amount)
  }

  return (
    <div className="stake-box">
      <a
        href="https://www.team.finance/view-coin/0x734ee1D796276Fd64a8E47f82677789cc10F66e6?name=Uniswap%20V2&symbol=UNI-V2&chainid=0x1"
        target="_blank"
        rel="noreferrer"
        className="header-stake-text"
      >
        Secured by Team.Finance
      </a>
      <div className="stake-header">
        {poolInfo ? (
          <>
            <div className="space-text">
              <div className="standard-text">APR:</div>
              <div className="highlight-text">{poolInfo.apr}%</div>
            </div>
            <div className="space-text">
              <div className="standard-text">Start Time:</div>
              <div className="highlight-text">{poolInfo.startTime}</div>
            </div>
            <div className="space-text">
              <div className="standard-text">End Time:</div>
              <div className="highlight-text">{poolInfo.endTime}</div>
            </div>
            <div className="space-text">
              <div className="standard-text">Total Reward:</div>
              <div className="highlight-text">{poolInfo.totalReward}</div>
            </div>
            <div className="space-text">
              <div className="standard-text">Remaining Token Rewards:</div>
              <div className="highlight-text">{poolInfo.remainingTokenRewards}</div>
            </div>
            <div className="space-text">
              <div className="standard-text">LP Percent Staked:</div>
              <div className="highlight-text">{poolInfo.lpPercentStaked}%</div>
            </div>
            <div className="space-text">
              <div className="standard-text">Your Unstaked LP:</div>
              <div className="highlight-text">{poolInfo.userLPBalance}</div>
            </div>
            <div className="space-text">
              <div className="standard-text">Your Staked LP:</div>
              <div className="highlight-text">{poolInfo.userStakedLP}</div>
            </div>
            <div className="space-text">
              <div className="standard-text">Your Pending Rewards:</div>
              <div className="highlight-text">{poolInfo.userPendingRewards}</div>
            </div>
          </>
        ) : (
          <div>Please Connect...</div>
        )}{' '}
      </div>

      <div className="stake-button" onClick={() => approve(account, provider)}>
        Approve
      </div>
      <div className="stake-button" onClick={() => deposit(account, provider)}>
        Stake
      </div>
      <div className="stake-button" onClick={() => withdraw(account, provider)}>
        Unstake
      </div>
      <div className="stake-button" onClick={() => claim(account, provider)}>
        Claim
      </div>
    </div>
  )
}

export default LPStake

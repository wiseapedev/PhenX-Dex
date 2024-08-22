import { useContext, useEffect, useState } from 'react'

import { BlockchainContext } from '../BlockchainContext'

function RevShareCal() {
  const [showModal, setShowModal] = useState(false)
  const { balance } = useContext(BlockchainContext)

  const totalSharePercent = 100

  const platSharePercent = 50
  const goldSharePercent = 30
  const silverSharePercent = 15
  const bronzeSharePercent = 5

  const platNeededTokens = 10000
  const goldNeededTokens = 5000
  const silverNeededTokens = 1000
  const bronzeNeededTokens = 100

  const numSilverUsers = 78
  const numGoldUsers = 18
  const numPlatUsers = 26

  // Updated to reflect the corrected total fee amount
  const [exampleShareDollarAmount, setExampleShareDollarAmount] = useState(39800)
  const [userTokensHeld, setUserTokensHeld] = useState(12000)
  const [userShareAmount, setUserShareAmount] = useState(0)
  const [userRank, setUserRank] = useState('')

  const calculateShare = (shareAmount, tokensHeld) => {
    let sharePercent = 0
    let rankUsers = 1 // Default to 1 to prevent division by zero
    let rank = ''

    if (tokensHeld >= platNeededTokens) {
      rank = 'Platinum'
      sharePercent = platSharePercent
      rankUsers = numPlatUsers
    } else if (tokensHeld >= goldNeededTokens) {
      rank = 'Gold'
      sharePercent = goldSharePercent
      rankUsers = numGoldUsers
    } else if (tokensHeld >= silverNeededTokens) {
      rank = 'Silver'
      sharePercent = silverSharePercent
      rankUsers = numSilverUsers
    } else if (tokensHeld >= bronzeNeededTokens) {
      rank = 'Bronze'
      sharePercent = bronzeSharePercent
    } else {
      rank = 'None'
    }

    setUserRank(rank)
    if (rank !== 'None') {
      setUserShareAmount((shareAmount * (sharePercent / totalSharePercent)) / rankUsers)
    } else {
      setUserShareAmount(0)
    }
  }
  useEffect(() => {
    setUserTokensHeld(balance)
    calculateShare(exampleShareDollarAmount, balance)
  }, [balance, showModal])

  const handleShareAmountChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value))
    setExampleShareDollarAmount(isNaN(value) ? 0 : value)
    calculateShare(isNaN(value) ? 0 : value, userTokensHeld)
  }

  const handleTokenBalanceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value, 10))
    setUserTokensHeld(isNaN(value) ? 0 : value)
    calculateShare(exampleShareDollarAmount, isNaN(value) ? 0 : value)
  }

  const totalPlatShare = ((exampleShareDollarAmount * platSharePercent) / totalSharePercent).toFixed(0)
  const totalGoldShare = ((exampleShareDollarAmount * goldSharePercent) / totalSharePercent).toFixed(0)
  const totalSilverShare = ((exampleShareDollarAmount * silverSharePercent) / totalSharePercent).toFixed(0)
  const totalBronzeShare = ((exampleShareDollarAmount * bronzeSharePercent) / totalSharePercent).toFixed(0)

  const min = 39800 // 1% of 39800
  const max = 3980000
  const percentage = ((exampleShareDollarAmount - min) / (max - min)) * 100 + 1

  if (showModal) {
    return (
      <div className="rev-share-cal-box">
        <div className="rev-text">Rev Share Calculator</div>
        <label htmlFor="shareAmount" className="rev-text">
          {percentage.toFixed(2)}% Uniswap 24hr volume ${exampleShareDollarAmount}
        </label>
        <input
          id="shareAmount"
          type="range"
          className="rev-input"
          min={min}
          max={max}
          value={exampleShareDollarAmount}
          onChange={handleShareAmountChange}
        />
        <label className="rev-text" htmlFor="tokenBalance">
          Token Balance
        </label>
        <input
          id="tokenBalance"
          type="number"
          className="rev-input"
          value={userTokensHeld}
          onChange={handleTokenBalanceChange}
          placeholder="Enter Your Token Balance"
        />
        <div className="rev-text">Rank: {userRank}</div>
        <div className="rev-text">Share: ${userShareAmount.toFixed(0)}</div>
        <div className="total-shares">
          <div className="rev-info">
            <span>Total Platinum Share:</span>
            <span>${totalPlatShare}</span>
          </div>
          <div className="rev-info">
            <span>Total Gold Share:</span>
            <span>${totalGoldShare}</span>
          </div>
          <div className="rev-info">
            <span>Total Silver Share:</span>
            <span>${totalSilverShare}</span>
          </div>
          <div className="rev-info">
            <span>Total Bronze Share:</span>
            <span>${totalBronzeShare}</span>
          </div>
        </div>
        <div className="rev-hide-button" onClick={() => setShowModal(!showModal)}>
          Hide
        </div>
      </div>
    )
  } else {
    return (
      <div className="rev-show-button" onClick={() => setShowModal(!showModal)}>
        RevShare Calculator
      </div>
    )
  }
}

export default RevShareCal

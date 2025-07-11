import React, { useState, useEffect } from "react";
import { GameLayout } from "../../components/gamelayout.jsx";
import { BetControl } from "../../components/betcontrol.jsx";
import PropTypes from 'prop-types'; 
import "../css/diceroll.css";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export const DiceRoll = ({ balance, onBack, onBalanceChange }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [lastRolls, setLastRolls] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1); // Changed from selectedRange
  const [winAmount, setWinAmount] = useState(0);
  const [autoRolling, setAutoRolling] = useState(false);
  const [autoRollsLeft, setAutoRollsLeft] = useState(0);
  const [currentBetId, setCurrentBetId] = useState(null);
  const auth = useAuth();
  const authToken = auth?.authToken || '';

   const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const handleBet = async ({ amount, autoRoll, rollsCount }) => {
     if (!authToken) {
      alert('Please login to play');
      return;
    }   
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }
    
    try {
      // Place bet with backend
      const response = await api.post('/api/dice/bet', {
        amount,
        selectedNumber
      });
      
      // Update local balance
      onBalanceChange(response.data.newBalance);
      
      if (autoRoll) {
        setAutoRolling(true);
        setAutoRollsLeft(rollsCount);
      }
      
      setCurrentBetId(response.data.betId);
      startRollAnimation(amount);
    } catch (error) {
      console.error('Bet placement error:', error);
      alert(error.response?.data?.error || 'Failed to place bet');
    }
  };

  


 
  const startRollAnimation = (amount) => {
    setRolling(true);
    
    // Animate dice roll
    const rolls = [];
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const value = rollDice();
        setDiceValue(value);
        if (i === 9) {
          finishRoll(value, amount);
        }
      }, i * 100);
    }
  };

  const finishRoll = async (value, amount) => {
    try {
      // Send result to backend
      const response = await api.post('/api/dice/result', {
        betId: currentBetId,
        diceResult: value
      });
      
      const { isWin, winAmount, balance: newBalance } = response.data;
      
      setRolling(false);
      setWinAmount(winAmount);
      onBalanceChange(response.data.newBalance);
     
      
      // Add to last rolls
      setLastRolls(prev => [
        { value, win: winAmount, timestamp: new Date() },
        ...prev.slice(0, 9)
      ]);
      
      // Continue auto roll if active
      if (autoRolling && autoRollsLeft > 1) {
        setTimeout(() => {
          setAutoRollsLeft(autoRollsLeft - 1);
          handleBet({ amount, autoRoll: true, rollsCount: autoRollsLeft - 1 });
        }, 1000);
      } else {
        setAutoRolling(false);
      }
    } catch (error) {
      console.error('Result processing error:', error);
      setRolling(false);
      alert(error.response?.data?.error || 'Failed to process game result');
    }
  };

    useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/api/dice/history');
        const formattedRolls = response.data.map(bet => ({
          value: bet.result,
          win: bet.winAmount,
          timestamp: bet.settledAt
        })).filter(bet => bet.value); // Filter out bets without results
        
        setLastRolls(formattedRolls.slice(0, 10));
      } catch (error) {
        console.error('Failed to load game history:', error);
      }
    };
    
    loadHistory();
  }, []); 


  return (
    <GameLayout title="Dice Roll" balance={balance} onBack={onBack}>
      <div className="dice-game-container">
        <div className="dice-display">
          <div className={`dice ${rolling ? "rolling" : ""} face-${diceValue}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`dot dot-${i}`}></div>
            ))}
          </div>
          
          {winAmount > 0 && !rolling && (
            <div className="win-message">
              You won ₹{winAmount.toLocaleString()}!
            </div>
          )}
        </div>

        <div className="number-selector">
          <h3>Select Number (2x Payout)</h3>
          <div className="number-options">
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <button
                key={number}
                className={`number-btn ${selectedNumber === number ? "active" : ""}`}
                onClick={() => setSelectedNumber(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        <BetControl balance={balance} onBet={handleBet} />

        {autoRolling && (
          <div className="auto-roll-status">
            Auto Rolling: {autoRollsLeft} rolls left
          </div>
        )}

        <div className="last-rolls">
          <h3>Last Rolls</h3>
          <div className="rolls-list">
            {lastRolls.length > 0 ? (
              lastRolls.map((roll, index) => (
                <div key={index} className={`roll-item ${roll.win > 0 ? "win" : "loss"}`}>
                  <span className="roll-value">{roll.value}</span>
                  <span className="roll-time">
                    {roll.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="roll-result">
                    {roll.win > 0 ? `+₹${roll.win}` : "Lose"}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-rolls">No rolls yet</div>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

DiceRoll.defaultProps = {
  onBalanceChange: () => {}
};

DiceRoll.propTypes = {
  balance: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onBalanceChange: PropTypes.func.isRequired
};

export default DiceRoll;
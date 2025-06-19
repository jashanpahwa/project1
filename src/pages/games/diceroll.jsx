import React, { useState, useEffect } from "react";
import { GameLayout } from "../../components/gamelayout.jsx";
import { BetControl } from "../../components/betcontrol.jsx";
import "../css/diceroll.css";

export const DiceRoll = ({ balance, onBack, onBalanceChange }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [lastRolls, setLastRolls] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1); // Changed from selectedRange
  const [winAmount, setWinAmount] = useState(0);
  const [autoRolling, setAutoRolling] = useState(false);
  const [autoRollsLeft, setAutoRollsLeft] = useState(0);

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const handleBet = ({ amount, autoRoll, rollsCount }) => {
    if (amount > balance) return;
    
    if (autoRoll) {
      setAutoRolling(true);
      setAutoRollsLeft(rollsCount);
      return;
    }
    
    placeBet(amount);
  };

  const placeBet = (amount) => {
    if (rolling) return;
    
    setRolling(true);
    onBalanceChange(-amount);
    
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

  const finishRoll = (value, amount) => {
    setRolling(false);
    
    const isWin = value === selectedNumber;
    const win = isWin ? amount * 2 : 0; // 2x payout
    
    setWinAmount(win);
    if (win > 0) {
      onBalanceChange(win);
    }
    
    // Add to last rolls
    setLastRolls(prev => [
      { value, win, timestamp: new Date() },
      ...prev.slice(0, 9)
    ]);
    
    // Continue auto roll if active
    if (autoRolling && autoRollsLeft > 1) {
      setTimeout(() => {
        setAutoRollsLeft(autoRollsLeft - 1);
        placeBet(amount);
      }, 1000);
    } else {
      setAutoRolling(false);
    }
  };

  useEffect(() => {
    if (autoRolling && autoRollsLeft > 0) {
      // This will be handled in the placeBet function
    }
  }, [autoRolling, autoRollsLeft]);

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

import PropTypes from 'prop-types';

DiceRoll.propTypes = {
  balance: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onBalanceChange: PropTypes.func.isRequired
};
import React, { useState } from "react";
import "./betcontrol.css";

export const BetControl = ({ balance, onBet }) => {
  const [amount, setAmount] = useState(100);
  const [autoRoll, setAutoRoll] = useState(false);
  const [rollsCount, setRollsCount] = useState(10);

  const handleAmountChange = (e) => {
    const value = Math.min(Number(e.target.value), balance);
    setAmount(value);
  };

  const quickSelect = (multiplier) => {
    setAmount(Math.floor(balance * multiplier));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBet({ amount, autoRoll, rollsCount });
  };

  return (
    <form className="bet-control" onSubmit={handleSubmit}>
      <div className="bet-amount">
        <label htmlFor="bet-amount">Bet Amount (₹)</label>
        <input
          type="number"
          id="bet-amount"
          min="10"
          max={balance}
          value={amount}
          onChange={handleAmountChange}
        />
        <div className="quick-buttons">
          <button type="button" onClick={() => quickSelect(0.25)}>25%</button>
          <button type="button" onClick={() => quickSelect(0.5)}>50%</button>
          <button type="button" onClick={() => quickSelect(0.75)}>75%</button>
          <button type="button" onClick={() => quickSelect(1)}>100%</button>
        </div>
      </div>

      <div className="auto-roll">
        <label>
          <input
            type="checkbox"
            checked={autoRoll}
            onChange={(e) => setAutoRoll(e.target.checked)}
          />
          Auto Roll
        </label>
        {autoRoll && (
          <div className="rolls-count">
            <label htmlFor="rolls-count">Number of Rolls:</label>
            <input
              type="number"
              id="rolls-count"
              min="1"
              max="100"
              value={rollsCount}
              onChange={(e) => setRollsCount(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <button type="submit" className="place-bet-btn">
        {autoRoll ? `Auto Roll (${rollsCount}x)` : "Roll Dice"}
      </button>
    </form>
  );
};
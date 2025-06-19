import React, { useState, useEffect, useCallback } from "react"; // Added useCallback here
import { GameLayout } from "../../components/gamelayout";
import { BetControl } from "../../components/betcontrol";
import "../css/spinandwin.css"; // Ensure you have the correct CSS file for styling

export const SpinAndWin = ({ balance, onBack, onBalanceChange }) => {
  const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "7️⃣", "💰"];
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [history, setHistory] = useState([]);
  const [autoSpins, setAutoSpins] = useState(0);
  const [jackpot, setJackpot] = useState(10000);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);

  // Paytable configuration
  const paytable = {
    "7️⃣7️⃣7️⃣": { multiplier: 20, bonus: "JACKPOT" },
    "💰💰💰": { multiplier: 10, bonus: "BIG WIN" },
    "🔔🔔🔔": { multiplier: 5 },
    "⭐️⭐️⭐️": { multiplier: 5 },
    "🍇🍇🍇": { multiplier: 3 },
    "🍊🍊🍊": { multiplier: 2 },
    "🍋🍋🍋": { multiplier: 2 },
    "🍒🍒🍒": { multiplier: 2 },
    "🍒🍒": { multiplier: 1.5 },
    "🍋🍋": { multiplier: 1.2 },
  };

  const spinReels = useCallback(() => {
    setSpinning(true);
    setWinAmount(0);
    
    // Deduct the bet amount
    onBalanceChange(-currentBet);
    
    // Generate random stops for each reel
    const stops = reels.map(() => Math.floor(Math.random() * symbols.length));
    
    // Animate each reel with different durations
    const spinDurations = [1000, 1500, 2000];
    
    stops.forEach((stop, index) => {
      const duration = spinDurations[index];
      const startTime = Date.now();
      
      const spinInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Update reel position during spin
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = (newReels[index] + 1) % symbols.length;
          return newReels;
        });
        
        if (progress >= 1) {
          clearInterval(spinInterval);
          // Set final position
          setReels(prev => {
            const newReels = [...prev];
            newReels[index] = stop;
            return newReels;
          });
          
          // Check if all reels have stopped
          if (index === stops.length - 1) {
            setTimeout(() => finishSpin(stops), 500);
          }
        }
      }, 50);
    });
  }, [currentBet, onBalanceChange, reels, symbols.length]);

  const finishSpin = (stops) => {
    setSpinning(false);
    
    // Get the symbols that landed
    const result = stops.map(stop => symbols[stop]).join("");
    
    // Check for winning combinations
    let win = 0;
    let bonus = null;
    
    // Check for three matching symbols
    if (result[0] === result[1] && result[1] === result[2]) {
      const combo = `${result[0]}${result[1]}${result[2]}`;
      if (paytable[combo]) {
        win = currentBet * paytable[combo].multiplier;
        bonus = paytable[combo].bonus;
      }
    }
    // Check for two matching symbols (only left two)
    else if (result[0] === result[1]) {
      const combo = `${result[0]}${result[1]}`;
      if (paytable[combo]) {
        win = currentBet * paytable[combo].multiplier;
      }
    }
    
    // Handle jackpot
    if (bonus === "JACKPOT") {
      win += jackpot;
      setJackpot(10000); // Reset jackpot
    } else if (result === "💰💰💰") {
      setJackpot(prev => prev + currentBet * 5);
    }
    
    setWinAmount(win);
    if (win > 0) {
      onBalanceChange(win);
      setShowWinAnimation(true);
      setTimeout(() => setShowWinAnimation(false), 2000);
    }
    
    // Add to history
    setHistory(prev => [
      { result, win, timestamp: new Date(), bonus },
      ...prev.slice(0, 9)
    ]);
    
    // Continue auto spins if enabled
    if (autoSpins > 1) {
      setTimeout(() => {
        setAutoSpins(autoSpins - 1);
        spinReels();
      }, 1500);
    }
  };

  const handleBet = ({ amount, autoRoll, rollsCount }) => {
    if (amount > balance) return;
    
    setCurrentBet(amount);
    
    if (autoRoll) {
      setAutoSpins(rollsCount);
    }
    
    spinReels();
  };

  return (
    <GameLayout title="Spin & Win" balance={balance} onBack={onBack}>
      <div className="spin-game-container">
        <div className="jackpot-display">
          <div className="jackpot-label">JACKPOT</div>
          <div className="jackpot-amount">₹{jackpot.toLocaleString()}</div>
        </div>
        
        <div className="spin-wheels">
          {reels.map((reel, index) => (
            <div key={index} className={`wheel ${spinning ? "spinning" : ""}`}>
              <div className="wheel-strip">
                {[...symbols, ...symbols, ...symbols].map((symbol, i) => (
                  <div 
                    key={i} 
                    className={`symbol ${i % symbols.length === reel ? "center" : ""}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="payline"></div>
        
        {showWinAnimation && (
          <div className="win-animation">
            {winAmount >= jackpot ? (
              <div className="jackpot-win">
                <div>JACKPOT!</div>
                <div>₹{winAmount.toLocaleString()}</div>
              </div>
            ) : winAmount > currentBet * 5 ? (
              <div className="big-win">BIG WIN!</div>
            ) : (
              <div className="win">WIN!</div>
            )}
          </div>
        )}
        
        <button 
          className="big-spin-button"
          onClick={() => handleBet({ amount: currentBet })}
          disabled={spinning}
        >
          SPIN NOW
        </button>
        
        <BetControl 
          balance={balance} 
          onBet={handleBet} 
          buttonText={autoSpins > 0 ? `Auto Spin (${autoSpins}x)` : "Spin"}
        />
        
        <div className="paytable">
          <h3>Win Combinations</h3>
          <div className="paytable-grid">
            {Object.entries(paytable).map(([combo, { multiplier, bonus }]) => (
              <div key={combo} className="paytable-item">
                <div className="combo">{combo}</div>
                <div className="payout">{multiplier}x</div>
                {bonus && <div className="bonus">{bonus}</div>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="spin-history">
          <h3>Recent Spins</h3>
          <div className="history-list">
            {history.length > 0 ? (
              history.map((spin, index) => (
                <div 
                  key={index} 
                  className={`history-item ${spin.win > 0 ? "win" : ""}`}
                >
                  <span className="result">{spin.result}</span>
                  <span className="time">
                    {spin.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="amount">
                    {spin.win > 0 ? `+₹${spin.win}` : "-"}
                  </span>
                  {spin.bonus && <span className="bonus">{spin.bonus}</span>}
                </div>
              ))
            ) : (
              <div className="no-history">No spins yet</div>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};
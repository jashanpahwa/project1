import React from "react";
import "./gamelayout.css";

export const GameLayout = ({ title, balance = 0, onBack, children }) => {
  return (
    <div className="game-layout">
      <header className="game-header">
        <button className="back-button" onClick={onBack}>
          &larr; Back
        </button>
        <h1 className="game-title">{title}</h1>
        <div className="game-balance">
          Balance: ₹{(balance || 0).toLocaleString()}
        </div>
      </header>
      
      <main className="game-main">
        {children}
      </main>
    </div>
  );
};
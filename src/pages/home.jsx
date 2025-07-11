import "./css/home.css";
import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

const games = [
  { 
    name: "Aviator", 
    path: "/games/aviator", 
    image: "/assets/aviator.jpg",
    color: "#4F46E5",
    tagline: "Soar to new heights",
    icon: "✈️"
  },
  { 
    name: "CrashX", 
    path: "/crashx", 
    image: "/assets/crashx.jpg",
    color: "#DC2626",
    tagline: "Ride the multiplier wave",
    icon: "🚀"
  },
  { 
    name: "Spin & Win", 
    path: "/games/spinandwin", 
    image: "/assets/spin.jpg",
    color: "#059669",
    tagline: "Fortune favors the bold",
    icon: "🎰"
  },
  { 
    name: "Dice Roll", 
    path: "/games/diceroll", 
    image: "/assets/dice.jpg",
    color: "#D97706",
    tagline: "Test your luck",
    icon: "🎲"
  },
];

const features = [
  { 
    title: "Instant Payouts", 
    description: "Withdraw your winnings instantly to your wallet", 
    icon: "⚡"
  },
  { 
    title: "Provably Fair", 
    description: "All games use blockchain-verified fairness", 
    icon: "🔒"
  },
  { 
    title: "24/7 Support", 
    description: "Our team is always ready to assist you", 
    icon: "👨‍💻"
  },
];

export default function Home() {
  const [activePlayers, setActivePlayers] = useState(0);
  const [bigWin, setBigWin] = useState(null);
  const [tickerItems, setTickerItems] = useState([]);
  
  // Simulate dynamic data
  useEffect(() => {
    // Active players counter
    const playerInterval = setInterval(() => {
      setActivePlayers(prev => {
        const newCount = prev + Math.floor(Math.random() * 10);
        return newCount > 5000 ? 1000 : newCount;
      });
    }, 2000);
    
    // Big wins simulation
    const winInterval = setInterval(() => {
      const players = ["JohnD", "LuckyStar", "BetMaster", "WinQueen", "JackpotKing"];
      const amounts = [1250, 3420, 7800, 2150, 9500];
      const games = ["Aviator", "CrashX", "Spin & Win", "Dice Roll"];
      
      setBigWin({
        player: players[Math.floor(Math.random() * players.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        game: games[Math.floor(Math.random() * games.length)]
      });
      
      // Add to ticker
      setTickerItems(prev => [
        ...prev.slice(-4),
        {
          id: Date.now(),
          player: players[Math.floor(Math.random() * players.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          game: games[Math.floor(Math.random() * games.length)]
        }
      ]);
      
    }, 8000);
    
    // Initial big win
    setBigWin({
      player: "LuckyStar",
      amount: 5200,
      game: "Aviator"
    });
    
    // Initial ticker items
    setTickerItems([
      { id: 1, player: "BetMaster", amount: 3420, game: "CrashX" },
      { id: 2, player: "WinQueen", amount: 2150, game: "Spin & Win" },
      { id: 3, player: "JackpotKing", amount: 7800, game: "Dice Roll" }
    ]);
    
    return () => {
      clearInterval(playerInterval);
      clearInterval(winInterval);
    };
  }, []);
  
  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Particles Effect */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
      
     

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h2 className="hero-title">
            <span className="hero-highlight">BexX Games</span> - Where Every Play Counts
          </h2>
          <p className="hero-subtitle">Experience the thrill of next-level betting</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn register-btn">
              Join Now
            </Link>
            <Link to="/games" className="cta-btn play-btn">
              Play Demo
            </Link>
          </div>
        </div>
        
        {/* Game Cards */}
        <div className="games-header">
          <h3>Featured Games</h3>
          <div className="games-filter">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Popular</button>
            <button className="filter-btn">New</button>
            <button className="filter-btn">High Stakes</button>
          </div>
        </div>
        
        <div className="games-grid">
          {games.map((game) => (
            <div 
              key={game.name} 
              className="game-card"
              style={{ '--card-color': game.color }}
            >
              <div className="card-bg" style={{ backgroundImage: `url(${game.image})` }}></div>
              <div className="card-content">
                <div className="game-icon">{game.icon}</div>
                <h3 className="game-name">{game.name}</h3>
                <p className="game-tagline">{game.tagline}</p>
                <div className="game-stats">
                  <span>🔥 24k Plays Today</span>
                  <span>⭐ 4.8/5 Rating</span>
                </div>
                <Link to={game.path} className="play-btn">
                  Play Now →
                </Link>
              </div>
              <div className="card-overlay"></div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
        
        {/* Features Section */}
        <div className="features-section">
          <h3>Why Choose BexX?</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        <div className="featured-banner">
          <div className="banner-content">
            <h3>🔥 Hot Today: 100% First Deposit Bonus!</h3>
            <p>Up to $500 bonus for new players</p>
            <div className="countdown">
              <span>Offer ends in:</span>
              <div className="countdown-timer">
                <span>02</span>:<span>45</span>:<span>18</span>
              </div>
            </div>
            <Link to="/promotions" className="claim-btn">Claim Now</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
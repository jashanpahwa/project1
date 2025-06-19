import React, { useState, useEffect } from "react";
import "./css/dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [recentBets, setRecentBets] = useState([]);
  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    balance: 1000.00
  });

  // Simulate loading data
  useEffect(() => {
    // Mock data - in a real app, you'd fetch this from an API
    setTimeout(() => {
      setRecentBets([
        { id: 1, game: "Aviator", amount: 50.00, outcome: "win", payout: 125.00, time: "10 mins ago" },
        { id: 2, game: "CrashX", amount: 25.00, outcome: "loss", payout: 0.00, time: "25 mins ago" },
        { id: 3, game: "Dice Roll", amount: 10.00, outcome: "win", payout: 20.00, time: "1 hour ago" },
        { id: 4, game: "Spin & Win", amount: 15.00, outcome: "pending", payout: null, time: "2 hours ago" }
      ]);

      setStats({
        totalBets: 42,
        wins: 28,
        losses: 14,
        balance: 1235.50
      });
    }, 500);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Track your bets, games, and activity</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-label">Balance</h3>
            <p className="stat-value">${stats.balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card total-bets">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-label">Total Bets</h3>
            <p className="stat-value">{stats.totalBets}</p>
          </div>
        </div>

        <div className="stat-card wins">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-label">Wins</h3>
            <p className="stat-value">{stats.wins}</p>
          </div>
        </div>

        <div className="stat-card losses">
          <div className="stat-icon">💔</div>
          <div className="stat-content">
            <h3 className="stat-label">Losses</h3>
            <p className="stat-value">{stats.losses}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "bets" ? "active" : ""}`}
          onClick={() => setActiveTab("bets")}
        >
          My Bets
        </button>
        <button
          className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Win/Loss Chart</p>
                <div className="chart-bar" style={{ width: "70%" }}></div>
                <div className="chart-bar" style={{ width: "30%" }}></div>
              </div>
            </div>
            <div className="recent-activity">
              <h3 className="section-title">Recent Activity</h3>
              <ul className="activity-list">
                {recentBets.slice(0, 3).map((bet) => (
                  <li key={bet.id} className="activity-item">
                    <span className={`activity-outcome ${bet.outcome}`}>
                      {bet.outcome === "win" ? "↑" : bet.outcome === "loss" ? "↓" : "↔"}
                    </span>
                    <div className="activity-details">
                      <p className="activity-game">{bet.game}</p>
                      <p className="activity-meta">
                        {bet.amount} • {bet.time}
                      </p>
                    </div>
                    {bet.outcome !== "pending" && (
                      <span className={`activity-amount ${bet.outcome}`}>
                        {bet.outcome === "win" ? "+" : "-"}${bet.payout.toFixed(2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "bets" && (
          <div className="bets-tab">
            <div className="table-container">
              <table className="bets-table">
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Amount</th>
                    <th>Outcome</th>
                    <th>Payout</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBets.map((bet) => (
                    <tr key={bet.id}>
                      <td>{bet.game}</td>
                      <td>${bet.amount.toFixed(2)}</td>
                      <td>
                        <span className={`outcome-badge ${bet.outcome}`}>
                          {bet.outcome}
                        </span>
                      </td>
                      <td>
                        {bet.payout !== null ? `$${bet.payout.toFixed(2)}` : "-"}
                      </td>
                      <td>{bet.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-tab">
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Activity Log</h3>
              <p>Your full activity history will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
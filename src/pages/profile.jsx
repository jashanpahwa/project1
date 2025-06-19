import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/profile.css";

export default function Profile() {
  const [userData, setUserData] = useState({
    id: "BXU12345",
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+91 9876543210",
    joinDate: "15 Jan 2023",
    lastLogin: "2 hours ago",
    verified: true,
    balance: "₹12,450.00"
  });

  const [stats, setStats] = useState({
    totalBets: 142,
    wins: 87,
    losses: 55,
    winRate: "61.3%"
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [recentActivity, setRecentActivity] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Mock data for recent activity
  useEffect(() => {
    setRecentActivity([
      { id: 1, type: "login", device: "iPhone 13", location: "Mumbai, IN", time: "2 hours ago" },
      { id: 2, type: "bet", game: "Aviator", amount: "₹500", outcome: "win", time: "5 hours ago" },
      { id: 3, type: "withdrawal", amount: "₹2,000", status: "completed", time: "1 day ago" },
      { id: 4, type: "deposit", amount: "₹5,000", method: "UPI", time: "3 days ago" }
    ]);
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    // In a real app, you would call an API here
    alert("Password changed successfully!");
    setShowPasswordModal(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {userData.name.charAt(0)}
          </div>
          {userData.verified && <div className="verified-badge">✓</div>}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{userData.name}</h1>
          <p className="profile-email">{userData.email}</p>
          <div className="profile-meta">
            <span>Member since {userData.joinDate}</span>
            <span>Last login: {userData.lastLogin}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-label">Balance</h3>
            <p className="stat-value">{userData.balance}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-label">Total Bets</h3>
            <p className="stat-value">{stats.totalBets}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-label">Wins</h3>
            <p className="stat-value">{stats.wins}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-label">Win Rate</h3>
            <p className="stat-value">{stats.winRate}</p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Activity
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="profile-details">
              <h3>Account Details</h3>
              <div className="detail-item">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">{userData.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{userData.mobile}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {userData.verified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <button 
                className="action-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
              <Link to="/wallet" className="action-btn">
                Go to Wallet
              </Link>
              <Link to="/contact" className="action-btn">
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-tab">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === "login" && "🔐"}
                    {activity.type === "bet" && "🎮"}
                    {activity.type === "deposit" && "📥"}
                    {activity.type === "withdrawal" && "📤"}
                  </div>
                  <div className="activity-details">
                    <div className="activity-main">
                      {activity.type === "login" && (
                        <span>Login from {activity.device} ({activity.location})</span>
                      )}
                      {activity.type === "bet" && (
                        <span>Bet {activity.amount} on {activity.game} ({activity.outcome})</span>
                      )}
                      {activity.type === "deposit" && (
                        <span>Deposited {activity.amount} via {activity.method}</span>
                      )}
                      {activity.type === "withdrawal" && (
                        <span>Withdrew {activity.amount} ({activity.status})</span>
                      )}
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-tab">
            <h3>Account Settings</h3>
            <div className="settings-group">
              <h4>Personal Information</h4>
              <div className="setting-item">
                <label>Full Name</label>
                <input type="text" value={userData.name} readOnly />
                <button className="edit-btn">Edit</button>
              </div>
              <div className="setting-item">
                <label>Email Address</label>
                <input type="email" value={userData.email} readOnly />
                <button className="edit-btn">Edit</button>
              </div>
              <div className="setting-item">
                <label>Mobile Number</label>
                <input type="tel" value={userData.mobile} readOnly />
                <button className="edit-btn">Edit</button>
              </div>
            </div>

            <div className="settings-group">
              <h4>Security</h4>
              <div className="setting-item">
                <label>Password</label>
                <input type="password" value="********" readOnly />
                <button 
                  className="edit-btn"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change
                </button>
              </div>
              <div className="setting-item">
                <label>Two-Factor Authentication</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="2fa-toggle" />
                  <label htmlFor="2fa-toggle"></label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <button 
              className="close-modal"
              onClick={() => setShowPasswordModal(false)}
            >
              &times;
            </button>
            <form onSubmit={submitPasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={passwordForm.current}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="new"
                  value={passwordForm.new}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwordForm.confirm}
                  onChange={handlePasswordChange}
                  required
                  minLength="8"
                />
              </div>
              <button type="submit" className="submit-btn">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
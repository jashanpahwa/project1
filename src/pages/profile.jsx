import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/profile.css";
import axios from "axios";

export default function Profile() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    joinDate: "",
    lastLogin: "",
    verified: false,
    balance: 0
  });

  const [stats, setStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    winRate: "0%"
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [recentActivity, setRecentActivity] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Fetch user profile
        const profileResponse = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch user stats
        const statsResponse = await axios.get("http://localhost:5000/api/user/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch recent activity
        const activityResponse = await axios.get("http://localhost:5000/api/user/activity", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData({
          id: profileResponse.data.user._id,
          name: profileResponse.data.user.name || "User",
          email: profileResponse.data.user.email,
          mobile: profileResponse.data.user.mobile,
          joinDate: new Date(profileResponse.data.user.createdAt).toLocaleDateString(),
          lastLogin: "Recently", // You would get this from the backend
          verified: profileResponse.data.user.verified,
          balance: profileResponse.data.user.balance || 0
        });

        setStats({
          totalBets: statsResponse.data.totalBets,
          wins: statsResponse.data.wins,
          losses: statsResponse.data.losses,
          winRate: statsResponse.data.winRate
        });

        setRecentActivity(activityResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile data");
        // Redirect to login if unauthorized
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (passwordForm.new !== passwordForm.confirm) {
        throw new Error("Passwords do not match");
      }

      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/user/change-password",
        {
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <svg width="50" height="50" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
            <path 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              opacity="0.75"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

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
            <p className="stat-value">{formatCurrency(userData.balance)}</p>
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
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity._id} className="activity-item">
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
                          <span>Bet {formatCurrency(activity.amount)} on {activity.game} ({activity.outcome})</span>
                        )}
                        {activity.type === "deposit" && (
                          <span>Deposited {formatCurrency(activity.amount)} via {activity.method}</span>
                        )}
                        {activity.type === "withdrawal" && (
                          <span>Withdrew {formatCurrency(activity.amount)} ({activity.status})</span>
                        )}
                      </div>
                      <div className="activity-time">
                        {new Date(activity.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-activity">No recent activity found</p>
            )}
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
              onClick={() => {
                setShowPasswordModal(false);
                setError("");
              }}
            >
              &times;
            </button>
            {error && <div className="error-message"><p>{error}</p></div>}
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
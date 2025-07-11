import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/profile.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [userData, setUserData] = useState({
    id: "",
    name: "",
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
  const [updatingField, setUpdatingField] = useState(null);

  // API endpoints
  const API_BASE = "http://localhost:5000/api";
  const PROFILE_ENDPOINT = `${API_BASE}/auth/me`;
  const STATS_ENDPOINT = `${API_BASE}/user/stats`;
  const ACTIVITY_ENDPOINT = `${API_BASE}/user/activity`;
  const UPDATE_PROFILE_ENDPOINT = `${API_BASE}/user/update-profile`;
  const CHANGE_PASSWORD_ENDPOINT = `${API_BASE}/user/change-password`;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (!authToken) {
          navigate("/login");
          return;
        }

        const [profileResponse, statsResponse, activityResponse] = await Promise.all([
          axios.get(PROFILE_ENDPOINT, {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axios.get(STATS_ENDPOINT, {
            headers: { Authorization: `Bearer ${authToken}` }
          }),
          axios.get(ACTIVITY_ENDPOINT, {
            headers: { Authorization: `Bearer ${authToken}` }
          })
        ]);

        setUserData({
          id: profileResponse.data.user._id,
          name: profileResponse.data.user.name || "User",
          mobile: profileResponse.data.user.mobile,
          joinDate: new Date(profileResponse.data.user.createdAt).toLocaleDateString(),
          lastLogin: profileResponse.data.user.lastLogin 
            ? new Date(profileResponse.data.user.lastLogin).toLocaleString() 
            : "Never",
          verified: profileResponse.data.user.verified,
          balance: profileResponse.data.user.balance || 0
        });

        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
        setError(err.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken, navigate, logout]);

  const handleProfileUpdate = async (field, value) => {
    try {
      setUpdatingField(field);
      
      if (field === 'mobile' && !/^[0-9]{10}$/.test(value)) {
        throw new Error("Please enter a valid 10-digit mobile number");
      }

      await axios.put(
        UPDATE_PROFILE_ENDPOINT,
        { [field]: value },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setUserData(prev => ({ ...prev, [field]: value }));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setUpdatingField(null);
    }
  };

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

      await axios.put(
        CHANGE_PASSWORD_ENDPOINT,
        {
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
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

  // Add a logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <p className="profile-mobile">{userData.mobile}</p>
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
              <button 
                className="action-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
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
                <button 
                  className="edit-btn"
                  onClick={() => {
                    const newName = prompt("Enter new name", userData.name);
                    if (newName) handleProfileUpdate("name", newName);
                  }}
                  disabled={updatingField === 'name'}
                >
                  {updatingField === 'name' ? 'Updating...' : 'Edit'}
                </button>
              </div>
              <div className="setting-item">
                <label>Mobile Number</label>
                <input type="tel" value={userData.mobile} readOnly />
                <button 
                  className="edit-btn"
                  onClick={() => {
                    const newMobile = prompt("Enter new mobile number", userData.mobile);
                    if (newMobile) handleProfileUpdate("mobile", newMobile);
                  }}
                  disabled={updatingField === 'mobile'}
                >
                  {updatingField === 'mobile' ? 'Updating...' : 'Edit'}
                </button>
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
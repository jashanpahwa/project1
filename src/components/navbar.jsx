import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/wallet", label: "Wallet", icon: "💰" },
    { path: "/promotions", label: "Promotions", icon: "🎁" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-text">Bet</span>
          <span className="logo-x">X</span>
          <span className="logo-dot">•</span>
        </Link>

        <nav className="desktop-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="auth-link profile">
                <span className="auth-icon">👤</span>
                Profile
              </Link>
              <button onClick={handleLogout} className="auth-link logout">
                <span className="auth-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">
                <span className="auth-icon">🔑</span>
                Login
              </Link>
              <Link to="/register" className="auth-link register">
                <span className="auth-icon">✍️</span>
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className={`mobile-menu-button ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>  


      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`mobile-nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={`mobile-nav-link ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">👤</span>
                  Profile
                </Link>
              </li>
              <li>
                <button
                  className="mobile-nav-link logout"
                  onClick={handleLogout}
                >
                  <span className="mobile-nav-icon">🚪</span>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`mobile-nav-link ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">🔑</span>
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={`mobile-nav-link ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">✍️</span>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
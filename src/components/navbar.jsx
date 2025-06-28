// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

   // Proper authentication check with error handling
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found');
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking auth with token:', token);
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for cookies if using them
        });

        console.log('Auth check response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Auth check data:', data);
        
        if (data.user) {
          console.log('User is authenticated');
          setIsLoggedIn(true);
        } else {
          console.log('No user data received');
          setIsLoggedIn(false);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/wallet", label: "Wallet", icon: "💰" },
    { path: "/promotions", label: "Promotions", icon: "🎁" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return <div className="navbar-loading">Loading...</div>;
  }

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo with animation */}
        <Link to="/" className="logo">
          <span className="logo-text">Bet</span>
          <span className="logo-x">X</span>
          <span className="logo-dot">•</span>
        </Link>

        {/* Desktop Navigation */}
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
                  <span className="nav-underline"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons - Changes based on login status */}
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="auth-link profile"
              >
                <span className="auth-icon">👤</span>
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="auth-link logout"
              >
                <span className="auth-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="auth-link"
              >
                <span className="auth-icon">🔑</span>
                Login
              </Link>
              <Link
                to="/register"
                className="auth-link register"
              >
                <span className="auth-icon">✍️</span>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
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
          {isLoggedIn ? (
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
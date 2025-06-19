import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css"; // Import the CSS file

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/wallet", label: "Wallet", icon: "💰" },
    { path: "/promotions", label: "Promotions", icon: "🎁" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  const authItems = [
    { path: "/login", label: "Login", icon: "🔑" },
    { path: "/register", label: "Register", icon: "✍️" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {authItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`auth-link ${
                item.label === "Register" ? "register" : ""
              }`}
            >
              <span className="auth-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
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
          {[...navItems, ...authItems].map((item) => (
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
        </ul>
      </div>
    </header>
  );
}
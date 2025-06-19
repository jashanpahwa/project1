import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const navigate = useNavigate();

  // Dynamic background themes
  const themes = {
    light: "theme-light",
    sunset: "theme-sunset",
    ocean: "theme-ocean",
    forest: "theme-forest"
  };

  // Rotate themes every 10 seconds
  useEffect(() => {
    const themeKeys = Object.keys(themes);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % themeKeys.length;
      setCurrentTheme(themeKeys[currentIndex]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace with actual API call in production
      if (mobile === "1234567890" && password === "password") {
        navigate("/dashboard");
      } else {
        setError("Invalid mobile number or password");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`login-container ${themes[currentTheme]}`}>
      {/* Dynamic Background Elements */}
      <div className="background-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      {/* Login Card */}
      <div className={`login-card ${shake ? 'animate-shake' : ''}`}>
        <div className="login-header">
          <h2>Welcome to BetX</h2>
          <p>Login to access your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="mobile"
                className="form-input"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                required
              />
              <div className="input-icon">📱</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            <div className="btn-shine"></div>
            <div className="btn-content">
              {isLoading ? (
                <>
                  <svg 
                    className="loading-spinner" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"></circle>
                    <path 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      opacity="0.75"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </div>
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Create one</a></p>
          
          <div className="social-login">
            <button className="social-btn">G</button>
            <button className="social-btn">f</button>
            <button className="social-btn">t</button>
          </div>
        </div>
      </div>
    </div>
  );
}
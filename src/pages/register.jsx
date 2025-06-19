import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/register.css";

export default function Register() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace with actual API call in production
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={`register-container ${themes[currentTheme]}`}>
      {/* Dynamic Background Elements */}
      <div className="background-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      {/* Registration Card */}
      <div className={`register-card ${shake ? 'animate-shake' : ''}`}>
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p>Join BetX to start your journey</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
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
                placeholder="Create a strong password"
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
            
            <div className="password-strength">
              <div className={`strength-meter ${password.length > 0 ? 'active' : ''}`}>
                <div 
                  className={`strength-bar ${password.length >= 8 ? 'strong' : password.length >= 5 ? 'medium' : 'weak'}`} 
                  style={{ width: `${Math.min(100, password.length * 10)}%` }}
                ></div>
              </div>
              <div className="strength-labels">
                <span className={password.length < 5 ? 'active' : ''}>Weak</span>
                <span className={password.length >= 5 && password.length < 8 ? 'active' : ''}>Medium</span>
                <span className={password.length >= 8 ? 'active' : ''}>Strong</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="terms-agreement">
            <input 
              type="checkbox" 
              id="terms" 
              className="terms-checkbox"
              required
            />
            <label htmlFor="terms">
              I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
            </label>
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
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </div>
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login" className="login-link">Login</a></p>
          
          <div className="social-login">
            <div className="divider">
              <span>Or register with</span>
            </div>
            
            <div className="social-buttons">
              <button className="social-btn google">
                <div className="social-icon">G</div>
                Google
              </button>
              <button className="social-btn facebook">
                <div className="social-icon">f</div>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
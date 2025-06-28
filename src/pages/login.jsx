import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  // Check for remembered credentials on mount
  useEffect(() => {
    const rememberedMobile = localStorage.getItem("rememberedMobile");
    if (rememberedMobile) {
      setFormData(prev => ({
        ...prev,
        mobile: rememberedMobile,
        rememberMe: true
      }));
    }
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (formData.password.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (formData.password.length > 5) strength += 1;
    if (formData.password.length > 8) strength += 1;
    // Complexity checks
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(Math.min(strength, 5));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.mobile.match(/^[0-9]{10}$/)) {
      setError("Please enter a valid 10-digit mobile number");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Remember mobile if checked
      if (formData.rememberMe) {
        localStorage.setItem("rememberedMobile", formData.mobile);
      } else {
        localStorage.removeItem("rememberedMobile");
      }

      // Save token and redirect
      localStorage.setItem('token', data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login functionality
    alert(`Logging in with ${provider} - Implement this functionality`);
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
                name="mobile"
                className="form-input"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                maxLength="10"
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
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div 
                  className={`strength-bar ${passwordStrength > 0 ? 'active' : ''}`}
                  style={{width: `${passwordStrength * 20}%`}}
                ></div>
              </div>
            )}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
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

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button 
            className="social-btn google"
            onClick={() => handleSocialLogin("Google")}
            aria-label="Login with Google"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
            </svg>
            Google
          </button>
          <button 
            className="social-btn facebook"
            onClick={() => handleSocialLogin("Facebook")}
            aria-label="Login with Facebook"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#1877F2" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
            </svg>
            Facebook
          </button>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Create one</a></p>
        </div>
      </div>
    </div>
  );
}
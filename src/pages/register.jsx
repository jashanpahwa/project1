import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

  // Calculate password strength
  useEffect(() => {
    if (formData.password.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length > 5) strength += 1;
    if (formData.password.length > 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(Math.min(strength, 5));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? value : checked
    }));
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the terms and conditions");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
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
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login page after successful registration
      navigate("/login", { state: { registrationSuccess: true } });
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
                name="mobile"
                className="form-input"
                value={formData.mobile}
                onChange={handleChange}
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
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
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
            
            <div className="password-strength">
              <div className={`strength-meter ${formData.password.length > 0 ? 'active' : ''}`}>
                <div 
                  className={`strength-bar strength-${passwordStrength}`}
                  style={{ width: `${passwordStrength * 20}%` }}
                ></div>
              </div>
              <div className="strength-labels">
                <span className={passwordStrength <= 1 ? 'active' : ''}>Weak</span>
                <span className={passwordStrength > 1 && passwordStrength <= 3 ? 'active' : ''}>Medium</span>
                <span className={passwordStrength > 3 ? 'active' : ''}>Strong</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
              checked={acceptedTerms}
              onChange={handleTermsChange}
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
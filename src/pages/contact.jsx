import React, { useState, useEffect } from "react";
import "./css/contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className={`contact-container ${themes[currentTheme]}`}>
      {/* Dynamic Background Elements */}
      <div className="background-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      {/* Contact Card */}
      <div className="contact-card">
        <div className="contact-header">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Our Location</h3>
              <p>123 BetX Street, Gaming District, NY 10001</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone Number</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email Address</h3>
              <p>support@betx.com</p>
            </div>
            
            <div className="social-links">
              <button className="social-btn">f</button>
              <button className="social-btn">t</button>
              <button className="social-btn">in</button>
              <button className="social-btn">ig</button>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitSuccess && (
              <div className="success-message">
                <p>Your message has been sent successfully!</p>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What is this regarding?"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                className="form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="5"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <div className="btn-shine"></div>
              <div className="btn-content">
                {isSubmitting ? (
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
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
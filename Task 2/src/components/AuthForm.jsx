import React, { useState } from 'react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Focus/Touch states to improve UX (errors don't flash immediately on blank load)
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email Validation Logic
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };
  const isEmailValid = validateEmail(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;
  const showEmailSuccess = email.length > 0 && isEmailValid;

  // Password Validation Logic
  const rules = [
    { id: 'length', text: 'Minimum 8 characters', met: password.length >= 8 },
    { id: 'uppercase', text: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', text: 'At least one lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', text: 'At least one number (0-9)', met: /\d/.test(password) },
    { id: 'special', text: 'At least one special character (@, $, !, %, etc.)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const rulesMetCount = rules.filter(r => r.met).length;
  const isPasswordValid = rulesMetCount === 5;

  // Determine strength label & styling class
  let strengthLabel = 'Weak';
  let strengthClass = '';
  if (password.length > 0) {
    if (rulesMetCount === 5) {
      strengthLabel = 'Strong';
      strengthClass = 'strong';
    } else if (rulesMetCount >= 3) {
      strengthLabel = 'Medium';
      strengthClass = 'medium';
    } else {
      strengthLabel = 'Weak';
      strengthClass = 'weak';
    }
  }

  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    // Simulate secure network auth request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setEmailTouched(false);
    setPasswordTouched(false);
    setShowPassword(false);
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="success-card">
        <div className="success-icon-wrapper">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div className="auth-header">
          <h2 className="auth-title" style={{ background: 'none', webkitTextFillColor: 'initial', color: 'var(--text-primary)' }}>
            Authentication Successful
          </h2>
          <p className="auth-subtitle">
            You have securely logged in as:
          </p>
          <p className="success-email">{email}</p>
        </div>
        <button className="submit-btn" onClick={handleReset} style={{ marginTop: '20px' }}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 className="auth-title">Secure Sign In</h2>
        <p className="auth-subtitle">Enter your credentials to access your portal</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">Email Address</label>
          <div className="input-wrapper">
            <input
              id="email-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailTouched(true);
              }}
              onBlur={() => setEmailTouched(true)}
              className={`auth-input ${showEmailError ? 'invalid' : ''} ${showEmailSuccess ? 'valid' : ''}`}
              required
              disabled={isSubmitting}
            />
          </div>
          {showEmailError && (
            <div className="feedback-msg error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Please enter a valid email address.
            </div>
          )}
          {showEmailSuccess && (
            <div className="feedback-msg success">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Email format is valid.
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password-input">Password</label>
          <div className="input-wrapper">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordTouched(true);
              }}
              onBlur={() => setPasswordTouched(true)}
              className={`auth-input ${passwordTouched && password.length > 0 && !isPasswordValid ? 'invalid' : ''} ${passwordTouched && isPasswordValid ? 'valid' : ''}`}
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>

          {/* Password Strength Meter & Live Checklist */}
          {password.length > 0 && (
            <div className="strength-meter-container">
              <div className="strength-bar-grid">
                <div className={`strength-bar-segment ${strengthClass ? 'weak' : ''}`} />
                <div className={`strength-bar-segment ${strengthClass === 'medium' || strengthClass === 'strong' ? 'medium' : ''}`} />
                <div className={`strength-bar-segment ${strengthClass === 'strong' ? 'strong' : ''}`} />
              </div>
              <div className="strength-label">
                <span>Strength:</span>
                <span className={`value-${strengthClass}`}>{strengthLabel}</span>
              </div>
            </div>
          )}

          {/* Checklist */}
          <div className="checklist-container" aria-label="Password rules check list">
            {rules.map((rule) => (
              <div key={rule.id} className={`checklist-item ${rule.met ? 'met' : ''}`}>
                <span className="checklist-item-dot" aria-hidden="true">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>{rule.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Verifying Security Credentials...
            </>
          ) : (
            'Verify & Sign In'
          )}
        </button>
      </form>
    </div>
  );
}

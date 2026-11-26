
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ closed = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {closed && <path d="M3 3 21 21" />}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    // Add your actual authentication API validation here.
    // This example only checks that both fields are filled.

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">

      {/* LEFT BRAND SECTION */}
      <section className="brand-panel">
        <div className="brand-content">

          <div className="brand-name">
            <span>WorkSync</span>
          </div>

          <h1>
            Manage your leaves.
            <span> Enjoy your time.</span>
          </h1>

          <p className="brand-description">
            A smarter way to manage employee leave requests,
            approvals and workplace schedules.
          </p>

          <div className="quote-card">
            <p>
              "Simple leave management for a happier workplace."
            </p>

            <p className="quote-caption">
              Employee Experience Platform
            </p>
          </div>

        </div>
      </section>

      {/* RIGHT LOGIN SECTION */}
      <section className="login-panel">
        <div className="login-card">

          <h2>Welcome back!</h2>

          <p className="login-subtitle">
            Sign in to access your leave management portal.
          </p>

          <form onSubmit={handleLogin} className="login-form">

            {/* EMAIL */}
            <div className="form-field">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrap">
                <MailIcon />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrap">
                <LockIcon />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <EyeIcon closed={showPassword} />
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="form-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact your administrator to reset your password.");
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="submit-button"
            >
              Sign In
              <ArrowIcon />
            </button>

          </form>

          <p className="copyright">
            © 2026 All rights reserved.
          </p>

        </div>
      </section>

    </main>
  );
}


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Icons
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

// Demo employee data
// Replace with your backend authentication API.
const employees = [
  {
    id: "EMP001",
    name: "Hareesh Paladi",
    email: "hareesh@worksync.com",
    password: "123456",
    department: "IT",
    designation: "Java Developer",
    role: "EMPLOYEE",
    joiningDate: "2022-06-14",
    leaveBalance: {
      annual: 12,
      sick: 6,
      casual: 6
    }
  },
  {
    id: "EMP002",
    name: "Rahul Kumar",
    email: "rahul@worksync.com",
    password: "123456",
    department: "Human Resources",
    designation: "HR Executive",
    role: "EMPLOYEE",
    joiningDate: "2023-02-10",
    leaveBalance: {
      annual: 15,
      sick: 6,
      casual: 5
    }
  },
  {
    id: "EMP003",
    name: "Priya Sharma",
    email: "priya@worksync.com",
    password: "123456",
    department: "Finance",
    designation: "Accountant",
    role: "EMPLOYEE",
    joiningDate: "2024-01-15",
    leaveBalance: {
      annual: 10,
      sick: 6,
      casual: 4
    }
  },
  {
    id: "ADM001",
    name: "Admin",
    email: "admin@worksync.com",
    password: "123456",
    department: "Administration",
    designation: "Administrator",
    role: "ADMIN",
    joiningDate: "2022-01-01",
    leaveBalance: {
      annual: 0,
      sick: 0,
      casual: 0
    }
  }
];

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedEmail")
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const employee = employees.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!employee) {
      setLoading(false);
      setError("Invalid email address or password.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email.trim());
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    const employeeDetails = {
      employeeId: employee.id,
      employeeName: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      role: employee.role,
      joiningDate: employee.joiningDate,
      leaveBalance: employee.leaveBalance
    };

    localStorage.setItem(
      "currentEmployee",
      JSON.stringify(employeeDetails)
    );

    // Frontend demo token only
    localStorage.setItem("authToken", "logged-in");

    navigate("/dashboard", { replace: true });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Please contact your administrator to reset your password.");
  };

  return (
    <main className="login-page">

      {/* LEFT BRAND PANEL */}
      <section className="brand-panel">
        <div className="brand-content">

          <div className="brand-name">
            <span>WorkSync</span>
          </div>

          <div className="brand-tagline">
            EMPLOYEE EXPERIENCE PLATFORM
          </div>

          <h1>
            Work smarter.
            <span> Live better.</span>
          </h1>

          <p className="brand-description">
            One simple platform to manage employee leaves,
            timesheets, approvals and workplace schedules.
            Stay connected, organized and productive.
          </p>

          <div className="quote-card">
            <p>
              "Your work. Your time. Your workplace.
              Everything in sync."
            </p>

            <p className="quote-caption">
              WorkSync Employee Portal
            </p>
          </div>

          <div className="brand-features">
            <div>
              <span>✓</span> Leave Management
            </div>
            <div>
              <span>✓</span> Smart Timesheets
            </div>
            <div>
              <span>✓</span> Employee Self Service
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className="login-panel">
        <div className="login-card">

          <div className="login-heading">
            <h2>Welcome back!</h2>

            <p className="login-subtitle">
              Sign in to your WorkSync employee account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">

            {/* EMAIL */}
            <div className="form-field">
              <label htmlFor="email">Email Address</label>

              <div className="input-wrap">
                <MailIcon />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-field">
              <label htmlFor="password">Password</label>

              <div className="input-wrap">
                <LockIcon />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <EyeIcon closed={showPassword} />
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {/* OPTIONS */}
            <div className="form-options">

              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <a
                href="#forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowIcon />}
            </button>

          </form>

        </div>
      </section>

      {/* FULL WIDTH FOOTER */}
      <footer className="login-footer">
        <p>© 2026 WorkSync. All rights reserved.</p>
        <p>Designed for a smarter workplace.</p>
      </footer>

    </main>
  );
}


import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard";
import Timesheet from "./pages/Timesheet";
import ApplyLeave from "./pages/ApplyLeave";
import Approvals from "./pages/Approvals";
import Holidays from "./pages/Holidays";
import Login from "./pages/Login";

import "./App.css";

// Protect dashboard routes
function ProtectedRoute({ children }) {
  const authToken = localStorage.getItem("authToken");

  return authToken ? children : <Navigate to="/login" replace />;
}

// Main application with Sidebar
function MainApp() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    navigate("/login", { replace: true });
  };

  return (
    <div className="app-layout">

      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
        onLogout={handleLogout}
      />

      <main className="app-main">

        {activeMenu === "Dashboard" && <Dashboard />}
        {activeMenu === "Timesheet" && <Timesheet />}
        {activeMenu === "Apply Leave" && <ApplyLeave />}
        {activeMenu === "Approvals" && <Approvals />}
        {activeMenu === "Holidays" && <Holidays />}

        {![
          "Dashboard",
          "Timesheet",
          "Apply Leave",
          "Approvals",
          "Holidays"
        ].includes(activeMenu) && (
          <div className="page-placeholder">
            <h2>{activeMenu}</h2>
            <p>This section is ready for implementation.</p>
          </div>
        )}

      </main>
    </div>
  );
}

// Application routes
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Login Page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            localStorage.getItem("authToken")
              ? <Navigate to="/dashboard" replace />
              : <Login />
          }
        />

        {/* Protected Dashboard + Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />

        {/* Invalid routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

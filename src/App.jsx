
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainApp />} />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}


import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Clock,
  CalendarPlus,
  ClipboardCheck,
  CalendarDays,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CalendarDays as CalendarIcon,
  Camera,
  Pencil,
  X,
  Save,
  Building2,
  User,
  IdCard,
  LogOut
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Timesheet", icon: Clock },
  { name: "Apply Leave", icon: CalendarPlus },
  { name: "Approvals", icon: ClipboardCheck },
  { name: "Holidays", icon: CalendarDays }
];

const defaultProfile = {
  name: "Hareesh Paladi",
  employeeId: "EMP-1024",
  designation: "Software Developer",
  department: "Engineering",
  email: "hareesh@example.com",
  phone: "+91 98765 43210",
  location: "Hyderabad, Telangana",
  joiningDate: "2022-06-14",
  manager: "Project Manager",
  photo: ""
};

function getSavedProfile() {
  try {
    const saved = localStorage.getItem("worksync_employee_profile");

    return saved
      ? { ...defaultProfile, ...JSON.parse(saved) }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function Sidebar({
  activeMenu,
  onMenuClick,
  onLogout
}) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(getSavedProfile);
  const [formData, setFormData] = useState(profile);

  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fileInputRef = useRef(null);

  // OPEN PROFILE
  const openProfile = () => {
    setFormData(profile);
    setIsEditing(false);
    setShowProfile(true);
  };

  // CLOSE PROFILE
  const closeProfile = () => {
    setShowProfile(false);
    setIsEditing(false);
    setFormData(profile);
  };

  // PROFILE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // PROFILE PHOTO UPLOAD
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      window.alert("Please select an image smaller than 3 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result
      }));
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // SAVE PROFILE
  const saveProfile = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      window.alert("Name and email are required.");
      return;
    }

    try {
      localStorage.setItem(
        "worksync_employee_profile",
        JSON.stringify(formData)
      );

      setProfile(formData);
      setIsEditing(false);

      window.alert("Profile updated successfully!");
    } catch {
      window.alert(
        "Unable to save profile. Try using a smaller profile photo."
      );
    }
  };

  // CANCEL PROFILE EDITING
  const cancelEditing = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // OPEN LOGOUT CONFIRMATION
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  // CANCEL LOGOUT
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // CONFIRM LOGOUT
  const confirmLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    // Clear authentication information
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // Close popups
    setShowProfile(false);
    setShowLogoutConfirm(false);

    // Notify parent component
    if (typeof onLogout === "function") {
      onLogout();
    }

    // Redirect to Login page
    navigate("/login", { replace: true });
  };

  // USER INITIALS
  const displayName = profile.name || "Employee";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  // PROFILE FIELDS
  const fields = [
    {
      label: "Full Name",
      name: "name",
      icon: User,
      type: "text"
    },
    {
      label: "Employee ID",
      name: "employeeId",
      icon: IdCard,
      type: "text"
    },
    {
      label: "Designation",
      name: "designation",
      icon: Briefcase,
      type: "text"
    },
    {
      label: "Department",
      name: "department",
      icon: Building2,
      type: "text"
    },
    {
      label: "Email Address",
      name: "email",
      icon: Mail,
      type: "email"
    },
    {
      label: "Phone Number",
      name: "phone",
      icon: Phone,
      type: "tel"
    },
    {
      label: "Location",
      name: "location",
      icon: MapPin,
      type: "text"
    },
    {
      label: "Joining Date",
      name: "joiningDate",
      icon: CalendarIcon,
      type: "date"
    },
    {
      label: "Reporting Manager",
      name: "manager",
      icon: UserRound,
      type: "text"
    }
  ];

  return (
    <>
      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* BRAND */}
        <div className="sidebar-brand">
          <svg
            className="brand-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="workSyncLogo"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#7775EA" />
                <stop offset="100%" stopColor="#4148B8" />
              </linearGradient>
            </defs>

            <rect
              width="64"
              height="64"
              rx="17"
              fill="url(#workSyncLogo)"
            />

            <path
              d="M13 19 L22 44 L32 27 L42 44 L51 19"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx="48"
              cy="47"
              r="10"
              fill="#22B889"
              stroke="#ffffff"
              strokeWidth="2"
            />

            <path
              d="M43.5 47 L47 50.5 L53 43.5"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>WorkSync</span>
        </div>

        {/* MENU */}
        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                className={`sidebar-item ${
                  activeMenu === item.name ? "active" : ""
                }`}
                onClick={() => onMenuClick?.(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">

          {/* MY ACCOUNT */}
          <button
            type="button"
            className="sidebar-footer"
            onClick={openProfile}
          >
            <div className="user-avatar">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile" />
              ) : (
                initials
              )}
            </div>

            <div className="sidebar-user-info">
              <strong>{displayName}</strong>
              <small>My Account</small>
            </div>

            <Pencil
              className="account-edit-icon"
              size={15}
            />
          </button>

          {/* SIGN OUT */}
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>

        </div>
      </aside>

      {/* PROFILE MODAL */}
      {showProfile && (
        <div
          className="profile-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeProfile();
            }
          }}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
          >

            {/* HEADER */}
            <div className="profile-modal-header">
              <div>
                <h2 id="profile-title">My Profile</h2>
                <p>
                  View and manage your employee information
                </p>
              </div>

              <button
                type="button"
                className="profile-close-btn"
                onClick={closeProfile}
                aria-label="Close profile"
              >
                <X size={21} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="profile-modal-content">

              {/* PROFILE HERO */}
              <div className="profile-hero">
                <div className="profile-photo-wrap">

                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      className="profile-photo"
                      alt="Employee profile"
                    />
                  ) : (
                    <div className="profile-photo-placeholder">
                      {initials}
                    </div>
                  )}

                  {isEditing && (
                    <>
                      <button
                        type="button"
                        className="profile-camera-btn"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        title="Change profile photo"
                      >
                        <Camera size={17} />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhotoChange}
                      />
                    </>
                  )}
                </div>

                <div className="profile-hero-details">
                  <h3>{formData.name || "Employee Name"}</h3>

                  <p>
                    {formData.designation || "Designation"}
                  </p>

                  <span className="profile-employee-badge">
                    {formData.employeeId || "Employee ID"}
                  </span>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    className="profile-edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil size={15} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* PROFILE FIELDS */}
              <div className="profile-section-heading">
                <h3>Personal & Employment Details</h3>

                {isEditing && (
                  <span>Editing mode</span>
                )}
              </div>

              <div className="profile-fields-grid">
                {fields.map((field) => {
                  const Icon = field.icon;

                  return (
                    <div
                      className="profile-field"
                      key={field.name}
                    >
                      <label htmlFor={`profile-${field.name}`}>
                        <Icon size={15} />
                        {field.label}
                      </label>

                      {isEditing ? (
                        <input
                          id={`profile-${field.name}`}
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <div className="profile-field-value">
                          {field.type === "date" &&
                          formData[field.name]
                            ? new Date(
                                formData[field.name] + "T00:00:00"
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })
                            : formData[field.name] || "Not provided"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FOOTER */}
            <div className="profile-modal-footer">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="profile-save-btn"
                    onClick={saveProfile}
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="profile-done-btn"
                  onClick={closeProfile}
                >
                  Done
                </button>
              )}
            </div>

          </section>
        </div>
      )}

      {/* SIGN OUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div
          className="logout-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cancelLogout();
            }
          }}
        >
          <section
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >

            {/* LOGOUT ICON */}
            <div className="logout-icon-wrapper">
              <LogOut size={27} />
            </div>

            {/* MESSAGE */}
            <h2 id="logout-title">Sign Out?</h2>

            <p>
              Are you sure you want to sign out of your
              WorkSync account?
            </p>

            {/* ACTION BUTTONS */}
            <div className="logout-modal-actions">

              <button
                type="button"
                className="logout-cancel-btn"
                onClick={cancelLogout}
                disabled={isLoggingOut}
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-confirm-btn"
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                <LogOut size={16} />
                Yes, Sign Out
              </button>

            </div>
          </section>
        </div>
      )}

    </>
  );
}


import React, { useMemo, useState } from "react";
import {
  Plus, CalendarDays, Clock3, CheckCircle2, XCircle,
  Pencil, Search, X, Upload, FileText, Palmtree,
  HeartPulse, Briefcase, Save, Paperclip, AlertCircle
} from "lucide-react";
import "./ApplyLeave.css";

const initialLeaves = [
  {
    id: 1,
    type: "Casual Leave",
    from: "2026-12-04",
    to: "2026-12-04",
    days: 1,
    reason: "Personal work",
    status: "Pending",
    attachment: null
  },
  {
    id: 2,
    type: "Sick Leave",
    from: "2026-11-18",
    to: "2026-11-19",
    days: 2,
    reason: "Not feeling well",
    status: "Approved",
    attachment: null
  },
  {
    id: 3,
    type: "Earned Leave",
    from: "2026-10-12",
    to: "2026-10-14",
    days: 3,
    reason: "Family function",
    status: "Rejected",
    attachment: null
  }
];

// "used" represents previously consumed leave outside the sample
// applications shown in the table.
const leaveBalances = [
  { name: "Casual Leave", total: 12, used: 4, color: "purple", icon: Palmtree },
  { name: "Sick Leave", total: 10, used: 2, color: "blue", icon: HeartPulse },
  { name: "Earned Leave", total: 15, used: 5, color: "orange", icon: Briefcase },
  { name: "Comp Off", total: 5, used: 1, color: "green", icon: Clock3 }
];

const emptyForm = {
  type: "Casual Leave",
  from: "",
  to: "",
  reason: "",
  attachment: null
};

function calculateLeaveDays(from, to) {
  if (!from || !to || to < from) return 0;

  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  let days = 0;

  while (start <= end) {
    const day = start.getDay();
    if (day !== 0 && day !== 6) days++;
    start.setDate(start.getDate() + 1);
  }

  return days;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default function ApplyLeave() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  const leaveDays = calculateLeaveDays(form.from, form.to);

  const balanceCards = useMemo(() => {
    return leaveBalances.map(item => {
      const approvedDays = leaves
        .filter(
          leave =>
            leave.type === item.name &&
            leave.status === "Approved"
        )
        .reduce((sum, leave) => sum + leave.days, 0);

      const used = item.used + approvedDays;
      const remaining = Math.max(0, item.total - used);

      return {
        ...item,
        used,
        remaining,
        percentage: Math.min(100, (used / item.total) * 100)
      };
    });
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leaves
      .filter(item => {
        const matchesSearch =
          item.type.toLowerCase().includes(query) ||
          item.reason.toLowerCase().includes(query);

        const matchesStatus =
          filter === "All" || item.status === filter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.from.localeCompare(a.from));
  }, [leaves, search, filter]);

  const pendingCount = leaves.filter(
    item => item.status === "Pending"
  ).length;

  const approvedCount = leaves.filter(
    item => item.status === "Approved"
  ).length;

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowModal(true);
  };

  const openEdit = leave => {
    if (leave.status !== "Pending") return;

    setEditingId(leave.id);
    setForm({
      type: leave.type,
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
      attachment: leave.attachment || null
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
  };

  const updateField = (field, value) => {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
    setError("");
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!form.from || !form.to || !form.reason.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.to < form.from) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    if (leaveDays <= 0) {
      setError("Selected dates contain no working days.");
      return;
    }

    const balance = balanceCards.find(
      item => item.name === form.type
    );

    const alreadyUsed = leaves
      .filter(item =>
        item.type === form.type &&
        item.status === "Approved" &&
        item.id !== editingId
      )
      .reduce((sum, item) => sum + item.days, 0);

    const available = balance
      ? balance.total - balance.used + alreadyUsed
      : 0;

    if (leaveDays > Math.max(0, available)) {
      setError(
        `Insufficient ${form.type} balance. Available: ${Math.max(
          0,
          available
        )} days.`
      );
      return;
    }

    const hasOverlap = leaves.some(item => {
      if (item.id === editingId) return false;
      if (item.status === "Rejected" || item.status === "Cancelled") {
        return false;
      }

      return (
        form.from <= item.to &&
        form.to >= item.from
      );
    });

    if (hasOverlap) {
      setError(
        "You already have a pending or approved leave request during these dates."
      );
      return;
    }

    const record = {
      ...form,
      id: editingId || Date.now(),
      days: leaveDays,
      reason: form.reason.trim(),
      status: "Pending"
    };

    if (editingId) {
      setLeaves(previous =>
        previous.map(item =>
          item.id === editingId ? record : item
        )
      );
    } else {
      setLeaves(previous => [record, ...previous]);
    }

    closeModal();
  };

  const handleCancel = () => {
    setLeaves(previous =>
      previous.map(item =>
        item.id === cancelId
          ? { ...item, status: "Cancelled" }
          : item
      )
    );
    setCancelId(null);
  };

  const handleDelete = id => {
    setLeaves(previous =>
      previous.filter(item => item.id !== id)
    );
  };

  const selectedAttachmentName = attachment => {
    if (!attachment) return "Choose a file to upload";
    return typeof attachment === "string"
      ? attachment
      : attachment.name;
  };

  return (
    <div className="apply-leave-page">

      {/* Header */}
      <header className="leave-page-header">
        <div>
          <span className="leave-eyebrow">TIME OFF MANAGEMENT</span>
          <h1>Apply Leave</h1>
          <p>
            Manage your leave requests and track your available balance.
          </p>
        </div>

        <button
          className="leave-primary-btn"
          type="button"
          onClick={openAdd}
        >
          <Plus size={17} />
          Apply for Leave
        </button>
      </header>

      {/* Single row of leave balance cards */}
      <section className="leave-balance-grid">
        {balanceCards.map(item => {
          const Icon = item.icon;

          return (
            <article className="leave-balance-card" key={item.name}>
              <div className="leave-balance-top">
                <div className={`leave-balance-icon ${item.color}`}>
                  <Icon size={19} />
                </div>
                <span className="leave-balance-label">
                  Available
                </span>
              </div>

              <div className="leave-balance-numbers">
                <h2>{item.remaining}</h2>
                <span>/ {item.total} days</span>
              </div>

              <p className="leave-balance-name">{item.name}</p>

              <div className="leave-progress">
                <span
                  className={item.color}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="leave-balance-footer">
                <span>{item.used} used</span>
                <strong>{item.remaining} remaining</strong>
              </div>
            </article>
          );
        })}
      </section>

      {/* Applications table */}
      <section className="leave-application-card">
        <div className="leave-table-heading">
          <div>
            <h2>My Leave Applications</h2>
            <p>
              {leaves.length} applications · {pendingCount} pending ·{" "}
              {approvedCount} approved
            </p>
          </div>

          <span className="leave-record-count">
            {filteredLeaves.length} Records
          </span>
        </div>

        <div className="leave-toolbar">
          <div className="leave-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search leave type or reason..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                title="Clear search"
                onClick={() => setSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <select
            className="leave-filter"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="leave-table-wrapper">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Document</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong className="leave-type-text">
                      {item.type}
                    </strong>
                  </td>

                  <td>{formatDate(item.from)}</td>
                  <td>{formatDate(item.to)}</td>

                  <td>
                    <strong>{item.days} days</strong>
                  </td>

                  <td className="leave-reason">
                    {item.reason}
                  </td>

                  <td>
                    {item.attachment ? (
                      <span
                        className="leave-document-name"
                        title={selectedAttachmentName(item.attachment)}
                      >
                        <Paperclip size={14} />
                        {selectedAttachmentName(item.attachment)}
                      </span>
                    ) : (
                      <span className="leave-no-action">—</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`leave-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="leave-row-actions">
                      {item.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            title="Edit application"
                            className="leave-edit-action"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            title="Cancel application"
                            className="leave-delete-action"
                            onClick={() => setCancelId(item.id)}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          title="Delete record"
                          className="leave-delete-action"
                          onClick={() => handleDelete(item.id)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan="8" className="leave-empty">
                    <FileText size={25} />
                    <strong>No leave applications found</strong>
                    <span>
                      Try changing your search or status filter.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit modal */}
      {showModal && (
        <div
          className="leave-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="leave-modal"
            onClick={event => event.stopPropagation()}
          >
            <div className="leave-modal-header">
              <div>
                <span className="leave-eyebrow">LEAVE REQUEST</span>
                <h2>
                  {editingId
                    ? "Update Leave Application"
                    : "Apply for Leave"}
                </h2>
                <p>
                  Enter your leave details below.
                </p>
              </div>

              <button
                className="leave-close-btn"
                type="button"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="leave-form-grid">

                <div className="leave-form-group full">
                  <label>Leave Type *</label>
                  <select
                    value={form.type}
                    onChange={event =>
                      updateField("type", event.target.value)
                    }
                    required
                  >
                    {leaveBalances.map(item => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="leave-form-group">
                  <label>From Date *</label>
                  <input
                    type="date"
                    value={form.from}
                    onChange={event =>
                      updateField("from", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="leave-form-group">
                  <label>To Date *</label>
                  <input
                    type="date"
                    min={form.from || undefined}
                    value={form.to}
                    onChange={event =>
                      updateField("to", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="leave-form-group full">
                  <label>Reason for Leave *</label>
                  <textarea
                    rows="3"
                    placeholder="Enter your reason for leave..."
                    value={form.reason}
                    onChange={event =>
                      updateField("reason", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="leave-form-group full">
                  <label>Supporting Document (Optional)</label>

                  <label className="leave-upload">
                    <Upload size={18} />
                    <span>
                      {selectedAttachmentName(form.attachment)}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={event =>
                        updateField(
                          "attachment",
                          event.target.files?.[0] || null
                        )
                      }
                    />
                  </label>

                  <small>
                    Accepted formats: PDF, JPG, PNG
                  </small>
                </div>
              </div>

              <div className="leave-days-preview">
                <div>
                  <CalendarDays size={19} />
                  <span>Calculated Leave Days</span>
                </div>
                <strong>
                  {leaveDays} {leaveDays === 1 ? "Day" : "Days"}
                </strong>
              </div>

              <p className="leave-calculation-note">
                Weekends are excluded. Public holidays and half-day
                leave are not included in this calculation.
              </p>

              {error && (
                <div className="leave-form-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="leave-modal-footer">
                <button
                  type="button"
                  className="leave-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="leave-primary-btn"
                >
                  <Save size={16} />
                  {editingId
                    ? "Update Request"
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      {cancelId !== null && (
        <div className="leave-modal-overlay">
          <div className="leave-confirm-modal">
            <div className="leave-confirm-icon">
              <XCircle size={25} />
            </div>

            <h2>Cancel Leave Request?</h2>
            <p>
              Are you sure you want to cancel this pending leave
              application?
            </p>

            <div className="leave-modal-footer">
              <button
                type="button"
                className="leave-cancel-btn"
                onClick={() => setCancelId(null)}
              >
                Keep Request
              </button>

              <button
                type="button"
                className="leave-confirm-delete"
                onClick={handleCancel}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useMemo, useState } from "react";
import {
  Plus, Search, Pencil, Trash2, Clock3, CalendarDays,
  CheckCircle2, Timer, X, Briefcase, Save
} from "lucide-react";
import "./Timesheet.css";

const initialEntries = [
  {
    id: 1,
    date: "2026-11-26",
    project: "MDMPrimeX",
    task: "Dashboard UI Development",
    description: "Designed dashboard and timesheet components",
    startTime: "09:00",
    endTime: "18:00",
    breakTime: 60,
    hours: 8,
    status: "Approved"
  },
  {
    id: 2,
    date: "2026-11-25",
    project: "Maaden",
    task: "OpenDocs Integration",
    description: "Worked on loader and API integration",
    startTime: "09:30",
    endTime: "18:00",
    breakTime: 60,
    hours: 7.5,
    status: "Submitted"
  },
  {
    id: 3,
    date: "2026-11-24",
    project: "PIH",
    task: "Scheduler API Changes",
    description: "Modified scheduler API calls and validations",
    startTime: "09:00",
    endTime: "17:30",
    breakTime: 60,
    hours: 7.5,
    status: "Draft"
  },
  {
    id: 4,
    date: "2026-11-23",
    project: "JSW",
    task: "API Integration",
    description: "Tested account holder API response scenarios",
    startTime: "09:00",
    endTime: "18:00",
    breakTime: 60,
    hours: 8,
    status: "Approved"
  },
  {
    id: 5,
    date: "2026-11-20",
    project: "MDRM",
    task: "Data Validation",
    description: "Completed data validation and testing",
    startTime: "10:00",
    endTime: "18:00",
    breakTime: 60,
    hours: 7,
    status: "Submitted"
  }
];

const emptyForm = {
  date: "2026-11-26",
  project: "",
  task: "",
  description: "",
  startTime: "09:00",
  endTime: "18:00",
  breakTime: 60,
  status: "Draft"
};

export default function Timesheet() {
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  const calculateHours = (start, end, breakTime) => {
    if (!start || !end) return 0;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let minutes = (eh * 60 + em) - (sh * 60 + sm);
    if (minutes < 0) minutes += 24 * 60;

    return Math.max(0, (minutes - Number(breakTime || 0)) / 60);
  };

  const totalHours = entries.reduce(
    (sum, item) => sum + Number(item.hours), 0
  );

  const approvedHours = entries
    .filter(item => item.status === "Approved")
    .reduce((sum, item) => sum + Number(item.hours), 0);

  const filteredEntries = useMemo(() => {
    return entries.filter(item => {
      const matchesSearch =
        item.project.toLowerCase().includes(search.toLowerCase()) ||
        item.task.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [entries, search, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10)
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      date: item.date,
      project: item.project,
      task: item.task,
      description: item.description,
      startTime: item.startTime,
      endTime: item.endTime,
      breakTime: item.breakTime,
      status: item.status
    });
    setError("");
    setShowModal(true);
  };

  const updateField = (field, value) => {
    setForm(previous => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.project || !form.task ||
        !form.startTime || !form.endTime) {
      setError("Please complete all required fields.");
      return;
    }

    const hours = calculateHours(
      form.startTime,
      form.endTime,
      form.breakTime
    );

    if (hours <= 0) {
      setError("Please enter a valid working time.");
      return;
    }

    const record = {
      ...form,
      id: editingId || Date.now(),
      breakTime: Number(form.breakTime),
      hours: Number(hours.toFixed(2))
    };

    if (editingId) {
      setEntries(previous =>
        previous.map(item => item.id === editingId ? record : item)
      );
    } else {
      setEntries(previous => [record, ...previous]);
    }

    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleDelete = () => {
    setEntries(previous => previous.filter(item => item.id !== deleteId));
    setDeleteId(null);
  };

  const formatDate = (date) => {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatHours = (hours) => `${Number(hours).toFixed(1)}h`;

  return (
    <div className="timesheet-page">

      <div className="timesheet-header">
        <div>
          <span className="timesheet-eyebrow">TIME MANAGEMENT</span>
          <h1>My Timesheet</h1>
          <p>Track your working hours, projects and daily activities.</p>
        </div>

        <button className="ts-primary-btn" onClick={openAdd}>
          <Plus size={17} /> Add Timesheet
        </button>
      </div>

      {/* Summary cards */}
      <div className="ts-summary-grid">
        <div className="ts-summary-card">
          <div className="ts-summary-icon purple"><Clock3 /></div>
          <div>
            <h3>{formatHours(totalHours)}</h3>
            <p>Total Working Hours</p>
          </div>
        </div>

        <div className="ts-summary-card">
          <div className="ts-summary-icon blue"><Timer /></div>
          <div>
            <h3>{formatHours(approvedHours)}</h3>
            <p>Approved Hours</p>
          </div>
        </div>

        <div className="ts-summary-card">
          <div className="ts-summary-icon orange"><CalendarDays /></div>
          <div>
            <h3>{entries.length}</h3>
            <p>Total Entries</p>
          </div>
        </div>

        <div className="ts-summary-card">
          <div className="ts-summary-icon green"><CheckCircle2 /></div>
          <div>
            <h3>{entries.filter(e => e.status === "Submitted").length}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="ts-table-card">
        <div className="ts-table-heading">
          <div>
            <h2>Timesheet Entries</h2>
            <p>Manage and update your daily work records</p>
          </div>
          <span className="ts-record-count">{filteredEntries.length} Records</span>
        </div>

        <div className="ts-toolbar">
          <div className="ts-search">
            <Search size={17} />
            <input
              placeholder="Search project or task..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="ts-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
          </select>
        </div>

        <div className="ts-table-wrapper">
          <table className="ts-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project / Task</th>
                <th>Working Time</th>
                <th>Break</th>
                <th>Total Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="ts-date-cell">
                      <CalendarDays size={15} />
                      {formatDate(item.date)}
                    </div>
                  </td>

                  <td>
                    <strong className="ts-project">{item.project}</strong>
                    <span className="ts-task">{item.task}</span>
                    <span className="ts-description">{item.description}</span>
                  </td>

                  <td>
                    <span className="ts-time">
                      {item.startTime} - {item.endTime}
                    </span>
                  </td>

                  <td>{item.breakTime} min</td>

                  <td>
                    <strong className="ts-hours">{formatHours(item.hours)}</strong>
                  </td>

                  <td>
                    <span className={`ts-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="ts-actions">
                      <button
                        title="Edit"
                        className="ts-edit-btn"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        title="Delete"
                        className="ts-delete-btn"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan="7" className="ts-empty">
                    No timesheet records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="ts-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()}>
            <div className="ts-modal-header">
              <div>
                <span className="timesheet-eyebrow">
                  WORK LOG MANAGEMENT
                </span>
                <h2>{editingId ? "Update Timesheet" : "Add Timesheet"}</h2>
                <p>Enter your daily working details below.</p>
              </div>
              <button
                className="ts-close-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ts-form-grid">
                <div className="ts-form-group">
                  <label>Work Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => updateField("date", e.target.value)}
                    required
                  />
                </div>

                <div className="ts-form-group">
                  <label>Project *</label>
                  <select
                    value={form.project}
                    onChange={e => updateField("project", e.target.value)}
                    required
                  >
                    <option value="">Select Project</option>
                    <option value="MDMPrimeX">MDMPrimeX</option>
                    <option value="Maaden">Maaden</option>
                    <option value="PIH">PIH</option>
                    <option value="JSW">JSW</option>
                    <option value="MDRM">MDRM</option>
                    <option value="Integral">Integral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="ts-form-group full">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={form.task}
                    onChange={e => updateField("task", e.target.value)}
                    required
                  />
                </div>

                <div className="ts-form-group full">
                  <label>Work Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe the work completed..."
                    value={form.description}
                    onChange={e => updateField("description", e.target.value)}
                  />
                </div>

                <div className="ts-form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => updateField("startTime", e.target.value)}
                    required
                  />
                </div>

                <div className="ts-form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => updateField("endTime", e.target.value)}
                    required
                  />
                </div>

                <div className="ts-form-group">
                  <label>Break (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="1440"
                    value={form.breakTime}
                    onChange={e => updateField("breakTime", e.target.value)}
                  />
                </div>

                <div className="ts-form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => updateField("status", e.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>
              </div>

              <div className="ts-calculated-hours">
                <div>
                  <Clock3 size={18} />
                  <span>Calculated Working Hours</span>
                </div>
                <strong>
                  {formatHours(calculateHours(
                    form.startTime,
                    form.endTime,
                    form.breakTime
                  ))}
                </strong>
              </div>

              {error && <p className="ts-error">{error}</p>}

              <div className="ts-modal-footer">
                <button
                  type="button"
                  className="ts-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ts-primary-btn">
                  <Save size={16} />
                  {editingId ? "Save Changes" : "Save Timesheet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="ts-modal-overlay">
          <div className="ts-delete-modal">
            <div className="ts-delete-icon"><Trash2 size={24} /></div>
            <h2>Delete Timesheet?</h2>
            <p>Are you sure you want to delete this work entry? This action cannot be undone.</p>
            <div className="ts-modal-footer">
              <button
                className="ts-cancel-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button className="ts-confirm-delete" onClick={handleDelete}>
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

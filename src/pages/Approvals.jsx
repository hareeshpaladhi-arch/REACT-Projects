
import React, { useMemo, useState } from "react";
import {
  Search, CheckCircle2, XCircle, Clock3, CalendarDays,
  FileClock, Eye, X, Check, AlertCircle, History,
  BriefcaseBusiness, UserRound, Filter
} from "lucide-react";
import "./Approvals.css";

const initialRequests = [
  {
    id: 101,
    category: "Leave",
    employee: "Rahul Sharma",
    employeeId: "EMP001",
    department: "Development",
    type: "Casual Leave",
    from: "2026-12-04",
    to: "2026-12-05",
    days: 2,
    reason: "Personal work",
    submitted: "2026-11-25",
    status: "Pending"
  },
  {
    id: 102,
    category: "Leave",
    employee: "Priya Reddy",
    employeeId: "EMP002",
    department: "QA",
    type: "Sick Leave",
    from: "2026-11-27",
    to: "2026-11-28",
    days: 2,
    reason: "Health reasons",
    submitted: "2026-11-24",
    status: "Pending"
  },
  {
    id: 103,
    category: "Timesheet",
    employee: "Kiran Kumar",
    employeeId: "EMP003",
    department: "Development",
    project: "Maaden",
    week: "Nov 16 - Nov 22, 2026",
    hours: 40,
    submitted: "2026-11-23",
    reason: "Weekly timesheet submission",
    status: "Pending",
    dailyHours: [
      { day: "Monday", date: "Nov 16", hours: 8 },
      { day: "Tuesday", date: "Nov 17", hours: 8 },
      { day: "Wednesday", date: "Nov 18", hours: 8 },
      { day: "Thursday", date: "Nov 19", hours: 8 },
      { day: "Friday", date: "Nov 20", hours: 8 }
    ]
  },
  {
    id: 104,
    category: "Timesheet",
    employee: "Suresh B",
    employeeId: "EMP004",
    department: "Integration",
    project: "PIH",
    week: "Nov 16 - Nov 22, 2026",
    hours: 38,
    submitted: "2026-11-23",
    reason: "Weekly timesheet submission",
    status: "Pending",
    dailyHours: [
      { day: "Monday", date: "Nov 16", hours: 8 },
      { day: "Tuesday", date: "Nov 17", hours: 7 },
      { day: "Wednesday", date: "Nov 18", hours: 8 },
      { day: "Thursday", date: "Nov 19", hours: 8 },
      { day: "Friday", date: "Nov 20", hours: 7 }
    ]
  },
  {
    id: 105,
    category: "Leave",
    employee: "Anjali Rao",
    employeeId: "EMP005",
    department: "HR",
    type: "Earned Leave",
    from: "2026-11-30",
    to: "2026-12-02",
    days: 3,
    reason: "Family function",
    submitted: "2026-11-20",
    status: "Approved",
    actionDate: "2026-11-21"
  },
  {
    id: 106,
    category: "Timesheet",
    employee: "Vikram R",
    employeeId: "EMP006",
    department: "Development",
    project: "JSW",
    week: "Nov 09 - Nov 15, 2026",
    hours: 35,
    submitted: "2026-11-16",
    reason: "Weekly timesheet submission",
    status: "Rejected",
    rejectionReason: "Please update the missing working hours.",
    actionDate: "2026-11-17",
    dailyHours: [
      { day: "Monday", date: "Nov 09", hours: 8 },
      { day: "Tuesday", date: "Nov 10", hours: 8 },
      { day: "Wednesday", date: "Nov 11", hours: 7 },
      { day: "Thursday", date: "Nov 12", hours: 6 },
      { day: "Friday", date: "Nov 13", hours: 6 }
    ]
  }
];

const formatDate = (date) =>
  new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

export default function Approvals() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const rejectedCount = requests.filter(r => r.status === "Rejected").length;

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesTab =
        activeTab === "All" || request.category === activeTab;

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const query = search.toLowerCase();

      const matchesSearch =
        request.employee.toLowerCase().includes(query) ||
        request.employeeId.toLowerCase().includes(query) ||
        request.department.toLowerCase().includes(query) ||
        (request.project || "").toLowerCase().includes(query) ||
        (request.type || "").toLowerCase().includes(query);

      return matchesTab && matchesStatus && matchesSearch;
    });
  }, [requests, activeTab, statusFilter, search]);

  const updateStatus = (id, status, reason = "") => {
    setRequests(previous =>
      previous.map(request =>
        request.id === id
          ? {
              ...request,
              status,
              rejectionReason: reason,
              actionDate: new Date().toISOString().slice(0, 10)
            }
          : request
      )
    );

    setSelectedRequest(null);
    setRejectRequest(null);
    setRejectionReason("");
    setError("");
  };

  const openReject = (request) => {
    setRejectRequest(request);
    setRejectionReason("");
    setError("");
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    updateStatus(rejectRequest.id, "Rejected", rejectionReason.trim());
  };

  const openDetails = (request) => {
    setSelectedRequest(request);
  };

  return (
    <div className="approvals-page">

      <div className="approvals-header">
        <div>
          <h1>Approvals</h1>
          <p>Review and manage employee leave and timesheet requests.</p>
        </div>

        <div className="approval-header-date">
          <CalendarDays size={16} />
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </div>
      </div>

      {/* Summary cards */}
      <div className="approval-stats">
        <div className="approval-stat-card">
          <div className="approval-stat-icon pending-icon">
            <Clock3 size={19} />
          </div>
          <div>
            <span>Pending Requests</span>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="approval-stat-card">
          <div className="approval-stat-icon approved-icon">
            <CheckCircle2 size={19} />
          </div>
          <div>
            <span>Approved</span>
            <h2>{approvedCount}</h2>
          </div>
        </div>

        <div className="approval-stat-card">
          <div className="approval-stat-icon rejected-icon">
            <XCircle size={19} />
          </div>
          <div>
            <span>Rejected</span>
            <h2>{rejectedCount}</h2>
          </div>
        </div>

        <div className="approval-stat-card">
          <div className="approval-stat-icon total-icon">
            <FileClock size={19} />
          </div>
          <div>
            <span>Total Requests</span>
            <h2>{requests.length}</h2>
          </div>
        </div>
      </div>

      {/* Main approval panel */}
      <section className="approval-panel">

        <div className="approval-panel-heading">
          <div>
            <h2>Approval Requests</h2>
            <p>Manage all employee submissions in one place.</p>
          </div>

          <div className="approval-history-label">
            <History size={15} />
            Approval History
          </div>
        </div>

        {/* Category tabs */}
        <div className="approval-tabs">
          {["All", "Leave", "Timesheet"].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "All" && <FileClock size={15} />}
              {tab === "Leave" && <CalendarDays size={15} />}
              {tab === "Timesheet" && <BriefcaseBusiness size={15} />}
              {tab === "All" ? "All Requests" : `${tab} Approvals`}
              {tab === "All" && (
                <span className="tab-count">{requests.length}</span>
              )}
              {tab === "Leave" && (
                <span className="tab-count">
                  {requests.filter(r => r.category === "Leave").length}
                </span>
              )}
              {tab === "Timesheet" && (
                <span className="tab-count">
                  {requests.filter(r => r.category === "Timesheet").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="approval-toolbar">
          <div className="approval-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search employee, ID, project..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="approval-filter">
            <Filter size={15} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="approval-table-wrapper">
          <table className="approval-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Request Type</th>
                <th>Details</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td>
                    <div className="approval-employee">
                      <div className="employee-avatar">
                        {request.employee
                          .split(" ")
                          .map(word => word[0])
                          .slice(0, 2)
                          .join("")
                        }
                      </div>
                      <div>
                        <strong>{request.employee}</strong>
                        <span>{request.employeeId} · {request.department}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`request-type ${request.category.toLowerCase()}`}>
                      {request.category === "Leave"
                        ? <CalendarDays size={13} />
                        : <BriefcaseBusiness size={13} />}
                      {request.category}
                    </span>
                  </td>

                  <td>
                    {request.category === "Leave" ? (
                      <div className="request-details">
                        <strong>{request.type}</strong>
                        <span>
                          {formatDate(request.from)} – {formatDate(request.to)}
                        </span>
                        <small>{request.days} day(s)</small>
                      </div>
                    ) : (
                      <div className="request-details">
                        <strong>{request.project} Project</strong>
                        <span>{request.week}</span>
                        <small>{request.hours} hours</small>
                      </div>
                    )}
                  </td>

                  <td className="submitted-date">
                    {formatDate(request.submitted)}
                  </td>

                  <td>
                    <span className={`approval-status ${request.status.toLowerCase()}`}>
                      <span className="status-dot" />
                      {request.status}
                    </span>
                  </td>

                  <td>
                    <div className="approval-actions">
                      <button
                        className="action-view"
                        title="View details"
                        onClick={() => openDetails(request)}
                      >
                        <Eye size={16} />
                      </button>

                      {request.status === "Pending" && (
                        <>
                          <button
                            className="action-approve"
                            title="Approve"
                            onClick={() => updateStatus(request.id, "Approved")}
                          >
                            <Check size={16} />
                          </button>

                          <button
                            className="action-reject"
                            title="Reject"
                            onClick={() => openReject(request)}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="approval-empty">
                      <FileClock size={30} />
                      <strong>No requests found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="approval-table-footer">
          Showing {filteredRequests.length} of {requests.length} requests
          <span>
            {pendingCount} requests awaiting your action
          </span>
        </div>
      </section>

      {/* Details modal */}
      {selectedRequest && (
        <div className="approval-modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div
            className="approval-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="approval-modal-header">
              <div>
                <h2>Request Details</h2>
                <p>Request #{selectedRequest.id}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="approval-detail-employee">
              <div className="employee-avatar large">
                {selectedRequest.employee.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </div>
              <div>
                <strong>{selectedRequest.employee}</strong>
                <span>
                  {selectedRequest.employeeId} · {selectedRequest.department}
                </span>
              </div>
              <span className={`approval-status ${selectedRequest.status.toLowerCase()}`}>
                <span className="status-dot" />
                {selectedRequest.status}
              </span>
            </div>

            <div className="approval-detail-grid">
              <div>
                <label>Request Category</label>
                <strong>{selectedRequest.category}</strong>
              </div>

              <div>
                <label>Submitted Date</label>
                <strong>{formatDate(selectedRequest.submitted)}</strong>
              </div>

              {selectedRequest.category === "Leave" ? (
                <>
                  <div>
                    <label>Leave Type</label>
                    <strong>{selectedRequest.type}</strong>
                  </div>
                  <div>
                    <label>Duration</label>
                    <strong>{selectedRequest.days} day(s)</strong>
                  </div>
                  <div>
                    <label>From Date</label>
                    <strong>{formatDate(selectedRequest.from)}</strong>
                  </div>
                  <div>
                    <label>To Date</label>
                    <strong>{formatDate(selectedRequest.to)}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label>Project</label>
                    <strong>{selectedRequest.project}</strong>
                  </div>
                  <div>
                    <label>Total Hours</label>
                    <strong>{selectedRequest.hours} hours</strong>
                  </div>
                  <div className="detail-full">
                    <label>Week Period</label>
                    <strong>{selectedRequest.week}</strong>
                  </div>
                </>
              )}

              <div className="detail-full">
                <label>Reason / Description</label>
                <strong>{selectedRequest.reason}</strong>
              </div>
            </div>

            {selectedRequest.category === "Timesheet" &&
              selectedRequest.dailyHours && (
                <div className="daily-hours-section">
                  <h3>Daily Working Hours</h3>
                  {selectedRequest.dailyHours.map((day, index) => (
                    <div className="daily-hours-row" key={index}>
                      <span>{day.day} <small>{day.date}</small></span>
                      <strong>{day.hours} hrs</strong>
                    </div>
                  ))}
                </div>
              )}

            {selectedRequest.rejectionReason && (
              <div className="rejection-note">
                <AlertCircle size={16} />
                <div>
                  <strong>Rejection Reason</strong>
                  <p>{selectedRequest.rejectionReason}</p>
                </div>
              </div>
            )}

            {selectedRequest.status === "Pending" && (
              <div className="approval-modal-actions">
                <button
                  className="modal-reject-button"
                  onClick={() => {
                    const request = selectedRequest;
                    setSelectedRequest(null);
                    openReject(request);
                  }}
                >
                  Reject Request
                </button>
                <button
                  className="modal-approve-button"
                  onClick={() => updateStatus(selectedRequest.id, "Approved")}
                >
                  <Check size={16} /> Approve Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectRequest && (
        <div className="approval-modal-overlay" onClick={() => setRejectRequest(null)}>
          <div
            className="approval-reject-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="approval-modal-header">
              <div>
                <h2>Reject Request</h2>
                <p>{rejectRequest.employee} · {rejectRequest.category}</p>
              </div>
              <button onClick={() => setRejectRequest(null)}>
                <X size={20} />
              </button>
            </div>

            <label className="reject-reason-label">Reason for rejection</label>
            <textarea
              rows="4"
              placeholder="Enter the reason for rejecting this request..."
              value={rejectionReason}
              onChange={e => {
                setRejectionReason(e.target.value);
                setError("");
              }}
            />

            {error && <span className="approval-error">{error}</span>}

            <div className="approval-modal-actions">
              <button
                className="modal-cancel-button"
                onClick={() => setRejectRequest(null)}
              >
                Cancel
              </button>
              <button
                className="modal-reject-button"
                onClick={submitRejection}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

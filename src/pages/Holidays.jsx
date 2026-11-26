
import React, { useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, CalendarDays, X,
  Pencil, Trash2, MapPin, Clock3
} from "lucide-react";
import "./Holidays.css";

const initialHolidays = [
  { id: 1, date: "2026-01-01", name: "New Year's Day", type: "Company" },
  { id: 2, date: "2026-01-26", name: "Republic Day", type: "National" },
  { id: 3, date: "2026-03-04", name: "Holi", type: "Festival" },
  { id: 4, date: "2026-04-03", name: "Good Friday", type: "Festival" },
  { id: 5, date: "2026-05-01", name: "Labour Day", type: "Company" },
  { id: 6, date: "2026-08-15", name: "Independence Day", type: "National" },
  { id: 7, date: "2026-09-05", name: "Company Foundation Day", type: "Company" },
  { id: 8, date: "2026-10-02", name: "Gandhi Jayanti", type: "National" },
  { id: 9, date: "2026-10-20", name: "Dussehra", type: "Festival" },
  { id: 10, date: "2026-12-25", name: "Christmas", type: "Festival" }
];

const pad = value => String(value).padStart(2, "0");

const dateKey = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatDate = value =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export default function Holidays() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [holidays, setHolidays] = useState(initialHolidays);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [form, setForm] = useState({
    name: "",
    date: dateKey(today),
    type: "National",
    description: ""
  });
  const [error, setError] = useState("");

  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthHolidays = useMemo(
    () => holidays.filter(item => {
      const date = new Date(`${item.date}T00:00:00`);
      return date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    }),
    [holidays, currentMonth, currentYear]
  );

  const upcomingHolidays = useMemo(() => {
    const todayKey = dateKey(today);
    return [...holidays]
      .filter(item => item.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [holidays]);

  const holidayMap = useMemo(() => {
    const map = {};
    holidays.forEach(item => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [holidays]);

  const goToPreviousMonth = () => {
    const date = new Date(currentYear, currentMonth - 1, 1);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    setSelectedHoliday(null);
  };

  const goToNextMonth = () => {
    const date = new Date(currentYear, currentMonth + 1, 1);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    setSelectedHoliday(null);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(dateKey(today));
    setSelectedHoliday(null);
  };

  const openAddModal = (date = selectedDate) => {
    setEditingId(null);
    setForm({
      name: "",
      date,
      type: "National",
      description: ""
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = holiday => {
    setEditingId(holiday.id);
    setForm({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      description: holiday.description || ""
    });
    setError("");
    setShowModal(true);
  };

  const saveHoliday = event => {
    event.preventDefault();

    if (!form.name.trim() || !form.date) {
      setError("Please enter a holiday name and date.");
      return;
    }

    const duplicate = holidays.some(item =>
      item.date === form.date &&
      item.id !== editingId &&
      item.name.toLowerCase() === form.name.trim().toLowerCase()
    );

    if (duplicate) {
      setError("This holiday already exists on this date.");
      return;
    }

    if (editingId !== null) {
      setHolidays(previous =>
        previous.map(item =>
          item.id === editingId
            ? { ...item, ...form, name: form.name.trim() }
            : item
        )
      );
    } else {
      const newHoliday = {
        id: Date.now(),
        ...form,
        name: form.name.trim()
      };
      setHolidays(previous => [...previous, newHoliday]);
    }

    const date = new Date(`${form.date}T00:00:00`);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    setSelectedDate(form.date);
    setSelectedHoliday(null);
    setShowModal(false);
  };

  const deleteHoliday = id => {
    setHolidays(previous => previous.filter(item => item.id !== id));
    setSelectedHoliday(null);
  };

  const selectDay = date => {
    setSelectedDate(dateKey(date));
    setSelectedHoliday(null);
  };

  const monthName = new Date(
    currentYear,
    currentMonth
  ).toLocaleDateString("en-IN", { month: "long" });

  return (
    <div className="holidays-page">

      <div className="holidays-header">
        <div>
          <h1>Holiday Calendar</h1>
          <p>View and manage your organization's holidays.</p>
        </div>

        <button className="holiday-add-btn" onClick={() => openAddModal()}>
          <Plus size={16} />
          Add Holiday
        </button>
      </div>

      <div className="holiday-calendar-layout">

        <section className="holiday-calendar-card">

          <div className="calendar-toolbar">
            <div className="calendar-month-title">
              <CalendarDays size={21} />
              <div>
                <h2>{monthName} {currentYear}</h2>
                <span>{monthHolidays.length} holidays this month</span>
              </div>
            </div>

            <div className="calendar-navigation">
              <button onClick={goToToday} className="today-btn">
                Today
              </button>
              <button onClick={goToPreviousMonth} title="Previous month">
                <ChevronLeft size={18} />
              </button>
              <button onClick={goToNextMonth} title="Next month">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="calendar-legend">
            <span><i className="legend-dot national" /> National</span>
            <span><i className="legend-dot festival" /> Festival</span>
            <span><i className="legend-dot company" /> Company</span>
          </div>

          <div className="full-calendar">

            <div className="calendar-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((date, index) => {
                const key = dateKey(date);
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isToday = key === dateKey(today);
                const isSelected = key === selectedDate;
                const dayHolidays = holidayMap[key] || [];

                return (
                  <div
                    key={index}
                    className={[
                      "calendar-day",
                      !isCurrentMonth ? "outside-month" : "",
                      isToday ? "today" : "",
                      isSelected ? "selected-day" : ""
                    ].join(" ")}
                    onClick={() => selectDay(date)}
                    onDoubleClick={() => openAddModal(key)}
                  >
                    <div className="calendar-day-top">
                      <span className="calendar-day-number">
                        {date.getDate()}
                      </span>
                      {isToday && <span className="today-label">Today</span>}
                    </div>

                    <div className="calendar-day-events">
                      {dayHolidays.slice(0, 2).map(holiday => (
                        <button
                          key={holiday.id}
                          className={`holiday-event ${holiday.type.toLowerCase()}`}
                          title={`${holiday.name} · ${holiday.type}`}
                          onClick={event => {
                            event.stopPropagation();
                            selectDay(date);
                            setSelectedHoliday(holiday);
                          }}
                        >
                          <span>{holiday.name}</span>
                        </button>
                      ))}

                      {dayHolidays.length > 2 && (
                        <span className="more-holidays">
                          +{dayHolidays.length - 2} more
                        </span>
                      )}
                    </div>

                    <button
                      className="calendar-add-day"
                      title="Add holiday"
                      onClick={event => {
                        event.stopPropagation();
                        openAddModal(key);
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-footer">
            <span>Double-click a date or use + to add a holiday.</span>
            <span>{holidays.length} holidays configured</span>
          </div>
        </section>

        <aside className="holiday-side-panel">

          <section className="holiday-side-card selected-date-card">
            <div className="side-card-heading">
              <div>
                <span className="side-eyebrow">SELECTED DATE</span>
                <h3>{formatDate(selectedDate)}</h3>
              </div>
              <CalendarDays size={19} />
            </div>

            {selectedHoliday ? (
              <div className="selected-holiday-detail">
                <span className={`holiday-type-pill ${selectedHoliday.type.toLowerCase()}`}>
                  {selectedHoliday.type}
                </span>
                <h4>{selectedHoliday.name}</h4>
                <p>{selectedHoliday.description || "Organization holiday."}</p>
                <div className="selected-holiday-actions">
                  <button onClick={() => openEditModal(selectedHoliday)}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => deleteHoliday(selectedHoliday.id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="selected-date-empty">
                {(holidayMap[selectedDate] || []).length > 0 ? (
                  holidayMap[selectedDate].map(item => (
                    <button
                      key={item.id}
                      className="side-holiday-item"
                      onClick={() => setSelectedHoliday(item)}
                    >
                      <span className={`legend-dot ${item.type.toLowerCase()}`} />
                      <span>{item.name}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))
                ) : (
                  <>
                    <p>No holiday on this date.</p>
                    <button
                      className="side-add-btn"
                      onClick={() => openAddModal(selectedDate)}
                    >
                      <Plus size={14} /> Add holiday
                    </button>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="holiday-side-card upcoming-card">
            <div className="upcoming-heading">
              <div>
                <span className="side-eyebrow">PLAN AHEAD</span>
                <h3>Upcoming Holidays</h3>
              </div>
              <Clock3 size={18} />
            </div>

            <div className="upcoming-list">
              {upcomingHolidays.length ? upcomingHolidays.map(item => (
                <button
                  key={item.id}
                  className="upcoming-item"
                  onClick={() => {
                    const date = new Date(`${item.date}T00:00:00`);
                    setCurrentMonth(date.getMonth());
                    setCurrentYear(date.getFullYear());
                    setSelectedDate(item.date);
                    setSelectedHoliday(item);
                  }}
                >
                  <div className="upcoming-date">
                    <strong>{new Date(`${item.date}T00:00:00`).getDate()}</strong>
                    <span>
                      {new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", {
                        month: "short"
                      })}
                    </span>
                  </div>
                  <div className="upcoming-info">
                    <strong>{item.name}</strong>
                    <span>{item.type}</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              )) : (
                <p className="no-upcoming">No upcoming holidays.</p>
              )}
            </div>
          </section>

          <div className="holiday-side-note">
            <MapPin size={15} />
            <span>Holiday calendar · India</span>
          </div>

        </aside>
      </div>

      {showModal && (
        <div className="holiday-modal-overlay" onClick={() => setShowModal(false)}>
          <form
            className="holiday-modal"
            onSubmit={saveHoliday}
            onClick={event => event.stopPropagation()}
          >
            <div className="holiday-modal-header">
              <div>
                <h2>{editingId !== null ? "Edit Holiday" : "Add Holiday"}</h2>
                <p>Enter the holiday information below.</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={19} />
              </button>
            </div>

            <label>Holiday Name</label>
            <input
              value={form.name}
              onChange={event => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Independence Day"
              autoFocus
            />

            <label>Holiday Date</label>
            <input
              type="date"
              value={form.date}
              onChange={event => setForm({ ...form, date: event.target.value })}
            />

            <label>Holiday Type</label>
            <select
              value={form.type}
              onChange={event => setForm({ ...form, type: event.target.value })}
            >
              <option value="National">National Holiday</option>
              <option value="Festival">Festival</option>
              <option value="Company">Company Holiday</option>
            </select>

            <label>Description (Optional)</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={event => setForm({
                ...form,
                description: event.target.value
              })}
              placeholder="Add a short description..."
            />

            {error && <p className="holiday-form-error">{error}</p>}

            <div className="holiday-modal-actions">
              <button
                type="button"
                className="holiday-cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="holiday-save-btn">
                {editingId !== null ? "Save Changes" : "Add Holiday"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

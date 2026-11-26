
import React from "react";
import ReactECharts from "echarts-for-react";

import {
  Clock3,
  CalendarDays,
  CheckCircle2,
  Timer,
  TrendingUp,
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  CalendarCheck,
} from "lucide-react";

import "./Dashboard.css";

const summaryCards = [
  {
    title: "Total Working Hours",
    value: "38.5",
    unit: "hrs",
    description: "Compared to 35.5 hrs last week",
    icon: Clock3,
    color: "purple",
    change: "+8.5%",
  },
  {
    title: "Average Daily Hours",
    value: "7.7",
    unit: "hrs",
    description: "Across 5 working days",
    icon: Timer,
    color: "blue",
    change: "+4.2%",
  },
  {
    title: "Available Leave",
    value: "32",
    unit: "days",
    description: "Your remaining leave balance",
    icon: CalendarDays,
    color: "orange",
    change: "Available",
  },
  {
    title: "Approved Leaves",
    value: "5",
    unit: "days",
    description: "Leave days used this year",
    icon: CheckCircle2,
    color: "green",
    change: "This year",
  },
];

const weeklyHours = [
  { day: "Mon", hours: 8 },
  { day: "Tue", hours: 7.5 },
  { day: "Wed", hours: 8 },
  { day: "Thu", hours: 7 },
  { day: "Fri", hours: 8 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];

const leaveCategories = [
  {
    name: "Casual Leave",
    used: 3,
    total: 12,
    color: "#7568EA",
    className: "casual",
  },
  {
    name: "Sick Leave",
    used: 1,
    total: 8,
    color: "#F2A65A",
    className: "sick",
  },
  {
    name: "Earned Leave",
    used: 1,
    total: 12,
    color: "#21B995",
    className: "earned",
  },
  {
    name: "Comp Off",
    used: 0,
    total: 8,
    color: "#E77DA9",
    className: "comp",
  },
];

const leaveTotal = leaveCategories.reduce(
  (sum, item) => sum + item.total,
  0
);

const leaveUsed = leaveCategories.reduce(
  (sum, item) => sum + item.used,
  0
);

const leaveAvailable = leaveTotal - leaveUsed;

const balancePercentage = Math.round(
  (leaveAvailable / leaveTotal) * 100
);

const timesheetOption = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "#20243A",
    borderWidth: 0,
    padding: 10,
    textStyle: {
      color: "#fff",
      fontSize: 12,
    },
    formatter: (params) =>
      `${params[0].axisValue}<br/>${params[0].value} working hours`,
  },

  grid: {
    left: 8,
    right: 12,
    top: 20,
    bottom: 12,
    containLabel: true,
  },

  xAxis: {
    type: "category",
    data: weeklyHours.map((item) => item.day),
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: {
      color: "#9298AA",
      fontSize: 11,
      margin: 13,
    },
  },

  yAxis: {
    type: "value",
    min: 0,
    max: 10,
    interval: 2,
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: {
      color: "#A0A5B5",
      fontSize: 10,
    },
    splitLine: {
      lineStyle: {
        color: "#ECEEF4",
        type: "dashed",
      },
    },
  },

  series: [
    {
      type: "bar",
      data: weeklyHours.map((item) => item.hours),
      barWidth: "42%",
      showBackground: true,

      backgroundStyle: {
        color: "#F2F1FC",
        borderRadius: [7, 7, 0, 0],
      },

      itemStyle: {
        color: "#7568EA",
        borderRadius: [7, 7, 0, 0],
      },

      emphasis: {
        itemStyle: {
          color: "#5144CF",
        },
      },
    },
  ],
};

const leaveBalanceOption = {
  tooltip: {
    show: true,
    trigger: "item",
    formatter: "{b}: {c} days",
  },

  series: [
    {
      type: "pie",
      radius: ["76%", "91%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: true,

      label: { show: false },

      itemStyle: {
        borderWidth: 3,
        borderColor: "#fff",
        borderRadius: 8,
      },

      data: [
        {
          value: leaveAvailable,
          name: "Available",
          itemStyle: { color: "#7568EA" },
        },
        {
          value: leaveUsed,
          name: "Used",
          itemStyle: { color: "#EDEBFA" },
        },
      ],
    },
  ],
};

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">
            <span className="eyebrow-dot" />
            WORKSPACE OVERVIEW
          </div>

          <h1>Dashboard</h1>

          <p>
            Welcome back! Here's your work and leave summary.
          </p>
        </div>

        <div className="dashboard-date">
          <CalendarDays size={16} />
          {currentDate}
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="summary-card" key={card.title}>

              <div className="summary-card-top">
                <div className={`summary-icon ${card.color}`}>
                  <Icon size={19} />
                </div>

                <span className={`summary-change ${card.color}`}>
                  {card.color !== "orange" && (
                    <TrendingUp size={12} />
                  )}
                  {card.change}
                </span>
              </div>

              <div className="summary-value">
                {card.value}
                <span>{card.unit}</span>
              </div>

              <div className="summary-title">
                {card.title}
              </div>

              <div className="summary-description">
                {card.description}
              </div>

            </div>
          );
        })}
      </div>

      {/* ANALYTICS HEADING */}

      <div className="dashboard-section-heading">
        <div>
          <h2>Work Analytics</h2>
          <p>
            Track your productivity and leave utilization.
          </p>
        </div>
      </div>

      {/* CHARTS */}

      <div className="charts-grid">

        {/* TIMESHEET OVERVIEW */}

        <section className="chart-card">

          <div className="chart-card-header">
            <div>
              <div className="chart-title-row">
                <div className="chart-heading-icon purple">
                  <BriefcaseBusiness size={17} />
                </div>

                <h2>Timesheet Overview</h2>
              </div>

              <p>Daily working hours and productivity</p>
            </div>

            <button className="chart-filter">
              This week
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="chart-highlight">
            <div>
              <div className="highlight-label">
                TOTAL LOGGED HOURS
              </div>

              <div className="highlight-value">
                38.5 <span>hrs</span>

                <span className="highlight-growth">
                  <ArrowUpRight size={13} />
                  8.5%
                </span>
              </div>
            </div>

            <div className="highlight-side">
              <span>Weekly target</span>
              <strong>40 hrs</strong>

              <div className="progress-track">
                <div className="progress-fill purple-fill" />
              </div>
            </div>
          </div>

          <div className="chart-container">
            <ReactECharts
              option={timesheetOption}
              notMerge={true}
              lazyUpdate={true}
              opts={{ renderer: "canvas" }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>

        </section>

        {/* LEAVE OVERVIEW */}

        <section className="chart-card leave-overview-card">

          <div className="chart-card-header">
            <div>
              <div className="chart-title-row">
                <div className="chart-heading-icon orange">
                  <CalendarCheck size={17} />
                </div>

                <h2>Leave Overview</h2>
              </div>

              <p>Your annual leave balance and utilization</p>
            </div>

            <button className="chart-filter">
              2026
              <ChevronDown size={14} />
            </button>
          </div>

          {/* BALANCE */}

          <div className="leave-balance-panel">

            <div className="leave-balance-main">
              <span className="leave-label">
                AVAILABLE LEAVES
              </span>

              <div className="leave-balance-value">
                {leaveAvailable}
                <span>days</span>
              </div>

              <span className="leave-subtitle">
                Remaining leave balance
              </span>
            </div>

            <div className="leave-circle">
              <ReactECharts
                option={leaveBalanceOption}
                notMerge={true}
                lazyUpdate={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />

              <div className="leave-circle-center">
                <strong>{balancePercentage}%</strong>
                <span>Balance</span>
              </div>
            </div>

          </div>

          {/* LEAVE STATS */}

          <div className="leave-stats-grid">

            <div className="leave-stat-box">
              <span className="leave-stat-dot purple-dot" />

              <div>
                <strong>{leaveTotal}</strong>
                <span>Total Allocated</span>
              </div>
            </div>

            <div className="leave-stat-box">
              <span className="leave-stat-dot orange-dot" />

              <div>
                <strong>{leaveUsed}</strong>
                <span>Used Leaves</span>
              </div>
            </div>

            <div className="leave-stat-box">
              <span className="leave-stat-dot green-dot" />

              <div>
                <strong>{leaveAvailable}</strong>
                <span>Available</span>
              </div>
            </div>

          </div>

          {/* CATEGORY BREAKDOWN */}

          <div className="leave-category-heading">
            <strong>Leave Breakdown</strong>
            <span>Used days</span>
          </div>

          <div className="leave-category-list">

            {leaveCategories.map((leave) => {
              const percentage =
                leave.total > 0
                  ? (leave.used / leave.total) * 100
                  : 0;

              return (
                <div
                  className="leave-category-item"
                  key={leave.name}
                >

                  <div className="leave-category-info">

                    <div className="leave-category-name">
                      <span
                        className={`category-dot ${leave.className}`}
                      />

                      {leave.name}
                    </div>

                    <strong>
                      {leave.used} {leave.used === 1 ? "day" : "days"}
                    </strong>

                  </div>

                  <div className="leave-progress">
                    <span
                      style={{
                        width: `${percentage}%`,
                        background: leave.color,
                      }}
                    />
                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </div>

      {/* BOTTOM INFORMATION */}

      <div className="dashboard-bottom">

        <div className="bottom-info">
          <div className="bottom-info-icon">
            <Clock3 size={17} />
          </div>

          <div>
            <strong>Weekly work summary</strong>

            <p>
              You've completed 96% of your weekly working hour target.
            </p>
          </div>
        </div>

        <div className="bottom-info">
          <div className="bottom-info-icon green-icon">
            <CheckCircle2 size={17} />
          </div>

          <div>
            <strong>Leave balance status</strong>

            <p>
              You have {leaveAvailable} leave days available this year.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

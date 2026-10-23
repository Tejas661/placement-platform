import { useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Send,
  ListChecks,
  Award,
  ArrowUpRight,
  ArrowRight,
  Bell,
  ChevronRight,
} from "lucide-react";

const STATS = [
  { key: "jobs", label: "Jobs available", title: "Available Jobs", value: 0, icon: Briefcase, empty: "New listings appear here as recruiters post them." },
  { key: "apps", label: "Jobs applied", title: "Applications", value: 0, icon: Send, empty: "You haven't applied to any roles yet." },
  { key: "shortlist", label: "Applications shortlisted", title: "Shortlisted", value: 0, icon: ListChecks, empty: "Shortlists from recruiters will show up here." },
  { key: "offers", label: "Offers received", title: "Offers", value: 0, icon: Award, empty: "Your first offer letter will land right here." },
];

const JOURNEY = ["Registered", "Applied", "Shortlisted", "Offer Received"];
const CURRENT_STAGE = 0; // index into JOURNEY

function Dashboard() {
  const navigate = useNavigate();
  const [activeStat, setActiveStat] = useState(null);
  const [jobs, setJobs] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("access_token");

  fetch("http://127.0.0.1:8000/api/jobs/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setJobs(data);
      console.log("Jobs:", data);
    })
    .catch((error) => {
      console.log("Error fetching jobs:", error);
    });
}, []);
  return (
    <div className="pd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .pd-root {
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(circle at 90% -5%, rgba(242,184,75,0.08), transparent 40%),
            #0A0F1E;
          color: #EDF1F8;
          font-family: 'Inter', sans-serif;
          padding-bottom: 60px;
        }

        /* ---------- TOPBAR ---------- */
        .pd-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 44px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .pd-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pd-brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, #F2B84B, #C98A2C);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #0A0F1E;
          box-shadow: 0 0 20px rgba(242,184,75,0.3);
        }

        .pd-brand-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8792A6;
        }

        .pd-topbar-right {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .pd-bell {
          position: relative;
          color: #8792A6;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .pd-bell:hover { color: #EDF1F8; }
        .pd-bell::after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #F2B84B;
          border: 1.5px solid #0A0F1E;
        }

        .pd-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #1B2740;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #C7CEDB;
        }

        /* ---------- HERO ---------- */
        .pd-hero {
          padding: 44px 44px 0 44px;
          animation: pd-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .pd-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #F2B84B;
          margin-bottom: 10px;
        }

        .pd-hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.4px;
          margin: 0 0 8px 0;
        }

        .pd-hero p {
          font-size: 14.5px;
          color: #8792A6;
          margin: 0;
        }

        @keyframes pd-rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ---------- JOURNEY STRIP ---------- */
        .pd-journey {
          margin: 34px 44px 0 44px;
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 22px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pd-journey-track {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .pd-journey-step {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .pd-journey-step:last-child { flex: 0; }

        .pd-journey-node-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 30px;
        }

        .pd-journey-node {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #1E293F;
          border: 1.5px solid rgba(255,255,255,0.18);
          flex-shrink: 0;
        }

        .pd-journey-node.pd-done {
          background: #F2B84B;
          border-color: #F2B84B;
          box-shadow: 0 0 0 4px rgba(242,184,75,0.15), 0 0 14px rgba(242,184,75,0.5);
        }

        .pd-journey-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #5B6579;
          white-space: nowrap;
        }

        .pd-journey-label.pd-done { color: #F2B84B; }

        .pd-journey-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 0 6px;
          margin-bottom: 22px;
        }

        .pd-journey-cta {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #F2B84B;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          white-space: nowrap;
          margin-left: 24px;
          transition: gap 0.2s ease;
        }
        .pd-journey-cta:hover { gap: 9px; }

        /* ---------- STAT GRID ---------- */
        .pd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin: 34px 44px 0 44px;
        }

        .pd-stat {
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 24px 24px 20px 24px;
          cursor: default;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .pd-stat:hover {
          transform: translateY(-3px);
          border-color: rgba(242,184,75,0.35);
          box-shadow: 0 14px 30px rgba(0,0,0,0.35);
        }

        .pd-stat-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .pd-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(242,184,75,0.1);
          color: #F2B84B;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pd-stat-trend {
          color: #4B5468;
          display: flex;
          align-items: center;
        }

        .pd-stat h3 {
          font-size: 13px;
          font-weight: 500;
          color: #8792A6;
          margin: 18px 0 4px 0;
        }

        .pd-stat .pd-stat-value {
          font-family: 'Sora', sans-serif;
          font-size: 36px;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .pd-stat .pd-stat-sub {
          font-size: 12.5px;
          color: #5B6579;
          margin: 6px 0 0 0;
        }

        .pd-stat-empty {
          font-size: 12px;
          color: #4B5468;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed rgba(255,255,255,0.08);
          line-height: 1.5;
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: opacity 0.25s ease, max-height 0.25s ease, margin-top 0.25s ease;
        }

        .pd-stat:hover .pd-stat-empty {
          opacity: 1;
          max-height: 60px;
          margin-top: 10px;
        }

        /* ---------- QUICK ACTIONS ---------- */
        .pd-actions {
          margin: 34px 44px 0 44px;
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 28px 30px;
        }

        .pd-actions h2 {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .pd-actions .pd-actions-sub {
          font-size: 13px;
          color: #5B6579;
          margin: 0 0 22px 0;
        }

        .pd-actions-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .pd-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          background: #17213A;
          color: #EDF1F8;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s ease, transform 0.15s ease, background 0.2s ease;
        }

        .pd-action-btn.pd-primary {
          background: linear-gradient(135deg, #F2B84B, #D9962F);
          color: #14100A;
          border: none;
          box-shadow: 0 8px 22px rgba(242,184,75,0.18);
        }

        .pd-action-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(242,184,75,0.4);
        }

        .pd-action-btn.pd-primary:hover {
          filter: brightness(1.05);
          box-shadow: 0 10px 26px rgba(242,184,75,0.3);
        }

        .pd-action-btn svg { flex-shrink: 0; }

        @media (max-width: 720px) {
          .pd-topbar, .pd-hero, .pd-journey, .pd-grid, .pd-actions {
            margin-left: 20px;
            margin-right: 20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .pd-journey { flex-direction: column; align-items: stretch; gap: 16px; }
          .pd-journey-cta { margin-left: 0; }
        }
      `}</style>

      <div className="pd-topbar">
        <div className="pd-brand">
          <div className="pd-brand-mark">PP</div>
          <div className="pd-brand-name">Placement Platform</div>
        </div>
        <div className="pd-topbar-right">
          <Bell size={19} className="pd-bell" />
          <div className="pd-avatar">S</div>
        </div>
      </div>

      <div className="pd-hero">
        <div className="pd-eyebrow">Student Dashboard</div>
        <h1>Welcome to your placement portal</h1>
        <p>Here's where your applications, shortlists and offers will show up as they happen.</p>
      </div>

      <div className="pd-journey">
        <div className="pd-journey-track">
          {JOURNEY.map((stage, i) => (
            <div className="pd-journey-step" key={stage}>
              <div className="pd-journey-node-wrap">
                <div className={`pd-journey-node ${i <= CURRENT_STAGE ? "pd-done" : ""}`} />
                <span className={`pd-journey-label ${i <= CURRENT_STAGE ? "pd-done" : ""}`}>{stage}</span>
              </div>
              {i < JOURNEY.length - 1 && <div className="pd-journey-line" />}
            </div>
          ))}
        </div>
        <div
  className="pd-journey-cta"
  onClick={() => navigate("/jobs")}
>
  View jobs <ArrowRight size={14} />
</div>
      </div>

      <div className="pd-grid">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              className="pd-stat"
              key={stat.key}
              onMouseEnter={() => setActiveStat(stat.key)}
              onMouseLeave={() => setActiveStat(null)}
            >
              <div className="pd-stat-top">
                <div className="pd-stat-icon">
                  <Icon size={18} />
                </div>
                <div className="pd-stat-trend">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3>{stat.title}</h3>
              <p className="pd-stat-value">
  {stat.key === "jobs" ? jobs.length : stat.value}
</p>
              <p className="pd-stat-sub">{stat.label}</p>
              <div className="pd-stat-empty">{stat.empty}</div>
            </div>
          );
        })}
      </div>

      <div className="pd-actions">
        <h2>Quick actions</h2>
        <p className="pd-actions-sub">Jump back into your job search.</p>
        <div className="pd-actions-row">
          <button
  className="pd-action-btn pd-primary"
  onClick={() => navigate("/jobs")}
>
  <Briefcase size={16} />
  View Jobs
</button>
          <button className="pd-action-btn">
            <Send size={16} />
            My Applications
          </button>
          <button className="pd-action-btn">
            <ChevronRight size={16} />
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
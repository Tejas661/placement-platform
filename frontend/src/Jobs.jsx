import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Search,
  Clock,
  ArrowRight,
  Check,
  SlidersHorizontal,
} from "lucide-react";

function daysLeft(deadline) {
  const diff = new Date(deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function urgencyMeta(days) {
  if (days <= 2) {
    return {
      color: "#E8604C",
      bg: "rgba(232,96,76,0.14)",
    };
  }

  if (days <= 7) {
    return {
      color: "#F2B84B",
      bg: "rgba(242,184,75,0.14)",
    };
  }

  return {
    color: "#4ADE80",
    bg: "rgba(74,222,128,0.14)",
  };
}

function formatDeadline(deadline) {
  return new Date(deadline).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function JobCardSkeleton() {
  return (
    <div className="job-card skeleton">
      <div className="sk-icon" />
      <div className="sk-line" style={{ width: "70%", height: 20 }} />
      <div className="sk-line" style={{ width: "45%", height: 14 }} />
      <div className="sk-line" style={{ width: "90%" }} />
      <div className="sk-line" style={{ width: "80%" }} />
      <div className="sk-line" style={{ width: "60%" }} />
      <div className="sk-button" />
    </div>
  );
}

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [query, setQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");
  const [applied, setApplied] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://127.0.0.1:8000/api/jobs/", {
      method: "GET",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        return response.json();
      })
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.log(error);
          setErrored(true);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const locations = useMemo(() => {
    const locationSet = new Set(
      jobs.map((job) => job.location).filter(Boolean)
    );

    return ["All", ...Array.from(locationSet)];
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    let list = jobs.filter((job) => {
      const searchText = query.toLowerCase();

      const matchesQuery =
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText);

      const matchesLocation =
        activeLocation === "All" ||
        job.location === activeLocation;

      return matchesQuery && matchesLocation;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      }

      if (sortBy === "salary") {
        return (
          (parseFloat(b.salary) || 0) -
          (parseFloat(a.salary) || 0)
        );
      }

      return 0;
    });

    return list;
  }, [jobs, query, activeLocation, sortBy]);

  const applyJob = async (jobId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs/${jobId}/apply/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setApplied((prev) => ({
          ...prev,
          [jobId]: true,
        }));

        alert("Applied successfully!");
      } else {
        alert(data.error || "Unable to apply");
      }
    } catch (error) {
      console.log(error);
      alert("Backend server is not running");
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

        * {
          box-sizing: border-box;
        }

        .job-card {
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: 0.25s ease;
        }

        .job-card:hover {
          transform: translateY(-4px);
          border-color: rgba(242,184,75,0.35);
          box-shadow: 0 16px 32px rgba(0,0,0,0.35);
        }

        .urgency-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .icon-badge {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(242,184,75,0.12);
          color: #F2B84B;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .apply-btn {
          width: 100%;
          padding: 11px;
          margin-top: 16px;
          border: none;
          border-radius: 8px;
          background: #F2B84B;
          color: #14100A;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .apply-btn:hover {
          filter: brightness(1.08);
        }

        .apply-btn.applied {
          background: rgba(74,222,128,0.14);
          color: #4ADE80;
          cursor: default;
        }

        .pill {
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #8792A6;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
        }

        .pill.active {
          background: #F2B84B;
          border-color: #F2B84B;
          color: #14100A;
          font-weight: 600;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .search-input {
          width: 100%;
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 11px 14px 11px 40px;
          color: #EDF1F8;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .search-input:focus {
          border-color: #F2B84B;
        }

        .search-input::placeholder {
          color: #5D6675;
        }

        .sort-select {
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 11px 14px;
          color: #EDF1F8;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #8792A6;
        }

        .sk-icon,
        .sk-line,
        .sk-button {
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          animation: shimmer 1.4s infinite;
        }

        .sk-icon {
          width: 42px;
          height: 42px;
          margin-bottom: 16px;
        }

        .sk-line {
          height: 12px;
          margin: 8px 0;
        }

        .sk-button {
          height: 42px;
          margin-top: 16px;
        }

        @keyframes shimmer {
          0% {
            opacity: 0.4;
          }

          50% {
            opacity: 0.8;
          }

          100% {
            opacity: 0.4;
          }
        }

        @media (max-width: 700px) {
          .job-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.heading}>Available Jobs</h1>

          <p style={styles.subtitle}>
            {loading
              ? "Loading opportunities..."
              : `${visibleJobs.length} ${
                  visibleJobs.length === 1 ? "role" : "roles"
                } matching your search`}
          </p>
        </div>
      </div>

      <div style={styles.controls}>
        <div className="search-wrap">
          <Search size={16} style={styles.searchIcon} />

          <input
            className="search-input"
            placeholder="Search by title or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="deadline">
            Sort: Deadline soonest
          </option>

          <option value="salary">
            Sort: Salary high to low
          </option>
        </select>
      </div>

      <div style={styles.pillRow}>
        <SlidersHorizontal
          size={14}
          style={{
            color: "#5D6675",
            flexShrink: 0,
          }}
        />

        {locations.map((location) => (
          <button
            key={location}
            className={`pill ${
              activeLocation === location ? "active" : ""
            }`}
            onClick={() => setActiveLocation(location)}
          >
            {location}
          </button>
        ))}
      </div>

      <div
        className="job-grid"
        style={styles.grid}
      >
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}

        {!loading && visibleJobs.length === 0 && (
          <div className="empty-state">
            <Briefcase
              size={28}
              style={{
                marginBottom: 10,
                opacity: 0.6,
              }}
            />

            <p
              style={{
                margin: 0,
                fontWeight: 600,
                color: "#EDF1F8",
              }}
            >
              No roles found
            </p>

            <p style={{ margin: "4px 0 0" }}>
              Try a different keyword or location.
            </p>
          </div>
        )}

        {!loading &&
          visibleJobs.map((job) => {
            const days = daysLeft(job.deadline);
            const urgency = urgencyMeta(days);
            const isApplied = !!applied[job.id];

            return (
              <div
                className="job-card"
                key={job.id}
              >
                <div
                  className="urgency-bar"
                  style={{
                    background: urgency.color,
                  }}
                />

                <div style={styles.cardTopRow}>
                  <div className="icon-badge">
                    <Briefcase size={20} />
                  </div>

                  <span
                    style={{
                      ...styles.urgencyBadge,
                      color: urgency.color,
                      background: urgency.bg,
                    }}
                  >
                    <Clock size={12} />

                    {days > 0
                      ? `${days}d left`
                      : "Closing today"}
                  </span>
                </div>

                <h2 style={styles.jobTitle}>
                  {job.title}
                </h2>

                <p style={styles.company}>
                  {job.company}
                </p>

                <div style={styles.metaRow}>
                  <MapPin
                    size={15}
                    style={styles.metaIcon}
                  />

                  {job.location}
                </div>

                <div style={styles.metaRow}>
                  <Calendar
                    size={15}
                    style={styles.metaIcon}
                  />

                  Deadline: {formatDeadline(job.deadline)}
                </div>

                <p style={styles.description}>
                  {job.description}
                </p>

                <div style={styles.salaryRow}>
                  <IndianRupee
                    size={16}
                    style={{
                      color: "#F2B84B",
                    }}
                  />

                  <span style={styles.salaryText}>
                    {job.salary}
                  </span>
                </div>

                <button
                  className={`apply-btn ${
                    isApplied ? "applied" : ""
                  }`}
                  disabled={isApplied}
                  onClick={() => applyJob(job.id)}
                >
                  {isApplied ? (
                    <>
                      <Check size={16} />
                      Applied
                    </>
                  ) : (
                    <>
                      Apply Now
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
      </div>

      {errored && (
        <p style={styles.errorNote}>
          Couldn't reach the jobs API. Make sure Django backend is running.
        </p>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0A0F1E",
    color: "#EDF1F8",
    padding: "40px",
    fontFamily: "'Inter', sans-serif",
  },

  headerRow: {
    marginBottom: "24px",
  },

  heading: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "32px",
    margin: 0,
  },

  subtitle: {
    color: "#8792A6",
    marginTop: "6px",
  },

  controls: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#5D6675",
  },

  pillRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "28px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  cardTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  urgencyBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 9px",
    borderRadius: "999px",
    fontFamily: "'IBM Plex Mono', monospace",
  },

  jobTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "19px",
    margin: "16px 0 2px",
  },

  company: {
    color: "#F2B84B",
    fontSize: "14px",
    margin: "0 0 12px",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#B8C0CE",
    fontSize: "14px",
    margin: "5px 0",
  },

  metaIcon: {
    color: "#5D6675",
    flexShrink: 0,
  },

  description: {
    color: "#8792A6",
    lineHeight: "1.55",
    fontSize: "13.5px",
    margin: "12px 0 0",
  },

  salaryRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "16px",
    paddingTop: "14px",
    borderTop:
      "1px solid rgba(255,255,255,0.06)",
  },

  salaryText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
    fontSize: "15px",
  },

  errorNote: {
    marginTop: "20px",
    color: "#E8604C",
    fontSize: "13px",
  },
};

export default Jobs;
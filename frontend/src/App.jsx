import { useState, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  Check,
  Upload,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import Dashboard from "./Dashboard";
import Jobs from "./Jobs";

const JOURNEY = [
  { label: "Registered" },
  { label: "Applied" },
  { label: "Shortlisted" },
  { label: "Offer Received" },
];


// =========================
// LOGIN
// =========================

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "idle") return;

    setStatus("loading");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);

        if (data.refresh) {
          localStorage.setItem("refresh_token", data.refresh);
        }

        setStatus("done");

        window.location.href = "/dashboard";
      } else {
        setStatus("idle");
        alert("Invalid username or password");
      }
    } catch (error) {
      setStatus("idle");
      alert("Backend server is not running");
      console.log(error);
    }
  };

  return (
    <div className="pp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
        }

        .pp-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          background: #0A0F1E;
          font-family: 'Inter', sans-serif;
          color: #EDF1F8;
        }

        .pp-left {
          position: relative;
          flex: 1.1;
          min-width: 0;
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            radial-gradient(circle at 15% 8%, rgba(242,184,75,0.10), transparent 45%),
            linear-gradient(180deg, #0D1426 0%, #0A0F1E 100%);
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .pp-dotgrid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            rgba(255,255,255,0.055) 1px,
            transparent 1px
          );
          background-size: 26px 26px;
          mask-image: radial-gradient(
            ellipse at 30% 20%,
            black 10%,
            transparent 65%
          );
          pointer-events: none;
        }

        .pp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1;
        }

        .pp-brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #F2B84B, #C98A2C);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #0A0F1E;
          letter-spacing: -0.5px;
          box-shadow: 0 0 24px rgba(242,184,75,0.35);
        }

        .pp-brand-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8792A6;
        }

        .pp-headline {
          z-index: 1;
          max-width: 420px;
          margin-top: 40px;
        }

        .pp-headline h1 {
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 40px;
          line-height: 1.15;
          margin: 0 0 14px 0;
          letter-spacing: -0.5px;
        }

        .pp-headline .accent {
          color: #F2B84B;
        }

        .pp-headline p {
          font-size: 15px;
          color: #8792A6;
          line-height: 1.6;
          margin: 0;
        }

        .pp-journey {
          z-index: 1;
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pp-step {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          padding-bottom: 34px;
        }

        .pp-step:last-child {
          padding-bottom: 0;
        }

        .pp-step-line {
          position: absolute;
          left: 10px;
          top: 24px;
          bottom: -10px;
          width: 1px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.16),
            rgba(255,255,255,0.04)
          );
        }

        .pp-step:last-child .pp-step-line {
          display: none;
        }

        .pp-node {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.22);
          background: #0A0F1E;
          flex-shrink: 0;
          z-index: 1;
        }

        .pp-node.pp-active {
          border-color: #F2B84B;
          background: #F2B84B;
          box-shadow:
            0 0 0 4px rgba(242,184,75,0.16),
            0 0 18px rgba(242,184,75,0.55);
          animation: pp-pulse 2.4s ease-in-out infinite;
        }

        @keyframes pp-pulse {
          0%, 100% {
            box-shadow:
              0 0 0 4px rgba(242,184,75,0.16),
              0 0 18px rgba(242,184,75,0.55);
          }

          50% {
            box-shadow:
              0 0 0 7px rgba(242,184,75,0.10),
              0 0 26px rgba(242,184,75,0.75);
          }
        }

        .pp-step-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: #8792A6;
          letter-spacing: 0.02em;
        }

        .pp-step.pp-active .pp-step-label {
          color: #F2B84B;
        }

        .pp-foot {
          z-index: 1;
          font-size: 12px;
          color: #4B5468;
          font-family: 'JetBrains Mono', monospace;
        }

        .pp-right {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #0A0F1E;
        }

        .pp-card {
          width: 100%;
          max-width: 380px;
          animation: pp-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes pp-rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pp-card-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #F2B84B;
          margin-bottom: 10px;
        }

        .pp-card h2 {
          font-family: 'Sora', sans-serif;
          font-size: 26px;
          font-weight: 600;
          margin: 0 0 8px 0;
          letter-spacing: -0.3px;
        }

        .pp-card .pp-sub {
          font-size: 14px;
          color: #8792A6;
          margin: 0 0 32px 0;
        }

        .pp-field {
          position: relative;
          margin-bottom: 20px;
        }

        .pp-field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #5B6579;
          transition: color 0.2s ease;
        }

        .pp-field:focus-within .pp-field-icon {
          color: #F2B84B;
        }

        .pp-field input {
          width: 100%;
          background: #121B2E;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 17px 16px 17px 46px;
          font-size: 14.5px;
          color: #EDF1F8;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .pp-field input::placeholder {
          color: #4B5468;
        }

        .pp-field input:focus {
          border-color: #F2B84B;
          background: #141F36;
          box-shadow: 0 0 0 3.5px rgba(242,184,75,0.12);
        }

        .pp-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #5B6579;
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.2s ease;
        }

        .pp-eye-btn:hover {
          color: #C7CEDB;
        }

        .pp-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 26px;
        }

        .pp-forgot {
          font-size: 13px;
          color: #8792A6;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }

        .pp-forgot:hover {
          color: #F2B84B;
          border-color: rgba(242,184,75,0.5);
        }

        .pp-submit {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #F2B84B, #D9962F);
          color: #14100A;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition:
            transform 0.15s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
          box-shadow: 0 8px 24px rgba(242,184,75,0.18);
        }

        .pp-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(242,184,75,0.3);
          filter: brightness(1.04);
        }

        .pp-submit:active {
          transform: translateY(0px) scale(0.99);
        }

        .pp-submit:disabled {
          cursor: default;
        }

        .pp-spinner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(20,16,10,0.3);
          border-top-color: #14100A;
          animation: pp-spin 0.7s linear infinite;
        }

        @keyframes pp-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .pp-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0 20px 0;
        }

        .pp-divider span {
          font-size: 12px;
          color: #4B5468;
          font-family: 'JetBrains Mono', monospace;
        }

        .pp-divider .pp-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .pp-signup {
          text-align: center;
          font-size: 13.5px;
          color: #8792A6;
        }

        .pp-signup a {
          color: #F2B84B;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }

        .pp-signup a:hover {
          text-decoration: underline;
        }

        @media (max-width: 860px) {
          .pp-left {
            display: none;
          }
        }
      `}</style>

      <div className="pp-left">
        <div className="pp-dotgrid" />

        <div className="pp-brand">
          <div className="pp-brand-mark">PP</div>
          <div className="pp-brand-name">Placement Platform</div>
        </div>

        <div className="pp-headline">
          <h1>
            Every offer starts
            <br />
            <span className="accent">with one login.</span>
          </h1>

          <p>
            Track applications, interviews and offers from every recruiter on
            campus, in one place.
          </p>
        </div>

        <div className="pp-journey">
          {JOURNEY.map((step, i) => (
            <div
              key={step.label}
              className={`pp-step ${
                i === JOURNEY.length - 1 ? "pp-active" : ""
              }`}
            >
              <div className="pp-step-line" />

              <div
                className={`pp-node ${
                  i === JOURNEY.length - 1 ? "pp-active" : ""
                }`}
              />

              <span className="pp-step-label">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="pp-foot">
          CAMPUS RECRUITMENT · 2026 SEASON
        </div>
      </div>

      <div className="pp-right">
        <form className="pp-card" onSubmit={handleSubmit}>
          <div className="pp-card-eyebrow">
            Student &amp; Recruiter Access
          </div>

          <h2>Welcome back</h2>

          <p className="pp-sub">
            Sign in to continue to your dashboard.
          </p>

          <div className="pp-field">
            <User size={17} className="pp-field-icon" />

            <input
              type="text"
              placeholder="Username or roll number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="pp-field">
            <Lock size={17} className="pp-field-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: "44px" }}
              required
            />

            <button
              type="button"
              className="pp-eye-btn"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>

          <div className="pp-row">
            <a className="pp-forgot">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="pp-submit"
            disabled={status !== "idle"}
          >
            {status === "idle" && (
              <>
                Login
                <ArrowRight size={16} />
              </>
            )}

            {status === "loading" && (
              <span className="pp-spinner" />
            )}

            {status === "done" && (
              <>
                Signed in
                <Check size={16} />
              </>
            )}
          </button>

          <div className="pp-divider">
            <span className="pp-line" />
            <span>NEW HERE</span>
            <span className="pp-line" />
          </div>

          <div className="pp-signup">
            Don't have an account?{" "}
            <a>Register with your college ID</a>
          </div>
        </form>
      </div>
    </div>
  );
}


// =========================
// RESUME ANALYZER
// =========================

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const handleFile = (file) => {
    setErrorMsg("");
    setText("");
    setAnalysis(null);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setResume(null);
      setErrorMsg("Please upload a PDF resume.");
      return;
    }

    setResume(file);
    setStatus("idle");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const scanResume = async () => {
    if (!resume) {
      setErrorMsg("Please select a PDF resume first.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setText("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/analyze-resume/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setText(data.text || "");
        setAnalysis(data.nlp || null);
        setAtsScore(data.ats_score ?? null);

        console.log("NLP RESULT:", data.nlp);
        console.log("ATS SCORE:", data.ats_score);

        setStatus("done");
       }else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.log(error);

      setStatus("error");
      setErrorMsg(
        "Unable to connect with backend. Make sure Django server is running."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0F1E",
        color: "#EDF1F8",
        fontFamily: "Inter, sans-serif",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >

        {/* Back button */}

        <Link
          to="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#8792A6",
            textDecoration: "none",
            marginBottom: "30px",
            fontSize: "14px",
          }}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>


        {/* Heading */}

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              color: "#F2B84B",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            AI POWERED
          </div>

          <h1
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "34px",
              margin: "0 0 10px 0",
            }}
          >
            AI Resume Analyzer
          </h1>

          <p
            style={{
              color: "#8792A6",
              margin: 0,
              fontSize: "15px",
            }}
          >
            Upload your resume and let our system extract important
            information from it.
          </p>
        </div>


        {/* Upload box */}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          style={{
            border: dragActive
              ? "2px solid #F2B84B"
              : "2px dashed rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "60px 30px",
            textAlign: "center",
            background: "#121B2E",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {resume ? (
            <>
              <FileText
                size={45}
                color="#F2B84B"
                style={{ marginBottom: "15px" }}
              />

              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {resume.name}
              </h3>

              <p
                style={{
                  color: "#8792A6",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                PDF selected successfully
              </p>
            </>
          ) : (
            <>
              <Upload
                size={45}
                color="#F2B84B"
                style={{ marginBottom: "15px" }}
              />

              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Upload your resume
              </h3>

              <p
                style={{
                  color: "#8792A6",
                  margin: 0,
                  fontSize: "13px",
                }}
              >
                Drag & drop your PDF here or click to browse
              </p>
            </>
          )}
        </div>


        {/* Error */}

        {errorMsg && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.2)",
              color: "#ff8a8a",
              fontSize: "14px",
            }}
          >
            {errorMsg}
          </div>
        )}


        {/* Scan button */}

        <button
          onClick={scanResume}
          disabled={!resume || status === "loading"}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "16px",
            borderRadius: "10px",
            border: "none",
            background:
              !resume || status === "loading"
                ? "#3A3A3A"
                : "linear-gradient(135deg, #F2B84B, #D9962F)",
            color: "#14100A",
            fontFamily: "Sora, sans-serif",
            fontWeight: "600",
            fontSize: "15px",
            cursor:
              !resume || status === "loading"
                ? "not-allowed"
                : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {status === "loading" ? (
            <>
              <Loader2
                size={18}
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
              Analyzing Resume...
            </>
          ) : (
            <>
              Analyze Resume
              <ArrowRight size={18} />
            </>
          )}
        </button>
{status === "done" && atsScore !== null && (
  <div
    style={{
      marginTop: "30px",
      background: "#121B2E",
      borderRadius: "14px",
      padding: "25px",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontFamily: "Sora, sans-serif",
            fontSize: "20px",
          }}
        >
          ATS Resume Score
        </h2>

        <p
          style={{
            color: "#8792A6",
            marginTop: "8px",
            fontSize: "14px",
          }}
        >
          Resume compatibility score based on important sections and skills.
        </p>
      </div>

      <div
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#F2B84B",
        }}
      >
        {atsScore}/100
      </div>
    </div>

    <div
      style={{
        marginTop: "20px",
        height: "10px",
        background: "#0A0F1E",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${atsScore}%`,
          height: "100%",
          background: "#F2B84B",
          borderRadius: "10px",
          transition: "width 0.5s ease",
        }}
      />
    </div>
  </div>
)}

        {/* ========================= */}
        {/* TECHNICAL SKILLS */}
        {/* ========================= */}

        {status === "done" &&
          analysis &&
          analysis.skills &&
          analysis.skills.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                background: "#121B2E",
                borderRadius: "14px",
                padding: "25px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <Check size={20} color="#F2B84B" />

                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Sora, sans-serif",
                    fontSize: "20px",
                  }}
                >
                  Technical Skills
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {analysis.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "20px",
                      background: "rgba(242,184,75,0.12)",
                      border: "1px solid rgba(242,184,75,0.3)",
                      color: "#F2B84B",
                      fontSize: "13px",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}


        {/* ========================= */}
        {/* NO SKILLS FOUND */}
        {/* ========================= */}

        {status === "done" &&
          analysis &&
          analysis.skills &&
          analysis.skills.length === 0 && (
            <div
              style={{
                marginTop: "30px",
                background: "#121B2E",
                borderRadius: "14px",
                padding: "25px",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8792A6",
              }}
            >
              No technical skills detected in this resume.
            </div>
          )}


        {/* ========================= */}
        {/* EXTRACTED TEXT */}
        {/* ========================= */}

        {status === "done" && (
          <div
            style={{
              marginTop: "30px",
              background: "#121B2E",
              borderRadius: "14px",
              padding: "25px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <Check size={20} color="#F2B84B" />

              <h2
                style={{
                  margin: 0,
                  fontFamily: "Sora, sans-serif",
                  fontSize: "20px",
                }}
              >
                Resume Text Extracted
              </h2>
            </div>

            <div
              style={{
                background: "#0A0F1E",
                borderRadius: "10px",
                padding: "20px",
                maxHeight: "500px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                color: "#C7CEDB",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              {text || "No text found in this PDF."}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}


// =========================
// PROTECTED ROUTE
// =========================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// =========================
// APP
// =========================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Jobs */}

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />


        {/* AI Resume Analyzer */}

        <Route
          path="/resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />


        {/* Anything else */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
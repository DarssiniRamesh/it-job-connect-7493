import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "./AuthContext";

/**
 * Job detail page by job id from /jobs/:id. Shows full job info. Seeker can apply; employer may edit in future.
 */
export default function JobDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const navigate = useNavigate();

  // Fetch job detail and application state when id/user changes
  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setErr("");
      try {
        const data = await api.get(`/jobs/${id}`);
        setJob(data);
        // If seeker, check if already applied by fetching applications (backend ensures seekers only see their applications)
        if (isAuthenticated && user && user.role === "seeker") {
          try {
            const apps = await api.get("/applications");
            if (Array.isArray(apps) && apps.find(app => app.job_id === Number(id))) {
              setAlreadyApplied(true);
            } else {
              setAlreadyApplied(false);
            }
          } catch {
            setAlreadyApplied(false);
          }
        }
      } catch (e) {
        setErr(e.message || "Failed to load job.");
        setJob(null);
      }
      setLoading(false);
    }
    if (id) fetchJob();
    // eslint-disable-next-line
  }, [id, isAuthenticated, user]);

  // Seeker applies for this job (simple, no cover letter for MVP)
  const handleApply = async () => {
    if (!isAuthenticated || !user || user.role !== "seeker") return;
    setApplying(true);
    setErr("");
    try {
      await api.post("/applications", { job_id: Number(id), cover_letter: null });
      setApplicationSuccess(true);
      setAlreadyApplied(true);
    } catch (e) {
      // If backend says already applied, reflect that state
      if (
        e.message &&
        (e.message.toLowerCase().includes("already applied") ||
          e.message.toLowerCase().includes("unique constraint"))
      ) {
        setAlreadyApplied(true);
      } else {
        setErr(e.message || "Failed to apply.");
      }
    }
    setApplying(false);
  };

  if (loading) return <div style={{ margin: 32 }}>Loading job details...</div>;
  if (err) return (
    <div style={{ margin: 32, color: "red" }}>
      {err}
      <br />
      <button onClick={() => navigate(-1)} style={{ marginTop: 12 }} className="theme-toggle">Back</button>
    </div>
  );
  if (!job) {
    return (
      <div style={{ margin: 32, color: "#888" }}>
        Job not found.
        <br />
        <button onClick={() => navigate(-1)} style={{ marginTop: 12 }} className="theme-toggle">Back</button>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ fontSize: 26 }}>{job.title}</h2>
      <div style={{ color: "var(--text-secondary)", margin: "10px 0 15px 0" }}>
        {job.employer_name && <span>{job.employer_name}</span>}
        {job.location && <span> | {job.location}</span>}
        <span style={{ marginLeft: 14, fontSize: 14, color: "#bbb" }}>
          Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : ""}
        </span>
      </div>
      <div style={{ fontSize: 17, marginBottom: 20, marginTop: 7, whiteSpace: "pre-line" }}>
        {job.description}
      </div>
      {isAuthenticated && user && user.role === "seeker" && (
        <div style={{ marginTop: 20 }}>
          {alreadyApplied ? (
            <div style={{ color: "#8642bf", fontWeight: 500, marginBottom: 12 }}>
              You have already applied for this job. Track your application in the dashboard.
            </div>
          ) : applicationSuccess ? (
            <div style={{ color: "green", fontWeight: 600, marginBottom: 13 }}>
              Application sent! Check your dashboard to track status.
            </div>
          ) : (
            <button
              onClick={handleApply}
              className="theme-toggle"
              disabled={applying}
              style={{ fontSize: 17, padding: "10px 22px" }}
            >
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>
      )}
      <button className="theme-toggle" style={{ marginTop: 24, background: "#aaa" }} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </article>
  );
}

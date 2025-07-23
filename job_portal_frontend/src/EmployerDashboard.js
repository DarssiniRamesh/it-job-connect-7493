import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";

/**
 * EmployerDashboard: Show employer's job postings and received applicants.
 * Allows managing applicant status and posting new jobs.
 */
export default function EmployerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  // State for new job posting
  const [newJob, setNewJob] = useState({ title: "", description: "", location: "" });
  const [postingJob, setPostingJob] = useState(false);
  const [jobPostedMsg, setJobPostedMsg] = useState("");

  // Fetch applications for this employer's jobs + jobs list
  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setErr("");
      try {
        // Fetch applications (GET /applications: employer sees all applicants to their jobs)
        const apps = await api.get("/applications");
        setApplications(apps || []);
        // Find unique job ids from those apps that belong to this employer (apps may be empty if no applicants)
        // Allow for "no jobs posted" - Double check by also showing jobs where there are none yet
        let allMyJobs = [];
        if (apps && Array.isArray(apps) && apps.length > 0) {
          allMyJobs = apps
            .map(a => a.job)
            .filter((job, idx, arr) => job && arr.findIndex(j2 => j2.id === job.id) === idx);
        }
        // If no jobs from applications, try GET /jobs and filter by user.id (backend can't list "my jobs" directly)
        if (allMyJobs.length === 0) {
          try {
            const jobs = await api.get("/jobs");
            allMyJobs = (jobs || []).filter(j => j.employer_id === user.id);
          } catch {
            // ignore
          }
        }
        setMyJobs(allMyJobs);
      } catch (e) {
        setErr(e.message || "Failed to load dashboard.");
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  // Handle posting a new job
  const handleJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    setJobPostedMsg("");
    setErr("");
    try {
      if (!newJob.title || !newJob.description) throw new Error("Title and description required.");
      await api.post("/jobs", {
        title: newJob.title,
        description: newJob.description,
        location: newJob.location || null,
      });
      setJobPostedMsg("Job posted successfully!");
      setNewJob({ title: "", description: "", location: "" });
      // Re-fetch job list and applications
      const apps = await api.get("/applications");
      setApplications(apps || []);
      const allMyJobs = (apps || [])
        .map(a => a.job)
        .filter((job, idx, arr) => job && arr.findIndex(j2 => j2.id === job.id) === idx);
      setMyJobs(allMyJobs);
    } catch (e) {
      setErr(e.message || "Failed to post job.");
    }
    setPostingJob(false);
  };

  // Employer can update applicant status (reviewed/rejected/hired)
  const handleStatusUpdate = async (applicationId, newStatus) => {
    if (!["reviewed", "rejected", "hired"].includes(newStatus)) return;
    setLoading(true);
    setErr("");
    try {
      await api.put(`/applications/${applicationId}?status_in=${newStatus}`);
      // Reload apps
      const apps = await api.get("/applications");
      setApplications(apps || []);
    } catch (e) {
      setErr(e.message || "Failed to update application status.");
    }
    setLoading(false);
  };

  return (
    <section>
      <h2 style={{ marginBottom: 10 }}>Employer Dashboard</h2>
      <div style={{ color: "var(--text-secondary)", marginBottom: 13 }}>
        Welcome, {user?.email}! View your job postings and applicants.
      </div>
      <form
        onSubmit={handleJobPost}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          padding: 18,
          maxWidth: 500,
          marginBottom: 22,
        }}
      >
        <h3 style={{ marginBottom: 10 }}>Post a New Job</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            name="title"
            required
            placeholder="Job Title"
            value={newJob.title}
            onChange={handleJobChange}
            style={{ padding: 8, borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 16 }}
          />
          <input
            type="text"
            name="location"
            placeholder="Location (remote, city...)"
            value={newJob.location}
            onChange={handleJobChange}
            style={{ padding: 8, borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 16 }}
          />
          <textarea
            name="description"
            required
            placeholder="Job description"
            value={newJob.description}
            onChange={handleJobChange}
            style={{ padding: 8, borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 15, minHeight: 60 }}
          />
          <button
            type="submit"
            className="theme-toggle"
            disabled={postingJob}
            style={{ fontSize: 16, marginTop: 4, alignSelf: "start" }}
          >
            {postingJob ? "Posting..." : "Post Job"}
          </button>
        </div>
        {jobPostedMsg && <div style={{ color: "green", marginTop: 13 }}>{jobPostedMsg}</div>}
        {err && <div style={{ color: "red", marginTop: 13 }}>{err}</div>}
      </form>
      <h3 style={{ marginTop: 18 }}>Applicants to Your Jobs</h3>
      {loading ? (
        <div style={{ margin: 24 }}>Loading applicants...</div>
      ) : err ? (
        <div style={{ color: "red", margin: 20 }}>{err}</div>
      ) : (
        <>
          {myJobs.length === 0 && (
            <div style={{ color: "#999", margin: "24px 0" }}>
              You have not posted any jobs yet. Use the form above to publish your first job.
            </div>
          )}
          {myJobs.length > 0 && applications.length === 0 && (
            <div style={{ color: "#999", margin: "24px 0" }}>
              No applicants yet. Share your job listing to receive applications!
            </div>
          )}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {applications.map(app => (
              <li
                key={app.id}
                style={{
                  background: "#fffdfa",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  marginBottom: 14,
                  padding: 14,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {app.job ? app.job.title : "Unknown Job"}
                  <span style={{ marginLeft: 10, color: "#bbb", fontSize: 14 }}>
                    | {app.user_email}
                  </span>
                </div>
                <div style={{ fontSize: 15, marginTop: 5 }}>
                  Status: <b>
                    <span
                      style={{
                        color:
                          app.status === "applied"
                            ? "#1a7edd"
                            : app.status === "reviewed"
                            ? "#936adc"
                            : app.status === "hired"
                            ? "#32c769"
                            : app.status === "rejected"
                            ? "#de4747"
                            : "#888",
                      }}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </b>
                  <span style={{ marginLeft: 18, color: "#bbb" }}>
                    Applied {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                  {["reviewed", "hired", "rejected"].map(status => (
                    <button
                      key={status}
                      className="theme-toggle"
                      disabled={app.status === status}
                      style={{
                        padding: "5px 11px",
                        fontSize: 14,
                        background:
                          status === "hired"
                            ? "#22c55e"
                            : status === "reviewed"
                            ? "#7c3aed"
                            : status === "rejected"
                            ? "#ef4444"
                            : "var(--button-bg)",
                        opacity: app.status === status ? 0.5 : 1,
                      }}
                      onClick={() => handleStatusUpdate(app.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

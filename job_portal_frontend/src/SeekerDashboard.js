import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";

/**
 * SeekerDashboard: For job seekers, show their tracked job applications.
 */
export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      setErr("");
      try {
        // GET /applications: seekers see their job applications
        const data = await api.get("/applications");
        setApplications(data || []);
      } catch (e) {
        setErr(e.message || "Failed to load applications.");
      }
      setLoading(false);
    }
    fetchApplications();
  }, []);

  return (
    <section>
      <h2 style={{ marginBottom: 10 }}>Seeker Dashboard</h2>
      <div style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
        Hi {user && user.email}! Track your applications below.
      </div>
      {loading ? (
        <div style={{ margin: 32, textAlign: "center" }}>Loading applications...</div>
      ) : err ? (
        <div style={{ color: "red", margin: 24 }}>{err}</div>
      ) : (
        <>
          {applications.length === 0 && (
            <div style={{ color: "#999", margin: "32px 0" }}>
              You haven't applied to any jobs yet. <a href="/jobs" className="App-link">Browse jobs</a> to get started!
            </div>
          )}
          <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
            {applications.map(app => (
              <li
                key={app.id}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 10,
                  marginBottom: 15,
                  padding: 18,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {(app.job && app.job.title) ? app.job.title : "Unknown Job"}
                  <span style={{ color: "#aaa", fontSize: 14, marginLeft: 10 }}>
                    {app.job && app.job.location ? app.job.location : ""}
                  </span>
                </div>
                <div style={{ fontSize: 15, marginTop: 4 }}>
                  <span>Status:&nbsp;
                    <span style={{
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
                      fontWeight: 500,
                    }}>
                      {app.status && typeof app.status === "string"
                        ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                        : app.status
                      }
                    </span>
                  </span>
                  <span style={{ marginLeft: 18, color: "#bbb" }}>
                    {app.applied_at
                      ? "Applied on " + new Date(app.applied_at).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div style={{ fontSize: 15, marginTop: 7, color: "var(--text-secondary)" }}>
                  {(app.job && app.job.employer_name)
                    ? <span>Employer: {app.job.employer_name}</span>
                    : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

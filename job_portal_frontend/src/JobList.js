import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "./api";
import JobSearchBar from "./JobSearchBar";
import { useAuth } from "./AuthContext";

/**
 * List and filter/search jobs. Loads all jobs by default, adjust filters/search as needed.
 * Role-based UI: anyone can view and search; employers may get extra actions in future.
 */
export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract search/filter params
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";

  // Fetch jobs from backend API
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setErr("");
      try {
        const params = [];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        if (location) params.push(`location=${encodeURIComponent(location)}`);
        const query = params.length ? `?${params.join("&")}` : "";
        const data = await api.get(`/jobs${query}`);
        setJobs(data || []);
      } catch (e) {
        setErr(e.message || "Failed to load jobs.");
      }
      setLoading(false);
    }
    fetchJobs();
    // eslint-disable-next-line
  }, [search, location]);

  // Handler for search input in JobSearchBar
  const handleSearch = (s, loc) => {
    // Update URL params (triggers useEffect)
    const params = {};
    if (s) params.search = s;
    if (loc) params.location = loc;
    setSearchParams(params);
  };

  return (
    <section>
      <h2 style={{ marginBottom: 12 }}>Job Listings</h2>
      <JobSearchBar
        search={search}
        location={location}
        onSearch={handleSearch}
      />
      {loading ? (
        <div style={{ margin: 32, textAlign: "center" }}>Loading jobs...</div>
      ) : err ? (
        <div style={{ color: "red", margin: 24 }}>{err}</div>
      ) : (
        <>
          {jobs.length === 0 && (
            <div style={{ margin: "32px 0", color: "#999" }}>
              No jobs found. Try adjusting search/filter.
            </div>
          )}
          <ul style={{ listStyle: "none", padding: 0, marginTop: 14 }}>
            {jobs.map(job => (
              <li
                key={job.id}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 12,
                  marginBottom: 18,
                  padding: 20,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Link
                      to={`/jobs/${job.id}`}
                      style={{ fontSize: 20, color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}
                    >
                      {job.title}
                    </Link>
                    <div style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 6 }}>
                      {job.company || job.employer_name || "Unknown"}
                      {job.location && <span> | {job.location}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 15,
                    color: "var(--text-primary)",
                    maxHeight: 50,
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {job.description && job.description.length > 180
                    ? job.description.slice(0, 180) + "..."
                    : job.description}
                </div>
                <div style={{ marginTop: 11 }}>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="theme-toggle"
                    style={{
                      background: "var(--button-bg)",
                      color: "var(--button-text)",
                      textDecoration: "none",
                      marginTop: 8,
                      padding: "6px 16px",
                      borderRadius: 6,
                      fontSize: "15px"
                    }}
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

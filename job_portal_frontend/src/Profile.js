import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";

/**
 * Profile: Allows job seeker or employer to view and update their profile.
 * Editable fields: full_name, bio, skills, company (company for employer only)
 */
export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    skills: "",
    company: ""
  });

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setErr("");
      try {
        const data = await api.get("/profile");
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          bio: data.bio || "",
          skills: data.skills || "",
          company: data.company || ""
        });
      } catch (e) {
        setErr(e.message || "Failed to load profile.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);
    try {
      const update = {
        full_name: form.full_name || null,
        bio: form.bio || null,
        skills: form.skills || null,
        company: user && user.role === "employer" ? (form.company || null) : undefined,
      };
      await api.put("/profile", update);
      setSuccess("Profile updated!");
    } catch (e) {
      setErr(e.message || "Profile update failed.");
    }
    setLoading(false);
  };

  if (loading && !profile) return <div style={{ margin: 36 }}>Loading profile...</div>;
  if (err && !profile) return (
    <div style={{ margin: 40, color: "red" }}>
      {err} <br /><br />
      <button className="theme-toggle" onClick={() => logout()}>Logout</button>
    </div>
  );

  return (
    <section>
      <h2 style={{ marginBottom: 12 }}>My Profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          padding: 20,
          maxWidth: 480,
          margin: "0 auto"
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <b>Email:</b> <span style={{ color: "#777" }}>{user && user.email}</span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Full Name<br />
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              style={{ width: "100%", padding: 9, borderRadius: 6, border: "1px solid var(--border-color)", marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Short Bio<br />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              style={{ width: "100%", padding: 9, borderRadius: 6, border: "1px solid var(--border-color)", marginTop: 4, minHeight: 50 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Skills (comma separated)<br />
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              style={{ width: "100%", padding: 9, borderRadius: 6, border: "1px solid var(--border-color)", marginTop: 4 }}
              placeholder="e.g. JavaScript, Python, React"
            />
          </label>
        </div>
        {user && user.role === "employer" && (
          <div style={{ marginBottom: 12 }}>
            <label>Company<br />
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                style={{ width: "100%", padding: 9, borderRadius: 6, border: "1px solid var(--border-color)", marginTop: 4 }}
                placeholder="Your company name"
              />
            </label>
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <button
            type="submit"
            className="theme-toggle"
            style={{ minWidth: 110, padding: "9px 22px", fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Profile"}
          </button>
        </div>
        {success && <div style={{ color: "green", marginTop: 14 }}>{success}</div>}
        {err && <div style={{ color: "red", marginTop: 10 }}>{err}</div>}
      </form>
    </section>
  );
}


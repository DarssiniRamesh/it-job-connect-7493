import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  const { register, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", role: "seeker" });
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (isAuthenticated && user) {
    if (user.role === "employer") return navigate("/dashboard/employer", { replace: true });
    if (user.role === "seeker") return navigate("/dashboard/seeker", { replace: true });
    return navigate("/", { replace: true });
  }

  // Handle form value changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      // After auto-login, go to dashboard
      if (form.role === "employer") navigate("/dashboard/employer", { replace: true });
      else navigate("/dashboard/seeker", { replace: true });
    } catch (error) {
      setErr(error.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ marginBottom: 14 }}>
          <label>Email<br />
            <input
              type="email"
              required
              name="email"
              placeholder="e.g. you@email.com"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--border-color)" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>Password<br />
            <input
              type="password"
              required
              minLength={8}
              name="password"
              value={form.password}
              onChange={handleChange}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--border-color)" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>Confirm Password<br />
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--border-color)" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Register as<br />
            <select name="role" value={form.role} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 6 }}>
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </label>
        </div>
        {err && <div style={{ color: "red", marginBottom: 16 }}>{err}</div>}
        <button type="submit" disabled={loading} className="theme-toggle" style={{ width: "100%", marginBottom: 8 }}>
          {loading ? "Registering..." : "Register"}
        </button>
        <div style={{ marginTop: 8, color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login">Login &rarr;</Link>
        </div>
      </form>
    </section>
  );
}

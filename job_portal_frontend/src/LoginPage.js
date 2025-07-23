import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // redirect after login

  if (isAuthenticated && user) {
    // If already logged in, redirect to dashboard
    if (user.role === "employer") return navigate("/dashboard/employer", { replace: true });
    if (user.role === "seeker") return navigate("/dashboard/seeker", { replace: true });
    return navigate("/", { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      // Redirect to the appropriate dashboard for the user role
      if (user && user.role === "employer") navigate("/dashboard/employer", { replace: true });
      else if (user && user.role === "seeker") navigate("/dashboard/seeker", { replace: true });
      else navigate("/");
    } catch (error) {
      setErr(error.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 380, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <label>Email<br />
            <input
              type="email"
              required
              placeholder="e.g. user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--border-color)" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Password<br />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid var(--border-color)" }}
              minLength={8}
            />
          </label>
        </div>
        {err && <div style={{ color: "red", marginBottom: 16 }}>{err}</div>}
        <button type="submit" disabled={loading} className="theme-toggle" style={{ width: "100%", marginBottom: 8 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={{ marginTop: 8, color: "var(--text-secondary)" }}>
          Don't have an account? <Link to="/register">Register here &rarr;</Link>
        </div>
      </form>
    </section>
  );
}

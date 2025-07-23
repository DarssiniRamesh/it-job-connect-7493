import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

// PUBLIC_INTERFACE
// AuthContext provides global access to user/auth state and authentication methods (login, logout, register).
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // user: { id, email, role, ... }
  const [loading, setLoading] = useState(true);  // while loading initial auth state
  const [jwt, setJwt] = useState(api.getToken() || null);

  // Try load logged-in user profile if JWT token exists
  useEffect(() => {
    async function loadProfile() {
      const token = api.getToken();
      if (token) {
        try {
          // Get profile endpoint returns user profile (with role info)
          const profile = await api.get("/profile");
          setUser(profile ? { ...profile, token } : null);
          setJwt(token);
        } catch (err) {
          setUser(null);
          api.clearToken();
          setJwt(null);
        }
      }
      setLoading(false);
    }
    loadProfile();
    // intentionally only run on mount or JWT token set/cleared
    // eslint-disable-next-line
  }, []);

  // Handle login: POST to /auth/login, store JWT, fetch user profile
  const login = async (email, password) => {
    setLoading(true);
    try {
      // /auth/login expects x-www-form-urlencoded
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      // Custom: use fetch directly for this one request (api.js uses JSON by default)
      const response = await fetch(`${api.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      if (!response.ok) {
        let msg = "Login failed";
        try {
          const data = await response.json();
          if (data && data.detail) msg = data.detail;
        } catch (_) {}
        throw new Error(msg);
      }
      const { access_token } = await response.json();
      api.saveToken(access_token);
      setJwt(access_token);

      // Fetch user profile for context (role, id, etc)
      const profile = await api.get("/profile");
      setUser({ ...profile, token: access_token });
      setLoading(false);
      return { success: true };
    } catch (err) {
      setUser(null);
      api.clearToken();
      setJwt(null);
      setLoading(false);
      throw err;
    }
  };

  // Handle register: POST to /auth/register, then auto-login
  const register = async ({ email, password, role }) => {
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, role });
      // After register, do login
      await login(email, password);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    api.clearToken();
    setUser(null);
    setJwt(null);
  };

  // Memoize the context value so children don't re-render unnecessarily
  const value = {
    user,
    jwt,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

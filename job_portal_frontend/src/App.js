import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import PrivateRoute from './PrivateRoute';

// Placeholder components for routes whose real versions require authentication
const Home = () => <section><h2>Home</h2><p>Welcome to the IT Job Portal.</p></section>;
const JobDetails = () => <section><h2>Job Details</h2><p>Details for job (dynamic page).</p></section>;
// Will move dashboard/profile to their own files later
const SeekerDashboard = () => <section><h2>Seeker Dashboard</h2></section>;
const EmployerDashboard = () => <section><h2>Employer Dashboard</h2></section>;
const Profile = () => <section><h2>Profile</h2></section>;
const NotFound = () => <section><h2>404 - Not Found</h2></section>;

/**
 * Navigation bar shown at top of every page.
 */
const Navbar = ({ theme, toggleTheme }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  // Show role-based dashboard links
  return (
    <nav className="navbar" style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
      <div>
        <Link className="App-link" to="/">IT Job Portal</Link>
        <Link className="App-link" to="/jobs" style={{ marginLeft: '24px' }}>Jobs</Link>
        {!isAuthenticated && (
          <>
            <Link className="App-link" to="/login" style={{ marginLeft: '24px' }}>Login</Link>
            <Link className="App-link" to="/register" style={{ marginLeft: '16px' }}>Register</Link>
          </>
        )}
        {isAuthenticated && user && (
          <>
            {user.role === "seeker" && <Link className="App-link" to="/dashboard/seeker" style={{ marginLeft: '16px' }}>Seeker Dashboard</Link>}
            {user.role === "employer" && <Link className="App-link" to="/dashboard/employer" style={{ marginLeft: '16px' }}>Employer Dashboard</Link>}
            <Link className="App-link" to="/profile" style={{ marginLeft: '16px' }}>Profile</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="theme-toggle" style={{ marginLeft: 14, background: "#f35353" }}>Logout</button>
          </>
        )}
      </div>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <div className="App">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <div className="container" style={{ maxWidth: 900, margin: '32px auto', padding: 24 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* DASHBOARDS and PROFILE are protected */}
            <Route
              path="/dashboard/seeker"
              element={
                <PrivateRoute requiredRole="seeker">
                  <SeekerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/employer"
              element={
                <PrivateRoute requiredRole="employer">
                  <EmployerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

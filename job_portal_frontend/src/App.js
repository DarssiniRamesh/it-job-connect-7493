import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Placeholder components for each route
const Home = () => <section><h2>Home</h2><p>Welcome to the IT Job Portal.</p></section>;
const Login = () => <section><h2>Login</h2><p>Login form comes here.</p></section>;
const Register = () => <section><h2>Register</h2><p>Registration form comes here.</p></section>;
const JobDetails = () => <section><h2>Job Details</h2><p>Details for job (dynamic page).</p></section>;
const SeekerDashboard = () => <section><h2>Seeker Dashboard</h2></section>;
const EmployerDashboard = () => <section><h2>Employer Dashboard</h2></section>;
const Profile = () => <section><h2>Profile</h2></section>;
const NotFound = () => <section><h2>404 - Not Found</h2></section>;

/**
 * Navigation bar shown at top of every page.
 */
const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  return (
    <nav className="navbar" style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
      <div>
        <Link className="App-link" to="/">IT Job Portal</Link>
        <Link className="App-link" to="/jobs" style={{ marginLeft: '24px' }}>Jobs</Link>
        <Link className="App-link" to="/login" style={{ marginLeft: '24px' }}>Login</Link>
        <Link className="App-link" to="/register" style={{ marginLeft: '16px' }}>Register</Link>
        <Link className="App-link" to="/dashboard/seeker" style={{ marginLeft: '16px' }}>Seeker Dashboard</Link>
        <Link className="App-link" to="/dashboard/employer" style={{ marginLeft: '16px' }}>Employer Dashboard</Link>
        <Link className="App-link" to="/profile" style={{ marginLeft: '16px' }}>Profile</Link>
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
    <div className="App">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container" style={{ maxWidth: 900, margin: '32px auto', padding: 24 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
          <Route path="/dashboard/employer" element={<EmployerDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

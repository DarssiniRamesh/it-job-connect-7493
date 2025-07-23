//
// PUBLIC_INTERFACE
// API client for backend communication (handles JWT storage, auto-attach, errors)
//
// Usage:
//   import api from './api'
//   api.get('/some/endpoint')...
//   api.post('/auth/login', {email, password, ...} ...)
//   api.saveToken(token) -- stores JWT token for future requests
//   api.clearToken() -- clears token on logout
//

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function getStoredToken() {
  return localStorage.getItem('jwt_token') || null;
}

function saveToken(token) {
  localStorage.setItem('jwt_token', token);
}

function clearToken() {
  localStorage.removeItem('jwt_token');
}

/**
 * Helper to make fetch requests with JWT attached.
 * Returns parsed JSON or throws error.
 */
async function request(endpoint, { method = "GET", body = null, headers = {}, ...rest } = {}) {
  const token = getStoredToken();
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...headers,
    },
    ...rest,
  };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      clearToken();
      throw new Error('Unauthorized: Please log in again.');
    }
    if (!response.ok) {
      let errMsg = `API error: ${response.status}`;
      try {
        const data = await response.json();
        if (data && data.detail) errMsg = data.detail;
        else if (typeof data === 'string') errMsg = data;
      } catch (e) { /* ignore */ }
      throw new Error(errMsg);
    }

    if (response.status === 204) return null; // No Content
    return await response.json();
  } catch (err) {
    // Optionally add more global error handling or logging here
    throw err;
  }
}

// PUBLIC_INTERFACE
const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: "PUT", body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: "DELETE" }),
  saveToken,
  clearToken,
  getToken: getStoredToken,
  API_BASE_URL,
};

export default api;

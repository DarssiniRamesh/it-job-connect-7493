import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
// PrivateRoute, for usage in Route: 
// <Route path="..." element={<PrivateRoute><SomeComponent/></PrivateRoute>} requiredRole="seeker"/>
export default function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Prevent flicker, can add spinner here

  if (!isAuthenticated || !user) {
    // Not logged in, redirect to login, remember where from
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (requiredRole && user.role !== requiredRole) {
    // Role not allowed
    return <Navigate to="/" replace />;
  }
  return children;
}

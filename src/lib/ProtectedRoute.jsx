import { Navigate } from "react-router-dom";

// ProtectedRoute untuk user biasa
export const UserProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isLoggedIn || !user || user.role !== "user") {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

// ProtectedRoute untuk admin
export const AdminProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isLoggedIn || !user || user.role !== "admin") {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

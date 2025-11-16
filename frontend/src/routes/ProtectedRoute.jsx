import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  // ⛔ Don't check token until loading is complete
  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

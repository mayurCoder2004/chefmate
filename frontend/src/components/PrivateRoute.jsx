import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Wrap any route/component that should be protected.
 * If user is not logged in, redirect to /login
 */
export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  return user ? children : <Navigate to="/login" />;
}
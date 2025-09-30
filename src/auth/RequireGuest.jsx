import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireGuest({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  console.log(isAuthenticated);
  if (isAuthenticated) {
    const to = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={to} replace />;
  }

  return children;
}

import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (loading) return children; // or a spinner

  if (!isAuthenticated) {
    // Public paths that should not bounce to login again
    const publicPaths = ["/", "/logout"];
    if (publicPaths.includes(location.pathname)) return children;

    // Always build login path from stored location (not from current pathname)
    const country = (localStorage.getItem("user_country") || "in").toLowerCase();
    const region  = (localStorage.getItem("user_region")  || "ts").toLowerCase();
    const city    = (localStorage.getItem("user_city")    || "hyderabad").toLowerCase();

    const locPrefix = `/${country}/${region}/${city}`;

    // For student dashboard guards, go to location-aware login WITHOUT redirect
    return <Navigate to={`${locPrefix}/login`} replace />;
  }

  return children;
}

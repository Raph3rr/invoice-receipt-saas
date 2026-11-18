import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import DashboardSkeleton from "../common/DashboardSkeleton.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

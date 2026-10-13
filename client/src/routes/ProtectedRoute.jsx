import { Navigate, Outlet } from 'react-router-dom'; import { useAuth } from '../context/AuthContext.jsx';
export default function ProtectedRoute({ managerOnly = false }) {
  const { user, isManager } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (managerOnly && !isManager) return <Navigate to="/programma" replace />;
  return <Outlet />;
}

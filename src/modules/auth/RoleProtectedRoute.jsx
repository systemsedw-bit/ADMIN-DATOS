import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../common/LoadingScreen.jsx';
import { useAuth } from './AuthContext.jsx';

function RoleProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Verificando sesión" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RoleProtectedRoute;

import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role || '')) {
      // Redirect based on role if they try to access restricted page
      if (user.role === 'SUPERADMIN') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'AGENCY') {
        return <Navigate to="/agency" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
}

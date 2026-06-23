import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, isLoading } = useAuth();

  // Show a loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading... {/* replace with a real spinner component */}
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated – render children
  return <>{children}</>;
};

export default ProtectedRoute;
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




// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import type { ReactNode } from 'react';

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { token, isLoading } = useAuth(); // assume isLoading is provided

//   // Show a loading spinner or null while checking authentication
//   if (isLoading) {
//     return <div>Loading...</div>; // or a spinner component
//   }

//   // If no token, redirect to login
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // Optionally, you can check token expiry here using jwt-decode
//   // If expired, redirect to login (and clear token)

//   return <>{children}</>;
// };

// export default ProtectedRoute;
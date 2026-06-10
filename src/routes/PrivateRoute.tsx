import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  // TODO: thay bằng kiểm tra auth thật từ services/auth.js
  const isAuthenticated = true;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

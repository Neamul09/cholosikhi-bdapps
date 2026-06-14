import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute() {
  const { session, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-app-bg">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}

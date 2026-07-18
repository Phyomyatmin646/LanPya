import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/contexts/authStore';
import { useGuestStore } from '@/store/guestStore';

/* Redirect to login if not authenticated */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/* Redirect to dashboard if already authenticated */
export function PublicRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

/* Let both Guests and Users through. Guests need `isGuest` in store. */
export function HybridRoute() {
  const { isAuthenticated } = useAuthStore();
  const isGuest = useGuestStore(state => state.isGuest);
  
  // If not auth and not a guest (meaning they bypassed Landing/Assessment), send to landing
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}

/* Admin-only routes */
export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated)              return <Navigate to="/login"     replace />;
  if (user?.role_id?.name !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

// ============================================================
// ProtectedRoute — محافظت از route ها بر اساس نقش
// ============================================================
// استفاده:
//   <ProtectedRoute roles={['customer']}>
//     <CustomerDashboard />
//   </ProtectedRoute>

import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // هنوز داره از localStorage می‌خونه — صبر کن
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // لاگین نکرده
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // نقش اشتباه
  if (user && !roles.includes(user.role)) {
    // admin → /admin | manager → /manager-dashboard | customer → /customer-dashboard
    const homeByRole: Record<UserRole, string> = {
      admin: '/admin',
      manager: '/manager-dashboard',
      customer: '/customer-dashboard',
    };
    return <Navigate to={homeByRole[user.role]} replace />;
  }

  return <>{children}</>;
}

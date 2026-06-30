import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// ── صفحات عمومی ─────────────────────────────────────────────
import { HomePage } from './pages/HomePage';
import { SearchResults } from './pages/SearchResults';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { NotFound } from './pages/NotFound';

// ── احراز هویت ──────────────────────────────────────────────
import { RoleSelection } from './pages/auth/RoleSelection';
import { LoginPage } from './pages/auth/LoginPage';
import { OTPVerification } from './pages/auth/OTPVerification';

// ── صفحات مشتری ─────────────────────────────────────────────
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { ReservationForm } from './pages/customer/ReservationForm';
import { ReservationConfirmation } from './pages/customer/ReservationConfirmation';
import { Favorites } from './pages/customer/Favorites';
import { Notifications } from './pages/customer/Notifications';
import { Support } from './pages/customer/Support';
import { RegisterPage } from './pages/auth/RegisterPage';


// ── صفحات مدیر رستوران ──────────────────────────────────────
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { RestaurantOnboarding } from './pages/manager/RestaurantOnboarding';
import { MenuManagement } from './pages/manager/MenuManagement';
import { WorkingHoursSettings } from './pages/manager/WorkingHoursSettings';

// ── صفحات مدیر ارشد (Admin) ─────────────────────────────────
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();

  const isDashboard = location.pathname.includes('dashboard');
  const isLogin     = location.pathname.includes('/login');
  const isOnboarding = location.pathname.includes('/onboarding');
  const isAdmin     = location.pathname.startsWith('/admin');
  const showBottomNav = !isDashboard && !isLogin && !isOnboarding && !isAdmin;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {!isDashboard && !isLogin && !isOnboarding && !isAdmin && (
        <Header />
      )}

      <Routes>
        {/* ── عمومی (بدون لاگین) ──────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/support" element={<Support />} />

        {/* ── احراز هویت ─────────────────────────────── */}
        <Route path="/login" element={<RoleSelection />} />
        <Route path="/login/customer" element={<LoginPage />} />
        <Route path="/login/owner" element={<LoginPage />} />
        <Route path="/otp-verify" element={<OTPVerification />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* ── مشتری (نیاز به لاگین) ────────────────── */}
        <Route path="/reservation/:id" element={
          <ProtectedRoute roles={['customer']}>
            <ReservationForm />
          </ProtectedRoute>
        } />
        <Route path="/reservation-confirmation" element={
          <ProtectedRoute roles={['customer']}>
            <ReservationConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/customer-dashboard" element={
          <ProtectedRoute roles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute roles={['customer']}>
            <Favorites />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute roles={['customer']}>
            <Notifications />
          </ProtectedRoute>
        } />

        {/* ── مدیر رستوران (نیاز به لاگین) ─────────── */}
        <Route path="/onboarding" element={
          <ProtectedRoute roles={['manager']}>
            <RestaurantOnboarding />
          </ProtectedRoute>
        } />
        <Route path="/manager-dashboard" element={
          <ProtectedRoute roles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager-dashboard/menu" element={
          <ProtectedRoute roles={['manager']}>
            <MenuManagement />
          </ProtectedRoute>
        } />
        <Route path="/manager-dashboard/hours" element={
          <ProtectedRoute roles={['manager']}>
            <WorkingHoursSettings />
          </ProtectedRoute>
        } />

        {/* ── مدیر ارشد (Admin) ───────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* ── 404 ─────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

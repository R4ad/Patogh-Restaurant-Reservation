import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/shared/BottomNav';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Customer pages
import { HomePage } from './pages/HomePage';
import { SearchResults } from './pages/SearchResults';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { ReservationForm } from './pages/ReservationForm';
import { ReservationConfirmation } from './pages/ReservationConfirmation';
import { RoleSelection } from './pages/RoleSelection';
import { LoginPage } from './pages/LoginPage';
import { OTPVerification } from './pages/OTPVerification';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { Favorites } from './pages/Favorites';
import { Notifications } from './pages/Notifications';
import { Support } from './pages/Support';
import { NotFound } from './pages/NotFound';

// Owner pages
import { ManagerDashboard } from './pages/ManagerDashboard';
import { RestaurantOnboarding } from './pages/owner/RestaurantOnboarding';
import { MenuManagement } from './pages/owner/MenuManagement';
import { WorkingHoursSettings } from './pages/owner/WorkingHoursSettings';

// Admin pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const location = useLocation();

  const isDashboard = location.pathname.includes('dashboard');
  const isLogin = location.pathname.includes('/login');
  const isOnboarding = location.pathname.includes('/onboarding');
  const isAdmin = location.pathname.startsWith('/admin');
  const showBottomNav = !isDashboard && !isLogin && !isOnboarding && !isAdmin;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {!isDashboard && !isLogin && !isOnboarding && !isAdmin && (
        <Header />
      )}

      <Routes>
        {/* صفحات عمومی مشتری */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/support" element={<Support />} />

        {/* Auth */}
        <Route path="/login" element={<RoleSelection />} />
        <Route path="/login/customer" element={<LoginPage />} />
        <Route path="/login/owner" element={<LoginPage />} />
        <Route path="/otp-verify" element={<OTPVerification />} />

        {/* صفحات محافظت‌شده مشتری */}
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

        {/* صفحات محافظت‌شده مدیر رستوران */}
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

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 404 */}
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

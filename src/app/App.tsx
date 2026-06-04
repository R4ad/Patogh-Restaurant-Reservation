import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/shared/BottomNav';
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
        {/* Customer routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/reservation/:id" element={<ReservationForm />} />
        <Route path="/reservation-confirmation" element={<ReservationConfirmation />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/support" element={<Support />} />

        {/* Auth routes */}
        <Route path="/login" element={<RoleSelection />} />
        <Route path="/login/customer" element={<LoginPage />} />
        <Route path="/login/owner" element={<LoginPage />} />
        <Route path="/otp-verify" element={<OTPVerification />} />

        {/* Customer dashboard */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

        {/* Owner routes */}
        <Route path="/onboarding" element={<RestaurantOnboarding />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/manager-dashboard/menu" element={<MenuManagement />} />
        <Route path="/manager-dashboard/hours" element={<WorkingHoursSettings />} />

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

// ============================================================
// Patogh — Auth Context
// ============================================================
// استفاده:
//   const { user, login, logout, isLoading } = useAuth();

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as loginService,
  verifyOTP as verifyOTPService,
  adminLogin as adminLoginService,
  logout as logoutService,
  getStoredRole,
  getStoredToken,
} from '../services/auth.service';
import type {
  AuthUser,
  UserRole,
  LoginRequest,
  VerifyOTPRequest,
  AdminLoginRequest,
} from '../types';

// ── Types ────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
  adminLogin: (data: AdminLoginRequest) => Promise<void>;
  logout: () => void;
}

// ── Context ──────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // بازیابی session از localStorage هنگام بارگذاری
  useEffect(() => {
    const token = getStoredToken();
    const role = getStoredRole();
    const phoneNumber = localStorage.getItem('phoneNumber');

    if (token && role) {
      setUser({ accessToken: token, PhoneNumber: phoneNumber ?? '', role });
    }
    setIsLoading(false);
  }, []);

  // redirect بر اساس نقش
  const redirectByRole = useCallback((role: UserRole) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'manager') navigate('/manager-dashboard');
    else navigate('/customer-dashboard');
  }, [navigate]);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await loginService(data);
    const role = getStoredRole() ?? 'customer';
    const authUser: AuthUser = { ...res, role };
    setUser(authUser);
    redirectByRole(role);
  }, [redirectByRole]);

  const verifyOTP = useCallback(async (data: VerifyOTPRequest) => {
    const res = await verifyOTPService(data);
    const role = getStoredRole() ?? 'customer';
    const authUser: AuthUser = { ...res, role };
    setUser(authUser);
    redirectByRole(role);
  }, [redirectByRole]);

  const adminLogin = useCallback(async (data: AdminLoginRequest) => {
    await adminLoginService(data);
    const authUser: AuthUser = {
      accessToken: getStoredToken()!,
      PhoneNumber: '',
      role: 'admin',
    };
    setUser(authUser);
    navigate('/admin');
  }, [navigate]);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        verifyOTP,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  }
  return ctx;
}

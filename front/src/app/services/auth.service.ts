// ============================================================
// Patogh — Auth Service
// ============================================================

import { apiClient, IS_MOCK, mockDelay } from './client';
import { mockUsers, mockAdmin } from './mock/data';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  AdminLoginRequest,
  AdminLoginResponse,
  BackendLoginResponse,
  UserRole,
} from '../types';

const mockRegisteredUsers: Record<string, {
  password: string;
  role: UserRole;
  accessToken: string;
  PhoneNumber: string;
}> = {};

// تبدیل نقش بک‌اند ("Customer", "RestaurantOwner", "Admin") به نقش فرانت
function mapBackendRole(backendRole: string): UserRole {
  switch (backendRole) {
    case 'RestaurantOwner': return 'manager';
    case 'Admin':           return 'admin';
    default:                return 'customer';
  }
}

// ── Register ─────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  if (IS_MOCK) {
    await mockDelay();
    // در mock، Role عدد ارسال می‌شه اما mock از string داخلی استفاده می‌کنه
    const phoneKey = data.PhoneNumber;
    if (mockUsers[phoneKey] || mockRegisteredUsers[phoneKey]) {
      throw new Error('این شماره قبلاً ثبت‌نام کرده است');
    }
    const newRole: UserRole = data.Role === 2 ? 'manager' : 'customer';
    mockRegisteredUsers[phoneKey] = {
      password: data.Password,
      role: newRole,
      accessToken: `mock-token-${phoneKey}-${Date.now()}`,
      PhoneNumber: phoneKey,
    };
    return { success: true, userId: `user-${Date.now()}`, message: 'ثبت‌نام موفق' };
  }
  return apiClient.post<RegisterResponse>('/api/auth/register', data);
}

// ── Login with Password ──────────────────────────────────────

export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const user = mockUsers[data.PhoneNumber] ?? mockRegisteredUsers[data.PhoneNumber];
    if (!user) throw new Error('USER_NOT_FOUND');
    if (user.password !== data.Password) throw new Error('شماره موبایل یا رمز عبور اشتباه است');
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('phoneNumber', user.PhoneNumber);
    return { accessToken: user.accessToken, PhoneNumber: user.PhoneNumber };
  }
  const res = await apiClient.post<BackendLoginResponse>('/api/auth/login', data);
  const role = mapBackendRole(res.role);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  localStorage.setItem('userRole', role);
  localStorage.setItem('phoneNumber', res.phoneNumber);
  localStorage.setItem('userId', res.userId);
  return { accessToken: res.accessToken, PhoneNumber: res.phoneNumber };
}

// ── Send OTP ─────────────────────────────────────────────────

export async function sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
  if (IS_MOCK) {
    await mockDelay(600);
    const user = mockUsers[data.PhoneNumber] ?? mockRegisteredUsers[data.PhoneNumber];
    const isNewUser = !user;
    if (isNewUser) {
      // در mock، کاربر جدید را ثبت می‌کنیم (مثل backend)
      mockRegisteredUsers[data.PhoneNumber] = {
        password:    '',
        role:        'customer',
        accessToken: `mock-token-${data.PhoneNumber}-${Date.now()}`,
        PhoneNumber: data.PhoneNumber,
      };
    }
    return { success: true, message: 'کد تأیید ارسال شد', isNewUser };
  }
  return apiClient.post<SendOTPResponse>('/api/auth/send-otp', data);
}

// ── Verify OTP ───────────────────────────────────────────────

export async function verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const user = mockUsers[data.PhoneNumber] ?? mockRegisteredUsers[data.PhoneNumber];
    if (!user) throw new Error('کاربر یافت نشد');
    // پروفایل ناقص: کاربر رمز ندارد (OTP-only account)
    const hasIncompleteProfile = !user.password;
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('phoneNumber', user.PhoneNumber);
    return { accessToken: user.accessToken, PhoneNumber: user.PhoneNumber, hasIncompleteProfile };
  }
  const res = await apiClient.post<BackendLoginResponse>('/api/auth/verify-otp', data);
  const role = mapBackendRole(res.role);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  localStorage.setItem('userRole', role);
  localStorage.setItem('phoneNumber', res.phoneNumber);
  localStorage.setItem('userId', res.userId);
  return {
    accessToken:          res.accessToken,
    PhoneNumber:          res.phoneNumber,
    hasIncompleteProfile: res.hasIncompleteProfile,
  };
}

// ── Admin Login ──────────────────────────────────────────────

export async function adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
  if (IS_MOCK) {
    await mockDelay();
    // mock admin login از username/phone هر دو قبول می‌کنه
    const isAdmin =
      (data.PhoneNumber === mockAdmin.username || data.PhoneNumber === '09000000000') &&
      data.Password === mockAdmin.password;
    if (!isAdmin) {
      throw new Error('شماره موبایل یا رمز عبور اشتباه است');
    }
    localStorage.setItem('accessToken', mockAdmin.accessToken);
    localStorage.setItem('userRole', 'admin');
    return { success: true, message: 'ورود موفق', accessToken: mockAdmin.accessToken };
  }
  const res = await apiClient.post<BackendLoginResponse>('/api/admin/auth/login', data);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  localStorage.setItem('userRole', 'admin');
  localStorage.setItem('phoneNumber', res.phoneNumber);
  return { success: true, message: 'ورود موفق', accessToken: res.accessToken };
}

// ── Logout ───────────────────────────────────────────────────

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('userId');
}

// ── Helpers ──────────────────────────────────────────────────

export function getStoredRole(): UserRole | null {
  return localStorage.getItem('userRole') as UserRole | null;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

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
  UserRole,
} from '../types';

// ── Register ─────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, UserId: `user-${Date.now()}` };
  }
  return apiClient.post<RegisterResponse>('/register', data);
}

// ── Login with Password ──────────────────────────────────────

export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const user = mockUsers[data.PhoneNumber];
    if (user && user.password === data.Password) {
      localStorage.setItem('accessToken', user.accessToken);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('phoneNumber', user.PhoneNumber);
      return { accessToken: user.accessToken, PhoneNumber: user.PhoneNumber };
    }
    throw new Error('شماره یا رمز عبور اشتباه است');
  }
  const res = await apiClient.post<LoginResponse>('/login', data);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('phoneNumber', res.PhoneNumber);
  return res;
}

// ── Send OTP ─────────────────────────────────────────────────

export async function sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
  if (IS_MOCK) {
    await mockDelay(600);
    return { success: true, message: 'کد تأیید ارسال شد' };
  }
  return apiClient.post<SendOTPResponse>('/send-otp', data);
}

// ── Verify OTP ───────────────────────────────────────────────

export async function verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
  if (IS_MOCK) {
    await mockDelay();
    // در mock هر کدی قبول می‌شه
    const user = mockUsers[data.PhoneNumber] ?? {
      accessToken: `mock-token-${Date.now()}`,
      PhoneNumber: data.PhoneNumber,
      role: 'customer' as UserRole,
    };
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('phoneNumber', user.PhoneNumber);
    return { accessToken: user.accessToken, PhoneNumber: user.PhoneNumber };
  }
  const res = await apiClient.post<VerifyOTPResponse>('/verify-otp', data);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('phoneNumber', res.PhoneNumber);
  return res;
}

// ── Admin Login ──────────────────────────────────────────────

export async function adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
  if (IS_MOCK) {
    await mockDelay();
    if (data.Username === mockAdmin.username && data.Password === mockAdmin.password) {
      localStorage.setItem('accessToken', mockAdmin.accessToken);
      localStorage.setItem('userRole', 'admin');
      return { success: true, message: 'ورود موفق', accessToken: mockAdmin.accessToken };
    }
    throw new Error('نام کاربری یا رمز عبور اشتباه است');
  }
  const res = await apiClient.post<AdminLoginResponse>('/admin/login', data);
  if (res.accessToken) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('userRole', 'admin');
  }
  return res;
}

// ── Logout ───────────────────────────────────────────────────

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('phoneNumber');
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

import { apiClient, IS_MOCK, mockDelay } from './client';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types';

// ── Mock data ─────────────────────────────────────────────────

const mockProfiles: Record<string, UserProfile> = {
  customer: {
    id: 'user-1',
    phoneNumber: '09121234567',
    role: 'Customer',
    displayName: null,
    avatarUrl: null,
    memberSince: '2024-01-15T00:00:00Z',
    totalReservations: 3,
    favoritesCount: 2,
  },
  manager: {
    id: 'user-2',
    phoneNumber: '09129876543',
    role: 'RestaurantOwner',
    displayName: null,
    avatarUrl: null,
    memberSince: '2023-06-01T00:00:00Z',
    totalReservations: 0,
    favoritesCount: 0,
  },
  admin: {
    id: 'user-admin',
    phoneNumber: '09000000000',
    role: 'Admin',
    displayName: null,
    avatarUrl: null,
    memberSince: '2023-01-01T00:00:00Z',
    totalReservations: 0,
    favoritesCount: 0,
  },
};

function getMockProfile(): UserProfile {
  const role = localStorage.getItem('userRole') ?? 'customer';
  return {
    ...(mockProfiles[role] ?? mockProfiles.customer),
    phoneNumber: localStorage.getItem('phoneNumber') ?? '—',
    displayName: localStorage.getItem('displayName'),
  };
}

// ── API calls ─────────────────────────────────────────────────

export async function getProfile(): Promise<UserProfile> {
  if (IS_MOCK) {
    await mockDelay(400);
    return getMockProfile();
  }
  return apiClient.get<UserProfile>('/api/users/profile');
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  if (IS_MOCK) {
    await mockDelay(400);
    if (data.displayName !== undefined) {
      localStorage.setItem('displayName', data.displayName ?? '');
    }
    return { ...getMockProfile(), displayName: data.displayName ?? null };
  }
  return apiClient.put<UserProfile>('/api/users/profile', data);
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  if (IS_MOCK) {
    await mockDelay(500);
    // Empty currentPassword = initial setup for OTP-only accounts (backend allows this)
    if (data.currentPassword && data.currentPassword !== '123456')
      throw new Error('رمز عبور فعلی اشتباه است.');
    return;
  }
  await apiClient.post<{ message: string }>('/api/users/change-password', data);
}

export async function uploadAvatar(file: File): Promise<string> {
  if (IS_MOCK) {
    await mockDelay(600);
    const url = URL.createObjectURL(file);
    return url;
  }
  const form = new FormData();
  form.append('file', file);

  const token = localStorage.getItem('accessToken');
  const BASE_URL = import.meta.env.VITE_API_URL ?? '';
  const res = await fetch(`${BASE_URL}/api/users/avatar`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || `خطای آپلود: ${res.status}`);
  }
  const data = await res.json() as { avatarUrl: string };
  return data.avatarUrl;
}

// ============================================================
// Patogh — Restaurant Service
// ============================================================

import { apiClient, IS_MOCK, mockDelay } from './client';
import { mockRestaurants } from './mock/data';
import type {
  Restaurant,
  GetRestaurantsResponse,
  CreateRestaurantRequest,
  CreateMenuItemRequest,
  CreateTableRequest,
  ApproveRestaurantRequest,
  ApiSuccessResponse,
} from '../types';

// ── Get All Restaurants ──────────────────────────────────────

export async function getRestaurants(): Promise<Restaurant[]> {
  if (IS_MOCK) {
    await mockDelay();
    return mockRestaurants.filter((r) => r.IsApproved);
  }
  const res = await apiClient.get<GetRestaurantsResponse>('/restaurants');
  return res.Restaurants;
}

// ── Get Restaurant by ID ─────────────────────────────────────

export async function getRestaurantById(id: string): Promise<Restaurant> {
  if (IS_MOCK) {
    await mockDelay();
    const restaurant = mockRestaurants.find((r) => r.Id === id);
    if (!restaurant) throw new Error('رستوران پیدا نشد');
    return restaurant;
  }
  return apiClient.get<Restaurant>(`/restaurant/${id}`);
}

// ── Create Restaurant (Manager) ──────────────────────────────

export async function createRestaurant(
  data: CreateRestaurantRequest
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay(600);
    return { success: true, message: 'رستوران با موفقیت ثبت شد و منتظر تأیید ادمین است' };
  }
  return apiClient.post<ApiSuccessResponse>('/create-restaurant', data);
}

// ── Create Menu Item (Manager) ───────────────────────────────

export async function createMenuItem(
  data: CreateMenuItemRequest
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'آیتم منو با موفقیت اضافه شد' };
  }
  return apiClient.post<ApiSuccessResponse>('/create-menu-item', data);
}

// ── Create Table (Manager) ───────────────────────────────────

export async function createTable(
  data: CreateTableRequest
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'میز با موفقیت اضافه شد' };
  }
  return apiClient.post<ApiSuccessResponse>('/create-table', data);
}

// ── Admin: Get Pending Restaurants ───────────────────────────

export async function getPendingRestaurants(): Promise<Restaurant[]> {
  if (IS_MOCK) {
    await mockDelay();
    return mockRestaurants.filter((r) => !r.IsApproved);
  }
  const res = await apiClient.get<GetRestaurantsResponse>('/admin/restaurants');
  return res.Restaurants;
}

// ── Admin: Approve / Reject Restaurant ──────────────────────

export async function approveRestaurant(
  data: ApproveRestaurantRequest
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const restaurant = mockRestaurants.find((r) => r.Id === data.RestaurantId);
    if (restaurant) restaurant.IsApproved = data.IsApproved;
    return {
      success: true,
      message: data.IsApproved ? 'رستوران تأیید شد' : 'رستوران رد شد',
    };
  }
  return apiClient.post<ApiSuccessResponse>('/admin/approve-restaurant', data);
}

// ============================================================
// Patogh — Favorite Service
// ============================================================
// mock: localStorage — real: API + localStorage به‌عنوان cache

import { apiClient, IS_MOCK, mockDelay } from './client';
import { mockRestaurants } from './mock/data';
import type { Restaurant } from '../types';

const FAVORITES_KEY = 'patogh_favorites';

function getStoredIds(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]'); }
  catch { return []; }
}

function saveIds(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

/** آیا رستوران در علاقه‌مندی‌هاست — همزمان، بدون await */
export function isFavorited(restaurantId: string): boolean {
  return getStoredIds().includes(restaurantId);
}

/** دریافت لیست رستوران‌های ذخیره‌شده */
export async function getFavorites(): Promise<Restaurant[]> {
  if (IS_MOCK) {
    await mockDelay();
    const ids = getStoredIds();
    return mockRestaurants.filter((r) => ids.includes(r.Id));
  }
  const data = await apiClient.get<Restaurant[]>('/favorites');
  return data;
}

/**
 * تاگل — اگه هست حذف می‌کنه، اگه نیست اضافه
 * برمی‌گردونه: true = اضافه شد، false = حذف شد
 */
export async function toggleFavorite(restaurantId: string): Promise<boolean> {
  const ids    = getStoredIds();
  const exists = ids.includes(restaurantId);

  if (IS_MOCK) {
    await mockDelay(150);
    saveIds(exists ? ids.filter((id) => id !== restaurantId) : [...ids, restaurantId]);
    return !exists;
  }

  if (exists) {
    await apiClient.post('/favorites/remove', { RestaurantId: restaurantId });
    saveIds(ids.filter((id) => id !== restaurantId));
    return false;
  } else {
    await apiClient.post('/favorites/add', { RestaurantId: restaurantId });
    saveIds([...ids, restaurantId]);
    return true;
  }
}
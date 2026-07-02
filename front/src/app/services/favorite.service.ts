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

interface FavoriteRestaurantDto {
  id:          string;
  name:        string;
  description: string;
  location:    string;
  foodType:    string;
  priceRange:  string;
}

function mapDtoToRestaurant(dto: FavoriteRestaurantDto): Restaurant {
  return {
    Id:          dto.id,
    Name:        dto.name,
    Description: dto.description,
    Location:    dto.location,
    FoodType:    dto.foodType,
    PriceRange:  dto.priceRange,
    StartTime:   '',
    EndTime:     '',
    IsApproved:  true,
    MenuItems:   [],
    Tables:      [],
  };
}

/** دریافت لیست رستوران‌های ذخیره‌شده */
export async function getFavorites(): Promise<Restaurant[]> {
  if (IS_MOCK) {
    await mockDelay();
    const ids = getStoredIds();
    return mockRestaurants.filter((r) => ids.includes(r.Id));
  }
  const data = await apiClient.get<FavoriteRestaurantDto[]>('/api/favorites');
  return data.map(mapDtoToRestaurant);
}

/**
 * افزودن رستوران به علاقه‌مندی‌ها
 * در موفقیت true برمی‌گرداند، در تکراری بودن false
 */
export async function addFavorite(restaurantId: string): Promise<void> {
  if (IS_MOCK) {
    await mockDelay(150);
    const ids = getStoredIds();
    if (!ids.includes(restaurantId)) saveIds([...ids, restaurantId]);
    return;
  }
  await apiClient.post<void>(`/api/favorites/${restaurantId}`, null);
  const ids = getStoredIds();
  if (!ids.includes(restaurantId)) saveIds([...ids, restaurantId]);
}

/**
 * حذف رستوران از علاقه‌مندی‌ها
 */
export async function removeFavorite(restaurantId: string): Promise<void> {
  if (IS_MOCK) {
    await mockDelay(150);
    saveIds(getStoredIds().filter((id) => id !== restaurantId));
    return;
  }
  await apiClient.delete<void>(`/api/favorites/${restaurantId}`);
  saveIds(getStoredIds().filter((id) => id !== restaurantId));
}

/**
 * تاگل — اگه هست حذف می‌کنه، اگه نیست اضافه
 * برمی‌گردونه: true = اضافه شد، false = حذف شد
 */
export async function toggleFavorite(restaurantId: string): Promise<boolean> {
  const isFav = isFavorited(restaurantId);
  if (isFav) {
    await removeFavorite(restaurantId);
    return false;
  } else {
    await addFavorite(restaurantId);
    return true;
  }
}

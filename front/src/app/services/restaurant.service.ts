// ============================================================
// Patogh — Restaurant Service
// ============================================================

import { apiClient, IS_MOCK, mockDelay } from './client';
import { mockRestaurants } from './mock/data';
import type {
  Restaurant,
  Table,
  CreateRestaurantRequest,
  CreateMenuItemRequest,
  CreateTableRequest,
  ApproveRestaurantRequest,
  ApiSuccessResponse,
  UpdateMenuItemRequest,
  DeleteMenuItemRequest,
  UpdateTableRequest,
  DeleteTableRequest,
  PaginatedResult,
  RestaurantListItem,
} from '../types';

// تبدیل آیتم لیست رستوران (بک‌اند camelCase) به مدل فرانت
function mapListItemToRestaurant(item: RestaurantListItem): Restaurant {
  return {
    Id:          item.id,
    Name:        item.name,
    Description: item.description,
    Location:    item.location,
    FoodType:    item.foodType,
    PriceRange:  item.priceRange,
    StartTime:   item.startTime,
    EndTime:     item.endTime,
    IsApproved:  item.isApproved,
    MenuItems:   [],
    Tables:      [],
  };
}

// تبدیل جزئیات رستوران از بک‌اند به مدل فرانت
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDetailToRestaurant(detail: any): Restaurant {
  return {
    Id:          detail.id,
    Name:        detail.name,
    Description: detail.description,
    Location:    detail.location,
    FoodType:    detail.foodType,
    PriceRange:  detail.priceRange ?? '',
    StartTime:   detail.startTime,
    EndTime:     detail.endTime,
    IsApproved:  detail.isApproved,
    Image:       detail.coverImageUrl ?? undefined,
    MenuItems:   (detail.menuItems ?? []).map((m: any) => ({
      Id:           m.id,
      RestaurantId: detail.id,
      Name:         m.name,
      Description:  m.description ?? '',
      Price:        m.price,
      Image:        m.image ?? undefined,
    })),
    Tables: (detail.tables ?? []).map((t: any) => ({
      Id:           t.id,
      RestaurantId: detail.id,
      TableNumber:  t.tableNumber,
      Capacity:     t.capacity,
    })),
  };
}

// ── Get All Restaurants ──────────────────────────────────────

export async function getRestaurants(): Promise<Restaurant[]> {
  if (IS_MOCK) {
    await mockDelay();
    return mockRestaurants.filter((r) => r.IsApproved);
  }
  const res = await apiClient.get<PaginatedResult<RestaurantListItem>>('/api/restaurants');
  return res.items.map(mapListItemToRestaurant);
}

// ── Get Restaurant by ID ─────────────────────────────────────

export async function getRestaurantById(id: string): Promise<Restaurant> {
  if (IS_MOCK) {
    await mockDelay();
    const restaurant = mockRestaurants.find((r) => r.Id === id);
    if (!restaurant) throw new Error('رستوران پیدا نشد');
    return restaurant;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detail = await apiClient.get<any>(`/api/restaurants/${id}`);
  return mapDetailToRestaurant(detail);
}

// ── Create Restaurant (Manager) ──────────────────────────────

export async function createRestaurant(
  data: CreateRestaurantRequest
): Promise<ApiSuccessResponse & { restaurantId?: string }> {
  if (IS_MOCK) {
    await mockDelay(600);
    return { success: true, message: 'رستوران با موفقیت ثبت شد و منتظر تأیید ادمین است' };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await apiClient.post<any>('/api/restaurants', data);
  return {
    success:      res.success,
    message:      res.message,
    restaurantId: res.restaurantId,
  };
}

// ── Create Menu Item (Manager) ───────────────────────────────

export async function createMenuItem(
  data: CreateMenuItemRequest
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'آیتم منو با موفقیت اضافه شد' };
  }
  return apiClient.post<ApiSuccessResponse>('/api/menus', data);
}

// ── Create Table (Manager) ───────────────────────────────────

export async function createTable(
  data: CreateTableRequest
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'میز با موفقیت اضافه شد' };
  }
  return apiClient.post<ApiSuccessResponse>('/api/tables', data);
}

// ── Admin: Get Pending Restaurants ───────────────────────────

export async function getPendingRestaurants(): Promise<Restaurant[]> {
  if (IS_MOCK) {
    await mockDelay();
    return mockRestaurants.filter((r) => !r.IsApproved);
  }
  // بک‌اند لیست همه رستوران‌ها (approved + pending) را برمی‌گرداند
  const res = await apiClient.get<PaginatedResult<RestaurantListItem>>(
    '/api/admin/restaurants?isApproved=false'
  );
  return res.items.map(mapListItemToRestaurant);
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
  // بک‌اند: PUT /api/admin/restaurants/{id}/approve با body برابر boolean
  return apiClient.put<ApiSuccessResponse>(
    `/api/admin/restaurants/${data.RestaurantId}/approve`,
    data.IsApproved
  );
}

// ── Update/Delete MenuItem ───────────────────────────────────

export async function updateMenuItem(data: UpdateMenuItemRequest): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'آیتم بروزرسانی شد' };
  }
  return apiClient.put<ApiSuccessResponse>(`/api/menus/${data.MenuItemId}`, data);
}

export async function deleteMenuItem(data: DeleteMenuItemRequest): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'آیتم حذف شد' };
  }
  return apiClient.delete<ApiSuccessResponse>(`/api/menus/${data.MenuItemId}`);
}

// ── Update/Delete Table ──────────────────────────────────────

export async function updateTable(data: UpdateTableRequest): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'میز بروزرسانی شد' };
  }
  // بک‌اند endpoint برای update ندارد — ابتدا حذف سپس دوباره اضافه
  // restaurantId را از رستوران مدیر می‌گیریم
  const restaurant = await getManagerRestaurant();
  if (!restaurant) throw new Error('رستوران پیدا نشد');
  await apiClient.delete<ApiSuccessResponse>(`/api/tables/${data.TableId}`);
  return apiClient.post<ApiSuccessResponse>('/api/tables', {
    RestaurantId: restaurant.Id,
    TableNumber:  data.TableNumber,
    Capacity:     data.Capacity,
  });
}

export async function deleteTable(data: DeleteTableRequest): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    return { success: true, message: 'میز حذف شد' };
  }
  return apiClient.delete<ApiSuccessResponse>(`/api/tables/${data.TableId}`);
}

// ── Get Manager Tables ───────────────────────────────────────

export async function getManagerTables(): Promise<Table[]> {
  if (IS_MOCK) {
    await mockDelay();
    const phone = localStorage.getItem('phoneNumber');
    const restaurantId = phone === '09129876543' ? '2' : (localStorage.getItem('restaurantId') ?? '1');
    const restaurant = mockRestaurants.find((r) => r.Id === restaurantId);
    return restaurant?.Tables ?? [];
  }
  const restaurant = await getManagerRestaurant();
  if (!restaurant) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = await apiClient.get<any[]>(`/api/tables?restaurantId=${restaurant.Id}`).catch(() => []);
  return (list ?? []).map((t: any) => ({
    Id:           t.id,
    RestaurantId: restaurant.Id,
    TableNumber:  t.tableNumber,
    Capacity:     t.capacity,
  }));
}

// ── Get Manager Restaurant ───────────────────────────────────

export async function getManagerRestaurant(): Promise<Restaurant | null> {
  if (IS_MOCK) {
    await mockDelay();
    const phone = localStorage.getItem('phoneNumber');
    if (phone === '09129876543') {
      return mockRestaurants.find((r) => r.Id === '2') ?? null;
    }
    const id = localStorage.getItem('restaurantId');
    if (id?.startsWith('rest-')) {
      return {
        Id:          id,
        Name:        localStorage.getItem('restaurantName') ?? 'رستوران من',
        Description: '',
        Location:    '',
        FoodType:    '',
        StartTime:   '10:00',
        EndTime:     '23:00',
        IsApproved:  false,
        MenuItems:   [],
        Tables:      [],
      };
    }
    return null;
  }
  // بک‌اند لیست رستوران‌های مدیر را برمی‌گرداند — اولین مورد را برمی‌گردانیم
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = await apiClient.get<any[]>('/api/restaurants/my').catch(() => []);
  if (!list || list.length === 0) return null;
  const first = list[0];
  return {
    Id:          first.id,
    Name:        first.name,
    Description: first.description ?? '',
    Location:    first.location ?? '',
    FoodType:    first.foodType ?? '',
    PriceRange:  first.priceRange ?? '',
    StartTime:   first.startTime ?? '',
    EndTime:     first.endTime ?? '',
    IsApproved:  first.isApproved,
    MenuItems:   [],
    Tables:      [],
  };
}

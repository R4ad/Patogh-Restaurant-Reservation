// ============================================================
// Patogh — Shared TypeScript Types
// ============================================================

export type UserRole = 'customer' | 'manager' | 'admin';
export type ReservationStatus = 'pending' | 'approved' | 'rejected';

// ── Restaurant ──────────────────────────────────────────────

export interface Restaurant {
  Id: string;
  Name: string;
  Description: string;
  Location: string;
  FoodType: string;
  StartTime: string;
  EndTime: string;
  IsApproved: boolean;
  Image?: string;
  MenuItems: MenuItem[];
  Tables: Table[];
  // فیلدهای UI (در API نیستن، از mock میان یا محاسبه می‌شن)
  rating?: number;
  reviewCount?: number;
  priceLevel?: 1 | 2 | 3;
  phone?: string;
}

export interface MenuItem {
  Id: string;
  RestaurantId: string;
  Name: string;
  Description: string;
  Image?: string;
  Price: number;
}

export interface Table {
  Id: string;
  RestaurantId: string;
  TableNumber: number;
  Capacity: number;
}

// ── Reservation ─────────────────────────────────────────────

export interface Reservation {
  id: string;
  restaurant: {
    name: string;
    image: string;
  };
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  reservationNumber: string;
}

// ── Auth ────────────────────────────────────────────────────

export interface AuthUser {
  accessToken: string;
  PhoneNumber: string;
  role: UserRole;
  UserId?: string;
}

// ── API Request/Response types ───────────────────────────────

export interface RegisterRequest {
  PhoneNumber: string;
  Password: string;
  Role: UserRole;
}
export interface RegisterResponse {
  success: boolean;
  UserId: string;
}

export interface LoginRequest {
  PhoneNumber: string;
  Password: string;
}
export interface LoginResponse {
  accessToken: string;
  PhoneNumber: string;
}

export interface SendOTPRequest {
  PhoneNumber: string;
}
export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  PhoneNumber: string;
  Code: string;
}
export interface VerifyOTPResponse {
  accessToken: string;
  PhoneNumber: string;
}

export interface GetRestaurantsResponse {
  Restaurants: Restaurant[];
}

export interface CreateRestaurantRequest {
  Name: string;
  Description: string;
  Location: string;
  FoodType: string;
  StartTime: string;
  EndTime: string;
}

export interface CreateMenuItemRequest {
  RestaurantId: string;
  Name: string;
  Description: string;
  Image?: string;
  Price: number;
}

export interface CreateTableRequest {
  RestaurantId: string;
  TableNumber: number;
  Capacity: number;
}

export interface AdminLoginRequest {
  Username: string;
  Password: string;
}
export interface AdminLoginResponse {
  success: boolean;
  message: string;
  accessToken?: string;
}

export interface ApproveRestaurantRequest {
  RestaurantId: string;
  IsApproved: boolean;
}

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
}

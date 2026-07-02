// ============================================================
// Patogh — Shared TypeScript Types
// ============================================================

export type UserRole         = 'customer' | 'manager' | 'admin';
export type ApiRole          = 'customer' | 'RestaurantOwner' | 'Admin';
export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// ── Restaurant ──────────────────────────────────────────────

export interface Restaurant {
  Id:          string;
  Name:        string;
  Description: string;
  Location:    string;
  FoodType:    string;
  StartTime:   string;
  EndTime:     string;
  IsApproved:  boolean;
  PriceRange?: string;
  Image?:      string;
  MenuItems:   MenuItem[];
  Tables:      Table[];
  // فیلدهای UI
  rating?:      number;
  reviewCount?: number;
  priceLevel?:  1 | 2 | 3;
  phone?:       string;
}

export interface MenuItem {
  Id:           string;
  RestaurantId: string;
  Name:         string;
  Description:  string;
  Image?:       string;
  Price:        number;
}

export interface Table {
  Id:           string;
  RestaurantId: string;
  TableNumber:  number;
  Capacity:     number;
}

// ── Reservation ─────────────────────────────────────────────

/** مدل نمایش (frontend) — از API یا mock میاد */
export interface Reservation {
  id:                string;
  restaurant:        { name: string; image: string };
  date:              string;  // ISO: "2024-06-15" — نمایش به‌صورت شمسی
  time:              string;
  guests:            number;
  status:            ReservationStatus;
  reservationNumber: string;
}

// ── Auth ────────────────────────────────────────────────────

export interface AuthUser {
  accessToken: string;
  PhoneNumber: string;
  role:        UserRole;
  UserId?:     string;
}

// ── API Request / Response ───────────────────────────────────

export interface RegisterRequest {
  PhoneNumber: string;
  Password:    string;
  Role:        number; // UserRole enum: Customer=1, RestaurantOwner=2
}
export interface RegisterResponse {
  success: boolean;
  userId:  string;  // camelCase از بک‌اند
  message: string;
}

export interface LoginRequest {
  PhoneNumber: string;
  Password:    string;
}

/** پاسخ بک‌اند برای login/verify-otp (camelCase) */
export interface BackendLoginResponse {
  accessToken:           string;
  refreshToken:          string;
  phoneNumber:           string;
  role:                  string;  // "Customer" | "RestaurantOwner" | "Admin"
  userId:                string;
  expiresInMinutes:      number;
  /** کاربری که هنوز رمز یا پروفایل تکمیل نکرده (OTP-only account).
   *  متفاوت از isNewUser در sendOtp — حتی کاربر قدیمی که پروفایل ناقص دارد هم true می‌گیرد. */
  hasIncompleteProfile?: boolean;
}

/** مدل ساده برای استفاده داخلی سرویس */
export interface LoginResponse {
  accessToken: string;
  PhoneNumber: string;
}

export interface SendOTPRequest  { PhoneNumber: string; }
export interface SendOTPResponse {
  success:    boolean;
  message:    string;
  isNewUser?: boolean;
  devOtp?:    string;
}

export interface VerifyOTPRequest  { PhoneNumber: string; Code: string; RequestedRole?: string; }
export interface VerifyOTPResponse {
  accessToken:            string;
  PhoneNumber:            string;
  /** میرور HasIncompleteProfile بک‌اند — پروفایل ناقص است، نه لزوماً کاربر جدید */
  hasIncompleteProfile?:  boolean;
}

/** پاسخ صفحه‌بندی‌شده بک‌اند */
export interface PaginatedResult<T> {
  items:          T[];
  page:           number;
  pageSize:       number;
  totalCount:     number;
  totalPages:     number;
  hasPreviousPage: boolean;
  hasNextPage:    boolean;
}

/** آیتم رستوران در لیست (بک‌اند) */
export interface RestaurantListItem {
  id:          string;
  name:        string;
  description: string;
  location:    string;
  foodType:    string;
  priceRange:  string;
  startTime:   string;
  endTime:     string;
  isApproved:  boolean;
}

export interface GetRestaurantsResponse { Restaurants: Restaurant[]; }

export interface CreateRestaurantRequest {
  Name:        string;
  Description: string;
  Location:    string;
  FoodType:    string;
  PriceRange?: string;
  StartTime:   string;
  EndTime:     string;
}

export interface CreateMenuItemRequest {
  RestaurantId: string;
  Name:         string;
  Description:  string;
  Image?:       string;
  Price:        number;
}

export interface CreateTableRequest {
  RestaurantId: string;
  TableNumber:  number;
  Capacity:     number;
}

export interface AdminLoginRequest  { PhoneNumber: string; Password: string; }
export interface AdminLoginResponse { success: boolean; message: string; accessToken?: string; }

export interface ApproveRestaurantRequest { RestaurantId: string; IsApproved: boolean; }

export interface ApiSuccessResponse { success: boolean; message: string; }

// ── Reservation API ──────────────────────────────────────────

export interface CreateReservationRequest {
  RestaurantId: string;
  Date:         string;    // ISO: "2024-06-15"
  Time:         string;    // "18:00"
  Guests:       number;
  FullName:     string;
  PhoneNumber:  string;
  Description?: string;
}

export interface CreateReservationResponse {
  ReservationId:     string;
  ReservationNumber: string;
  Status:            ReservationStatus;
}

export interface CancelReservationRequest {
  ReservationId: string;
  Reason?:       string;
}

export interface GetReservationsResponse {
  Reservations: Reservation[];
}

// ── Manager Reservation ──────────────────────────────────────

export interface ManagerReservation {
  id:                string;
  customer:          { name: string; phone: string };
  date:              string;
  time:              string;
  guests:            number;
  status:            ReservationStatus;
  reservationNumber: string;
  notes:             string;
}

export interface GetManagerReservationsResponse {
  Reservations: ManagerReservation[];
}

export interface ApproveReservationRequest { ReservationId: string; }
export interface RejectReservationRequest  { ReservationId: string; Reason?: string; }

// ── Menu / Table Update & Delete ─────────────────────────────

export interface UpdateMenuItemRequest {
  MenuItemId:   string;
  Name:         string;
  Description:  string;
  Image?:       string;
  Price:        number;
}

export interface DeleteMenuItemRequest { MenuItemId: string; }

export interface UpdateTableRequest {
  TableId:     string;
  TableNumber: number;
  Capacity:    number;
}

export interface DeleteTableRequest { TableId: string; }

// ── Available Table ──────────────────────────────────────────

export interface AvailableTable {
  tableId:     string;
  tableNumber: number;
  capacity:    number;
}

// ── User Profile ─────────────────────────────────────────────

export interface UserProfile {
  id:               string;
  phoneNumber:      string;
  role:             string;
  displayName:      string | null;
  avatarUrl:        string | null;
  memberSince:      string;
  totalReservations: number;
  favoritesCount:   number;
}

export interface UpdateProfileRequest {
  displayName: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword:     string;
}

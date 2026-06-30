// ============================================================
// Patogh — Reservation Service
// ============================================================

import { apiClient, IS_MOCK, mockDelay } from './client';
import { mockReservations, mockRestaurants } from './mock/data';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  CancelReservationRequest,
  ApiSuccessResponse,
  Reservation,
  ManagerReservation,
  GetManagerReservationsResponse,
  ApproveReservationRequest,
  RejectReservationRequest,
  PaginatedResult,
  AvailableTable,
  ReservationStatus,
} from '../types';

// رزروهای runtime — با refresh ریست می‌شه (فقط mock)
const mockReservationStore: Reservation[] = [...mockReservations];
const mockManagerReservationStore: ManagerReservation[] = [
  {
    id: 'mr-1',
    customer: { name: 'محمد احمدی',  phone: '09123456789' },
    date: '2024-06-20', time: '18:00', guests: 2,
    status: 'pending', reservationNumber: 'RES-123456',
    notes: 'لطفا میز کنار پنجره',
  },
  {
    id: 'mr-2',
    customer: { name: 'سارا کریمی',  phone: '09198765432' },
    date: '2024-06-21', time: '20:00', guests: 4,
    status: 'pending', reservationNumber: 'RES-123457',
    notes: '',
  },
  {
    id: 'mr-3',
    customer: { name: 'رضا محمدی',   phone: '09121112222' },
    date: '2024-06-19', time: '19:30', guests: 3,
    status: 'approved', reservationNumber: 'RES-123455',
    notes: '',
  },
  {
    id: 'mr-4',
    customer: { name: 'مینا رضایی',  phone: '09133334444' },
    date: '2024-06-18', time: '17:00', guests: 2,
    status: 'rejected', reservationNumber: 'RES-123454',
    notes: '',
  },
];

// تبدیل statusLabel بک‌اند به ReservationStatus فرانت
function mapStatus(statusLabel: string): ReservationStatus {
  switch (statusLabel) {
    case 'Confirmed': return 'approved';
    case 'Rejected':  return 'rejected';
    case 'Cancelled': return 'cancelled';
    default:          return 'pending';
  }
}

// تبدیل "18:00:00" به "18:00"
function trimSeconds(time: string): string {
  return time?.length > 5 ? time.substring(0, 5) : (time ?? '');
}

// تبدیل ReservationSummaryDto به Reservation (مدل مشتری)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToReservation(r: any): Reservation {
  return {
    id:                r.id,
    restaurant:        { name: r.restaurantName ?? '', image: '' },
    date:              r.reservationDate ?? '',
    time:              trimSeconds(r.startTime ?? ''),
    guests:            r.guestCount ?? 0,
    status:            mapStatus(r.statusLabel ?? ''),
    reservationNumber: `RES-${r.id?.substring(0, 8)?.toUpperCase() ?? ''}`,
  };
}

// تبدیل ReservationSummaryDto به ManagerReservation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToManagerReservation(r: any): ManagerReservation {
  return {
    id:                r.id,
    customer:          { name: r.customerName ?? '', phone: r.customerPhone ?? '' },
    date:              r.reservationDate ?? '',
    time:              trimSeconds(r.startTime ?? ''),
    guests:            r.guestCount ?? 0,
    status:            mapStatus(r.statusLabel ?? ''),
    reservationNumber: `RES-${r.id?.substring(0, 8)?.toUpperCase() ?? ''}`,
    notes:             r.notes ?? '',
  };
}

// ── Create ───────────────────────────────────────────────────

export async function createReservation(
  data: CreateReservationRequest,
): Promise<CreateReservationResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const restaurant        = mockRestaurants.find((r) => r.Id === data.RestaurantId);
    const reservationNumber = `RES-${Date.now().toString().slice(-6)}`;
    const newReservation: Reservation = {
      id:          `res-${Date.now()}`,
      restaurant:  {
        name:  restaurant?.Name  ?? 'رستوران',
        image: restaurant?.Image ?? '/images/restaurant-1.jpg',
      },
      date:              data.Date,
      time:              data.Time,
      guests:            data.Guests,
      status:            'pending',
      reservationNumber,
    };
    mockReservationStore.push(newReservation);
    const customerPhone = localStorage.getItem('phoneNumber') ?? '—';
    mockManagerReservationStore.push({
      id:                newReservation.id,
      customer:          { name: data.FullName, phone: customerPhone },
      date:              data.Date,
      time:              data.Time,
      guests:            data.Guests,
      status:            'pending',
      reservationNumber,
      notes:             data.Description ?? '',
    });
    return {
      ReservationId:     newReservation.id,
      ReservationNumber: reservationNumber,
      Status:            'pending',
    };
  }

  // ابتدا میز خالی پیدا می‌کنیم، سپس رزرو می‌سازیم
  const startTimeFull = data.Time.length === 5 ? `${data.Time}:00` : data.Time;

  const tables = await apiClient.get<AvailableTable[]>(
    `/api/restaurants/${data.RestaurantId}/available-tables` +
    `?date=${data.Date}&startTime=${encodeURIComponent(startTimeFull)}&guestCount=${data.Guests}`
  );

  if (!tables || tables.length === 0) {
    throw new Error('متأسفانه برای این تاریخ و ساعت میز خالی وجود ندارد');
  }

  const tableId = tables[0].tableId;

  const res = await apiClient.post<{ success: boolean; reservationId: string; message: string }>(
    '/api/reservations',
    {
      RestaurantId:    data.RestaurantId,
      TableId:         tableId,
      CustomerName:    data.FullName,
      CustomerPhone:   data.PhoneNumber,
      GuestCount:      data.Guests,
      ReservationDate: data.Date,
      StartTime:       startTimeFull,
      Notes:           data.Description ?? null,
    }
  );

  return {
    ReservationId:     res.reservationId,
    ReservationNumber: `RES-${res.reservationId?.substring(0, 8)?.toUpperCase() ?? ''}`,
    Status:            'pending',
  };
}

// ── Get Mine ─────────────────────────────────────────────────

export async function getMyReservations(): Promise<Reservation[]> {
  if (IS_MOCK) {
    await mockDelay();
    return [...mockReservationStore].reverse();
  }
  const res = await apiClient.get<PaginatedResult<unknown>>('/api/reservations/my');
  return res.items.map(mapToReservation);
}

// ── Cancel ───────────────────────────────────────────────────

export async function cancelReservation(
  data: CancelReservationRequest,
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const index = mockReservationStore.findIndex((r) => r.id === data.ReservationId);
    if (index === -1)
      throw new Error('رزرو پیدا نشد');
    if (mockReservationStore[index].status !== 'pending')
      throw new Error('فقط رزروهای در انتظار قابل لغو هستند');
    mockReservationStore[index] = { ...mockReservationStore[index], status: 'cancelled' };
    return { success: true, message: 'رزرو با موفقیت لغو شد' };
  }
  // بک‌اند: DELETE /api/reservations/{id}
  return apiClient.delete<ApiSuccessResponse>(`/api/reservations/${data.ReservationId}`);
}

// ── Manager: Get Restaurant Reservations ─────────────────────

export async function getRestaurantReservations(): Promise<ManagerReservation[]> {
  if (IS_MOCK) {
    await mockDelay();
    return [...mockManagerReservationStore].reverse();
  }

  // ابتدا رستوران مدیر را پیدا می‌کنیم
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myRestaurants = await apiClient.get<any[]>('/api/restaurants/my').catch(() => []);
  if (!myRestaurants || myRestaurants.length === 0) return [];

  const restaurantId = myRestaurants[0].id;
  const res = await apiClient.get<PaginatedResult<unknown>>(
    `/api/reservations/restaurant/${restaurantId}`
  );
  return res.items.map(mapToManagerReservation);
}

// ── Manager: Approve ─────────────────────────────────────────

export async function approveReservation(
  data: ApproveReservationRequest,
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const mi = mockManagerReservationStore.findIndex((r) => r.id === data.ReservationId);
    const ci = mockReservationStore.findIndex((r) => r.id === data.ReservationId);
    if (mi !== -1) mockManagerReservationStore[mi] = { ...mockManagerReservationStore[mi], status: 'approved' };
    if (ci !== -1) mockReservationStore[ci]         = { ...mockReservationStore[ci],         status: 'approved' };
    return { success: true, message: 'رزرو تأیید شد' };
  }
  // بک‌اند: PUT /api/reservations/{id}/confirm
  return apiClient.put<ApiSuccessResponse>(
    `/api/reservations/${data.ReservationId}/confirm`,
    {}
  );
}

// ── Manager: Reject ──────────────────────────────────────────

export async function rejectReservation(
  data: RejectReservationRequest,
): Promise<ApiSuccessResponse> {
  if (IS_MOCK) {
    await mockDelay();
    const mi = mockManagerReservationStore.findIndex((r) => r.id === data.ReservationId);
    const ci = mockReservationStore.findIndex((r) => r.id === data.ReservationId);
    if (mi !== -1) mockManagerReservationStore[mi] = { ...mockManagerReservationStore[mi], status: 'rejected' };
    if (ci !== -1) mockReservationStore[ci]         = { ...mockReservationStore[ci],         status: 'rejected' };
    return { success: true, message: 'رزرو رد شد' };
  }
  // بک‌اند: PUT /api/reservations/{id}/reject
  return apiClient.put<ApiSuccessResponse>(
    `/api/reservations/${data.ReservationId}/reject`,
    {}
  );
}

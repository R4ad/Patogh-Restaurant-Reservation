// ============================================================
// Patogh — Notification Service
// ============================================================

import { apiClient, IS_MOCK, mockDelay } from './client';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id:            string;
  type:          NotificationType;
  title:         string;
  message:       string;
  time:          string;   // برای نمایش: "۲ ساعت پیش"
  createdAt:     number;   // timestamp برای مرتب‌سازی
  read:          boolean;
  reservationId?: string;
}

const NOTIFS_KEY = 'patogh_notifications';

const INITIAL_MOCK: AppNotification[] = [
  {
    id: 'n-1',
    type: 'success',
    title: 'رزرو تأیید شد',
    message: 'رزرو شما در رستوران سنتی شیراز برای تاریخ ۱۴۰۳/۰۳/۱۰ ساعت ۲۰:۰۰ تأیید شد',
    time: '۲ ساعت پیش',
    createdAt: Date.now() - 2 * 36e5,
    read: false,
    reservationId: '2',
  },
  {
    id: 'n-2',
    type: 'error',
    title: 'رزرو رد شد',
    message: 'متأسفانه رزرو شما در کافه رویال به دلیل عدم ظرفیت رد شد',
    time: '۵ ساعت پیش',
    createdAt: Date.now() - 5 * 36e5,
    read: false,
    reservationId: '3',
  },
  {
    id: 'n-3',
    type: 'info',
    title: 'یادآوری رزرو',
    message: 'رزرو شما در رستوران آریا فردا ساعت ۱۹:۳۰ است',
    time: '۱ روز پیش',
    createdAt: Date.now() - 24 * 36e5,
    read: true,
    reservationId: '4',
  },
];

function getStored(): AppNotification[] {
  try { return JSON.parse(localStorage.getItem(NOTIFS_KEY) ?? 'null') ?? []; }
  catch { return []; }
}

function save(list: AppNotification[]): void {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(list));
}

/** ایجاد اعلان جدید — قابل فراخوانی از سایر سرویس‌ها */
export function pushNotification(
  notif: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'time'>,
): void {
  const stored = getStored();
  save([{ ...notif, id: `n-${Date.now()}`, createdAt: Date.now(), read: false, time: 'همین الان' }, ...stored]);
}

/** دریافت همه‌ی اعلان‌ها */
export async function getNotifications(): Promise<AppNotification[]> {
  if (IS_MOCK) {
    await mockDelay();
    const stored = getStored();
    if (stored.length === 0) {
      save(INITIAL_MOCK);
      return INITIAL_MOCK;
    }
    return [...stored].sort((a, b) => b.createdAt - a.createdAt);
  }
  return apiClient.get<AppNotification[]>('/notifications');
}

/** خوانده‌شدن یک اعلان */
export async function markAsRead(notifId: string): Promise<void> {
  if (IS_MOCK) {
    save(getStored().map((n) => n.id === notifId ? { ...n, read: true } : n));
    return;
  }
  await apiClient.post('/notifications/read', { NotificationId: notifId });
}

/** خوانده‌شدن همه‌ی اعلان‌ها */
export async function markAllAsRead(): Promise<void> {
  if (IS_MOCK) {
    save(getStored().map((n) => ({ ...n, read: true })));
    return;
  }
  await apiClient.post('/notifications/read-all', {});
}

/** تعداد خوانده‌نشده — همزمان */
export function getUnreadCount(): number {
  return getStored().filter((n) => !n.read).length;
}
/**
 * تبدیل تاریخ ISO میلادی به نمایش شمسی
 * از Intl.DateTimeFormat مرورگر استفاده می‌کنه — بدون کتابخانه‌ی اضافه
 * مثال: "2024-06-15" → "۱۴۰۳/۰۳/۲۶"
 */
export function formatJalaliDate(isoDate: string): string {
  if (!isoDate) return '—';
  try {
    const date = isoDate.includes('T')
      ? new Date(isoDate)
      : new Date(isoDate + 'T00:00:00');
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('fa-IR', {
      calendar: 'persian',
      year:  'numeric',
      month: '2-digit',
      day:   '2-digit',
    }).format(date);
  } catch {
    return isoDate;
  }
}
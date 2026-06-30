// ============================================================
// Patogh — Shared Formatting Utilities
// ============================================================

/** عدد به فارسی: 1500 → ۱٬۵۰۰ */
export function formatNumber(n: number): string {
  return n.toLocaleString('fa-IR');
}

/** قیمت به فارسی: 85000 → ۸۵٬۰۰۰ تومان */
export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR') + ' تومان';
}

/** تعداد نفرات: 4 → ۴ نفر */
export function formatGuests(guests: number): string {
  return `${guests.toLocaleString('fa-IR')} نفر`;
}

/** امتیاز: 4.5 → ۴٫۵ */
export function formatRating(rating: number): string {
  return rating.toLocaleString('fa-IR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
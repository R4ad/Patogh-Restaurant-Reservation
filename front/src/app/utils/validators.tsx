// ============================================================
// Patogh — Shared Form Validators
// ============================================================

/** فرمت معتبر موبایل ایرانی: ۱۱ رقم، شروع با ۰۹ */
const iranianPhoneRegex = /^09[0-9]{9}$/;

export const validateIranianPhone = (value: string) =>
  iranianPhoneRegex.test(value) ||
  'شماره موبایل باید با ۰۹ شروع شده و دقیقاً ۱۱ رقم باشد';

export const validatePasswordLength = (value: string) =>
  value.length >= 6 || 'رمز عبور باید حداقل ۶ کاراکتر باشد';

/** کلاس ورودی با وضعیت خطا */
export function inputClass(hasError = false): string {
  const base =
    'w-full px-4 py-3 bg-input-background border rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-ring transition-colors';
  return hasError ? `${base} border-destructive` : `${base} border-border`;
}

/** نمایش خطای زیر هر فیلد */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs mt-1 text-right">{message}</p>;
}
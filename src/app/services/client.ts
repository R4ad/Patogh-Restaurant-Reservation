// ============================================================
// Patogh — Base HTTP Client
// ============================================================
//
// VITE_USE_MOCK=true  → همه سرویس‌ها از mock data برمی‌گردن
// VITE_API_URL=...    → آدرس بک‌اند واقعی
//
// اگه VITE_API_URL خالی باشه به‌صورت خودکار mock فعال می‌شه

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const IS_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' || !BASE_URL;

// تاخیر مصنوعی برای mock (احساس شبکه)
export const mockDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Fetcher ──────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(errorBody || `خطای سرور: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

// IS_MOCK is controlled exclusively by VITE_USE_MOCK.
// Removing the !BASE_URL fallback prevents empty VITE_API_URL (relative-URL
// production setup) from silently activating mock mode.
export const IS_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true';

export const mockDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Auth helpers ──────────────────────────────────────────────

function clearAuthAndRedirect(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('phoneNumber');
  window.location.href = '/login';
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken as string;
  } catch {
    return null;
  }
}

// ── Core fetcher ──────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
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

  // Only attempt token refresh when a session existed (token was sent in the request).
  // Without this guard, a failed login (401 from /api/auth/login) would trigger
  // clearAuthAndRedirect(), causing a page reload before the error could be shown.
  if (res.status === 401 && !isRetry && token) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return request<T>(path, options, true);
    }
    clearAuthAndRedirect();
    throw new Error('نشست شما منقضی شده است. لطفاً مجدداً وارد شوید');
  }

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    let message = `خطای سرور: ${res.status}`;
    if (errorBody) {
      try {
        const json = JSON.parse(errorBody) as Record<string, unknown>;
        message = (json.detail as string) || (json.title as string) || (json.message as string) || errorBody;
      } catch {
        message = errorBody;
      }
    }
    throw new Error(message);
  }

  // Handle 201 with empty body (e.g., AddFavorite)
  const contentLength = res.headers.get('content-length');
  if (res.status === 204 || contentLength === '0') {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: body !== null ? JSON.stringify(body) : undefined }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};

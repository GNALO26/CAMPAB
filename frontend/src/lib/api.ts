// Client HTTP centralisé pour l'API CAMPAB

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "http://localhost:4000";

const TOKEN_KEY = "campab_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>;
}

export class ApiException extends Error {
  status: number;
  details?: Record<string, string[]>;
  constructor({ status, message, details }: ApiError) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = false, isFormData = false, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers || {}),
  };

  if (auth) {
    const token = getToken();
    if (token) (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  // 204 No Content
  if (response.status === 204) return undefined as T;

  let data: unknown = null;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const err = (data as { error?: string; details?: Record<string, string[]> }) || {};
    throw new ApiException({
      status: response.status,
      message: err.error || `Erreur ${response.status}`,
      details: err.details,
    });
  }

  return data as T;
}

// ==== Helpers courts ====
export const api = {
  get: <T>(path: string, auth = false) =>
    apiFetch<T>(path, { method: "GET", auth }),
  post: <T>(path: string, body?: unknown, auth = false) =>
    apiFetch<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "PUT", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "PATCH", body, auth }),
  delete: <T>(path: string, auth = true) =>
    apiFetch<T>(path, { method: "DELETE", auth }),
  upload: <T>(path: string, formData: FormData) =>
    apiFetch<T>(path, {
      method: "POST",
      body: formData,
      auth: true,
      isFormData: true,
    }),
};
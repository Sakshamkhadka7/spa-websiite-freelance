import axios, { AxiosError } from "axios";
export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] || "http://localhost:5000/api/v1";
export const API_ORIGIN = new URL(API_BASE_URL).origin;

const TOKEN_KEY = "salus-token";
const USER_KEY = "salus-user";

export const tokenStorage = {
  get: (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const userStorage = {
  get: <T>(): T | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  set: (u: unknown) => {
    if (typeof window !== "undefined") localStorage.setItem(USER_KEY, JSON.stringify(u));
  },
};

export const api = axios.create({ baseURL: API_BASE_URL, headers: { Accept: "application/json" } });

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The production API uses a consistent { success, message, data, pagination }
// envelope. Unwrap it here so the existing service/type layer stays unchanged.
api.interceptors.response.use(
  (response) => {
    const body = response.data as { success?: boolean; data?: unknown } | undefined;
    if (body?.success === true && Object.prototype.hasOwnProperty.call(body, "data"))
      response.data = body.data;
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        const admin = window.location.pathname.startsWith("/admin");
        window.location.assign(admin ? "/admin/login" : "/login");
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

/** Build multipart/form-data for REST uploads. */
export function toFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (v instanceof File) fd.append(k, v);
    else if (typeof v === "object") fd.append(k, JSON.stringify(v));
    else fd.append(k, String(v));
  });
  return fd;
}

export function backendImageUrl(value?: string): string {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/.test(value) || value.startsWith("asset:")) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}

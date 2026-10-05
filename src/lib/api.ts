import axios, { AxiosError } from "axios";
import type { ImageInput } from "@/types";
import { fileToDataUrl } from "./images";

/**
 * Set VITE_API_BASE_URL (e.g. http://localhost:5000/api) to switch every service
 * from the local mock store to the Express/MongoDB REST API.
 */
export const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;
export const USE_MOCK = !API_BASE_URL;

const TOKEN_KEY = "salus-token";
const USER_KEY = "salus-user";

export const tokenStorage = {
  get: (): string | null => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => {
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
  set: (u: unknown) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
};

export const api = axios.create({ baseURL: API_BASE_URL, headers: { Accept: "application/json" } });

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

/** Mock helper: turn a picked File into a storable data URL. */
export async function resolveImageInput(image: ImageInput): Promise<string> {
  return typeof image === "string" ? image : fileToDataUrl(image);
}

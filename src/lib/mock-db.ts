import { seed, type MockDB } from "./seed";

const KEY = "salus-db-v1";
let cache: MockDB | null = null;

/** Temporary browser-local data store. Replaced by the REST API when VITE_API_BASE_URL is set. */
export function db(): MockDB {
  if (typeof window === "undefined") return seed();
  if (!cache) {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as MockDB) : seed();
    persist();
  }
  return cache;
}

export function persist() {
  if (typeof window === "undefined" || !cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    throw new Error("Local storage is full — try a smaller image.");
  }
}

export function resetDb() {
  cache = seed();
  persist();
}

export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
export const uid = () => crypto.randomUUID();

/**
 * Tiny localStorage cache for semi-static KMB data.
 *
 * Each entry stores { t: savedAt, v: value }. `cacheGet` returns the value only
 * when it is younger than `ttl`; pass `Infinity` to accept any stale entry
 * (used as an offline fallback). All access is guarded so it is a no-op during
 * SSR / static export where `window` is undefined.
 */

interface Entry<T> {
  t: number;
  v: T;
}

const hasStorage = (): boolean =>
  typeof window !== 'undefined' && !!window.localStorage;

export function cacheGet<T>(key: string, ttl: number): T | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    if (ttl !== Infinity && Date.now() - entry.t > ttl) return null;
    return entry.v;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  try {
    const entry: Entry<T> = { t: Date.now(), v: value };
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Quota exceeded (the stop list is large) — fail silently; the app still
    // works without the cache, just re-fetching on next load.
  }
}

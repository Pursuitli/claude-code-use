/**
 * KMB Open Data API client (runs in the browser).
 *
 * Two origins are used:
 *  - INTERNAL (`/api/kmb/*`): Vercel Route Handlers that edge-cache the heavy,
 *    semi-static data (route list, stop list, route-stop mapping). This means
 *    each visitor downloads a trimmed, CDN-cached payload and KMB is hit ~once
 *    a day instead of once per browser.
 *  - KMB (the public API): used directly for live ETA and single-stop detail,
 *    where freshness and low latency beat an extra server hop. The API is
 *    CORS-enabled and needs no key.
 *
 * Static data is additionally cached in localStorage for a day; ETA is never
 * cached here — callers poll it.
 */

import type {
  KmbEnvelope,
  KmbRoute,
  KmbStop,
  KmbRouteStop,
  KmbEta,
  Direction,
} from './types';
import { cacheGet, cacheSet } from './cache';

/** Public KMB API — used directly for live data. */
const KMB = 'https://data.etabus.gov.hk/v1/transport/kmb';
/**
 * Same-origin Vercel proxy — used for edge-cached static data.
 * Note the trailing slash: the site sets `trailingSlash: true`, so requests
 * without it 308-redirect. We build canonical (trailing-slash) URLs to skip
 * that extra hop.
 */
const INTERNAL = '/api/kmb';

/** One day in milliseconds — the refresh budget for semi-static data. */
export const STATIC_TTL = 24 * 60 * 60 * 1000;

/** Low-level fetch that unwraps the { data } envelope and fails loudly on non-2xx. */
async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request to ${url} responded ${res.status}`);
  }
  const json = (await res.json()) as KmbEnvelope<T>;
  return json.data;
}

/**
 * Fetch with a localStorage cache. Returns cached data immediately when it is
 * still fresh; otherwise hits the network and refreshes the cache. On network
 * failure we fall back to stale cache (if any) so the app stays usable offline.
 */
async function fetchCached<T>(key: string, url: string): Promise<T> {
  const cached = cacheGet<T>(key, STATIC_TTL);
  if (cached) return cached;
  try {
    const data = await fetchData<T>(url);
    cacheSet(key, data);
    return data;
  } catch (err) {
    const stale = cacheGet<T>(key, Infinity);
    if (stale) return stale;
    throw err;
  }
}

// ── Static (edge-cached via /api/kmb, plus daily localStorage) ────────────

/** Every route variant (route + bound + service_type). */
export function getRoutes(): Promise<KmbRoute[]> {
  return fetchCached<KmbRoute[]>('kmb:routes', `${INTERNAL}/routes/`);
}

/** The full stop list with coordinates (trimmed by the proxy). */
export function getStops(): Promise<KmbStop[]> {
  return fetchCached<KmbStop[]>('kmb:stops', `${INTERNAL}/stops/`);
}

/** Ordered stop sequence for a route direction + service type. */
export function getRouteStops(
  route: string,
  direction: Direction,
  serviceType: string,
): Promise<KmbRouteStop[]> {
  const key = `kmb:route-stop:${route}:${direction}:${serviceType}`;
  return fetchCached<KmbRouteStop[]>(
    key,
    `${INTERNAL}/route-stop/${encodeURIComponent(route)}/${direction}/${encodeURIComponent(serviceType)}/`,
  );
}

// ── Live (client-direct, never cached — polled by the UI) ─────────────────

/** GET /stop/{stop_id} — single stop detail. */
export function getStop(stopId: string, signal?: AbortSignal): Promise<KmbStop> {
  return fetchData<KmbStop>(`${KMB}/stop/${encodeURIComponent(stopId)}`, signal);
}

/** GET /eta/{stop_id}/{route}/{service_type} — ETA for one route at one stop. */
export function getEta(
  stopId: string,
  route: string,
  serviceType: string,
  signal?: AbortSignal,
): Promise<KmbEta[]> {
  return fetchData<KmbEta[]>(
    `${KMB}/eta/${encodeURIComponent(stopId)}/${encodeURIComponent(route)}/${serviceType}`,
    signal,
  );
}

/** GET /stop-eta/{stop_id} — ETA for every route serving a stop. */
export function getStopEta(stopId: string, signal?: AbortSignal): Promise<KmbEta[]> {
  return fetchData<KmbEta[]>(`${KMB}/stop-eta/${encodeURIComponent(stopId)}`, signal);
}

/** GET /route-eta/{route}/{service_type} — ETA for every stop on a route. */
export function getRouteEta(
  route: string,
  serviceType: string,
  signal?: AbortSignal,
): Promise<KmbEta[]> {
  return fetchData<KmbEta[]>(
    `${KMB}/route-eta/${encodeURIComponent(route)}/${serviceType}`,
    signal,
  );
}

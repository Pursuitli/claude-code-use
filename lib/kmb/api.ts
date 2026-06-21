/**
 * KMB Open Data API client.
 *
 * All requests run in the browser; the API is CORS-enabled and needs no key.
 * Static data (route list, stop list, route-stop mapping) is cached in
 * localStorage for one day. ETA data is never cached here — callers poll it.
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

const BASE = 'https://data.etabus.gov.hk/v1/transport/kmb';

/** One day in milliseconds — the refresh budget for semi-static data. */
export const STATIC_TTL = 24 * 60 * 60 * 1000;

/** Low-level fetch that unwraps the { data } envelope and fails loudly on non-2xx. */
async function fetchData<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal });
  if (!res.ok) {
    throw new Error(`KMB API ${path} responded ${res.status}`);
  }
  const json = (await res.json()) as KmbEnvelope<T>;
  return json.data;
}

/**
 * Fetch with a localStorage cache. Returns cached data immediately when it is
 * still fresh; otherwise hits the network and refreshes the cache. On network
 * failure we fall back to stale cache (if any) so the app stays usable offline.
 */
async function fetchCached<T>(key: string, path: string): Promise<T> {
  const cached = cacheGet<T>(key, STATIC_TTL);
  if (cached) return cached;
  try {
    const data = await fetchData<T>(path);
    cacheSet(key, data);
    return data;
  } catch (err) {
    const stale = cacheGet<T>(key, Infinity);
    if (stale) return stale;
    throw err;
  }
}

// ── Static (cached daily) ────────────────────────────────────────────────

/** GET /route/ — every route variant (route + bound + service_type). */
export function getRoutes(): Promise<KmbRoute[]> {
  return fetchCached<KmbRoute[]>('kmb:routes', '/route/');
}

/** GET /stop — the full stop list with coordinates. Large (~600KB). */
export function getStops(): Promise<KmbStop[]> {
  return fetchCached<KmbStop[]>('kmb:stops', '/stop');
}

/** GET /route-stop/{route}/{direction}/{service_type} — ordered stop sequence. */
export function getRouteStops(
  route: string,
  direction: Direction,
  serviceType: string,
): Promise<KmbRouteStop[]> {
  const key = `kmb:route-stop:${route}:${direction}:${serviceType}`;
  return fetchCached<KmbRouteStop[]>(
    key,
    `/route-stop/${encodeURIComponent(route)}/${direction}/${serviceType}`,
  );
}

// ── Live (never cached — polled by the UI) ───────────────────────────────

/** GET /stop/{stop_id} — single stop detail. */
export function getStop(stopId: string, signal?: AbortSignal): Promise<KmbStop> {
  return fetchData<KmbStop>(`/stop/${encodeURIComponent(stopId)}`, signal);
}

/** GET /eta/{stop_id}/{route}/{service_type} — ETA for one route at one stop. */
export function getEta(
  stopId: string,
  route: string,
  serviceType: string,
  signal?: AbortSignal,
): Promise<KmbEta[]> {
  return fetchData<KmbEta[]>(
    `/eta/${encodeURIComponent(stopId)}/${encodeURIComponent(route)}/${serviceType}`,
    signal,
  );
}

/** GET /stop-eta/{stop_id} — ETA for every route serving a stop. */
export function getStopEta(stopId: string, signal?: AbortSignal): Promise<KmbEta[]> {
  return fetchData<KmbEta[]>(`/stop-eta/${encodeURIComponent(stopId)}`, signal);
}

/** GET /route-eta/{route}/{service_type} — ETA for every stop on a route. */
export function getRouteEta(
  route: string,
  serviceType: string,
  signal?: AbortSignal,
): Promise<KmbEta[]> {
  return fetchData<KmbEta[]>(
    `/route-eta/${encodeURIComponent(route)}/${serviceType}`,
    signal,
  );
}

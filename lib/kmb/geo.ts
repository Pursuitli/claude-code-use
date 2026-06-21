/** Geographic helpers for the "nearby stops" feature. */

import type { KmbStop } from './types';

/** Great-circle distance between two lat/lng points, in metres (Haversine). */
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface StopWithDistance {
  stop: KmbStop;
  distance: number;
}

/**
 * Return stops within `radius` metres of (lat, lon), nearest first.
 * Stops with missing/invalid coordinates are skipped.
 */
export function nearbyStops(
  stops: KmbStop[],
  lat: number,
  lon: number,
  radius: number,
): StopWithDistance[] {
  const out: StopWithDistance[] = [];
  for (const stop of stops) {
    const sLat = parseFloat(stop.lat ?? '');
    const sLon = parseFloat(stop.long ?? '');
    if (Number.isNaN(sLat) || Number.isNaN(sLon)) continue;
    const distance = distanceMeters(lat, lon, sLat, sLon);
    if (distance <= radius) out.push({ stop, distance });
  }
  out.sort((a, b) => a.distance - b.distance);
  return out;
}

/** Pretty distance: "120 m" or "1.3 km". */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

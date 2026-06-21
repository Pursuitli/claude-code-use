/**
 * Local favorites store (localStorage).
 *
 * A favorite is a route + service_type + direction pinned at a specific stop —
 * e.g. "87D 沙田第一城 → 紅磡站". This is enough to render a live ETA card
 * directly via getEta(stopId, route, serviceType).
 */

import type { Bound } from './types';

export interface Favorite {
  /** Stable id derived from the fields below. */
  id: string;
  route: string;
  serviceType: string;
  bound: Bound;
  stopId: string;
  /** Cached display labels so the favorites page renders before any fetch. */
  stopNameTc: string;
  stopNameEn: string;
  destTc: string;
  destEn: string;
  addedAt: number;
}

const KEY = 'kmb:favorites';

export function favoriteId(
  route: string,
  serviceType: string,
  bound: Bound,
  stopId: string,
): string {
  return `${route}|${serviceType}|${bound}|${stopId}`;
}

function read(): Favorite[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

function write(list: Favorite[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
}

export function getFavorites(): Favorite[] {
  return read().sort((a, b) => b.addedAt - a.addedAt);
}

export function isFavorite(id: string): boolean {
  return read().some((f) => f.id === id);
}

/** Add (or no-op if already present). Returns the updated list. */
export function addFavorite(fav: Omit<Favorite, 'id' | 'addedAt'>): Favorite[] {
  const id = favoriteId(fav.route, fav.serviceType, fav.bound, fav.stopId);
  const list = read();
  if (!list.some((f) => f.id === id)) {
    list.push({ ...fav, id, addedAt: Date.now() });
    write(list);
  }
  return getFavorites();
}

export function removeFavorite(id: string): Favorite[] {
  write(read().filter((f) => f.id !== id));
  return getFavorites();
}

export function toggleFavorite(fav: Omit<Favorite, 'id' | 'addedAt'>): Favorite[] {
  const id = favoriteId(fav.route, fav.serviceType, fav.bound, fav.stopId);
  return isFavorite(id) ? removeFavorite(id) : addFavorite(fav);
}

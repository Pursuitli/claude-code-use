/**
 * ETA / time / text formatting helpers.
 *
 * The KMB API returns ETA timestamps as ISO 8601 strings already in Hong Kong
 * time (+08:00). We render the wall-clock time and minutes-remaining relative
 * to the user's "now".
 */

import type { KmbEta } from './types';

/** Minutes until `etaIso`, rounded down. Negative means the bus is due/past. */
export function minutesUntil(etaIso: string | null, now: number = Date.now()): number | null {
  if (!etaIso) return null;
  const t = new Date(etaIso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((t - now) / 60000);
}

/** Wall-clock time in Hong Kong, e.g. "18:42". */
export function hkClock(etaIso: string | null): string {
  if (!etaIso) return '--:--';
  const d = new Date(etaIso);
  if (Number.isNaN(d.getTime())) return '--:--';
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Hong_Kong',
  }).format(d);
}

/** Human label for minutes remaining: "已過", "即將到達", "5 分鐘". */
export function minutesLabel(mins: number | null): string {
  if (mins === null) return '—';
  if (mins < 0) return '已過';
  if (mins === 0) return '即將到達';
  return `${mins}`;
}

/**
 * Heuristic for whether an ETA is a live/real-time estimate vs. a scheduled
 * (timetable) one. KMB does not expose a flag, but flags scheduled trips in the
 * remark text ("Scheduled Bus" / "原定班次"). Treat everything else as live.
 */
export function isScheduled(eta: KmbEta): boolean {
  const en = (eta.rmk_en ?? '').toLowerCase();
  const tc = eta.rmk_tc ?? '';
  return en.includes('scheduled') || tc.includes('原定');
}

/** Pick the best remark to show, preferring Traditional Chinese. */
export function remark(eta: KmbEta): string {
  return eta.rmk_tc || eta.rmk_en || '';
}

/** Format a clock for "last updated" lines, in HK time with seconds. */
export function hkClockSeconds(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Hong_Kong',
  }).format(date);
}

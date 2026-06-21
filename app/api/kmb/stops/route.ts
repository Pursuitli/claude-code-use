import { proxyKmb } from '@/lib/kmb/server';
import type { KmbStop } from '@/lib/kmb/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/kmb/stops — edge-cached mirror of KMB /stop, trimmed to just the
 * fields the client needs. The full list is ~1 MB; dropping unused fields and
 * serving it from Vercel's edge cache means each visitor downloads far less and
 * KMB itself is hit ~once a day.
 */
export function GET() {
  return proxyKmb('/stop', (data) =>
    (data as KmbStop[]).map((s) => ({
      stop: s.stop,
      name_tc: s.name_tc,
      name_en: s.name_en,
      name_sc: s.name_sc,
      lat: s.lat,
      long: s.long,
    })),
  );
}

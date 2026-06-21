/**
 * Server-side helpers for the KMB proxy Route Handlers (app/api/kmb/*).
 *
 * These run on Vercel (Node/serverless), fetch the semi-static KMB data once,
 * and return it with a long CDN cache header so Vercel's edge serves every
 * visitor from cache and KMB is hit at most ~once per day per region.
 *
 * Only route/stop/route-stop go through here. Live ETA stays client-direct
 * for freshness and lowest latency.
 */

import { NextResponse } from 'next/server';

export const KMB_BASE = 'https://data.etabus.gov.hk/v1/transport/kmb';

/** One day at the edge, with a week of stale-while-revalidate grace. */
const CACHE_HEADER = 'public, s-maxage=86400, stale-while-revalidate=604800';

/**
 * Fetch an upstream KMB endpoint and return it as a JSON response with edge
 * caching. `transform` may trim the payload (e.g. drop unused stop fields).
 */
export async function proxyKmb(
  path: string,
  transform?: (data: unknown) => unknown,
): Promise<NextResponse> {
  try {
    const res = await fetch(`${KMB_BASE}${path}`, {
      // Let Vercel's Data Cache also hold it; the CDN header does the heavy lifting.
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream KMB responded ${res.status}` },
        { status: 502 },
      );
    }
    const json = (await res.json()) as { data?: unknown; generated_timestamp?: string };
    const data = transform ? transform(json.data) : json.data;
    return NextResponse.json(
      { data, generated_timestamp: json.generated_timestamp ?? new Date().toISOString() },
      { headers: { 'Cache-Control': CACHE_HEADER } },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upstream fetch failed' },
      { status: 502 },
    );
  }
}

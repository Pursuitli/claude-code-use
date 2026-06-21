import { proxyKmb } from '@/lib/kmb/server';

// Run per-request (no build-time fetch); the CDN header caches the response.
export const dynamic = 'force-dynamic';

/** GET /api/kmb/routes — edge-cached mirror of KMB /route/. */
export function GET() {
  return proxyKmb('/route/');
}

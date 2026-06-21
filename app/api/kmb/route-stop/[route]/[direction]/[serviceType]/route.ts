import { proxyKmb } from '@/lib/kmb/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/kmb/route-stop/{route}/{direction}/{serviceType}
 * Edge-cached mirror of KMB /route-stop/... (the ordered stop sequence).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ route: string; direction: string; serviceType: string }> },
) {
  const { route, direction, serviceType } = await params;
  // direction must be "inbound" | "outbound"; pass through but guard the rest.
  const dir = direction === 'inbound' ? 'inbound' : 'outbound';
  return proxyKmb(
    `/route-stop/${encodeURIComponent(route)}/${dir}/${encodeURIComponent(serviceType)}`,
  );
}

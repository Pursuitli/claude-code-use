'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStop, getStopEta } from '@/lib/kmb/api';
import { useAsync, usePolling, ETA_INTERVAL } from '@/lib/kmb/hooks';
import { useFavorites } from '@/lib/kmb/useFavorites';
import { favoriteId } from '@/lib/kmb/favorites';
import type { KmbEta } from '@/lib/kmb/types';
import { Skeleton, ErrorBox, Empty, RefreshBar } from '../_components/ui';
import { EtaList } from '../_components/EtaList';

export default function StopDetailPage() {
  return (
    <Suspense fallback={<Skeleton rows={4} />}>
      <StopDetail />
    </Suspense>
  );
}

interface Group {
  key: string;
  route: string;
  serviceType: string;
  bound: KmbEta['dir'];
  destTc: string;
  destEn: string;
  etas: KmbEta[];
}

function StopDetail() {
  const params = useSearchParams();
  const stopId = params.get('id') ?? '';

  const stop = useAsync(() => getStop(stopId), [stopId]);
  const eta = usePolling<KmbEta[]>((signal) => getStopEta(stopId, signal), ETA_INTERVAL, [stopId]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  // Group every ETA at this stop by route + service_type + direction (destination).
  const groups = useMemo<Group[]>(() => {
    const m = new Map<string, Group>();
    (eta.data ?? []).forEach((e) => {
      const key = `${e.route}|${e.service_type}|${e.dir}`;
      let g = m.get(key);
      if (!g) {
        g = {
          key,
          route: e.route,
          serviceType: String(e.service_type),
          bound: e.dir,
          destTc: e.dest_tc ?? '?',
          destEn: e.dest_en ?? '?',
          etas: [],
        };
        m.set(key, g);
      }
      g.etas.push(e);
    });
    return Array.from(m.values()).sort((a, b) =>
      a.route.localeCompare(b.route, undefined, { numeric: true }),
    );
  }, [eta.data]);

  const { toggle, has } = useFavorites();

  if (!stopId) return <Empty>缺少車站參數 · Missing stop id</Empty>;

  return (
    <>
      <Link href="/bus" className="kmb-back">‹ 返回搜尋 Back</Link>

      <h1 className="kmb-page-title">{stop.data?.name_tc ?? '車站 Stop'}</h1>
      <p className="kmb-page-sub">{stop.data?.name_en ?? stopId}</p>

      <RefreshBar updatedAt={eta.updatedAt} refreshing={eta.refreshing} onRefresh={eta.reload} />

      {eta.loading && <Skeleton rows={4} />}
      {eta.error && !eta.data && <ErrorBox error={eta.error} onRetry={eta.reload} />}
      {!eta.loading && groups.length === 0 && !eta.error && (
        <Empty>此車站暫無班次資料<br />No routes currently serving this stop</Empty>
      )}

      {groups.map((g) => {
        const stopNameTc = stop.data?.name_tc ?? stopId;
        const stopNameEn = stop.data?.name_en ?? '';
        const favId = favoriteId(g.route, g.serviceType, g.bound, stopId);
        const isFav = has(favId);
        return (
          <div className="kmb-stop" key={g.key}>
            <div className="kmb-eta-group-head">
              <Link
                href={`/bus/route?route=${encodeURIComponent(g.route)}&dir=${
                  g.bound === 'O' ? 'outbound' : 'inbound'
                }&st=${g.serviceType}`}
                className="kmb-route-badge"
              >
                {g.route}
              </Link>
              <span className="kmb-route-od">
                <span className="kmb-route-dest">往 {g.destTc}</span>
                <span className="kmb-route-en">to {g.destEn}</span>
              </span>
              <button
                className={`kmb-star ${isFav ? 'on' : ''}`}
                aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                onClick={() =>
                  toggle({
                    route: g.route,
                    serviceType: g.serviceType,
                    bound: g.bound,
                    stopId,
                    stopNameTc,
                    stopNameEn,
                    destTc: g.destTc,
                    destEn: g.destEn,
                  })
                }
              >
                {isFav ? '★' : '☆'}
              </button>
            </div>
            <EtaList etas={g.etas} now={now} />
          </div>
        );
      })}
    </>
  );
}

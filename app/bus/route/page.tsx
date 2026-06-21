'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getRoutes, getRouteStops, getStops, getRouteEta } from '@/lib/kmb/api';
import { useAsync, usePolling, ETA_INTERVAL } from '@/lib/kmb/hooks';
import { useFavorites } from '@/lib/kmb/useFavorites';
import { favoriteId } from '@/lib/kmb/favorites';
import type { Bound, Direction, KmbEta, KmbRoute, KmbStop } from '@/lib/kmb/types';
import { Skeleton, ErrorBox, Empty, RefreshBar } from '../_components/ui';
import { EtaList } from '../_components/EtaList';

export default function RouteDetailPage() {
  // useSearchParams must sit under a Suspense boundary for static export.
  return (
    <Suspense fallback={<Skeleton rows={4} />}>
      <RouteDetail />
    </Suspense>
  );
}

function RouteDetail() {
  const params = useSearchParams();
  const route = (params.get('route') ?? '').toUpperCase();
  const initialDir = (params.get('dir') as Direction) || 'outbound';
  const initialSt = params.get('st') ?? '1';

  const [dir, setDir] = useState<Direction>(initialDir);
  const [st, setSt] = useState<string>(initialSt);

  const allRoutes = useAsync(getRoutes, []);

  // Variants of this route number, used for the direction / service-type pickers.
  const variants = useMemo<KmbRoute[]>(
    () => (allRoutes.data ?? []).filter((r) => r.route.toUpperCase() === route),
    [allRoutes.data, route],
  );

  // Keep the picked direction/service_type valid for the loaded variants.
  useEffect(() => {
    if (variants.length === 0) return;
    const wantBound: Bound = dir === 'outbound' ? 'O' : 'I';
    const ok = variants.some((v) => v.bound === wantBound && v.service_type === st);
    if (!ok) {
      const fallback = variants.find((v) => v.bound === wantBound) ?? variants[0];
      setDir(fallback.bound === 'O' ? 'outbound' : 'inbound');
      setSt(fallback.service_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  const bound: Bound = dir === 'outbound' ? 'O' : 'I';
  const current = variants.find((v) => v.bound === bound && v.service_type === st);

  if (!route) return <Empty>缺少路線參數 · Missing route</Empty>;
  if (allRoutes.loading) return <Skeleton rows={4} />;
  if (allRoutes.error) return <ErrorBox error={allRoutes.error} onRetry={allRoutes.reload} />;
  if (variants.length === 0) return <Empty>找不到路線 {route}</Empty>;

  const boundsAvailable = Array.from(new Set(variants.map((v) => v.bound)));
  const serviceTypes = Array.from(
    new Set(variants.filter((v) => v.bound === bound).map((v) => v.service_type)),
  ).sort();

  const destFor = (b: Bound) => {
    const v = variants.find((x) => x.bound === b);
    return { tc: v?.dest_tc ?? '?', en: v?.dest_en ?? '?' };
  };

  return (
    <>
      <Link href="/bus" className="kmb-back">‹ 返回搜尋 Back</Link>
      <div className="kmb-route-row" style={{ marginBottom: 8 }}>
        <span className="kmb-route-badge">{route}</span>
        <span className="kmb-route-od">
          <span className="kmb-route-dest">
            {current?.orig_tc ?? '?'} <span className="arrow">→</span> {current?.dest_tc ?? '?'}
          </span>
          <span className="kmb-route-en">
            {current?.orig_en ?? '?'} → {current?.dest_en ?? '?'}
          </span>
        </span>
      </div>

      {/* Direction toggle */}
      <div className="kmb-dir-toggle">
        {(['O', 'I'] as Bound[])
          .filter((b) => boundsAvailable.includes(b))
          .map((b) => {
            const d = destFor(b);
            return (
              <button
                key={b}
                className={bound === b ? 'active' : ''}
                onClick={() => setDir(b === 'O' ? 'outbound' : 'inbound')}
              >
                往 {d.tc}
                <span className="sub">to {d.en}</span>
              </button>
            );
          })}
      </div>

      {/* Service-type chips (only when the route has variants) */}
      {serviceTypes.length > 1 && (
        <div className="kmb-chips">
          {serviceTypes.map((s) => (
            <button
              key={s}
              className={`kmb-chip ${st === s ? 'active' : ''}`}
              onClick={() => setSt(s)}
            >
              {s === '1' ? '正常班次' : `特別班次 ${s}`}
            </button>
          ))}
        </div>
      )}

      <StopSequence route={route} dir={dir} st={st} bound={bound} dest={destFor(bound)} />
    </>
  );
}

function StopSequence({
  route,
  dir,
  st,
  bound,
  dest,
}: {
  route: string;
  dir: Direction;
  st: string;
  bound: Bound;
  dest: { tc: string; en: string };
}) {
  // Static, cached: the ordered stop sequence + the master stop list for names.
  const routeStops = useAsync(() => getRouteStops(route, dir, st), [route, dir, st]);
  const stops = useAsync(getStops, []);

  // Live, polled every 30s: ETA for every stop on this route+service_type.
  const eta = usePolling<KmbEta[]>(
    (signal) => getRouteEta(route, st, signal),
    ETA_INTERVAL,
    [route, st],
  );
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  // stopId -> stop details
  const stopMap = useMemo(() => {
    const m = new Map<string, KmbStop>();
    (stops.data ?? []).forEach((s) => m.set(s.stop, s));
    return m;
  }, [stops.data]);

  // seq -> ETAs (filtered to the active direction)
  const etaBySeq = useMemo(() => {
    const m = new Map<number, KmbEta[]>();
    (eta.data ?? [])
      .filter((e) => e.dir === bound)
      .forEach((e) => {
        const arr = m.get(e.seq) ?? [];
        arr.push(e);
        m.set(e.seq, arr);
      });
    return m;
  }, [eta.data, bound]);

  const { toggle, has } = useFavorites();

  if (routeStops.loading || stops.loading) return <Skeleton rows={5} />;
  if (routeStops.error) return <ErrorBox error={routeStops.error} onRetry={routeStops.reload} />;
  if (!routeStops.data || routeStops.data.length === 0)
    return <Empty>此方向沒有車站資料</Empty>;

  return (
    <>
      <RefreshBar updatedAt={eta.updatedAt} refreshing={eta.refreshing} onRefresh={eta.reload} />
      {routeStops.data.map((rs) => {
        const stop = stopMap.get(rs.stop);
        const seq = parseInt(rs.seq, 10);
        const etas = etaBySeq.get(seq) ?? [];
        const nameTc = stop?.name_tc ?? rs.stop;
        const nameEn = stop?.name_en ?? '';
        const favId = favoriteId(route, st, bound, rs.stop);
        const isFav = has(favId);
        return (
          <div className="kmb-stop" key={`${rs.stop}-${rs.seq}`}>
            <div className="kmb-stop-head">
              <span className="kmb-seq">{rs.seq}</span>
              <Link href={`/bus/stop?id=${encodeURIComponent(rs.stop)}`} className="kmb-stop-name">
                <span className="tc">{nameTc}</span>
                <span className="en">{nameEn}</span>
                <span className="kmb-stop-id">{rs.stop}</span>
              </Link>
              <button
                className={`kmb-star ${isFav ? 'on' : ''}`}
                aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                onClick={() =>
                  toggle({
                    route,
                    serviceType: st,
                    bound,
                    stopId: rs.stop,
                    stopNameTc: nameTc,
                    stopNameEn: nameEn,
                    destTc: dest.tc,
                    destEn: dest.en,
                  })
                }
              >
                {isFav ? '★' : '☆'}
              </button>
            </div>
            {eta.loading && etas.length === 0 ? (
              <p className="kmb-eta-none">載入到站時間…</p>
            ) : (
              <EtaList etas={etas} now={now} />
            )}
          </div>
        );
      })}
      {eta.error && <p className="kmb-eta-none">到站時間載入失敗，將自動重試。</p>}
    </>
  );
}

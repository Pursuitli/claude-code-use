'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getRoutes, getStops } from '@/lib/kmb/api';
import { useAsync } from '@/lib/kmb/hooks';
import type { KmbRoute, KmbStop } from '@/lib/kmb/types';
import { Skeleton, ErrorBox, Empty } from './_components/ui';

type Mode = 'route' | 'stop';

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('route');
  const [q, setQ] = useState('');

  return (
    <>
      <h1 className="kmb-page-title">搜尋路線或車站</h1>
      <p className="kmb-page-sub">Search routes or stops</p>

      <div className="kmb-seg">
        <button className={mode === 'route' ? 'active' : ''} onClick={() => setMode('route')}>
          路線 Route
        </button>
        <button className={mode === 'stop' ? 'active' : ''} onClick={() => setMode('stop')}>
          車站 Stop
        </button>
      </div>

      <div className="kmb-search">
        <input
          inputMode={mode === 'route' ? 'text' : 'search'}
          autoCapitalize="characters"
          placeholder={mode === 'route' ? '路線號碼，例如 87D / 40 / 680' : '車站名稱，例如 沙田第一城'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {mode === 'route' ? <RouteResults q={q} /> : <StopResults q={q} />}
    </>
  );
}

// ── Route search ────────────────────────────────────────────

function RouteResults({ q }: { q: string }) {
  const { data, error, loading, reload } = useAsync(getRoutes, []);
  const query = q.trim().toUpperCase();

  const matches = useMemo(() => {
    if (!data || !query) return [];
    // Prefix match on the route number, then exact-first ordering.
    const found = data.filter((r) => r.route.toUpperCase().startsWith(query));
    found.sort((a, b) => {
      if (a.route !== b.route) {
        const ax = a.route === query ? 0 : 1;
        const bx = b.route === query ? 0 : 1;
        if (ax !== bx) return ax - bx;
        return a.route.localeCompare(b.route, undefined, { numeric: true });
      }
      return a.bound.localeCompare(b.bound) || a.service_type.localeCompare(b.service_type);
    });
    return found.slice(0, 60);
  }, [data, query]);

  if (loading) return <Skeleton />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (!query) return <Empty>輸入路線號碼開始搜尋<br />Type a route number to search</Empty>;
  if (matches.length === 0) return <Empty>找不到路線「{q}」<br />No matching route</Empty>;

  return (
    <div style={{ marginTop: 14 }}>
      {matches.map((r) => (
        <RouteCard key={`${r.route}-${r.bound}-${r.service_type}`} route={r} />
      ))}
    </div>
  );
}

function RouteCard({ route: r }: { route: KmbRoute }) {
  const dir = r.bound === 'O' ? 'outbound' : 'inbound';
  const href = `/bus/route?route=${encodeURIComponent(r.route)}&dir=${dir}&st=${r.service_type}`;
  const hasVariant = r.service_type !== '1';
  return (
    <Link href={href} className="kmb-card">
      <div className="kmb-route-row">
        <span className="kmb-route-badge">
          {r.route}
          {hasVariant && <span className="st">特別班次 {r.service_type}</span>}
        </span>
        <span className="kmb-route-od">
          <span className="kmb-route-dest">
            {r.orig_tc ?? '?'} <span className="arrow">→</span> {r.dest_tc ?? '?'}
          </span>
          <span className="kmb-route-en">
            {r.orig_en ?? '?'} → {r.dest_en ?? '?'}
          </span>
        </span>
        <span className="kmb-chev">›</span>
      </div>
    </Link>
  );
}

// ── Stop search ─────────────────────────────────────────────

function StopResults({ q }: { q: string }) {
  const { data, error, loading, reload } = useAsync(getStops, []);
  const query = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!data || query.length < 1) return [];
    const found = data.filter((s) => {
      const tc = (s.name_tc ?? '').toLowerCase();
      const en = (s.name_en ?? '').toLowerCase();
      const sc = (s.name_sc ?? '').toLowerCase();
      return tc.includes(query) || en.includes(query) || sc.includes(query);
    });
    return found.slice(0, 60);
  }, [data, query]);

  if (loading) return <Skeleton />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (!query) return <Empty>輸入車站名稱開始搜尋<br />Type a stop name to search</Empty>;
  if (matches.length === 0) return <Empty>找不到車站「{q}」<br />No matching stop</Empty>;

  return (
    <div style={{ marginTop: 14 }}>
      {matches.map((s: KmbStop) => (
        <Link key={s.stop} href={`/bus/stop?id=${encodeURIComponent(s.stop)}`} className="kmb-card">
          <div className="kmb-route-row">
            <span className="kmb-route-od">
              <span className="kmb-route-dest">{s.name_tc ?? '(未命名車站)'}</span>
              <span className="kmb-route-en">{s.name_en ?? ''}</span>
            </span>
            <span className="kmb-chev">›</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

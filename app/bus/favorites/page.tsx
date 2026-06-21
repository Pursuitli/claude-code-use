'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEta } from '@/lib/kmb/api';
import { usePolling, ETA_INTERVAL } from '@/lib/kmb/hooks';
import { useFavorites } from '@/lib/kmb/useFavorites';
import type { KmbEta } from '@/lib/kmb/types';
import type { Favorite as Fav } from '@/lib/kmb/favorites';
import { Empty } from '../_components/ui';
import { EtaList } from '../_components/EtaList';

export default function FavoritesPage() {
  const { favorites, remove } = useFavorites();

  // Shared clock so all favorite cards recompute minutes together.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <h1 className="kmb-page-title">收藏</h1>
      <p className="kmb-page-sub">Favorites · live ETA</p>

      {favorites.length === 0 ? (
        <Empty>
          尚未收藏任何路線<br />
          No favorites yet — tap ☆ on a route stop to save it.
        </Empty>
      ) : (
        favorites.map((f) => (
          <FavoriteCard key={f.id} fav={f} now={now} onRemove={() => remove(f.id)} />
        ))
      )}
    </>
  );
}

function FavoriteCard({
  fav,
  now,
  onRemove,
}: {
  fav: Fav;
  now: number;
  onRemove: () => void;
}) {
  // Each favorite polls its own route+stop ETA every 30s.
  const eta = usePolling<KmbEta[]>(
    (signal) => getEta(fav.stopId, fav.route, fav.serviceType, signal),
    ETA_INTERVAL,
    [fav.stopId, fav.route, fav.serviceType],
  );

  const dir = fav.bound === 'O' ? 'outbound' : 'inbound';

  return (
    <div className="kmb-stop">
      <div className="kmb-eta-group-head">
        <Link
          href={`/bus/route?route=${encodeURIComponent(fav.route)}&dir=${dir}&st=${fav.serviceType}`}
          className="kmb-route-badge"
        >
          {fav.route}
        </Link>
        <Link href={`/bus/stop?id=${encodeURIComponent(fav.stopId)}`} className="kmb-route-od">
          <span className="kmb-route-dest">{fav.stopNameTc}</span>
          <span className="kmb-route-en">
            往 {fav.destTc} · to {fav.destEn}
          </span>
        </Link>
        <button className="kmb-star on" aria-label="Remove favorite" onClick={onRemove}>
          ★
        </button>
      </div>
      {eta.loading && !eta.data ? (
        <p className="kmb-eta-none">載入到站時間…</p>
      ) : eta.error && !eta.data ? (
        <p className="kmb-eta-none">載入失敗，將自動重試 · {eta.error.message}</p>
      ) : (
        <EtaList etas={eta.data ?? []} now={now} />
      )}
    </div>
  );
}

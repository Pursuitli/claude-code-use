'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getStops } from '@/lib/kmb/api';
import { useAsync } from '@/lib/kmb/hooks';
import { nearbyStops, formatDistance } from '@/lib/kmb/geo';
import { Skeleton, ErrorBox, Empty } from '../_components/ui';

const RADII = [300, 500, 1000];

interface Coords {
  lat: number;
  lon: number;
}

export default function NearbyPage() {
  const stops = useAsync(getStops, []);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [radius, setRadius] = useState(500);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const locate = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('此瀏覽器不支援定位 · Geolocation not supported');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setGeoError(`無法取得位置 · ${err.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  const results = useMemo(() => {
    if (!coords || !stops.data) return [];
    return nearbyStops(stops.data, coords.lat, coords.lon, radius).slice(0, 60);
  }, [coords, stops.data, radius]);

  return (
    <>
      <h1 className="kmb-page-title">附近車站</h1>
      <p className="kmb-page-sub">Nearby stops</p>

      <button className="kmb-btn" onClick={locate} disabled={locating}>
        📍 {locating ? '定位中…' : coords ? '重新定位 Re-locate' : '使用我的位置 Use my location'}
      </button>

      <div className="kmb-chips">
        {RADII.map((r) => (
          <button
            key={r}
            className={`kmb-chip ${radius === r ? 'active' : ''}`}
            onClick={() => setRadius(r)}
          >
            {r < 1000 ? `${r} m` : '1 km'}
          </button>
        ))}
      </div>

      {geoError && <p className="kmb-eta-none">{geoError}</p>}

      {stops.loading && coords && <Skeleton rows={4} />}
      {stops.error && <ErrorBox error={stops.error} onRetry={stops.reload} />}

      {!coords && !geoError && (
        <Empty>授權定位以尋找 {radius < 1000 ? `${radius} 米` : '1 公里'} 內的車站<br />
          Allow location to find stops near you</Empty>
      )}

      {coords && results.length === 0 && !stops.loading && (
        <Empty>此範圍內沒有車站，試試擴大範圍<br />No stops in range — try a larger radius</Empty>
      )}

      {results.map(({ stop, distance }) => (
        <Link key={stop.stop} href={`/bus/stop?id=${encodeURIComponent(stop.stop)}`} className="kmb-card">
          <div className="kmb-route-row">
            <span className="kmb-route-od">
              <span className="kmb-route-dest">{stop.name_tc ?? '(未命名車站)'}</span>
              <span className="kmb-route-en">{stop.name_en ?? ''}</span>
            </span>
            <span className="kmb-dist">{formatDistance(distance)}</span>
            <span className="kmb-chev">›</span>
          </div>
        </Link>
      ))}
    </>
  );
}

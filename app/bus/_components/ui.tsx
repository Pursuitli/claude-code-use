'use client';

/** Small shared presentational pieces: skeletons, error box, refresh bar. */

import { hkClockSeconds } from '@/lib/kmb/format';

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="kmb-skel-wrap" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="kmb-skel-card" key={i}>
          <div className="kmb-skel-line w40" />
          <div className="kmb-skel-line w70" />
          <div className="kmb-skel-line w55" />
        </div>
      ))}
    </div>
  );
}

export function ErrorBox({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="kmb-error" role="alert">
      <strong>載入失敗 · Failed to load</strong>
      <p>{error.message}</p>
      {onRetry && (
        <button className="kmb-btn" onClick={onRetry}>
          重試 Retry
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="kmb-empty">{children}</p>;
}

/** "Last updated HH:MM:SS" line with a manual refresh button. */
export function RefreshBar({
  updatedAt,
  refreshing,
  onRefresh,
}: {
  updatedAt: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="kmb-refreshbar">
      <span className="kmb-updated">
        {updatedAt ? `更新於 ${hkClockSeconds(updatedAt)}` : '載入中…'}
      </span>
      <button
        className={`kmb-refresh-btn ${refreshing ? 'spin' : ''}`}
        onClick={onRefresh}
        aria-label="Refresh"
        title="Refresh"
      >
        ↻
      </button>
    </div>
  );
}

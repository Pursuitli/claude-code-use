'use client';

/**
 * Renders the next few ETAs for a single route at a single stop.
 * Large, glanceable minute numbers for real-world use at a bus stop.
 */

import type { KmbEta } from '@/lib/kmb/types';
import {
  minutesUntil,
  minutesLabel,
  hkClock,
  isScheduled,
  remark,
} from '@/lib/kmb/format';

export function EtaList({ etas, now }: { etas: KmbEta[]; now: number }) {
  // Keep only entries that carry a time, ordered by the API's eta_seq.
  const items = [...etas]
    .filter((e) => e.eta)
    .sort((a, b) => (a.eta_seq ?? 99) - (b.eta_seq ?? 99))
    .slice(0, 3);

  if (items.length === 0) {
    return <p className="kmb-eta-none">暫無班次 · No ETA</p>;
  }

  return (
    <div className="kmb-eta-list">
      {items.map((eta, i) => {
        const mins = minutesUntil(eta.eta, now);
        const label = minutesLabel(mins);
        const numeric = mins !== null && mins > 0;
        return (
          <div className="kmb-eta-item" key={`${eta.eta}-${i}`}>
            <div className="kmb-eta-mins">
              <span className={`kmb-eta-num ${mins !== null && mins <= 0 ? 'due' : ''}`}>
                {label}
              </span>
              {numeric && <span className="kmb-eta-unit">分鐘</span>}
            </div>
            <div className="kmb-eta-meta">
              <span className="kmb-eta-clock">{hkClock(eta.eta)}</span>
              {isScheduled(eta) ? (
                <span className="kmb-tag kmb-tag-sched">原定班次 Scheduled</span>
              ) : (
                <span className="kmb-tag kmb-tag-live">實時 Live</span>
              )}
              {remark(eta) && <span className="kmb-eta-rmk">{remark(eta)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

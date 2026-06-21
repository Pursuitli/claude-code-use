import type { Metadata } from 'next';
import Link from 'next/link';
import { BottomNav } from './_components/BottomNav';
import './bus.css';

export const metadata: Metadata = {
  title: 'KMB 巴士到站 · Bus ETA',
  description:
    'Search KMB routes and stops, see stop sequences and real-time arrivals from the KMB Open Data API.',
};

export default function BusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="kmb">
      <header className="kmb-header">
        <Link href="/bus" className="kmb-brand" aria-label="KMB Bus ETA home">
          <span className="kmb-logo">KMB</span>
          <span className="kmb-brand-text">
            巴士到站 <span className="kmb-brand-en">Bus&nbsp;ETA</span>
          </span>
        </Link>
      </header>
      <main className="kmb-main">{children}</main>
      <BottomNav />
    </div>
  );
}

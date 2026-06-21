'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/bus', label: '搜尋', sub: 'Search', icon: '🔍' },
  { href: '/bus/nearby', label: '附近', sub: 'Nearby', icon: '📍' },
  { href: '/bus/favorites', label: '收藏', sub: 'Saved', icon: '★' },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="kmb-bottomnav">
      {TABS.map((t) => {
        // Exact match for /bus; prefix match for the others.
        const active = t.href === '/bus' ? pathname === '/bus' : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={`kmb-tab ${active ? 'active' : ''}`}>
            <span className="kmb-tab-icon">{t.icon}</span>
            <span className="kmb-tab-label">{t.label}</span>
            <span className="kmb-tab-sub">{t.sub}</span>
          </Link>
        );
      })}
    </nav>
  );
}

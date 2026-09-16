'use client';

import React from 'react';
import { FIGURES, PHOTOS } from '@/lib/packaging/figures';
import { Conf, Eyebrow } from './ui';

/**
 * Standard frame for every explanatory figure: title, the drawing, what it
 * shows, and what the reader should take from it. Keeping the "reading" line
 * separate from the caption is deliberate — the caption describes the picture,
 * the reading states the conclusion.
 */
export function Figure({ id, children }: { id: string; children: React.ReactNode }) {
  const f = FIGURES[id];
  if (!f) return <>{children}</>;
  return (
    <figure className="rounded-md border border-line bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline px-4 py-2.5">
        <Eyebrow>Figure — {f.title}</Eyebrow>
        <Conf c={f.confidence} />
      </div>
      <div className="px-4 py-4">{children}</div>
      <figcaption className="border-t border-hairline px-4 py-3">
        <p className="max-w-[80ch] text-[12px] leading-relaxed text-muted">{f.caption}</p>
        <p className="mt-2 max-w-[80ch] border-l-2 border-accent/40 pl-3 text-[12.5px] leading-relaxed text-body">
          {f.reading}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * Third-party photograph. The files are CC-licensed works fetched by
 * scripts/fetch-figures.mjs rather than committed, so this renders a labelled
 * placeholder when they are absent instead of a broken image.
 */
export function Photo({ id, className = '' }: { id: string; className?: string }) {
  const p = PHOTOS.find((x) => x.id === id);
  const [failed, setFailed] = React.useState(false);
  if (!p) return null;

  return (
    <figure className={`overflow-hidden rounded-md border border-line bg-surface ${className}`}>
      {!failed ? (
        <img
          src={`/figures/${p.file}`}
          alt={p.title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="block max-h-[280px] w-full object-cover"
        />
      ) : (
        <div className="flex min-h-[132px] items-center justify-center border-b border-hairline bg-raised px-4 py-6 text-center">
          <span className="pk-num max-w-[36ch] text-[10px] leading-relaxed tracking-[0.06em] text-faint">
            PHOTOGRAPH NOT INSTALLED — run <span className="text-muted">node scripts/fetch-figures.mjs</span> to
            download the Creative Commons original from Wikimedia Commons
          </span>
        </div>
      )}
      <figcaption className="px-3.5 py-2.5">
        <div className="text-[12.5px] font-medium text-ink">{p.title}</div>
        <p className="mt-1 text-[11.5px] leading-snug text-muted">{p.why}</p>
        <p className="pk-num mt-1.5 text-[9.5px] leading-snug text-faint">
          Wikimedia Commons · see /public/figures/CREDITS.md for author and licence
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * Typographic company mark.
 *
 * Deliberately not the real logo. Reproducing corporate logos on a published
 * site is a trademark question that varies per company (Apple's mark in
 * particular is not freely licensed), and a set of mismatched raster logos
 * would look worse here than one consistent typographic treatment.
 */
export function Mark({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .replace(/[^A-Za-z0-9 &]/g, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const dim = size === 'md' ? 'h-7 w-7 text-[10px]' : 'h-5 w-5 text-[8.5px]';
  return (
    <span
      title={name}
      className={`pk-num inline-flex shrink-0 items-center justify-center rounded-[3px] border border-line bg-raised font-medium tracking-[0.02em] text-muted ${dim}`}
    >
      {initials}
    </span>
  );
}

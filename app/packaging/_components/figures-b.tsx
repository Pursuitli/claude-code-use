'use client';

import React from 'react';
import { C } from './diagrams';

function T({
  x, y, children, anchor = 'start', size = 9, fill = C.muted, mono = true, weight = 400,
}: {
  x: number; y: number; children: React.ReactNode;
  anchor?: 'start' | 'middle' | 'end'; size?: number; fill?: string; mono?: boolean; weight?: number;
}) {
  return (
    <text
      x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill} fontWeight={weight}
      style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', letterSpacing: mono ? '0.04em' : undefined }}
    >
      {children}
    </text>
  );
}

/* ================================================================== */
/* 6. Where warpage comes from                                         */
/* ================================================================== */

export function WarpageFigure({ hot, onToggle }: { hot: boolean; onToggle: () => void }) {
  // At reflow the stack is flat; cooled, the substrate contracts further and bows the assembly.
  const bow = hot ? 0 : 26;
  const arc = (yTop: number, h: number, fill: string, stroke: string) =>
    `M120 ${yTop} Q400 ${yTop - bow} 680 ${yTop} L680 ${yTop + h} Q400 ${yTop - bow + h} 120 ${yTop + h} Z`;

  return (
    <div>
      <svg viewBox="0 0 760 250" className="w-full" role="img" aria-label="A silicon die on an organic substrate, flat when hot and bowed when cool">
        <path d={arc(96, 16, C.sunk, C.ink)} fill={C.sunk} stroke={C.ink} strokeWidth={1} />
        <path d={arc(114, 40, C.surface, C.muted)} fill={C.surface} stroke={C.muted} strokeWidth={1} />

        <T x={690} y={108} size={9} fill={C.ink}>SILICON</T>
        <T x={690} y={120} size={8} fill={C.faint}>2.6 ppm/K</T>
        <T x={690} y={146} size={9} fill={C.ink}>SUBSTRATE</T>
        <T x={690} y={158} size={8} fill={C.faint}>~17 ppm/K</T>

        {!hot && (
          <>
            <path d="M400 76 V58 M394 64 L400 58 L406 64" stroke={C.neg} fill="none" strokeWidth={1.2} />
            <T x={400} y={50} anchor="middle" size={9} fill={C.neg}>bow</T>
            <line x1={120} y1={186} x2={120} y2={96} stroke={C.line} strokeDasharray="3 3" />
            <line x1={680} y1={186} x2={680} y2={96} stroke={C.line} strokeDasharray="3 3" />
          </>
        )}

        <T x={40} y={28} size={9} fill={C.faint}>
          {hot ? 'AT REFLOW — ~250 °C, BONDED FLAT' : 'COOLED TO ROOM TEMPERATURE'}
        </T>
        <foreignObject x={40} y={198} width={680} height={48}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', lineHeight: 1.55, color: 'var(--color-body)' }}>
            {hot
              ? 'Joined at temperature, both materials are the size the design assumed. Everything is flat and every joint touches.'
              : 'Cooling, the substrate wants to shrink about six times as much as the silicon. It cannot, so the mismatch becomes curvature — and the corner joints carry the load.'}
          </div>
        </foreignObject>
      </svg>
      <button
        onClick={onToggle}
        className="pk-num mt-1 rounded-[4px] border border-line px-2.5 py-[4px] text-[10px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:border-accent hover:text-accent"
      >
        {hot ? 'Cool it down →' : '← Heat it back up'}
      </button>
    </div>
  );
}

/* ================================================================== */
/* 7. Fan-in vs fan-out                                                */
/* ================================================================== */

export function FanOutFigure() {
  const balls = (cx: number, cy: number, n: number, span: number, fill: string) => {
    const out: React.ReactNode[] = [];
    const step = span / (n - 1);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        out.push(
          <circle key={`${i}-${j}`} cx={cx - span / 2 + i * step} cy={cy - span / 2 + j * step} r={3.4} fill={fill} />,
        );
    return out;
  };

  return (
    <svg viewBox="0 0 760 250" className="w-full" role="img" aria-label="Fan-in packaging compared with fan-out">
      <T x={40} y={24} size={9} fill={C.faint}>FAN-IN — PACKAGE IS THE DIE</T>
      <rect x={112} y={60} width={128} height={128} fill={C.raised} stroke={C.muted} strokeWidth={1} />
      {balls(176, 124, 4, 84, C.muted)}
      <T x={176} y={210} anchor="middle" size={12} fill={C.ink} mono={false} weight={600}>16 balls</T>
      <T x={176} y={226} anchor="middle" size={9} fill={C.muted}>capped by the die&apos;s own area</T>

      <line x1={380} y1={44} x2={380} y2={236} stroke={C.line} />

      <T x={430} y={24} size={9} fill={C.faint}>FAN-OUT — MOULDED BODY, RDL ROUTES OUTWARD</T>
      <rect x={462} y={40} width={216} height={168} fill={C.surface} stroke={C.accent} strokeWidth={1} strokeDasharray="4 3" />
      <T x={470} y={54} size={8} fill={C.accent}>mould compound</T>
      <rect x={522} y={82} width={96} height={84} fill={C.raised} stroke={C.muted} strokeWidth={1} />
      <T x={570} y={78} anchor="middle" size={8} fill={C.faint}>same die</T>
      {/* RDL traces fanning out from the die edge */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M522 ${94 + i * 21} H486 V${60 + i * 34}`} fill="none" stroke={C.accent} strokeWidth={0.8} />
          <path d={`M618 ${94 + i * 21} H654 V${60 + i * 34}`} fill="none" stroke={C.accent} strokeWidth={0.8} />
        </g>
      ))}
      {balls(570, 124, 6, 172, C.accent)}
      <T x={570} y={230} anchor="middle" size={12} fill={C.accent} mono={false} weight={600}>36 balls</T>
      <T x={570} y={244} anchor="middle" size={9} fill={C.muted}>and no laminate substrate to pay for</T>
    </svg>
  );
}

/* ================================================================== */
/* 8. Monolithic die vs four chiplets                                  */
/* ================================================================== */

export function ChipletFigure() {
  // Poisson yield: Y = e^(-D0 * A). Note the consequence that makes this figure
  // worth drawing carefully — P(all four chiplets good) is *identical* to the
  // monolith's yield, because the exponents add. The chiplet win is not that
  // more assemblies come out good; it is that bad silicon is discarded in
  // 200 mm² pieces and only tested-good dies are assembled. The honest metric
  // is therefore silicon consumed per working product.
  const D0 = 0.05 / 100; // defects per mm²
  const y = (a: number) => Math.exp(-D0 * a);
  const mono = y(800);
  const one = y(200);
  const monoSi = 800 / mono;
  const chipSi = (4 * 200) / one;
  const saving = (1 - chipSi / monoSi) * 100;

  return (
    <svg viewBox="0 0 760 344" className="w-full" role="img" aria-label="Silicon consumed per working product, monolithic die versus four chiplets">
      <T x={40} y={24} size={9} fill={C.faint}>ONE DIE — 800 mm²</T>
      <rect x={60} y={46} width={158} height={158} fill={C.raised} stroke={C.ink} strokeWidth={1.2} />
      <T x={139} y={130} anchor="middle" size={9.5} fill={C.faint}>everything on one node</T>
      <T x={60} y={228} size={11} fill={C.ink} mono={false} weight={600}>{(mono * 100).toFixed(0)}% yield</T>
      <T x={60} y={250} size={20} fill={C.ink} mono weight={600}>{monoSi.toFixed(0)} mm²</T>
      <T x={60} y={266} size={9} fill={C.muted}>silicon consumed per working part</T>
      <T x={60} y={282} size={9} fill={C.neg}>one defect scraps all 800 mm²</T>

      <line x1={310} y1={34} x2={310} y2={272} stroke={C.line} />

      <T x={370} y={24} size={9} fill={C.faint}>FOUR CHIPLETS — 200 mm² EACH, SAME TOTAL</T>
      {[0, 1].map((i) =>
        [0, 1].map((j) => (
          <rect
            key={`${i}${j}`}
            x={392 + i * 82}
            y={46 + j * 82}
            width={74}
            height={74}
            fill={C.raised}
            stroke={C.muted}
            strokeWidth={1}
          />
        )),
      )}
      <line x1={470} y1={46} x2={470} y2={204} stroke={C.accent} strokeWidth={2.4} />
      <line x1={392} y1={124} x2={548} y2={124} stroke={C.accent} strokeWidth={2.4} />
      <T x={562} y={92} size={8.5} fill={C.accent}>every crossing costs</T>
      <T x={562} y={104} size={8.5} fill={C.accent}>power and edge area</T>

      <T x={370} y={228} size={11} fill={C.pos} mono={false} weight={600}>
        {(one * 100).toFixed(0)}% yield each — tested before assembly
      </T>
      <T x={370} y={250} size={20} fill={C.pos} mono weight={600}>{chipSi.toFixed(0)} mm²</T>
      <T x={370} y={266} size={9} fill={C.muted}>silicon consumed per working part</T>
      <T x={370} y={282} size={9} fill={C.muted}>a defect scraps 200 mm², caught at probe</T>
      <T x={540} y={250} size={13} fill={C.pos} mono weight={600}>−{saving.toFixed(0)}%</T>

      <rect x={40} y={296} width={680} height={38} rx={3} fill={C.accentsoft} stroke={C.accent} strokeWidth={0.8} />
      <T x={54} y={312} size={8.5} fill={C.accent}>THE SUBTLETY MOST EXPLANATIONS GET WRONG</T>
      <T x={54} y={326} size={9} fill={C.body}>
        P(all four chiplets good) = {(Math.pow(one, 4) * 100).toFixed(0)}% — identical to the monolith, because the exponents add. Harvesting tested dies is the win, not the odds.
      </T>
    </svg>
  );
}

/* ================================================================== */
/* 9. True-scale package sizes                                         */
/* ================================================================== */

const BODIES = [
  { id: 'coin', label: 'S$1 coin', mm: 24.65, note: 'for scale', round: true },
  { id: 'phone', label: 'Phone SoC (InFO)', mm: 12, note: '~8 W' },
  { id: 'cpu', label: 'Server CPU', mm: 58, note: '~350 W' },
  { id: 'ai', label: 'AI accelerator', mm: 95, note: '~1,000 W+' },
];

export function PackageScaleFigure() {
  const px = 2.15;
  const baseY = 206;
  // Small bodies are narrower than their own labels, so gaps are widened to the
  // label width and the captions alternate between two rows.
  const MIN_SLOT = 104;
  let cursor = 44;
  const placed = BODIES.map((b, i) => {
    const s = b.mm * px;
    const x = cursor;
    cursor += Math.max(s, MIN_SLOT) + 18;
    return { ...b, x, s, row: i % 2 };
  });

  return (
    <svg viewBox="0 0 760 286" className="w-full" role="img" aria-label="Package body sizes drawn at true relative scale">
      {placed.map((b) => (
        <g key={b.id}>
          {b.round ? (
            <circle cx={b.x + b.s / 2} cy={baseY - b.s / 2} r={b.s / 2} fill={C.midsoft} stroke={C.mid} strokeWidth={1.2} />
          ) : (
            <rect
              x={b.x}
              y={baseY - b.s}
              width={b.s}
              height={b.s}
              rx={2}
              fill={b.id === 'ai' ? C.accentsoft : C.raised}
              stroke={b.id === 'ai' ? C.accent : C.muted}
              strokeWidth={1.2}
            />
          )}
          <line
            x1={b.x + Math.min(b.s, 40) / 2}
            y1={baseY}
            x2={b.x + Math.min(b.s, 40) / 2}
            y2={baseY + 8 + b.row * 34}
            stroke={C.line}
            strokeWidth={0.8}
          />
          <T x={b.x} y={baseY + 22 + b.row * 34} size={10.5} fill={C.ink} mono={false} weight={b.id === 'ai' ? 600 : 400}>
            {b.label}
          </T>
          <T x={b.x} y={baseY + 35 + b.row * 34} size={9} fill={b.id === 'ai' ? C.accent : C.muted}>
            {b.mm} mm · {b.note}
          </T>
        </g>
      ))}
      <line x1={40} y1={baseY} x2={740} y2={baseY} stroke={C.line} />
      <T x={40} y={24} size={9} fill={C.faint}>DRAWN AT TRUE RELATIVE SCALE</T>
    </svg>
  );
}

/* ================================================================== */
/* 10. Material state through the back-end line                        */
/* ================================================================== */

const STATES: { k: string; draw: (x: number, y: number) => React.ReactNode }[] = [
  {
    k: 'Incoming wafer',
    draw: (x, y) => <circle cx={x + 26} cy={y + 26} r={24} fill={C.surface} stroke={C.muted} strokeWidth={1} />,
  },
  {
    k: 'Bumped',
    draw: (x, y) => (
      <g>
        <circle cx={x + 26} cy={y + 26} r={24} fill={C.surface} stroke={C.muted} strokeWidth={1} />
        {[-12, -4, 4, 12].map((d) => (
          <React.Fragment key={d}>
            <circle cx={x + 26 + d} cy={y + 18} r={2} fill={C.accent} />
            <circle cx={x + 26 + d} cy={y + 30} r={2} fill={C.accent} />
          </React.Fragment>
        ))}
      </g>
    ),
  },
  {
    k: 'Thinned',
    draw: (x, y) => (
      <g>
        <rect x={x + 4} y={y + 22} width={44} height={7} fill={C.raised} stroke={C.muted} strokeWidth={0.9} />
        <path d={`M${x + 4} ${y + 18} H${x + 48}`} stroke={C.faint} strokeWidth={0.7} strokeDasharray="2 2" />
        <T x={x + 26} y={y + 14} anchor="middle" size={7} fill={C.faint}>was 775 µm</T>
      </g>
    ),
  },
  {
    k: 'Diced',
    draw: (x, y) => (
      <g>
        {[0, 1, 2].map((i) =>
          [0, 1, 2].map((j) => (
            <rect key={`${i}${j}`} x={x + 6 + i * 14} y={y + 12 + j * 14} width={11} height={11} fill={C.raised} stroke={C.muted} strokeWidth={0.7} />
          )),
        )}
      </g>
    ),
  },
  {
    k: 'Bonded to interposer',
    draw: (x, y) => (
      <g>
        <rect x={x + 2} y={y + 30} width={48} height={9} fill={C.raised} stroke={C.accent} strokeWidth={0.9} />
        <rect x={x + 10} y={y + 15} width={14} height={14} fill={C.sunk} stroke={C.ink} strokeWidth={0.8} />
        <rect x={x + 28} y={y + 15} width={14} height={14} fill={C.sunk} stroke={C.ink} strokeWidth={0.8} />
      </g>
    ),
  },
  {
    k: 'Underfilled & moulded',
    draw: (x, y) => (
      <g>
        <rect x={x + 2} y={y + 30} width={48} height={9} fill={C.raised} stroke={C.muted} strokeWidth={0.9} />
        <rect x={x + 4} y={y + 13} width={44} height={17} fill={C.mid} opacity={0.32} stroke={C.mid} strokeWidth={0.8} />
      </g>
    ),
  },
  {
    k: 'On substrate',
    draw: (x, y) => (
      <g>
        <rect x={x} y={y + 34} width={52} height={11} fill={C.surface} stroke={C.muted} strokeWidth={0.9} />
        <rect x={x + 6} y={y + 24} width={40} height={10} fill={C.raised} stroke={C.muted} strokeWidth={0.8} />
        <rect x={x + 10} y={y + 12} width={32} height={12} fill={C.mid} opacity={0.32} />
      </g>
    ),
  },
  {
    k: 'Lidded',
    draw: (x, y) => (
      <g>
        <rect x={x} y={y + 34} width={52} height={11} fill={C.surface} stroke={C.muted} strokeWidth={0.9} />
        <rect x={x + 2} y={y + 12} width={48} height={22} rx={2} fill={C.sunk} stroke={C.ink} strokeWidth={1} />
      </g>
    ),
  },
  {
    k: 'Tested & binned',
    draw: (x, y) => (
      <g>
        <rect x={x} y={y + 34} width={52} height={11} fill={C.surface} stroke={C.muted} strokeWidth={0.9} />
        <rect x={x + 2} y={y + 12} width={48} height={22} rx={2} fill={C.sunk} stroke={C.pos} strokeWidth={1.2} />
        <path d={`M${x + 18} ${y + 24} l5 5 l11 -11`} fill="none" stroke={C.pos} strokeWidth={2} />
      </g>
    ),
  },
];

export function ProcessStatesFigure() {
  const step = 82;
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <svg viewBox="0 0 776 130" className="w-full min-w-[720px]" role="img" aria-label="The state of the material at each stage of the back-end line">
        {STATES.map((s, i) => {
          const x = 14 + i * step;
          return (
            <g key={s.k}>
              {s.draw(x, 26)}
              <T x={x + 26} y={94} anchor="middle" size={8} fill={C.muted}>
                {s.k.length > 15 ? s.k.split(' ')[0] : s.k}
              </T>
              {s.k.length > 15 && (
                <T x={x + 26} y={104} anchor="middle" size={8} fill={C.muted}>
                  {s.k.split(' ').slice(1).join(' ')}
                </T>
              )}
              {i < STATES.length - 1 && (
                <path d={`M${x + 58} 50 H${x + 72} M${x + 68} 46 L${x + 72} 50 L${x + 68} 54`} stroke={C.faint} fill="none" strokeWidth={0.9} />
              )}
            </g>
          );
        })}
        <line x1={14} y1={118} x2={430} y2={118} stroke={C.line} strokeWidth={3} />
        <line x1={430} y1={118} x2={762} y2={118} stroke={C.neg} strokeWidth={3} />
        <T x={14} y={130} size={8} fill={C.faint}>cheap to scrap</T>
        <T x={762} y={130} anchor="end" size={8} fill={C.neg}>thousands of dollars committed</T>
      </svg>
    </div>
  );
}

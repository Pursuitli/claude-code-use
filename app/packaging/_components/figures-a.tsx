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
/* 1. Area needed for 1,000 connections — drawn at true relative area  */
/* ================================================================== */

const PITCHES = [
  { id: 'pcb', label: 'Circuit board', pitch: 400, note: 'what a PCB can economically resolve' },
  { id: 'c4', label: 'C4 flip-chip bump', pitch: 150, note: 'die to substrate' },
  { id: 'ub', label: 'Microbump', pitch: 45, note: 'die to interposer, 2.5D' },
  { id: 'hb', label: 'Hybrid bond', pitch: 5, note: 'copper fused to copper, no solder' },
].map((p) => ({ ...p, sideMm: Math.sqrt(1000 * Math.pow(p.pitch / 1000, 2)) }));

export function PitchAreaFigure() {
  const W = 760;
  const H = 330;
  const px = 250 / PITCHES[0].sideMm; // biggest square is 250px wide
  const x0 = 40;
  const y1 = 288; // shared bottom-left corner

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Area needed for one thousand connections at four interconnect pitches">
      {PITCHES.map((p, i) => {
        const s = p.sideMm * px;
        const tone = [C.sunk, C.line, C.mid, C.accent][i];
        return (
          <rect
            key={p.id}
            x={x0}
            y={y1 - s}
            width={s}
            height={s}
            fill={tone}
            opacity={i < 2 ? 1 : 0.9}
            stroke={i === 3 ? C.accent : C.muted}
            strokeWidth={i === 3 ? 1.4 : 0.9}
          />
        );
      })}

      {/* leader lines and labels, stacked clear of the squares */}
      {PITCHES.map((p, i) => {
        const s = p.sideMm * px;
        const ly = 56 + i * 62;
        const anchorX = x0 + s;
        const anchorY = y1 - s + Math.min(s / 2, 10);
        return (
          <g key={p.id}>
            <path d={`M${anchorX} ${anchorY} H${330} V${ly} H${348}`} fill="none" stroke={C.line} strokeWidth={0.8} />
            <circle cx={anchorX} cy={anchorY} r={2} fill={i === 3 ? C.accent : C.muted} />
            <T x={356} y={ly - 5} size={12} fill={C.ink} mono={false} weight={600}>{p.label}</T>
            <T x={356} y={ly + 9} size={9.5} fill={i === 3 ? C.accent : C.muted}>
              {p.pitch} µm pitch · {p.sideMm < 1 ? `${(p.sideMm * 1000).toFixed(0)} µm` : `${p.sideMm.toFixed(1)} mm`} square
            </T>
            <T x={356} y={ly + 22} size={9} fill={C.faint} mono={false}>{p.note}</T>
          </g>
        );
      })}

      {/* the hybrid-bond square is ~3 px wide at this scale, which is the point —
          ring it so the reader can find the thing they are meant to be startled by */}
      <circle cx={x0 + 1.7} cy={y1 - 1.7} r={7.5} fill="none" stroke={C.accent} strokeWidth={1} strokeDasharray="2 2" />
      <path d={`M${x0 + 7} ${y1 - 7} L${x0 + 40} ${y1 - 40}`} stroke={C.accent} strokeWidth={0.8} />
      <T x={x0 + 44} y={y1 - 42} size={8.5} fill={C.accent}>the hybrid-bond square is in here</T>
      <T x={x0 + 44} y={y1 - 31} size={8} fill={C.faint}>0.16 mm — about the width of this rule</T>

      <T x={x0 + 44} y={y1 + 22} size={8.5} fill={C.faint}>drawn at true relative area</T>
      <T x={720} y={y1 + 22} anchor="end" size={10} fill={C.accent} mono={false} weight={600}>
        ~6,400× less area, end to end
      </T>
    </svg>
  );
}

/* ================================================================== */
/* 2. Perimeter I/O vs area array                                      */
/* ================================================================== */

export function PerimeterFigure() {
  const pads = (cx: number, cy: number, n: number, perimeterOnly: boolean) => {
    const out: React.ReactNode[] = [];
    const span = 112;
    const step = span / (n - 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const edge = i === 0 || j === 0 || i === n - 1 || j === n - 1;
        if (perimeterOnly && !edge) continue;
        out.push(
          <circle
            key={`${i}-${j}`}
            cx={cx - span / 2 + i * step}
            cy={cy - span / 2 + j * step}
            r={2.6}
            fill={perimeterOnly ? C.muted : C.accent}
          />,
        );
      }
    }
    return out;
  };
  const n = 9;
  const perim = 4 * n - 4;
  const area = n * n;

  return (
    <svg viewBox="0 0 760 260" className="w-full" role="img" aria-label="Perimeter wire-bond pads versus a full area array of flip-chip bumps">
      {/* wire bond */}
      <T x={40} y={24} size={9} fill={C.faint}>WIRE BONDING — PADS ON THE EDGE ONLY</T>
      <rect x={112} y={58} width={140} height={140} fill={C.raised} stroke={C.muted} strokeWidth={0.9} />
      {pads(182, 128, n, true)}
      {/* a few bond wires arcing off the edge */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${126 + i * 14} 58 q ${-14 - i * 6} -26 ${-34 - i * 8} -30`} fill="none" stroke={C.mid} strokeWidth={0.9} />
      ))}
      <T x={182} y={222} anchor="middle" size={13} fill={C.ink} mono={false} weight={600}>{perim} connections</T>
      <T x={182} y={238} anchor="middle" size={9} fill={C.muted}>grows with the edge — 4n − 4</T>

      {/* divider */}
      <line x1={380} y1={44} x2={380} y2={240} stroke={C.line} />

      {/* flip chip */}
      <T x={430} y={24} size={9} fill={C.faint}>FLIP CHIP — BUMPS ACROSS THE WHOLE FACE</T>
      <rect x={508} y={58} width={140} height={140} fill={C.raised} stroke={C.accent} strokeWidth={0.9} />
      {pads(578, 128, n, false)}
      <T x={578} y={222} anchor="middle" size={13} fill={C.accent} mono={false} weight={600}>{area} connections</T>
      <T x={578} y={238} anchor="middle" size={9} fill={C.muted}>grows with the area — n²</T>
    </svg>
  );
}

/* ================================================================== */
/* 3. Yield vs die area, on one fixed defect map                       */
/* ================================================================== */

/** Deterministic defect positions so the figure is stable across renders. */
const DEFECTS = (() => {
  let seed = 20260916;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const pts: { x: number; y: number }[] = [];
  while (pts.length < 46) {
    const x = rnd() * 2 - 1;
    const y = rnd() * 2 - 1;
    if (Math.hypot(x, y) < 0.97) pts.push({ x, y });
  }
  return pts;
})();

export function YieldWaferFigure({ dieMm, onChange }: { dieMm: number; onChange: (v: number) => void }) {
  const R = 118;
  const cx = 150;
  const cy = 140;
  const waferMm = 300;
  const scale = R / (waferMm / 2);
  const d = dieMm * scale;

  const dies: { x: number; y: number; bad: boolean }[] = [];
  const cols = Math.ceil((R * 2) / d) + 2;
  for (let i = -cols; i <= cols; i++) {
    for (let j = -cols; j <= cols; j++) {
      const x = cx + i * d;
      const y = cy + j * d;
      const fits = [[x, y], [x + d, y], [x, y + d], [x + d, y + d]].every(
        ([px, py]) => Math.hypot(px - cx, py - cy) <= R,
      );
      if (!fits) continue;
      const bad = DEFECTS.some((p) => {
        const dx = cx + p.x * R;
        const dy = cy + p.y * R;
        return dx >= x && dx < x + d && dy >= y && dy < y + d;
      });
      dies.push({ x, y, bad });
    }
  }
  const good = dies.filter((x) => !x.bad).length;
  const yieldPct = dies.length ? (good / dies.length) * 100 : 0;

  return (
    <div>
      <svg viewBox="0 0 760 290" className="w-full" role="img" aria-label="Good and bad dies on one wafer as die size changes">
        <circle cx={cx} cy={cy} r={R} fill={C.surface} stroke={C.muted} strokeWidth={1} />
        {dies.map((t, i) => (
          <rect
            key={i}
            x={t.x + 0.5}
            y={t.y + 0.5}
            width={Math.max(d - 1, 1)}
            height={Math.max(d - 1, 1)}
            fill={t.bad ? C.negsoft : C.raised}
            stroke={t.bad ? C.neg : C.muted}
            strokeWidth={0.5}
          />
        ))}
        {DEFECTS.map((p, i) => (
          <circle key={i} cx={cx + p.x * R} cy={cy + p.y * R} r={2} fill={C.neg} />
        ))}
        <T x={cx} y={cy + R + 22} anchor="middle" size={8.5} fill={C.faint}>
          300 mm wafer · 46 defects, fixed position
        </T>

        <line x1={310} y1={34} x2={310} y2={252} stroke={C.line} />
        <T x={344} y={50} size={9} fill={C.faint}>AT {dieMm} × {dieMm} MM PER DIE</T>
        <T x={344} y={92} size={34} fill={C.ink} mono weight={600}>{good}</T>
        <T x={344} y={110} size={9.5} fill={C.muted}>good dies per wafer</T>
        <T x={520} y={92} size={34} fill={yieldPct > 70 ? C.pos : yieldPct > 45 ? C.mid : C.neg} mono weight={600}>
          {yieldPct.toFixed(0)}%
        </T>
        <T x={520} y={110} size={9.5} fill={C.muted}>die yield</T>
        <T x={344} y={144} size={9.5} fill={C.muted}>
          {dies.length} candidate dies · {dies.length - good} contain a defect
        </T>
        <T x={344} y={172} size={9} fill={C.faint}>
          Die area {(dieMm * dieMm).toFixed(0)} mm²
        </T>
        <foreignObject x={344} y={186} width={390} height={70}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: 1.55, color: 'var(--color-body)' }}>
            Nothing changed except the grid. The defects are in the same places — a bigger die simply catches more of
            them, and takes more good silicon down with each one.
          </div>
        </foreignObject>
      </svg>
      <div className="mt-2 flex items-center gap-3">
        <span className="pk-num shrink-0 text-[10px] uppercase tracking-[0.08em] text-faint">Die edge</span>
        <input
          type="range"
          min={6}
          max={30}
          step={1}
          value={dieMm}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="h-[3px] min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-accent)]"
          aria-label="Die edge length in millimetres"
        />
        <span className="pk-num w-14 shrink-0 text-right text-[11px] tabular-nums text-accent">{dieMm} mm</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 4. Reticle limit and stitching                                      */
/* ================================================================== */

export function ReticleFigure() {
  const s = 5.2; // px per mm
  const fw = 26 * s;
  const fh = 33 * s;
  return (
    <svg viewBox="0 0 760 250" className="w-full" role="img" aria-label="One reticle field compared with a stitched multi-field interposer">
      <T x={40} y={24} size={9} fill={C.faint}>ONE EXPOSURE — THE HARD LIMIT</T>
      <rect x={60} y={44} width={fw} height={fh} fill={C.raised} stroke={C.ink} strokeWidth={1.2} />
      <T x={60 + fw / 2} y={44 + fh / 2 - 4} anchor="middle" size={11} fill={C.ink} mono={false} weight={600}>858 mm²</T>
      <T x={60 + fw / 2} y={44 + fh / 2 + 11} anchor="middle" size={9} fill={C.muted}>26 × 33 mm</T>
      <T x={60} y={44 + fh + 20} size={9} fill={C.faint}>no monolithic die exceeds this</T>

      <line x1={300} y1={30} x2={300} y2={230} stroke={C.line} />

      <T x={336} y={24} size={9} fill={C.faint}>A 3.3× INTERPOSER — FOUR FIELDS, STITCHED</T>
      {[0, 1].map((i) =>
        [0, 1].map((j) => {
          const last = i === 1 && j === 1;
          return (
            <rect
              key={`${i}${j}`}
              x={356 + i * fw}
              y={44 + j * (fh * 0.62)}
              width={fw}
              height={fh * 0.62}
              fill={C.raised}
              stroke={C.muted}
              strokeWidth={0.9}
              opacity={last ? 0.55 : 1}
            />
          );
        }),
      )}
      {/* seams */}
      <line x1={356 + fw} y1={44} x2={356 + fw} y2={44 + fh * 1.24} stroke={C.neg} strokeWidth={1.6} strokeDasharray="4 3" />
      <line x1={356} y1={44 + fh * 0.62} x2={356 + fw * 2} y2={44 + fh * 0.62} stroke={C.neg} strokeWidth={1.6} strokeDasharray="4 3" />
      <T x={356 + fw} y={38} anchor="middle" size={8.5} fill={C.neg}>SEAM</T>
      <T x={356} y={44 + fh * 1.24 + 20} size={9.5} fill={C.body} mono={false}>
        Every seam must align to a fraction of a micron, across a wafer that flexes and expands with heat.
      </T>
      <T x={356} y={44 + fh * 1.24 + 36} size={9} fill={C.faint} mono={false}>
        Yield falls with each additional field, which is why package size is an economic decision, not a design one.
      </T>
    </svg>
  );
}

/* ================================================================== */
/* 5. Energy per bit vs distance                                       */
/* ================================================================== */

const HOPS = [
  { label: 'On-chip wire', dist: '~0.1 mm', pj: 0.1, note: 'inside a single die' },
  { label: 'Hybrid-bonded 3D', dist: '~0.01 mm', pj: 0.05, note: 'die fused to die' },
  { label: 'Across an interposer', dist: '~2 mm', pj: 0.4, note: 'compute die to HBM' },
  { label: 'Across a substrate', dist: '~20 mm', pj: 0.8, note: 'chiplet to chiplet' },
  { label: 'Off-package SerDes', dist: '~100 mm', pj: 7, note: 'chip to chip on a board' },
  { label: 'DDR to a DIMM', dist: '~150 mm', pj: 18, note: 'the memory wall, in one number' },
];

export function EnergyFigure() {
  const W = 760;
  const H = 280;
  const x0 = 262;
  const x1 = W - 96;
  const lo = Math.log10(0.03);
  const hi = Math.log10(30);
  const px = (v: number) => x0 + ((Math.log10(v) - lo) / (hi - lo)) * (x1 - x0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Energy per bit against interconnect distance">
      {[0.1, 1, 10].map((g) => (
        <g key={g}>
          <line x1={px(g)} y1={36} x2={px(g)} y2={236} stroke={C.line} strokeWidth={0.6} />
          <T x={px(g)} y={252} anchor="middle" size={8.5} fill={C.faint}>{g} pJ/bit</T>
        </g>
      ))}
      {HOPS.map((h, i) => {
        const y = 52 + i * 31;
        const inPkg = i < 4;
        return (
          <g key={h.label}>
            <T x={248} y={y + 4} anchor="end" size={10.5} fill={C.ink} mono={false} weight={inPkg ? 500 : 400}>
              {h.label}
            </T>
            <line x1={x0} y1={y} x2={px(h.pj)} y2={y} stroke={inPkg ? C.accent : C.neg} strokeWidth={5} opacity={0.85} />
            <circle cx={px(h.pj)} cy={y} r={3.4} fill={inPkg ? C.accent : C.neg} />
            <T x={px(h.pj) + 9} y={y + 3.5} size={9.5} fill={inPkg ? C.accent : C.neg}>{h.pj} pJ</T>
            <T x={248} y={y + 15} anchor="end" size={8} fill={C.faint}>{h.dist} · {h.note}</T>
          </g>
        );
      })}
      <line x1={x0} y1={36} x2={x0} y2={236} stroke={C.muted} strokeWidth={0.9} />

      {/* group brackets, aligned to the rows they describe */}
      <path d="M22 46 h8 v108 h-8" fill="none" stroke={C.accent} strokeWidth={0.9} />
      <g transform="translate(18, 100) rotate(-90)">
        <T x={0} y={0} anchor="middle" size={8.5} fill={C.accent}>IN PACKAGE</T>
      </g>
      <path d="M22 164 h8 v56 h-8" fill="none" stroke={C.neg} strokeWidth={0.9} />
      <g transform="translate(18, 192) rotate(-90)">
        <T x={0} y={0} anchor="middle" size={8.5} fill={C.neg}>OUTSIDE</T>
      </g>
      <T x={x1} y={24} anchor="end" size={8.5} fill={C.faint}>logarithmic scale</T>
    </svg>
  );
}

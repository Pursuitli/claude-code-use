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

/* ------------------------------------------------------------------ */
/* Scale ladder — transistor to rack                                    */
/* ------------------------------------------------------------------ */

const RUNGS = [
  { id: 'transistor', label: 'Transistor', size: '~20 nm', note: 'One switch. A chip holds tens of billions.', exp: -8 },
  { id: 'cell', label: 'Circuit block', size: '~10 µm', note: 'A cache line, an adder, a memory cell.', exp: -5 },
  { id: 'die', label: 'Die', size: '~28 mm', note: 'One chip, cut from the wafer.', exp: -2 },
  { id: 'wafer', label: 'Wafer', size: '300 mm', note: 'Hundreds of dies, built together.', exp: -0.5 },
  { id: 'package', label: 'Package', size: '~100 mm', note: 'Dies plus memory, wired and armoured.', exp: -1 },
  { id: 'rack', label: 'Rack', size: '~2 m', note: 'Dozens of packages, 100+ kW.', exp: 0.3 },
];

export function ScaleLadder({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const W = 760;
  const H = 176;
  const step = (W - 80) / RUNGS.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Scale from a transistor to a data-centre rack">
      <line x1={40} y1={124} x2={W - 40} y2={124} stroke={C.line} strokeWidth={1} />
      {RUNGS.map((r, i) => {
        const cx = 40 + step * (i + 0.5);
        const on = r.id === active;
        // Marker radius is linear in the exponent, i.e. logarithmic in real size.
        // Nothing else fits: a true-scale drawing of 20 nm beside 2 m is one dot
        // and one rectangle. The caption says so rather than implying otherwise.
        const rad = 3.5 + (r.exp + 8) * 2.9;
        return (
          <g key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: 'pointer' }}>
            <circle cx={cx} cy={80} r={rad} fill={on ? C.accent : C.raised} stroke={on ? C.accent : C.muted} strokeWidth={0.9} />
            <line x1={cx} y1={124} x2={cx} y2={118} stroke={on ? C.accent : C.line} strokeWidth={on ? 1.6 : 1} />
            <T x={cx} y={144} anchor="middle" size={10} fill={on ? C.ink : C.muted} mono={false} weight={on ? 600 : 400}>
              {r.label}
            </T>
            <T x={cx} y={158} anchor="middle" size={8.5} fill={on ? C.accent : C.faint}>
              {r.size}
            </T>
          </g>
        );
      })}
      <T x={40} y={22} size={8.5} fill={C.faint}>SMALLEST</T>
      <T x={W - 40} y={22} anchor="end" size={8.5} fill={C.faint}>LARGEST</T>
      <T x={W / 2} y={22} anchor="middle" size={8.5} fill={C.faint}>
        ten orders of magnitude · circles on a log scale, not true size
      </T>
    </svg>
  );
}

export const SCALE_RUNGS = RUNGS;

/* ------------------------------------------------------------------ */
/* What a transistor is                                                 */
/* ------------------------------------------------------------------ */

export function TransistorDiagram() {
  return (
    <svg viewBox="0 0 760 250" className="w-full" role="img" aria-label="How a transistor works as a switch">
      {/* --- left: the plumbing analogy --- */}
      <T x={20} y={20} size={9} fill={C.faint}>THE IDEA — A TAP</T>
      <rect x={20} y={44} width={300} height={150} rx={3} fill={C.raised} stroke={C.line} />
      <path d="M46 150 H160 M200 150 H294" stroke={C.muted} strokeWidth={9} strokeLinecap="round" />
      <path d="M180 150 m-22 0 a22 22 0 0 1 44 0" fill="none" stroke={C.accent} strokeWidth={3} />
      <line x1={180} y1={128} x2={180} y2={86} stroke={C.accent} strokeWidth={3} />
      <circle cx={180} cy={82} r={9} fill={C.accent} />
      <T x={180} y={72} anchor="middle" size={8.5} fill={C.accent}>CONTROL</T>
      <T x={46} y={176} size={8.5}>water in</T>
      <T x={294} y={176} anchor="end" size={8.5}>water out</T>
      <T x={30} y={210} size={9.5} fill={C.body} mono={false}>
        A small signal on the control opens or closes a much larger flow.
      </T>

      {/* --- right: the real thing --- */}
      <T x={400} y={20} size={9} fill={C.faint}>THE DEVICE — A FIELD-EFFECT TRANSISTOR</T>
      <rect x={400} y={44} width={340} height={150} rx={3} fill={C.raised} stroke={C.line} />
      {/* substrate */}
      <rect x={418} y={140} width={304} height={38} fill={C.sunk} stroke={C.muted} strokeWidth={0.8} />
      <T x={428} y={164} size={8.5} fill={C.faint}>SILICON</T>
      {/* source / drain */}
      <rect x={440} y={118} width={70} height={24} fill={C.surface} stroke={C.muted} strokeWidth={0.8} />
      <rect x={630} y={118} width={70} height={24} fill={C.surface} stroke={C.muted} strokeWidth={0.8} />
      <T x={475} y={112} anchor="middle" size={8}>SOURCE</T>
      <T x={665} y={112} anchor="middle" size={8}>DRAIN</T>
      {/* channel */}
      <rect x={510} y={134} width={120} height={8} fill={C.accent} opacity={0.35} />
      <T x={570} y={160} anchor="middle" size={7.5} fill={C.accent}>channel</T>
      {/* gate */}
      <rect x={510} y={96} width={120} height={9} fill={C.mid} opacity={0.6} />
      <rect x={510} y={105} width={120} height={22} fill={C.ink} opacity={0.75} />
      <T x={570} y={90} anchor="middle" size={8} fill={C.ink}>GATE</T>
      <T x={740} y={124} anchor="end" size={7.5} fill={C.faint}>insulator</T>
      <T x={412} y={210} size={9.5} fill={C.body} mono={false}>
        Voltage on the gate lets current cross the channel. That is the whole switch.
      </T>
      <T x={412} y={230} size={9} fill={C.faint} mono={false}>
        A modern accelerator die contains on the order of 100 billion of them.
      </T>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* What a wafer is                                                      */
/* ------------------------------------------------------------------ */

export function WaferDiagram() {
  const dies: React.ReactNode[] = [];
  const cx = 610;
  const cy = 128;
  const R = 84;
  const d = 15;
  for (let gx = -6; gx <= 6; gx++) {
    for (let gy = -6; gy <= 6; gy++) {
      const x = cx + gx * d;
      const y = cy + gy * d;
      // Keep only whole dies that fit inside the wafer edge — the partial ones
      // at the rim are real yield loss, so they are simply not drawn.
      const corners = [
        [x, y], [x + d - 1.5, y], [x, y + d - 1.5], [x + d - 1.5, y + d - 1.5],
      ];
      if (corners.every(([px, py]) => Math.hypot(px - cx, py - cy) < R - 3)) {
        dies.push(<rect key={`${gx}-${gy}`} x={x} y={y} width={d - 1.5} height={d - 1.5} fill={C.raised} stroke={C.muted} strokeWidth={0.5} />);
      }
    }
  }

  return (
    <svg viewBox="0 0 760 250" className="w-full" role="img" aria-label="From silicon ingot to wafer to individual dies">
      <T x={20} y={20} size={9} fill={C.faint}>1 — INGOT</T>
      <path d="M40 70 h84 v112 h-84 z" fill={C.sunk} stroke={C.muted} strokeWidth={0.9} />
      <ellipse cx={82} cy={70} rx={42} ry={11} fill={C.raised} stroke={C.muted} strokeWidth={0.9} />
      <ellipse cx={82} cy={182} rx={42} ry={11} fill={C.sunk} stroke={C.muted} strokeWidth={0.9} />
      <T x={82} y={208} anchor="middle" size={8.5}>grown crystal</T>
      <T x={82} y={221} anchor="middle" size={8} fill={C.faint}>300 mm across</T>

      <path d="M150 126 H196 M190 121 L196 126 L190 131" stroke={C.faint} fill="none" strokeWidth={1} />
      <T x={173} y={112} anchor="middle" size={8} fill={C.faint}>slice</T>

      <T x={222} y={20} size={9} fill={C.faint}>2 — WAFER</T>
      <circle cx={300} cy={128} r={84} fill={C.surface} stroke={C.muted} strokeWidth={1} />
      <path d="M244 192 A84 84 0 0 0 268 204" stroke={C.paper} strokeWidth={3} fill="none" />
      <line x1={252} y1={190} x2={276} y2={202} stroke={C.muted} strokeWidth={1.4} />
      <T x={300} y={132} anchor="middle" size={9} fill={C.faint}>polished disc</T>
      <T x={300} y={148} anchor="middle" size={8} fill={C.faint}>~0.8 mm thick</T>
      <T x={300} y={230} anchor="middle" size={8.5}>the flat marks crystal orientation</T>

      <path d="M408 126 H454 M448 121 L454 126 L448 131" stroke={C.faint} fill="none" strokeWidth={1} />
      <T x={431} y={112} anchor="middle" size={8} fill={C.faint}>build</T>

      <T x={488} y={20} size={9} fill={C.faint}>3 — DIES ON THE WAFER</T>
      <circle cx={cx} cy={cy} r={R} fill={C.surface} stroke={C.muted} strokeWidth={1} />
      {dies}
      <T x={cx} y={230} anchor="middle" size={8.5}>each square is one chip</T>
      <T x={cx} y={243} anchor="middle" size={8} fill={C.faint}>1,000+ process steps to get here</T>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* What a fab does — the repeating loop                                 */
/* ------------------------------------------------------------------ */

const LOOP = [
  { k: 'Deposit', d: 'Lay down a thin film — metal, insulator or semiconductor — across the whole wafer.' },
  { k: 'Coat', d: 'Spin on a light-sensitive resist.' },
  { k: 'Expose', d: 'Project the mask pattern onto the resist through a lens. This is lithography.' },
  { k: 'Develop', d: 'Wash away the exposed resist, leaving the pattern.' },
  { k: 'Etch', d: 'Cut the film away wherever the resist does not protect it.' },
  { k: 'Strip & clean', d: 'Remove the remaining resist and every particle, then start again.' },
];

export function FabLoopDiagram({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const cx = 180;
  const cy = 128;
  const R = 86;
  return (
    <svg viewBox="0 0 760 256" className="w-full" role="img" aria-label="The repeating deposit, pattern and etch loop inside a fab">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.line} strokeWidth={1} strokeDasharray="4 4" />
      {LOOP.map((s, i) => {
        const a = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        const on = i === active;
        return (
          <g key={s.k} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={on ? 9 : 6} fill={on ? C.accent : C.paper} stroke={on ? C.accent : C.muted} strokeWidth={1.2} />
            <T
              x={x + Math.cos(a) * 18}
              y={y + Math.sin(a) * 18 + 3}
              anchor={Math.cos(a) > 0.2 ? 'start' : Math.cos(a) < -0.2 ? 'end' : 'middle'}
              size={on ? 10 : 9}
              fill={on ? C.ink : C.muted}
              mono={false}
              weight={on ? 600 : 400}
            >
              {s.k}
            </T>
          </g>
        );
      })}
      <T x={cx} y={cy - 6} anchor="middle" size={11} fill={C.ink} mono={false} weight={600}>× 1,000+</T>
      <T x={cx} y={cy + 9} anchor="middle" size={8.5} fill={C.faint}>steps per wafer</T>

      <line x1={318} y1={44} x2={318} y2={212} stroke={C.line} />
      <T x={344} y={52} size={9} fill={C.faint}>WHAT THE ACTIVE STEP DOES</T>
      <foreignObject x={344} y={62} width={396} height={150}>
        <div
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.6,
            color: 'var(--color-body)',
          }}
        >
          <strong style={{ color: 'var(--color-ink)' }}>{LOOP[active].k}. </strong>
          {LOOP[active].d}
        </div>
      </foreignObject>
      <T x={344} y={208} size={8.5} fill={C.faint}>
        Three to four months of this, per wafer, before packaging even begins.
      </T>
    </svg>
  );
}

export const FAB_LOOP = LOOP;

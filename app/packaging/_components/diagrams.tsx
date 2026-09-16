'use client';

import React from 'react';

/* ------------------------------------------------------------------ */
/* Shared SVG helpers                                                   */
/* ------------------------------------------------------------------ */

export const C = {
  line: 'var(--color-line)',
  ink: 'var(--color-ink)',
  muted: 'var(--color-muted)',
  faint: 'var(--color-faint)',
  accent: 'var(--color-accent)',
  surface: 'var(--color-surface)',
  raised: 'var(--color-raised)',
  sunk: 'var(--color-sunk)',
  paper: 'var(--color-paper)',
  accentsoft: 'var(--color-accentsoft)',
  pos: 'var(--color-pos)',
  mid: 'var(--color-mid)',
  neg: 'var(--color-neg)',
};

function Label({
  x,
  y,
  children,
  anchor = 'start',
  size = 9,
  fill = C.muted,
  mono = true,
  weight = 400,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: 'start' | 'middle' | 'end';
  size?: number;
  fill?: string;
  mono?: boolean;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fill={fill}
      fontWeight={weight}
      style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', letterSpacing: mono ? '0.04em' : undefined }}
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Cross-section of an AI accelerator package                        */
/* ------------------------------------------------------------------ */

export function PackageCrossSection({
  active,
  onHover,
}: {
  active: string | null;
  onHover: (id: string | null) => void;
}) {
  const on = (id: string) => active === id;
  const fill = (id: string, base: string) => (on(id) ? C.accent : base);
  const op = (id: string) => (active && !on(id) ? 0.78 : 1);

  const Group = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <g
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onHover(on(id) ? null : id)}
      opacity={op(id)}
      style={{ cursor: 'pointer', transition: 'opacity .15s' }}
    >
      {children}
    </g>
  );

  // One HBM stack drawn as N thin dies with TSV columns running through.
  const hbmStack = (x: number, w: number, key: string) => {
    const tiers = 8;
    const h = 6.2;
    const top = 152;
    return (
      <g key={key}>
        {Array.from({ length: tiers }).map((_, i) => (
          <rect
            key={i}
            x={x}
            y={top + i * (h + 1.1)}
            width={w}
            height={h}
            fill={fill('hbm', C.raised)}
            stroke={on('hbm') ? C.accent : C.muted}
            strokeWidth={0.6}
          />
        ))}
        {/* base die, slightly taller */}
        <rect x={x} y={top + tiers * (h + 1.1)} width={w} height={9} fill={on('hbm') ? C.accent : C.sunk} stroke={on('hbm') ? C.accent : C.muted} strokeWidth={0.8} />
        {/* TSV columns */}
        {[0.22, 0.42, 0.62, 0.82].map((f, i) => (
          <line
            key={i}
            x1={x + w * f}
            y1={top}
            x2={x + w * f}
            y2={top + tiers * (h + 1.1) + 9}
            stroke={on('hbm') ? C.paper : C.accent}
            strokeWidth={1}
            opacity={0.65}
          />
        ))}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 820 400" className="w-full" role="img" aria-label="Cross-section of an AI accelerator package">
      {/* ---------- cold plate ---------- */}
      <Group id="coldplate">
        <rect x={60} y={30} width={700} height={34} rx={3} fill={fill('coldplate', C.sunk)} stroke={on('coldplate') ? C.accent : C.muted} strokeWidth={0.9} />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={80 + i * 48} y={38} width={26} height={18} rx={2} fill={C.paper} opacity={on('coldplate') ? 0.5 : 0.85} stroke={C.line} strokeWidth={0.5} />
        ))}
        <Label x={66} y={24}>COLD PLATE — liquid channels, 700–1,400 W</Label>
      </Group>

      {/* ---------- TIM1 ---------- */}
      <Group id="tim1">
        <rect x={90} y={100} width={640} height={7} fill={fill('tim1', C.mid)} opacity={on('tim1') ? 1 : 0.55} />
        <Label x={736} y={106} anchor="start" size={8}>TIM1 · 25–100 µm</Label>
      </Group>

      {/* ---------- lid ---------- */}
      <Group id="lid">
        <path d="M78 68 H742 V100 H78 Z" fill={fill('lid', C.raised)} stroke={on('lid') ? C.accent : C.muted} strokeWidth={0.9} />
        <path d="M78 100 V148 H98 V100 Z M742 100 V148 H722 V100 Z" fill={fill('lid', C.raised)} stroke={on('lid') ? C.accent : C.muted} strokeWidth={0.9} />
        <Label x={84} y={62}>LID / INTEGRATED HEAT SPREADER — also a stiffener</Label>
      </Group>

      {/* ---------- HBM stacks ---------- */}
      <Group id="hbm">
        {hbmStack(112, 86, 'l1')}
        {hbmStack(206, 86, 'l2')}
        {hbmStack(526, 86, 'r1')}
        {hbmStack(620, 86, 'r2')}
        <Label x={112} y={146} size={8.5} fill={on('hbm') ? C.accent : C.muted}>HBM ×4 (8 on a flagship)</Label>
      </Group>

      {/* ---------- compute dies ---------- */}
      <Group id="compute">
        <rect x={306} y={152} width={98} height={68} fill={fill('compute', C.sunk)} stroke={on('compute') ? C.accent : C.ink} strokeWidth={1} />
        <rect x={412} y={152} width={98} height={68} fill={fill('compute', C.sunk)} stroke={on('compute') ? C.accent : C.ink} strokeWidth={1} />
        {/* die-to-die link */}
        <path d="M404 186 H412" stroke={C.accent} strokeWidth={3} />
        <Label x={408} y={146} anchor="middle" size={8.5} fill={on('compute') ? C.accent : C.muted}>COMPUTE DIE ×2 · ~800 mm² each</Label>
        <Label x={408} y={200} anchor="middle" size={7.5} fill={C.accent}>~10 TB/s D2D</Label>
      </Group>

      {/* ---------- microbumps ---------- */}
      <Group id="microbump">
        {Array.from({ length: 62 }).map((_, i) => (
          <circle key={i} cx={114 + i * 10.2} cy={226} r={2.6} fill={fill('microbump', C.muted)} />
        ))}
        <Label x={736} y={229} size={8}>µBUMP 40–55 µm</Label>
      </Group>

      {/* ---------- interposer ---------- */}
      <Group id="interposer">
        <rect x={100} y={232} width={620} height={26} fill={fill('interposer', C.raised)} stroke={on('interposer') ? C.accent : C.muted} strokeWidth={0.9} />
        {/* fine routing lines */}
        {[238, 243, 248, 253].map((y, i) => (
          <line key={i} x1={112} y1={y} x2={708} y2={y} stroke={on('interposer') ? C.paper : C.accent} strokeWidth={0.55} opacity={0.5} />
        ))}
        {/* TSVs through the interposer */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={124 + i * 32} y1={232} x2={124 + i * 32} y2={258} stroke={on('interposer') ? C.paper : C.muted} strokeWidth={1.2} />
        ))}
        <Label x={106} y={246} size={8.5} fill={on('interposer') ? C.paper : C.ink} weight={500}>INTERPOSER · sub-2 µm routing · TSVs</Label>
      </Group>

      {/* ---------- C4 ---------- */}
      <Group id="c4">
        {Array.from({ length: 31 }).map((_, i) => (
          <circle key={i} cx={112 + i * 20} cy={266} r={5} fill={fill('c4', C.muted)} />
        ))}
        <Label x={736} y={270} size={8}>C4 ~150 µm</Label>
      </Group>

      {/* ---------- substrate ---------- */}
      <Group id="substrate">
        <rect x={62} y={274} width={696} height={44} fill={fill('substrate', C.surface)} stroke={on('substrate') ? C.accent : C.muted} strokeWidth={0.9} />
        {[282, 290, 298, 306, 314].map((y, i) => (
          <line key={i} x1={70} y1={y} x2={750} y2={y} stroke={on('substrate') ? C.paper : C.line} strokeWidth={0.6} />
        ))}
        <Label x={70} y={288} size={8.5} fill={on('substrate') ? C.paper : C.ink} weight={500}>ABF SUBSTRATE · 18–24 layers · ~100 mm body</Label>
      </Group>

      {/* ---------- BGA ---------- */}
      <Group id="bga">
        {Array.from({ length: 24 }).map((_, i) => (
          <circle key={i} cx={78 + i * 28.5} cy={328} r={8} fill={fill('bga', C.sunk)} stroke={on('bga') ? C.accent : C.muted} strokeWidth={0.8} />
        ))}
        <Label x={766} y={332} anchor="end" size={8}>BGA</Label>
      </Group>

      {/* ---------- PCB ---------- */}
      <Group id="pcb">
        <rect x={40} y={338} width={740} height={30} fill={fill('pcb', C.raised)} stroke={on('pcb') ? C.accent : C.muted} strokeWidth={0.9} />
        <Label x={48} y={357} size={8.5} fill={on('pcb') ? C.paper : C.muted}>MODULE PCB — VRMs deliver &gt;1,000 A from directly beneath</Label>
      </Group>

      {/* heat arrows */}
      <g opacity={0.5}>
        {[200, 410, 620].map((x, i) => (
          <path key={i} d={`M${x} 150 V 78`} stroke={C.neg} strokeWidth={1} markerEnd="url(#pk-arrow)" />
        ))}
      </g>
      <defs>
        <marker id="pk-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill={C.neg} />
        </marker>
      </defs>
      <Label x={780} y={390} anchor="end" size={8} fill={C.faint}>Schematic — not to scale. Vertical dimensions exaggerated ~20×.</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Top-down view                                                     */
/* ------------------------------------------------------------------ */

export function PackageTopDown({ active, onHover }: { active: string | null; onHover: (id: string | null) => void }) {
  const on = (id: string) => active === id;
  const op = (id: string) => (active && !on(id) ? 0.78 : 1);
  const stroke = (id: string) => (on(id) ? C.accent : C.muted);

  const hbm = (x: number, y: number) => (
    <g key={`${x}-${y}`} opacity={op('hbm')} onMouseEnter={() => onHover('hbm')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={54} height={74} fill={on('hbm') ? C.accent : C.raised} stroke={stroke('hbm')} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={x + 6} y1={y + 10 + i * 11} x2={x + 48} y2={y + 10 + i * 11} stroke={on('hbm') ? C.paper : C.faint} strokeWidth={0.6} opacity={0.6} />
      ))}
    </g>
  );

  return (
    <svg viewBox="0 0 520 360" className="w-full" role="img" aria-label="Top-down view of an AI accelerator package">
      <g opacity={op('substrate')} onMouseEnter={() => onHover('substrate')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        <rect x={20} y={20} width={480} height={320} rx={4} fill={C.surface} stroke={stroke('substrate')} />
        <Label x={30} y={36} size={8.5}>ABF SUBSTRATE ~100 × 100 mm</Label>
      </g>
      <g opacity={op('interposer')} onMouseEnter={() => onHover('interposer')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        <rect x={54} y={56} width={412} height={250} rx={2} fill={on('interposer') ? C.accent : C.raised} stroke={stroke('interposer')} />
        <Label x={64} y={72} size={8.5} fill={on('interposer') ? C.paper : C.muted}>INTERPOSER — 3.3× reticle (~2,800 mm²)</Label>
      </g>

      {hbm(70, 92)}
      {hbm(70, 176)}
      {hbm(134, 92)}
      {hbm(134, 176)}
      {hbm(266, 92)}
      {hbm(266, 176)}
      {hbm(330, 92)}
      {hbm(330, 176)}

      <g opacity={op('compute')} onMouseEnter={() => onHover('compute')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        <rect x={196} y={92} width={30} height={158} fill={on('compute') ? C.accent : C.sunk} stroke={on('compute') ? C.accent : C.ink} />
        <rect x={230} y={92} width={30} height={158} fill={on('compute') ? C.accent : C.sunk} stroke={on('compute') ? C.accent : C.ink} />
        <line x1={226} y1={171} x2={230} y2={171} stroke={C.accent} strokeWidth={4} />
        <Label x={228} y={268} anchor="middle" size={8} fill={on('compute') ? C.accent : C.muted}>COMPUTE ×2</Label>
      </g>

      <Label x={228} y={84} anchor="middle" size={7.5} fill={C.faint}>← 4 HBM →</Label>
      <Label x={30} y={354} size={8} fill={C.faint}>Every HBM stack is within ~5 mm of a compute die. That distance is the design.</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. HBM stack detail                                                  */
/* ------------------------------------------------------------------ */

export function HBMStackDiagram({ active, onHover }: { active: string | null; onHover: (id: string | null) => void }) {
  const on = (id: string) => active === id;
  const op = (id: string) => (active && !on(id) ? 0.75 : 1);
  const tiers = 11;

  return (
    <svg viewBox="0 0 420 300" className="w-full" role="img" aria-label="HBM stack cross-section">
      <g opacity={op('top')} onMouseEnter={() => onHover('top')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        <rect x={80} y={26} width={220} height={16} fill={on('top') ? C.accent : C.sunk} stroke={on('top') ? C.accent : C.line} />
        <Label x={310} y={38}>Top die — thicker, for rigidity</Label>
      </g>

      <g opacity={op('core')} onMouseEnter={() => onHover('core')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        {Array.from({ length: tiers }).map((_, i) => (
          <rect key={i} x={80} y={46 + i * 15} width={220} height={11} fill={on('core') ? C.accent : C.raised} stroke={on('core') ? C.accent : C.line} strokeWidth={0.7} />
        ))}
        <Label x={310} y={120}>Core DRAM ×11 · ~30–50 µm each</Label>
        <Label x={310} y={133} size={8} fill={C.faint}>thinner stack = more tiers, worse yield</Label>
      </g>

      <g opacity={op('gap')} onMouseEnter={() => onHover('gap')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        {Array.from({ length: tiers }).map((_, i) => (
          <rect key={i} x={80} y={57 + i * 15} width={220} height={4} fill={on('gap') ? C.accent : C.mid} opacity={on('gap') ? 1 : 0.35} />
        ))}
        <Label x={70} y={120} anchor="end">MR-MUF / TC-NCF gap fill</Label>
      </g>

      <g opacity={op('tsvcol')} onMouseEnter={() => onHover('tsvcol')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        {[0.16, 0.32, 0.48, 0.64, 0.8].map((f, i) => (
          <line key={i} x1={80 + 220 * f} y1={26} x2={80 + 220 * f} y2={236} stroke={on('tsvcol') ? C.accent : C.accent} strokeWidth={on('tsvcol') ? 3 : 1.4} opacity={on('tsvcol') ? 1 : 0.7} />
        ))}
        <Label x={70} y={80} anchor="end">TSV columns</Label>
      </g>

      <g opacity={op('base')} onMouseEnter={() => onHover('base')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        <rect x={80} y={214} width={220} height={22} fill={on('base') ? C.accent : C.sunk} stroke={on('base') ? C.accent : C.ink} />
        <Label x={190} y={228} anchor="middle" size={8} fill={on('base') ? C.paper : C.ink} weight={500}>BASE / LOGIC DIE — PHY, test, repair</Label>
      </g>

      <g opacity={op('ubump')} onMouseEnter={() => onHover('ubump')} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
        {Array.from({ length: 22 }).map((_, i) => (
          <circle key={i} cx={86 + i * 10} cy={243} r={3} fill={on('ubump') ? C.accent : C.muted} />
        ))}
        <Label x={310} y={247}>µbumps → interposer</Label>
      </g>

      <rect x={60} y={252} width={260} height={12} fill={C.raised} stroke={C.line} />
      <Label x={190} y={261} anchor="middle" size={8} fill={C.faint}>INTERPOSER</Label>
      <Label x={20} y={288} size={8} fill={C.faint}>12-Hi stack. Yield ≈ (per-die yield)¹² × stacking yield — often ~35% at 92% per die.</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Horizontal bar chart (bandwidth, capacity, cost)                  */
/* ------------------------------------------------------------------ */

export function BarChart({
  data,
  unit,
  formatter,
  height = 24,
  labelWidth = 170,
  colorFor,
}: {
  data: { name: string; value: number; note?: string; kind?: string }[];
  unit: string;
  formatter?: (v: number) => string;
  height?: number;
  labelWidth?: number;
  colorFor?: (kind?: string) => string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const fmt = formatter ?? ((v: number) => v.toLocaleString());
  return (
    <div className="space-y-[6px]">
      {data.map((d) => (
        <div key={d.name} className="group flex items-center gap-3" title={d.note}>
          <div className="pk-num shrink-0 text-right text-[10.5px] text-muted" style={{ width: labelWidth }}>
            {d.name}
          </div>
          <div className="relative min-w-0 flex-1 overflow-hidden rounded-[2px] bg-sunk" style={{ height }}>
            <div
              className="h-full rounded-[2px] transition-[width] duration-500"
              style={{ width: `${(d.value / max) * 100}%`, background: colorFor ? colorFor(d.kind) : C.ink }}
            />
            <span className="pk-num absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-medium text-paper mix-blend-difference">
              {fmt(d.value)} {unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Cost/density scatter for the technology ladder                    */
/* ------------------------------------------------------------------ */

export function LadderScatter({
  items,
  selected,
  onSelect,
}: {
  items: { id: string; name: string; costIndex: number; densityIndex: number; family: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const W = 760;
  const H = 440;
  const pad = { l: 54, r: 26, t: 26, b: 44 };
  const x = (v: number) => pad.l + (v / 100) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / 100) * (H - pad.t - pad.b);

  // Drop the vendor parenthetical — the detail card below carries the full name.
  const short = (n: string) => n.replace(/\s*[—(].*$/, '').trim();

  // Hand-tuned nudges where two technologies genuinely sit on top of each other.
  const NUDGE: Record<string, { dx: number; dy: number }> = {
    glass: { dx: 0, dy: -13 },
    cowos: { dx: 0, dy: -4 },
    soic: { dx: 0, dy: 14 },
    foveros: { dx: 0, dy: 14 },
    interposer: { dx: 0, dy: 3 },
    bridge: { dx: 0, dy: 2 },
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Packaging technologies by cost and interconnect density">
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={x(g)} y1={pad.t} x2={x(g)} y2={H - pad.b} stroke={C.line} strokeWidth={0.5} />
          <line x1={pad.l} y1={y(g)} x2={W - pad.r} y2={y(g)} stroke={C.line} strokeWidth={0.5} />
        </g>
      ))}
      <Label x={W / 2} y={H - 12} anchor="middle" size={9} fill={C.faint}>
        RELATIVE COST PER PACKAGE  →
      </Label>
      <g transform={`translate(15, ${H / 2}) rotate(-90)`}>
        <Label x={0} y={0} anchor="middle" size={9} fill={C.faint}>
          INTERCONNECT DENSITY  →
        </Label>
      </g>
      <Label x={pad.l + 4} y={H - pad.b - 7} size={8} fill={C.faint}>cheap / coarse</Label>
      <Label x={W - pad.r - 2} y={pad.t - 9} anchor="end" size={8} fill={C.faint}>expensive / dense</Label>

      {items.map((it) => {
        const on = it.id === selected;
        const n = NUDGE[it.id] ?? { dx: 0, dy: 0 };
        const cx = x(it.costIndex);
        const cy = y(it.densityIndex) + n.dy;
        // Past the midline, hang the label to the left so it never runs off the frame.
        const left = it.costIndex > 58;
        const gap = (on ? 11 : 8) + n.dx;
        return (
          <g key={it.id} onClick={() => onSelect(it.id)} style={{ cursor: 'pointer' }}>
            <circle
              cx={cx}
              cy={cy}
              r={on ? 6.5 : 4}
              fill={on ? C.accent : C.paper}
              stroke={on ? C.accent : C.muted}
              strokeWidth={1.3}
            />
            <text
              x={left ? cx - gap : cx + gap}
              y={cy + 3.5}
              textAnchor={left ? 'end' : 'start'}
              fontSize={on ? 10.5 : 9.5}
              fill={on ? C.ink : C.muted}
              fontWeight={on ? 600 : 400}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {short(it.name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. World map with packaging hubs                                     */
/* ------------------------------------------------------------------ */

/**
 * A deliberate schematic rather than an atlas. Nodes sit at their true
 * latitude/longitude on a graticule; drawing crude coastlines would add
 * decoration and subtract accuracy, so there are none. The point the chart
 * has to make is concentration, which the highlight box makes directly.
 */
export function WorldMap({
  regions,
  active,
  onSelect,
}: {
  regions: { id: string; name: string; x: number; y: number; weight: number; spotlight?: boolean }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  // Label offsets, tuned so the dense East Asian cluster stays readable.
  const OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' }> = {
    taiwan: { dx: 16, dy: 22, anchor: 'start' },
    china: { dx: -16, dy: -2, anchor: 'end' },
    korea: { dx: 15, dy: -12, anchor: 'start' },
    japan: { dx: 15, dy: 10, anchor: 'start' },
    vietnam: { dx: -16, dy: 2, anchor: 'end' },
    malaysia: { dx: -16, dy: -4, anchor: 'end' },
    singapore: { dx: 14, dy: 16, anchor: 'start' },
    usa: { dx: 16, dy: 4, anchor: 'start' },
  };

  return (
    <svg viewBox="150 110 790 200" className="w-full" role="img" aria-label="Map of semiconductor packaging hubs by latitude and longitude">
      {/* graticule — 30° longitude, 20° latitude */}
      <g opacity={0.5}>
        {Array.from({ length: 13 }).map((_, i) => {
          const x = (i * 30 + 180) / 360 * 1000;
          return <line key={`v${i}`} x1={x} y1={110} x2={x} y2={296} stroke={C.line} strokeWidth={0.5} />;
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = (90 - (80 - i * 20)) / 180 * 500;
          return <line key={`h${i}`} x1={150} y1={y} x2={940} y2={y} stroke={C.line} strokeWidth={0.5} />;
        })}
        <line x1={150} y1={250} x2={940} y2={250} stroke={C.faint} strokeWidth={0.7} strokeDasharray="4 3" />
        <Label x={154} y={246} size={8} fill={C.faint}>EQUATOR</Label>
      </g>

      {/* the concentration box */}
      <g>
        <rect x={762} y={132} width={140} height={128} rx={3} fill="none" stroke={C.accent} strokeWidth={0.9} strokeDasharray="3 3" opacity={0.7} />
        <Label x={902} y={274} anchor="end" size={8.5} fill={C.accent} weight={500}>
          EAST ASIA + SEA — ~90%+ of advanced packaging (est.)
        </Label>
      </g>

      {regions.map((r) => {
        const on = r.id === active;
        const rad = 3.5 + r.weight * 1.7;
        const o = OFFSET[r.id] ?? { dx: rad + 6, dy: 3.5, anchor: 'start' as const };
        const lx = r.x + o.dx;
        const ly = r.y + o.dy;
        return (
          <g key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: 'pointer' }}>
            {on && <circle cx={r.x} cy={r.y} r={rad + 10} fill={C.accent} opacity={0.13} />}
            {/* leader line so labels never sit on top of the cluster */}
            <line
              x1={r.x + (o.anchor === 'start' ? rad : -rad)}
              y1={r.y}
              x2={lx + (o.anchor === 'start' ? -3 : 3)}
              y2={ly - 3.5}
              stroke={on ? C.accent : C.line}
              strokeWidth={0.7}
            />
            <circle cx={r.x} cy={r.y} r={rad} fill={on ? C.accent : r.spotlight ? C.mid : C.ink} opacity={on ? 1 : 0.85} />
            <text
              x={lx}
              y={ly}
              textAnchor={o.anchor}
              fontSize={on ? 12 : 10.5}
              fontWeight={on ? 600 : 400}
              fill={on ? C.ink : C.muted}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {r.name}
            </text>
          </g>
        );
      })}

      <g transform="translate(156, 302)">
        <circle cx={4} cy={-4} r={4.5} fill={C.ink} opacity={0.85} />
        <Label x={15} y={-1} size={8.5} fill={C.faint}>hub · dot size = strategic weight</Label>
        <circle cx={208} cy={-4} r={4.5} fill={C.mid} />
        <Label x={219} y={-1} size={8.5} fill={C.faint}>Southeast Asia focus</Label>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Line/area chart (CoWoS capacity)                                  */
/* ------------------------------------------------------------------ */

export function StepChart({ data }: { data: { period: string; wpm: number; note: string }[] }) {
  const W = 720;
  const H = 240;
  const pad = { l: 56, r: 16, t: 16, b: 46 };
  const max = Math.max(...data.map((d) => d.wpm)) * 1.1;
  const bw = (W - pad.l - pad.r) / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Estimated CoWoS capacity trajectory">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const yy = pad.t + (1 - f) * (H - pad.t - pad.b);
        return (
          <g key={f}>
            <line x1={pad.l} y1={yy} x2={W - pad.r} y2={yy} stroke={C.line} strokeWidth={0.5} />
            <Label x={pad.l - 8} y={yy + 3} anchor="end" size={8.5} fill={C.faint}>
              {Math.round((max * f) / 1000)}k
            </Label>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (d.wpm / max) * (H - pad.t - pad.b);
        const xx = pad.l + i * bw + bw * 0.18;
        const w = bw * 0.64;
        const last = i === data.length - 1;
        return (
          <g key={d.period}>
            <rect x={xx} y={H - pad.b - h} width={w} height={h} fill={last ? C.accentsoft : C.ink} opacity={last ? 1 : 0.82} stroke={last ? C.accent : 'none'} strokeDasharray={last ? '3 2' : undefined} />
            <Label x={xx + w / 2} y={H - pad.b - h - 6} anchor="middle" size={9} fill={C.ink} weight={600}>
              {(d.wpm / 1000).toFixed(0)}k
            </Label>
            <Label x={xx + w / 2} y={H - pad.b + 14} anchor="middle" size={8} fill={C.muted}>
              {d.period.replace(' (planned)', '')}
            </Label>
          </g>
        );
      })}
      <Label x={pad.l - 48} y={pad.t + 4} size={8} fill={C.faint}>WPM</Label>
      <Label x={pad.l} y={H - 8} size={8} fill={C.faint}>Interposer wafer starts per month · widely reported analyst estimates, not company disclosure</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Yield decay curve                                                 */
/* ------------------------------------------------------------------ */

export function YieldCurve({ dieYield, chipletCount }: { dieYield: number; chipletCount: number }) {
  const W = 520;
  const H = 230;
  const pad = { l: 42, r: 16, t: 14, b: 34 };
  const maxN = 16;
  const px = (n: number) => pad.l + ((n - 1) / (maxN - 1)) * (W - pad.l - pad.r);
  const py = (v: number) => pad.t + (1 - v) * (H - pad.t - pad.b);

  const series = [0.999, 0.99, dieYield, 0.95, 0.9].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => b - a);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Package yield versus chiplet count">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={pad.l} y1={py(f)} x2={W - pad.r} y2={py(f)} stroke={C.line} strokeWidth={0.5} />
          <Label x={pad.l - 6} y={py(f) + 3} anchor="end" size={8} fill={C.faint}>{Math.round(f * 100)}%</Label>
        </g>
      ))}
      {series.map((y) => {
        const isActive = Math.abs(y - dieYield) < 1e-9;
        const pts = Array.from({ length: maxN }, (_, i) => `${px(i + 1)},${py(Math.pow(y, i + 1))}`).join(' ');
        return (
          <g key={y}>
            <polyline points={pts} fill="none" stroke={isActive ? C.accent : C.muted} strokeWidth={isActive ? 2.2 : 1} opacity={isActive ? 1 : 0.4} />
            <Label x={W - pad.r - 2} y={py(Math.pow(y, maxN)) + 3} anchor="end" size={8} fill={isActive ? C.accent : C.faint}>
              {(y * 100).toFixed(1)}%
            </Label>
          </g>
        );
      })}
      <line x1={px(chipletCount)} y1={pad.t} x2={px(chipletCount)} y2={H - pad.b} stroke={C.accent} strokeDasharray="3 3" strokeWidth={1} />
      <circle cx={px(chipletCount)} cy={py(Math.pow(dieYield, chipletCount))} r={4} fill={C.accent} />
      <Label x={W / 2} y={H - 8} anchor="middle" size={8.5} fill={C.faint}>NUMBER OF DIES IN THE PACKAGE →</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 9. CoWoS supply chain flow                                           */
/* ------------------------------------------------------------------ */

export function SupplyFlow({
  nodes,
  active,
  onSelect,
}: {
  nodes: { id: string; name: string; constrained: 'high' | 'medium' | 'low'; suppliers: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const colorOf = (c: string) => (c === 'high' ? C.neg : c === 'medium' ? C.mid : C.pos);
  const cols = 4;
  const W = 760;
  const cw = 168;
  const ch = 62;
  const gapX = (W - cols * cw) / (cols + 1);

  return (
    <svg viewBox={`0 0 ${W} 300`} className="w-full" role="img" aria-label="CoWoS supply chain nodes and their constraint level">
      {nodes.map((n, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gapX + col * (cw + gapX);
        const y = 30 + row * (ch + 40);
        const on = n.id === active;
        return (
          <g key={n.id} onClick={() => onSelect(n.id)} style={{ cursor: 'pointer' }}>
            <rect x={x} y={y} width={cw} height={ch} rx={3} fill={on ? C.accentsoft : C.surface} stroke={on ? C.accent : C.line} strokeWidth={on ? 1.5 : 1} />
            <rect x={x} y={y} width={3.5} height={ch} fill={colorOf(n.constrained)} />
            <text x={x + 12} y={y + 22} fontSize={11} fontWeight={600} fill={C.ink} style={{ fontFamily: 'var(--font-sans)' }}>
              {n.name.length > 24 ? n.name.slice(0, 23) + '…' : n.name}
            </text>
            <text x={x + 12} y={y + 38} fontSize={8.5} fill={C.muted} style={{ fontFamily: 'var(--font-sans)' }}>
              {n.suppliers.length > 30 ? n.suppliers.slice(0, 29) + '…' : n.suppliers}
            </text>
            <Label x={x + 12} y={y + 52} size={8} fill={colorOf(n.constrained)}>
              {n.constrained.toUpperCase()} CONSTRAINT
            </Label>
          </g>
        );
      })}
      <g transform="translate(12, 288)">
        {[
          ['high', 'binding'],
          ['medium', 'tight'],
          ['low', 'ample'],
        ].map(([k, l], i) => (
          <g key={k} transform={`translate(${i * 110}, 0)`}>
            <rect x={0} y={-8} width={3.5} height={10} fill={colorOf(k)} />
            <Label x={10} y={0} size={8.5} fill={C.faint}>{l}</Label>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Process flow rail                                                */
/* ------------------------------------------------------------------ */

export function FlowRail({
  stages,
  active,
  onSelect,
}: {
  stages: { id: string; name: string; actor?: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-max items-stretch gap-0">
        {stages.map((s, i) => {
          const on = s.id === active;
          return (
            <React.Fragment key={s.id}>
              {i > 0 && (
                <div className="flex w-5 shrink-0 items-center justify-center text-faint">
                  <svg width="14" height="8" viewBox="0 0 14 8" aria-hidden>
                    <path d="M0 4 H10 M7 1 L10 4 L7 7" stroke="currentColor" fill="none" strokeWidth="1" />
                  </svg>
                </div>
              )}
              <button
                onClick={() => onSelect(s.id)}
                className={`min-w-[112px] rounded-[4px] border px-3 py-2.5 text-left transition-colors ${
                  on ? 'border-accent bg-accentsoft' : 'border-line bg-surface hover:border-faint'
                }`}
              >
                <div className="pk-num text-[9px] tracking-[0.1em] text-faint">{String(i + 1).padStart(2, '0')}</div>
                <div className={`mt-0.5 text-[12px] leading-tight font-medium ${on ? 'text-accent' : 'text-ink'}`}>{s.name}</div>
                {s.actor && <div className="mt-0.5 text-[10px] leading-tight text-muted">{s.actor}</div>}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Stacked cost bar (BOM)                                           */
/* ------------------------------------------------------------------ */

export function StackedCost({
  items,
  total,
}: {
  items: { id: string; name: string; value: number; category: string }[];
  total: number;
}) {
  const palette: Record<string, string> = {
    silicon: C.ink,
    memory: C.accent,
    packaging: C.mid,
    test: C.pos,
    other: C.faint,
  };
  return (
    <div>
      <div className="flex h-9 w-full overflow-hidden rounded-[3px]">
        {items.map((it) => (
          <div
            key={it.id}
            title={`${it.name} — $${Math.round(it.value).toLocaleString()} (${((it.value / total) * 100).toFixed(1)}%)`}
            style={{ width: `${(it.value / total) * 100}%`, background: palette[it.category] ?? C.faint }}
            className="group relative border-r border-paper/40 last:border-r-0 transition-opacity hover:opacity-80"
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {Object.entries(palette).map(([k, v]) => {
          const sum = items.filter((i) => i.category === k).reduce((a, b) => a + b.value, 0);
          if (!sum) return null;
          return (
            <span key={k} className="pk-num inline-flex items-center gap-1.5 text-[10px] text-muted">
              <span className="h-2 w-2 rounded-[1px]" style={{ background: v }} />
              {k} · {((sum / total) * 100).toFixed(0)}%
            </span>
          );
        })}
      </div>
    </div>
  );
}

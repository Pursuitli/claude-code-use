'use client';

import React, { useMemo, useState } from 'react';
import { TECHNOLOGIES } from '@/lib/packaging/technologies';
import { PACKAGE_LAYERS, SYSTEM_CONCEPTS, BOTTLENECK_NARRATIVE } from '@/lib/packaging/anatomy';
import {
  COWOS_MEANING, COWOS_VARIANTS, COWOS_WHY_STRATEGIC, COWOS_CAPACITY,
  COWOS_SUPPLY_NODES, WHY_CAPACITY_IS_HARD,
} from '@/lib/packaging/cowos';
import {
  HBM_WHAT, HBM_GENERATIONS, BANDWIDTH_COMPARISON, HBM_STACK_ANATOMY,
  HBM_CONCENTRATION, HBM_YIELD_ECONOMICS,
} from '@/lib/packaging/hbm';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';
import {
  Conf, DepthBlock, Disclosure, Eyebrow, KnowledgeCheck, LearnOnly, Matrix, Note,
  Panel, Prose, ScoreDots, Section, SubHead, Tabs, Td, Th,
} from '../ui';
import {
  BarChart, C, HBMStackDiagram, LadderScatter, PackageCrossSection, PackageTopDown,
  StepChart, SupplyFlow,
} from '../diagrams';
import { Figure, Photo } from '../Figure';
import { EnergyFigure, PerimeterFigure, ReticleFigure } from '../figures-a';
import { FanOutFigure, PackageScaleFigure } from '../figures-b';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;
const quiz = (id: string) => QUIZZES.find((q) => q.sectionId === id)!.questions;

/* ================================================================== */
/* 03 — Technology ladder                                              */
/* ================================================================== */

const FAMILY_LABEL: Record<string, string> = {
  legacy: 'Legacy',
  flipchip: 'Flip chip',
  'wafer-level': 'Wafer level',
  '2.5d': '2.5D',
  '3d': '3D',
  platform: 'Platform',
};

export function LadderSection() {
  const m = meta('ladder');
  const [sel, setSel] = useState('interposer');
  const [view, setView] = useState('map');
  const t = TECHNOLOGIES.find((x) => x.id === sel)!;
  const byRung = useMemo(() => [...TECHNOLOGIES].sort((a, b) => a.rung - b.rung || a.costIndex - b.costIndex), []);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="The one axis that matters">
          Every technology below is an answer to the same question: <em>how close together can I put the connections, and what
          will that cost me?</em> Wire bonding works at 50 µm along a die&apos;s edge. Hybrid bonding works below 10 µm across
          its entire face. Since connection density scales with the inverse square of pitch, that is roughly a thousand-fold
          span — and the entire cost, thermal and yield story follows from where on that span you choose to sit.
        </Note>
      </LearnOnly>

      {/* Both are wide-format drawings — side by side they scale below legible
          label size on anything narrower than a desktop, so they stack. */}
      <div className="space-y-4">
        <Figure id="perimeter">
          <PerimeterFigure />
        </Figure>
        <Figure id="fanout">
          <FanOutFigure />
        </Figure>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Photo id="wirebond" />
        <Photo id="flipchip" />
      </div>

      <Tabs
        tabs={[
          { id: 'map', label: 'Cost / density map' },
          { id: 'ladder', label: 'The ladder' },
          { id: 'matrix', label: 'Full comparison' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'map' && (
        <Panel className="p-4">
          <LadderScatter items={TECHNOLOGIES} selected={sel} onSelect={setSel} />
        </Panel>
      )}

      {view === 'ladder' && (
        <div className="space-y-1">
          {byRung.map((tech) => (
            <button
              key={tech.id}
              onClick={() => setSel(tech.id)}
              className={`flex w-full items-center gap-3 rounded-[4px] border px-3 py-2 text-left transition-colors ${
                tech.id === sel ? 'border-accent bg-accentsoft' : 'border-transparent hover:bg-raised'
              }`}
            >
              <span className="pk-num w-6 shrink-0 text-[10px] text-faint">R{tech.rung}</span>
              <span className="w-[190px] shrink-0 text-[13px] font-medium text-ink">{tech.name}</span>
              <span className="pk-num hidden w-[150px] shrink-0 text-[10.5px] text-muted sm:block">{tech.interconnectPitch}</span>
              <span className="min-w-0 flex-1">
                <span className="block h-[5px] w-full overflow-hidden rounded-full bg-sunk">
                  <span className="block h-full rounded-full" style={{ width: `${tech.costIndex}%`, background: C.accent }} />
                </span>
              </span>
              <span className="pk-num w-16 shrink-0 text-right text-[10px] text-faint">{tech.era.split('→')[0].trim()}</span>
            </button>
          ))}
          <p className="pk-num pt-2 text-[10px] text-faint">Bar = relative cost per package. R = rung on the ladder.</p>
        </div>
      )}

      {view === 'matrix' && (
        <Matrix
          head={
            <tr>
              <Th className="w-[150px]">Technology</Th>
              <Th>Family</Th>
              <Th className="w-[140px]">Pitch</Th>
              <Th className="w-[150px]">Relative cost</Th>
              <Th title="Manufacturing difficulty, 5 = hardest">Difficulty</Th>
              <Th className="w-[220px]">Solves</Th>
            </tr>
          }
        >
          {byRung.map((tech) => (
            <tr key={tech.id} onClick={() => setSel(tech.id)} className="cursor-pointer transition-colors hover:bg-raised/60">
              <Td className="font-medium text-ink">{tech.name}</Td>
              <Td className="pk-num text-[10px] text-muted">{FAMILY_LABEL[tech.family]}</Td>
              <Td className="pk-num text-muted">{tech.interconnectPitch}</Td>
              <Td className="text-muted">{tech.relativeCost}</Td>
              <Td><ScoreDots n={tech.difficulty} invert label="Difficulty" /></Td>
              <Td className="text-muted"><Prose>{tech.problem}</Prose></Td>
            </tr>
          ))}
        </Matrix>
      )}

      {/* detail card, always visible */}
      <Panel className="p-5">
        <div key={t.id} className="pk-fade">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{t.name}</h4>
            <span className="pk-num rounded-[3px] border border-line px-1.5 py-[1px] text-[9.5px] uppercase tracking-[0.08em] text-muted">
              {FAMILY_LABEL[t.family]}
            </span>
            <span className="pk-num text-[11px] text-faint">{t.era}</span>
          </div>
          <div className="mt-2 flex max-w-[74ch] gap-1.5 text-[13.5px] leading-snug font-medium text-body">
            <span className="shrink-0 text-faint">Solves:</span>
            <Prose>{t.problem}</Prose>
          </div>

          <div className="mt-4">
            <DepthBlock d={t.how} title="How it works" compact />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 border-y border-hairline py-4 sm:grid-cols-4">
            <div>
              <Eyebrow>Pitch</Eyebrow>
              <div className="pk-num mt-1 text-[12px] text-ink">{t.interconnectPitch}</div>
            </div>
            <div>
              <Eyebrow>Relative cost</Eyebrow>
              <div className="pk-num mt-1 text-[12px] text-ink">
                {t.relativeCost}
                <Conf c="est" />
              </div>
            </div>
            <div>
              <Eyebrow>Difficulty</Eyebrow>
              <div className="mt-1.5">
                <ScoreDots n={t.difficulty} invert label="Difficulty" />
              </div>
            </div>
            <div>
              <Eyebrow>Density index</Eyebrow>
              <div className="pk-num mt-1 text-[12px] text-ink">{t.densityIndex}/100</div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Eyebrow>Performance</Eyebrow>
              <p className="mt-1 text-[12.5px] leading-relaxed text-body">{t.performance}</p>
            </div>
            <div>
              <Eyebrow>Thermal</Eyebrow>
              <p className="mt-1 text-[12.5px] leading-relaxed text-body">{t.thermal}</p>
            </div>
            <div>
              <Eyebrow>Typical use cases</Eyebrow>
              <p className="mt-1 text-[12.5px] leading-relaxed text-body">{t.useCases.join(' · ')}</p>
            </div>
            <div>
              <Eyebrow>Who uses it</Eyebrow>
              <p className="mt-1 text-[12.5px] leading-relaxed text-body">{t.players.join(' · ')}</p>
            </div>
          </div>

          <div className="mt-4 border-l-2 border-accent/50 bg-accentsoft/50 py-2.5 pl-3.5 pr-3">
            <Eyebrow className="text-accent">The thing people miss</Eyebrow>
            <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{t.gotcha}</Prose>
          </div>
        </div>
      </Panel>

      <KnowledgeCheck sectionId="ladder" questions={quiz('ladder')} />
    </Section>
  );
}

/* ================================================================== */
/* 04 — Anatomy                                                        */
/* ================================================================== */

export function AnatomySection() {
  const m = meta('anatomy');
  const [hover, setHover] = useState<string | null>('hbm');
  const [view, setView] = useState('cross');
  const layer = PACKAGE_LAYERS.find((l) => l.id === hover);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="Why this section matters most">
          If you can hold this stack in your head — cold plate, TIM, lid, HBM, compute die, microbumps, interposer, C4,
          substrate, BGA, board — you can follow almost any conversation in this industry. Every shortage, every startup pitch
          and every technology roadmap is about one of these eleven layers, or about the interfaces between them.
        </Note>
      </LearnOnly>

      <Tabs
        tabs={[
          { id: 'cross', label: 'Cross-section' },
          { id: 'top', label: 'Top-down' },
        ]}
        active={view}
        onChange={setView}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel className="p-4">
          {view === 'cross' ? (
            <PackageCrossSection active={hover} onHover={setHover} />
          ) : (
            <PackageTopDown active={hover} onHover={setHover} />
          )}
        </Panel>
        <div>
          <Eyebrow className="mb-2">Layers — hover or tap</Eyebrow>
          <div className="flex flex-col">
            {PACKAGE_LAYERS.map((l) => (
              <button
                key={l.id}
                onMouseEnter={() => setHover(l.id)}
                onClick={() => setHover(l.id)}
                className={`border-l-2 py-1.5 pl-2.5 text-left transition-colors ${
                  hover === l.id ? 'border-accent bg-raised' : 'border-transparent hover:bg-raised/50'
                }`}
              >
                <div className={`text-[12.5px] leading-tight font-medium ${hover === l.id ? 'text-accent' : 'text-ink'}`}>{l.name}</div>
                <div className="pk-num mt-0.5 text-[9.5px] text-faint">{l.thickness}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {layer && (
        <Panel key={layer.id} className="pk-fade p-5">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{layer.name}</h4>
            <span className="pk-num text-[11px] text-muted">{layer.thickness}</span>
            <span className="pk-num text-[11px] text-faint">· {layer.material}</span>
          </div>
          <p className="mt-2 text-[13.5px] font-medium text-body">{layer.what}</p>
          <Prose className="mt-2.5 max-w-[76ch] text-[13px] leading-[1.7] text-body">{layer.detail}</Prose>
          <p className="mt-3 border-t border-hairline pt-3 text-[12.5px] text-neg">
            <span className="pk-num text-[9.5px] uppercase tracking-[0.1em]">Fails by · </span>
            {layer.fails}
          </p>
        </Panel>
      )}

      <Figure id="scale">
        <PackageScaleFigure />
      </Figure>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <Photo id="package" />
        <Panel tone="sunk" className="p-4">
          <Eyebrow>Hold the physical fact</Eyebrow>
          <p className="mt-2 text-[13px] leading-relaxed text-body">
            A flagship accelerator package is roughly the footprint of a drink coaster, about two millimetres of it is
            substrate, and it dissipates more than a kilowatt through a contact patch a few centimetres across.
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-body">
            Every constraint in this section — warpage, thermal density, power delivery, package size limits — is a
            consequence of those three numbers sitting together in one object.
          </p>
        </Panel>
      </div>

      <div className="grid gap-4">
        <Figure id="energy">
          <EnergyFigure />
        </Figure>
        <Figure id="reticle">
          <ReticleFigure />
        </Figure>
      </div>

      {/* system-level quantities */}
      <div>
        <SubHead note="Six numbers that determine whether a package works. Each has a Simple and a Founder-depth explanation.">
          The system-level quantities
        </SubHead>
        <div className="grid gap-4 lg:grid-cols-2">
          {SYSTEM_CONCEPTS.map((c) => (
            <Panel key={c.id} className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="text-[14px] font-semibold text-ink">{c.name}</h4>
                <span className="pk-num shrink-0 text-[15px] font-medium text-accent">{c.number}</span>
              </div>
              <p className="pk-num mt-1 text-[10px] leading-snug text-faint">{c.numberNote}</p>
              <div className="mt-3">
                <DepthBlock d={c.explain} compact />
              </div>
            </Panel>
          ))}
        </div>
      </div>

      <DepthBlock d={BOTTLENECK_NARRATIVE} title="How packaging became the system-level bottleneck" />

      <KnowledgeCheck sectionId="anatomy" questions={quiz('anatomy')} />
    </Section>
  );
}

/* ================================================================== */
/* 05 — CoWoS                                                          */
/* ================================================================== */

export function CowosSection() {
  const m = meta('cowos');
  const [node, setNode] = useState('hbmsupply');
  const active = COWOS_SUPPLY_NODES.find((n) => n.id === node)!;

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <DepthBlock d={COWOS_MEANING} title="What CoWoS actually means" />

      <div>
        <SubHead note="Three variants, one platform. The difference is entirely in what the interposer is made of — and that single choice drives cost, maximum package size and achievable bandwidth.">
          CoWoS-S, -R and -L
        </SubHead>
        <div className="grid gap-4 lg:grid-cols-3">
          {COWOS_VARIANTS.map((v) => (
            <Panel key={v.id} className="flex flex-col p-4">
              <div className="flex items-baseline justify-between">
                <h4 className="text-[15px] font-semibold text-ink">{v.name}</h4>
                <span className="pk-num text-[10px] text-faint">{v.introduced}</span>
              </div>
              <p className="pk-num mt-1.5 text-[11px] leading-snug text-accent">{v.interposer}</p>
              <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-body">{v.detail}</p>
              <div className="mt-3.5 space-y-2 border-t border-hairline pt-3">
                <div className="flex items-center justify-between">
                  <Eyebrow>Density</Eyebrow>
                  <ScoreDots n={v.density} label="Density" />
                </div>
                <div className="flex items-center justify-between">
                  <Eyebrow>Cost</Eyebrow>
                  <ScoreDots n={v.cost} invert label="Cost" />
                </div>
                <div>
                  <Eyebrow>Max size</Eyebrow>
                  <div className="pk-num mt-1 text-[11px] text-body">{v.maxSize}</div>
                </div>
                <div>
                  <Eyebrow>Used by</Eyebrow>
                  <div className="mt-1 text-[11.5px] leading-snug text-body">{v.users}</div>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <SubHead note="Estimated interposer wafer starts per month. Capacity has grown roughly an order of magnitude and demand has still exceeded it for most of that period.">
            Capacity trajectory <Conf c="est" />
          </SubHead>
          <Panel className="p-4">
            <StepChart data={COWOS_CAPACITY} />
          </Panel>
        </div>
        <div>
          <SubHead note="Why a packaging step became a strategic control point.">Why it matters strategically</SubHead>
          <Panel className="px-4 py-1">
            {COWOS_WHY_STRATEGIC.map((s, i) => (
              <div key={i} className="flex gap-3 border-b border-hairline py-3 last:border-b-0">
                <span className="pk-num mt-[3px] text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[12.5px] leading-relaxed text-body">{s}</p>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      <div>
        <SubHead note="Click a node. The binding constraint has rotated between these several times since 2023 — which is why 'the CoWoS shortage' is an imprecise phrase.">
          The supply chain behind one CoWoS package
        </SubHead>
        <Panel className="p-4">
          <SupplyFlow nodes={COWOS_SUPPLY_NODES} active={node} onSelect={setNode} />
        </Panel>
        <Panel key={active.id} className="pk-fade mt-3 p-4">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h4 className="text-[14.5px] font-semibold text-ink">{active.name}</h4>
            <span
              className={`pk-num rounded-[3px] px-1.5 py-[1px] text-[9.5px] uppercase tracking-[0.08em] ${
                active.constrained === 'high' ? 'bg-negsoft text-neg' : active.constrained === 'medium' ? 'bg-midsoft text-mid' : 'bg-possoft text-pos'
              }`}
            >
              {active.constrained} constraint
            </span>
          </div>
          <p className="mt-1.5 text-[12.5px] text-muted">{active.role} · {active.suppliers}</p>
          <p className="mt-2.5 max-w-[76ch] text-[13px] leading-relaxed text-body">{active.why}</p>
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <Photo id="cleanroom" />
        <Panel tone="sunk" className="p-4">
          <Eyebrow>The thing the capacity debate keeps missing</Eyebrow>
          <p className="mt-2 text-[13px] leading-relaxed text-body">
            Advanced packaging happens in a room like this one, not on an assembly floor. Class 100–1000 cleanroom,
            lithography, plating, CMP, metrology — the same class of plant as a fab, at the same construction timescale.
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-body">
            That single fact explains the 18–30 month expansion cycle better than any supply-chain chart. You cannot rent
            this. You build it, qualify it, and then spend quarters climbing its yield curve.
          </p>
        </Panel>
      </div>

      <div>
        <SubHead note="Six reasons, and the last one is the one most commentary misses.">
          Why expanding packaging capacity is genuinely hard
        </SubHead>
        <Panel className="px-4">
          {WHY_CAPACITY_IS_HARD.map((r, i) => (
            <Disclosure key={i} title={r.reason} defaultOpen={i === 5}>
              <Prose>{r.detail}</Prose>
            </Disclosure>
          ))}
        </Panel>
      </div>

      <KnowledgeCheck sectionId="cowos" questions={quiz('cowos')} />
    </Section>
  );
}

/* ================================================================== */
/* 06 — HBM                                                            */
/* ================================================================== */

export function HbmSection() {
  const m = meta('hbm');
  const [part, setPart] = useState<string | null>('core');
  const detail = HBM_STACK_ANATOMY.find((p) => p.id === part);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <DepthBlock d={HBM_WHAT} title="What HBM is" />

      <div>
        <SubHead note="Per-device bandwidth. Note that one HBM3E stack, 11 mm on a side, matches roughly 24 DDR5 modules — and that is the entire argument for advanced packaging in one chart.">
          Bandwidth comparison <Conf c="fact" />
        </SubHead>
        <Panel className="p-4">
          <BarChart
            data={BANDWIDTH_COMPARISON.map((b) => ({ name: b.name, value: b.gbps, note: b.note, kind: b.kind }))}
            unit="GB/s"
            formatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)} TB/s` : `${v}`)}
            colorFor={(k) => (k === 'hbm' ? C.accent : k === 'system' ? C.ink : C.faint)}
          />
          <p className="pk-num mt-3 text-[10px] text-faint">
            Grey = board-level memory · copper = one HBM stack · black = a complete accelerator. Hover a bar for context.
          </p>
        </Panel>
      </div>

      <div>
        <SubHead note="Every generation roughly doubles per-stack bandwidth. HBM4 does it by doubling interface width rather than pin speed — because width is what packaging makes affordable.">
          Generations
        </SubHead>
        <Matrix
          head={
            <tr>
              <Th>Generation</Th>
              <Th>Year</Th>
              <Th>Per-stack BW</Th>
              <Th>Pin rate</Th>
              <Th>Width</Th>
              <Th>Stack</Th>
              <Th>Capacity</Th>
              <Th className="w-[300px]">Note</Th>
            </tr>
          }
        >
          {HBM_GENERATIONS.map((g) => (
            <tr key={g.gen} className="transition-colors hover:bg-raised/60">
              <Td className="font-medium text-ink">{g.gen}</Td>
              <Td className="pk-num text-muted">{g.year}</Td>
              <Td className="pk-num text-accent">{g.perStackLabel}</Td>
              <Td className="pk-num text-muted">{g.pinRate}</Td>
              <Td className="pk-num text-muted">{g.width}</Td>
              <Td className="pk-num text-muted">{g.stackHeight}</Td>
              <Td className="pk-num text-muted">{g.capacity}</Td>
              <Td className="text-muted">{g.note}</Td>
            </tr>
          ))}
        </Matrix>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div>
          <SubHead>Inside a stack</SubHead>
          <Panel className="p-4">
            <HBMStackDiagram active={part} onHover={setPart} />
          </Panel>
        </div>
        <div>
          <SubHead note="Click a layer in the diagram, or read through.">Layer by layer</SubHead>
          <Panel className="px-4">
            {HBM_STACK_ANATOMY.map((p) => (
              <Disclosure key={p.id} title={p.name} meta={p.what} defaultOpen={p.id === part} dense>
                <Prose>{p.detail}</Prose>
              </Disclosure>
            ))}
          </Panel>
          {detail && (
            <p className="pk-num mt-2 text-[10px] text-faint">Highlighted: {detail.name}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <SubHead>Why supply is concentrated</SubHead>
          <Panel className="px-4">
            {HBM_CONCENTRATION.map((c, i) => (
              <Disclosure key={i} title={c.point} dense>
                <Prose>{c.detail}</Prose>
              </Disclosure>
            ))}
          </Panel>
        </div>
        <div>
          <SubHead>Stack yield and the economics that follow</SubHead>
          <DepthBlock d={HBM_YIELD_ECONOMICS} />
        </div>
      </div>

      <KnowledgeCheck sectionId="hbm" questions={quiz('hbm')} />
    </Section>
  );
}

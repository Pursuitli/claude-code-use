'use client';

import React, { useMemo, useState } from 'react';
import { PROCESS_STEPS } from '@/lib/packaging/process';
import { MATERIALS } from '@/lib/packaging/materials';
import { EQUIPMENT } from '@/lib/packaging/equipment';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';
import {
  Eyebrow, KnowledgeCheck, LearnOnly, Matrix, Note, Panel, Prose,
  ScoreDots, Section, SplitList, SubHead, Tabs, Td, Th,
} from '../ui';
import { FlowRail } from '../diagrams';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;
const quiz = (id: string) => QUIZZES.find((q) => q.sectionId === id)!.questions;

const STAGE_LABEL: Record<string, string> = {
  wafer: 'Wafer-level prep',
  assembly: 'Assembly',
  substrate: 'Substrate integration',
  final: 'Final',
};

/* ================================================================== */
/* 07 — Process line                                                   */
/* ================================================================== */

export function ProcessSection() {
  const m = meta('process');
  const [sel, setSel] = useState('dieattach');
  const [view, setView] = useState('flow');
  const s = PROCESS_STEPS.find((x) => x.id === sel)!;

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="How to use this">
          Read the <em>failure modes</em> column before anything else. In manufacturing, the failure modes are the business:
          every one of them is somebody&apos;s product, somebody&apos;s inspection tool, and somebody&apos;s scrap line item.
          When you meet a packaging startup, the fastest way to assess them is to ask which failure mode they eliminate and
          how much value is committed by the time it appears.
        </Note>
      </LearnOnly>

      <Tabs
        tabs={[
          { id: 'flow', label: 'Process flow' },
          { id: 'risk', label: 'Yield risk & opportunity' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'flow' ? (
        <>
          <FlowRail stages={PROCESS_STEPS.map((p) => ({ id: p.id, name: p.name, actor: STAGE_LABEL[p.stage] }))} active={sel} onSelect={setSel} />
          <Panel key={s.id} className="pk-fade mt-4 p-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="pk-num text-[11px] text-accent">STEP {String(s.n).padStart(2, '0')}</span>
              <h4 className="text-[16.5px] font-semibold tracking-[-0.01em] text-ink">{s.name}</h4>
              <span className="pk-num text-[10.5px] text-faint">{STAGE_LABEL[s.stage]}{s.cycleTime ? ` · ${s.cycleTime}` : ''}</span>
            </div>
            <p className="mt-2 text-[13.5px] font-medium text-body">{s.what}</p>
            <Prose className="mt-2.5 max-w-[78ch] text-[13px] leading-[1.7] text-body">{s.detail}</Prose>

            <div className="mt-4 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
              <div>
                <Eyebrow>Machine</Eyebrow>
                <p className="mt-1 text-[12.5px] leading-relaxed text-body">{s.machine}</p>
              </div>
              <div>
                <Eyebrow>Equipment vendors</Eyebrow>
                <p className="mt-1 text-[12.5px] leading-relaxed text-body">{s.vendors.join(' · ')}</p>
              </div>
              <div>
                <Eyebrow>What goes wrong</Eyebrow>
                <ul className="mt-1 space-y-1">
                  {s.failureModes.map((f) => (
                    <li key={f} className="ml-3.5 list-disc pl-1 text-[12.5px] leading-snug text-body marker:text-neg">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Eyebrow>Yield risk</Eyebrow>
                <div className="mt-1.5">
                  <ScoreDots n={s.yieldRisk} invert label="Yield risk" />
                </div>
                <Eyebrow className="mt-4">Startup opportunity</Eyebrow>
                <p className="mt-1 text-[12.5px] leading-relaxed text-accent">{s.opportunity}</p>
              </div>
            </div>
          </Panel>
        </>
      ) : (
        <Matrix
          head={
            <tr>
              <Th className="w-[40px]">#</Th>
              <Th className="w-[160px]">Step</Th>
              <Th title="Yield risk, 5 = highest">Risk</Th>
              <Th className="w-[230px]">Dominant failure mode</Th>
              <Th className="w-[180px]">Key vendors</Th>
              <Th className="w-[260px]">Where a startup could enter</Th>
            </tr>
          }
        >
          {PROCESS_STEPS.map((p) => (
            <tr key={p.id} onClick={() => { setSel(p.id); setView('flow'); }} className="cursor-pointer transition-colors hover:bg-raised/60">
              <Td className="pk-num text-faint">{String(p.n).padStart(2, '0')}</Td>
              <Td className="font-medium text-ink">{p.name}</Td>
              <Td><ScoreDots n={p.yieldRisk} invert label="Yield risk" /></Td>
              <Td className="text-muted">{p.failureModes[0]}</Td>
              <Td className="text-muted">{p.vendors.slice(0, 3).join(', ')}</Td>
              <Td className="text-accent">{p.opportunity}</Td>
            </tr>
          ))}
        </Matrix>
      )}

      <KnowledgeCheck sectionId="process" questions={quiz('process')} />
    </Section>
  );
}

/* ================================================================== */
/* 08 — Materials                                                      */
/* ================================================================== */

export function MaterialsSection() {
  const m = meta('materials');
  const [sel, setSel] = useState('abf');
  const spotlights = useMemo(() => MATERIALS.filter((x) => x.spotlight), []);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="The pattern to look for">
          Materials are the smallest revenue line in packaging and the largest source of systemic risk. The reason is
          qualification: a material is approved into one specific process recipe backed by years of reliability data, so
          switching means requalifying the package. That makes incumbents almost impossible to dislodge — and it makes any{' '}
          <em>new</em> structure (glass cores, panel-level, hybrid-bonding interfaces) a genuinely open field, because nobody
          has a data-set head start there.
        </Note>
      </LearnOnly>

      <div>
        <SubHead>Three that deserve founder attention</SubHead>
        <div className="grid gap-4 lg:grid-cols-3">
          {spotlights.map((x) => (
            <button key={x.id} onClick={() => setSel(x.id)} className="text-left">
              <Panel tone={sel === x.id ? 'accent' : 'default'} className="h-full p-4 transition-colors hover:border-accent/40">
                <h4 className="text-[14px] font-semibold text-ink">{x.name}</h4>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-body">{x.purpose}</p>
                <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2.5">
                  <Eyebrow>Concentration</Eyebrow>
                  <ScoreDots n={x.concentrationScore} invert label="Concentration" />
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <Eyebrow>Substitutable</Eyebrow>
                  <ScoreDots n={x.substitutionScore} label="Substitutability" />
                </div>
              </Panel>
            </button>
          ))}
        </div>
      </div>

      <SplitList
        items={MATERIALS}
        selected={sel}
        onSelect={setSel}
        renderLabel={(x, on) => (
          <div className="flex items-center justify-between gap-2">
            <span className={`truncate text-[12.5px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{x.name}</span>
            {x.spotlight && <span className="pk-num shrink-0 text-[9px] text-accent">★</span>}
          </div>
        )}
        renderDetail={(x) => (
          <>
            <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{x.name}</h4>
            <p className="mt-1.5 text-[13.5px] font-medium text-body">{x.purpose}</p>
            <Prose className="mt-3 max-w-[76ch] text-[13px] leading-[1.7] text-body">{x.detail}</Prose>

            <div className="mt-4 grid gap-4 border-y border-hairline py-4 sm:grid-cols-2">
              <div>
                <Eyebrow>Key suppliers</Eyebrow>
                <ul className="mt-1.5 space-y-1">
                  {x.suppliers.map((sup) => (
                    <li key={sup.name} className="text-[12.5px] leading-snug">
                      <span className="font-medium text-ink">{sup.name}</span>
                      {sup.share && <span className="text-muted"> — {sup.share}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Eyebrow>Supply concentration</Eyebrow>
                  <ScoreDots n={x.concentrationScore} invert label="Concentration" />
                </div>
                <Prose className="text-[11.5px] leading-snug text-muted">{x.concentration}</Prose>
                <div className="flex items-center justify-between">
                  <Eyebrow>Substitutability</Eyebrow>
                  <ScoreDots n={x.substitutionScore} label="Substitutability" />
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <Eyebrow>Technical bottleneck</Eyebrow>
                <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{x.bottleneck}</Prose>
              </div>
              <div>
                <Eyebrow>Can it be substituted?</Eyebrow>
                <p className="mt-1 text-[12.5px] leading-relaxed text-body">{x.substitutable}</p>
              </div>
              <div className="border-l-2 border-accent/50 bg-accentsoft/50 py-2.5 pl-3.5 pr-3">
                <Eyebrow className="text-accent">Startup opportunity</Eyebrow>
                <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{x.opportunity}</Prose>
              </div>
            </div>
          </>
        )}
      />

      <KnowledgeCheck sectionId="materials" questions={quiz('materials')} />
    </Section>
  );
}

/* ================================================================== */
/* 09 — Equipment                                                      */
/* ================================================================== */

export function EquipmentSection() {
  const m = meta('equipment');
  const [sel, setSel] = useState('hybridbond');
  const [view, setView] = useState('detail');

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="Where equipment moats actually come from">
          Rarely from the machine. DISCO&apos;s moat is consumables and recipes; Advantest&apos;s is the customer&apos;s own
          test code; ASML&apos;s is physics nobody else has reproduced. When you assess a tool startup, ask what makes the
          incumbent hard to replace — and whether that same thing would protect you if you won. Selling into a{' '}
          <em>new</em> process step means there is no install base to displace, which is why hybrid bonding attracted so much
          capital so quickly.
        </Note>
      </LearnOnly>

      <Tabs
        tabs={[
          { id: 'detail', label: 'Category detail' },
          { id: 'barriers', label: 'Barriers to entry' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'detail' ? (
        <SplitList
          items={EQUIPMENT}
          selected={sel}
          onSelect={setSel}
          renderLabel={(e, on) => (
            <div className="flex items-center justify-between gap-2">
              <span className={`truncate text-[12.5px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{e.name}</span>
              <ScoreDots n={e.barrier} invert label="Barrier" />
            </div>
          )}
          renderDetail={(e) => (
            <>
              <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{e.name}</h4>
              <p className="mt-1.5 text-[13.5px] font-medium text-body">{e.what}</p>
              <Prose className="mt-3 max-w-[76ch] text-[13px] leading-[1.7] text-body">{e.detail}</Prose>

              <div className="mt-4 border-y border-hairline py-4">
                <Eyebrow>Who leads</Eyebrow>
                <ul className="mt-2 space-y-1.5">
                  {e.leaders.map((l) => (
                    <li key={l.name} className="text-[12.5px] leading-snug">
                      <span className="font-medium text-ink">{l.name}</span>
                      {l.note && <span className="text-muted"> — {l.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <Eyebrow>Barrier to entry</Eyebrow>
                    <ScoreDots n={e.barrier} invert label="Barrier" />
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-body">{e.barrierWhy}</p>
                </div>
                <div>
                  <Eyebrow>Typical tool price</Eyebrow>
                  <p className="pk-num mt-1 text-[12.5px] text-ink">{e.toolPrice}</p>
                </div>
              </div>

              <div className="mt-4 border-l-2 border-accent/50 bg-accentsoft/50 py-2.5 pl-3.5 pr-3">
                <Eyebrow className="text-accent">Startup opportunity</Eyebrow>
                <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{e.opportunity}</Prose>
              </div>
            </>
          )}
        />
      ) : (
        <Matrix
          head={
            <tr>
              <Th className="w-[180px]">Category</Th>
              <Th title="Barrier to entry, 5 = highest">Barrier</Th>
              <Th className="w-[150px]">Tool price</Th>
              <Th className="w-[180px]">Leaders</Th>
              <Th className="w-[320px]">Why the barrier is where it is</Th>
            </tr>
          }
        >
          {[...EQUIPMENT].sort((a, b) => b.barrier - a.barrier).map((e) => (
            <tr key={e.id} onClick={() => { setSel(e.id); setView('detail'); }} className="cursor-pointer transition-colors hover:bg-raised/60">
              <Td className="font-medium text-ink">{e.name}</Td>
              <Td><ScoreDots n={e.barrier} invert label="Barrier" /></Td>
              <Td className="pk-num text-muted">{e.toolPrice}</Td>
              <Td className="text-muted">{e.leaders.slice(0, 2).map((l) => l.name).join(', ')}</Td>
              <Td className="text-muted">{e.barrierWhy}</Td>
            </tr>
          ))}
        </Matrix>
      )}

      <KnowledgeCheck sectionId="equipment" questions={quiz('equipment')} />
    </Section>
  );
}

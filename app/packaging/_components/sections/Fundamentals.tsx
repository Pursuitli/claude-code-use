'use client';

import React, { useState } from 'react';
import {
  PACKAGING_JOBS,
  FLOW_STAGES,
  FAB_VS_PACKAGING,
  WHY_NOT_BARE_DIE,
  WHAT_IS_ADVANCED,
  WHY_AI_CHANGED_IT,
} from '@/lib/packaging/fundamentals';
import { VALUE_CHAIN } from '@/lib/packaging/valuechain';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';
import {
  Conf, DepthBlock, Eyebrow, KnowledgeCheck, LearnOnly, Matrix, Note, Panel,
  Prose, ScoreDots, Section, SplitList, SubHead, Td, Th, Tabs, RefOnly,
} from '../ui';
import { FlowRail } from '../diagrams';
import { Figure, Mark, Photo } from '../Figure';
import { PitchAreaFigure } from '../figures-a';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;
const quiz = (id: string) => QUIZZES.find((q) => q.sectionId === id)!.questions;

/* ================================================================== */
/* 01 — Industry in five minutes                                       */
/* ================================================================== */

export function FundamentalsSection() {
  const m = meta('fundamentals');
  const [stage, setStage] = useState('fab');
  const [job, setJob] = useState('memory');
  const active = FLOW_STAGES.find((s) => s.id === stage)!;

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Panel tone="sunk" className="p-5">
          <Eyebrow>Start here</Eyebrow>
          <p className="mt-2 max-w-[74ch] text-[14.5px] leading-[1.7] text-body">
            A chip is made in two halves. The <strong className="font-medium text-ink">front end</strong> builds transistors
            into silicon. The <strong className="font-medium text-ink">back end</strong> turns that silicon into a component
            a computer can use — giving it connections, power, cooling and armour. That second half is packaging. For thirty
            years it was the boring half. It is not any more, and this page is about why, and about what follows commercially
            from that change.
          </p>
        </Panel>
      </LearnOnly>

      {/* -------- the flow -------- */}
      <div>
        <SubHead note="Click any stage. The whole industry is a hand-off between these seven boxes, and the money is not evenly distributed across them.">
          Design to data centre, in seven stages
        </SubHead>
        <FlowRail stages={FLOW_STAGES.map((s) => ({ id: s.id, name: s.name, actor: s.actor }))} active={stage} onSelect={setStage} />
        <Panel className="mt-4 p-5">
          <div key={active.id} className="pk-fade">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{active.name}</h4>
              <span className="pk-num text-[11px] text-muted">{active.actor}</span>
              <span className="pk-num text-[11px] text-faint">· {active.duration}</span>
            </div>
            <p className="mt-2 text-[13.5px] font-medium text-ink">{active.what}</p>
            <Prose className="mt-2 max-w-[76ch] text-[13px] leading-[1.7] text-body">{active.detail}</Prose>
            <div className="mt-4 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
              <div>
                <Eyebrow>Economics</Eyebrow>
                <Prose className="mt-1.5 text-[12.5px] leading-relaxed text-body">{active.economics}</Prose>
              </div>
              <div>
                <Eyebrow>Who wins here</Eyebrow>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-body">{active.whoWins}</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* -------- the central claim, as a picture -------- */}
      <div>
        <SubHead note="If you only look at one diagram on this page, make it this one.">
          Why packaging exists, in one figure
        </SubHead>
        <Figure id="pitch">
          <PitchAreaFigure />
        </Figure>
      </div>

      {/* -------- the three explainers -------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DepthBlock d={WHY_NOT_BARE_DIE} title="Why can't you just use the bare die?" />
        <DepthBlock d={FAB_VS_PACKAGING} title="Fabrication vs packaging" />
        <DepthBlock d={WHAT_IS_ADVANCED} title="What makes packaging 'advanced'?" />
        <DepthBlock d={WHY_AI_CHANGED_IT} title="Why AI made packaging strategic" />
      </div>

      {/* -------- seven jobs -------- */}
      <div>
        <SubHead note="Every one of these is a physical constraint, a failure mode, and a place where a supplier can make or lose money. Learn them as a checklist — you will use it every time someone pitches you a packaging idea.">
          The seven jobs a package does
        </SubHead>
        <SplitList
          items={PACKAGING_JOBS}
          selected={job}
          onSelect={setJob}
          renderLabel={(j, on) => (
            <>
              <div className={`text-[13px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{j.name}</div>
              <div className="pk-num mt-0.5 text-[10px] leading-tight text-muted">{j.number}</div>
            </>
          )}
          renderDetail={(j) => (
            <>
              <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{j.name}</h4>
              <p className="mt-1.5 text-[13.5px] leading-snug font-medium text-body">{j.oneLine}</p>
              <Prose className="mt-3 max-w-[74ch] text-[13px] leading-[1.7] text-body">{j.detail}</Prose>
              <div className="mt-4 grid gap-3 border-t border-hairline pt-3.5 sm:grid-cols-2">
                <div>
                  <Eyebrow>Key number</Eyebrow>
                  <div className="pk-num mt-1 text-[12.5px] text-ink">{j.number}</div>
                </div>
                <div>
                  <Eyebrow>What failure looks like</Eyebrow>
                  <div className="mt-1 text-[12.5px] leading-snug text-neg">{j.failure}</div>
                </div>
              </div>
            </>
          )}
        />
      </div>

      <Note>
        If you retain one thing from this section: packaging exists because a die and a circuit board are separated by about
        three orders of magnitude in feature size, by a factor of six in thermal expansion, and by the fact that silicon is a
        brittle ceramic. Everything else — interposers, HBM, hybrid bonding, the CoWoS shortage — follows from trying to close
        those gaps at ever higher power and bandwidth.
      </Note>

      <KnowledgeCheck sectionId="fundamentals" questions={quiz('fundamentals')} />
    </Section>
  );
}

/* ================================================================== */
/* 02 — Value chain                                                    */
/* ================================================================== */

const SCORE_COLS: { key: 'capitalIntensity' | 'switchingCost' | 'technicalDifficulty' | 'concentrationScore' | 'startupEntry'; label: string; title: string; invert?: boolean }[] = [
  { key: 'capitalIntensity', label: 'Capital', title: 'Capital intensity: how much capex per dollar of revenue. 5 = highest.' },
  { key: 'switchingCost', label: 'Switching', title: 'How hard it is for a customer to change supplier. 5 = hardest.' },
  { key: 'technicalDifficulty', label: 'Difficulty', title: 'Technical difficulty of operating in this layer. 5 = hardest.' },
  { key: 'concentrationScore', label: 'Concentration', title: 'Supplier concentration. 5 = most concentrated.' },
  { key: 'startupEntry', label: 'Startup entry', title: 'Realistic startup entry viability. 5 = most viable.' },
];

export function ValueChainSection() {
  const m = meta('valuechain');
  const [layer, setLayer] = useState('osat');
  const [view, setView] = useState('map');

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="How to read this">
          Two questions decide everything in this chain: <em>who has an alternative</em>, and <em>who carries the capital</em>.
          Margin tracks the first almost perfectly — EDA is hard and earns 85%, substrates are hard and earn 20%, and the
          difference is not technical difficulty, it is whether the customer can go elsewhere. Read every layer below with
          that lens.
        </Note>
      </LearnOnly>

      <Tabs
        tabs={[
          { id: 'map', label: 'Layer detail' },
          { id: 'matrix', label: 'Comparison matrix' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'map' ? (
        <SplitList
          items={VALUE_CHAIN}
          selected={layer}
          onSelect={setLayer}
          renderLabel={(l, on) => (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className={`truncate text-[13px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{l.name}</div>
                <div className="pk-num mt-0.5 truncate text-[10px] text-muted">{l.grossMargin}</div>
              </div>
              <ScoreDots n={l.startupEntry} label="Startup entry" />
            </div>
          )}
          renderDetail={(l) => (
            <>
              <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{l.name}</h4>
              <p className="mt-1.5 text-[13.5px] leading-snug font-medium text-body">{l.what}</p>
              <Prose className="mt-3 max-w-[74ch] text-[13px] leading-[1.7] text-body">{l.detail}</Prose>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-hairline py-3.5 sm:grid-cols-3">
                <div>
                  <Eyebrow>Gross margin</Eyebrow>
                  <div className="pk-num mt-1 text-[13px] text-ink">
                    {l.grossMargin}
                    <Conf c="est" />
                  </div>
                </div>
                {SCORE_COLS.map((c) => (
                  <div key={c.key}>
                    <Eyebrow>{c.label}</Eyebrow>
                    <div className="mt-1.5">
                      <ScoreDots n={l[c.key]} invert={c.key !== 'startupEntry'} label={c.label} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <Eyebrow>Concentration</Eyebrow>
                  <p className="mt-1 text-[12.5px] text-body">{l.concentration}</p>
                </div>
                <div>
                  <Eyebrow>Value capture</Eyebrow>
                  <p className="mt-1 text-[12.5px] text-body">{l.valueCapture}</p>
                </div>
                <div>
                  <Eyebrow>Can a startup enter?</Eyebrow>
                  <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{l.startupNote}</Prose>
                </div>
                <div>
                  <Eyebrow>Who operates here</Eyebrow>
                  <ul className="mt-1.5 space-y-1.5">
                    {l.companies.map((c) => (
                      <li key={c.name} className="flex items-start gap-2 text-[12.5px] leading-snug">
                        <span className="mt-[1px]">
                          <Mark name={c.name} />
                        </span>
                        <span>
                          <span className="font-medium text-ink">{c.name}</span>
                          <span className="text-muted"> — {c.note}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        />
      ) : (
        <Matrix
          head={
            <tr>
              <Th className="w-[160px]">Layer</Th>
              <Th>Gross margin</Th>
              {SCORE_COLS.map((c) => (
                <Th key={c.key} title={c.title}>
                  {c.label}
                </Th>
              ))}
              <Th className="w-[200px]">Concentration</Th>
            </tr>
          }
        >
          {VALUE_CHAIN.map((l) => (
            <tr key={l.id} className="transition-colors hover:bg-raised/60">
              <Td className="font-medium text-ink">{l.name}</Td>
              <Td className="pk-num text-muted">{l.grossMargin}</Td>
              {SCORE_COLS.map((c) => (
                <Td key={c.key}>
                  <ScoreDots n={l[c.key]} invert={c.key !== 'startupEntry'} label={c.label} />
                </Td>
              ))}
              <Td className="text-muted">{l.concentration}</Td>
            </tr>
          ))}
        </Matrix>
      )}

      <RefOnly>
        <Panel tone="sunk" className="p-4">
          <Eyebrow>Reading the matrix</Eyebrow>
          <p className="mt-2 text-[12.5px] leading-relaxed text-body">
            Look for rows where <strong className="text-ink">concentration is high</strong> and{' '}
            <strong className="text-ink">margin is low</strong> — substrates and OSAT. Those are structural bottlenecks whose
            owners lack the incentive to relieve them, which is where both supply crises and supplier opportunities originate.
          </p>
        </Panel>
      </RefOnly>

      <KnowledgeCheck sectionId="valuechain" questions={quiz('valuechain')} />
    </Section>
  );
}

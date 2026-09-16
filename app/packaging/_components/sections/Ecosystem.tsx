'use client';

import React, { useState } from 'react';
import { COMPANIES } from '@/lib/packaging/companies';
import { REGIONS, SEA_THESIS } from '@/lib/packaging/geography';
import { PERSONAS, BUYING_CRITERIA_NOTE } from '@/lib/packaging/customers';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';
import {
  Conf, DepthBlock, Eyebrow, KnowledgeCheck, LearnOnly, Note, Panel, Prose,
  ScoreDots, Section, SplitList, SubHead, Tabs,
} from '../ui';
import { WorldMap } from '../diagrams';
import { Mark } from '../Figure';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;
const quiz = (id: string) => QUIZZES.find((q) => q.sectionId === id)!.questions;

/* ================================================================== */
/* 12 — Players                                                        */
/* ================================================================== */

export function PlayersSection() {
  const m = meta('players');
  const [sel, setSel] = useState('tsmc');

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="Read the last field first">
          Every profile ends with <em>what a startup should not try to compete with directly</em>. That field is the point of
          this section. Knowing a company&apos;s strengths is table stakes; knowing precisely which of those strengths is
          unassailable, and why, is what keeps you from spending three years and $20m discovering it.
        </Note>
      </LearnOnly>

      <SplitList
        items={COMPANIES}
        selected={sel}
        onSelect={setSel}
        renderLabel={(c, on) => (
          <div className="flex items-center gap-2.5">
            <Mark name={c.name} size="md" />
            <div className="min-w-0">
              <div className={`truncate text-[13px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{c.name}</div>
              <div className="pk-num mt-0.5 truncate text-[10px] leading-tight text-muted">{c.layer}</div>
            </div>
          </div>
        )}
        renderDetail={(c) => (
          <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="translate-y-[3px]"><Mark name={c.name} size="md" /></span>
              <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{c.name}</h4>
              {c.ticker && <span className="pk-num text-[11px] text-faint">{c.ticker}</span>}
              <span className="pk-num text-[11px] text-muted">· {c.hq}</span>
            </div>
            <p className="pk-num mt-1 text-[10.5px] uppercase tracking-[0.1em] text-accent">{c.layer}</p>
            <p className="mt-3 max-w-[74ch] text-[13.5px] leading-relaxed text-body">{c.role}</p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-y border-hairline py-3.5">
              {c.numbers.map((n) => (
                <div key={n.label}>
                  <Eyebrow>{n.label}</Eyebrow>
                  <div className="pk-num mt-1 text-[13px] text-ink">
                    {n.value}
                    <Conf c={n.confidence} />
                  </div>
                  {n.note && <div className="mt-0.5 text-[10.5px] text-faint">{n.note}</div>}
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Eyebrow>Strong at</Eyebrow>
                <ul className="mt-1.5 space-y-1.5">
                  {c.strengths.map((s) => (
                    <li key={s} className="ml-3.5 list-disc pl-1 text-[12.5px] leading-snug text-body marker:text-pos">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Eyebrow>Vulnerable to</Eyebrow>
                <ul className="mt-1.5 space-y-1.5">
                  {c.vulnerabilities.map((s) => (
                    <li key={s} className="ml-3.5 list-disc pl-1 text-[12.5px] leading-snug text-body marker:text-neg">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <Eyebrow>Major customers</Eyebrow>
              <p className="mt-1 text-[12.5px] text-body">{c.customers.join(' · ')}</p>
            </div>

            <div className="mt-4">
              <Eyebrow>Moat</Eyebrow>
              <Prose className="mt-1 max-w-[74ch] text-[12.5px] leading-relaxed text-body">{c.moat}</Prose>
            </div>

            <div className="mt-4 border-l-2 border-neg/50 bg-negsoft/50 py-2.5 pl-3.5 pr-3">
              <Eyebrow className="text-neg">Do not compete here</Eyebrow>
              <p className="mt-1 text-[12.5px] leading-relaxed text-body">{c.doNotCompete}</p>
            </div>
          </>
        )}
      />

      <KnowledgeCheck sectionId="players" questions={quiz('players')} />
    </Section>
  );
}

/* ================================================================== */
/* 13 — Geography                                                      */
/* ================================================================== */

export function GeographySection() {
  const m = meta('geography');
  const [sel, setSel] = useState('singapore');
  const [view, setView] = useState('map');
  const r = REGIONS.find((x) => x.id === sel)!;

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <Tabs
        tabs={[
          { id: 'map', label: 'Hub map' },
          { id: 'sea', label: 'Southeast Asia thesis' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'map' ? (
        <>
          <Panel className="p-3">
            <WorldMap regions={REGIONS} active={sel} onSelect={setSel} />
          </Panel>

          <div className="flex flex-wrap gap-1.5">
            {REGIONS.map((x) => (
              <button
                key={x.id}
                onClick={() => setSel(x.id)}
                className={`rounded-[4px] border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  x.id === sel ? 'border-accent bg-accentsoft text-accent' : 'border-line text-muted hover:border-faint hover:text-ink'
                }`}
              >
                {x.name}
                {x.spotlight && <span className="ml-1 text-[9px] text-mid">★</span>}
              </button>
            ))}
          </div>

          <Panel key={r.id} className="pk-fade p-5">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{r.name}</h4>
              <span className="pk-num text-[11px] text-accent">{r.share}</span>
            </div>
            <Prose className="mt-2.5 max-w-[78ch] text-[13px] leading-[1.7] text-body">{r.why}</Prose>

            <div className="mt-4 grid gap-5 border-t border-hairline pt-4 lg:grid-cols-2">
              <div>
                <Eyebrow>Capabilities on the ground</Eyebrow>
                <ul className="mt-1.5 space-y-1.5">
                  {r.capabilities.map((c) => (
                    <li key={c} className="ml-3.5 list-disc pl-1 text-[12.5px] leading-snug text-body marker:text-accent">
                      {c}
                    </li>
                  ))}
                </ul>
                <Eyebrow className="mt-4">New capacity being added</Eyebrow>
                <ul className="mt-1.5 space-y-1">
                  {r.newCapacity.map((c) => (
                    <li key={c} className="text-[12.5px] leading-snug text-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3.5">
                {[
                  ['Labour', r.labor],
                  ['Engineering talent', r.talent],
                  ['Supply-chain cluster', r.cluster],
                  ['Geopolitics', r.geopolitics],
                ].map(([k, v]) => (
                  <div key={k}>
                    <Eyebrow>{k}</Eyebrow>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-body">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </>
      ) : (
        <>
          <Note label="Written for a founder operating from Singapore">
            This is the part of the manual that is opinionated about your specific situation. It is a view, not a fact — argue
            with it.
          </Note>
          <div className="grid gap-4 lg:grid-cols-2">
            {SEA_THESIS.map((t, i) => (
              <Panel key={i} className="p-4">
                <div className="flex gap-3">
                  <span className="pk-num mt-[3px] text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className="text-[13.5px] font-semibold leading-snug text-ink">{t.title}</h4>
                    <Prose className="mt-1.5 text-[12.5px] leading-relaxed text-body">{t.body}</Prose>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}

      <KnowledgeCheck sectionId="geography" questions={quiz('geography')} />
    </Section>
  );
}

/* ================================================================== */
/* 14 — Customers                                                      */
/* ================================================================== */

export function CustomersSection() {
  const m = meta('customers');
  const [sel, setSel] = useState('aidesigner');

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="The framing error to avoid">
          Founders pitch the same deck to everyone. But an AI accelerator vendor is <em>capacity-constrained</em> and a mobile
          SoC vendor is <em>cost-constrained</em> — the identical technology has to be described completely differently to each,
          and to the wrong one it is not interesting at any price.
        </Note>
      </LearnOnly>

      <SplitList
        items={PERSONAS}
        selected={sel}
        onSelect={setSel}
        renderLabel={(p, on) => (
          <div>
            <div className={`text-[13px] font-medium ${on ? 'text-accent' : 'text-ink'}`}>{p.name}</div>
            <div className="pk-num mt-0.5 text-[10px] leading-tight text-muted">{p.salesCycle.split(' ')[0]} cycle</div>
          </div>
        )}
        renderDetail={(p) => (
          <>
            <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{p.name}</h4>
            <p className="mt-1 text-[12.5px] text-muted">{p.who}</p>
            <Prose className="mt-3 max-w-[76ch] text-[13px] leading-[1.7] text-body">{p.mindset}</Prose>

            <div className="mt-5">
              <Eyebrow>Buying criteria, weighted</Eyebrow>
              <div className="mt-2.5 space-y-2">
                {[...p.priorities].sort((a, b) => b.weight - a.weight).map((c) => (
                  <div key={c.criterion} className="flex items-start gap-3">
                    <span className="w-[150px] shrink-0 text-[12px] font-medium text-ink">{c.criterion}</span>
                    <span className="mt-[5px] shrink-0">
                      <ScoreDots n={c.weight} label="Weight" />
                    </span>
                    <span className="min-w-0 flex-1 text-[11.5px] leading-snug text-muted">{c.why}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-3">
              <div>
                <Eyebrow>Buys from</Eyebrow>
                <p className="mt-1 text-[12px] leading-relaxed text-body">{p.buysFrom}</p>
              </div>
              <div>
                <Eyebrow>Kill criteria</Eyebrow>
                <p className="mt-1 text-[12px] leading-relaxed text-neg">{p.killCriteria}</p>
              </div>
              <div>
                <Eyebrow>Sales cycle</Eyebrow>
                <p className="mt-1 text-[12px] leading-relaxed text-body">{p.salesCycle}</p>
              </div>
            </div>
          </>
        )}
      />

      <DepthBlock d={BUYING_CRITERIA_NOTE} title="How to use the persona map" />

      <KnowledgeCheck sectionId="customers" questions={quiz('customers')} />
    </Section>
  );
}

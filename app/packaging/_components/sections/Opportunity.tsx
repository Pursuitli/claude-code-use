'use client';

import React, { useMemo, useState } from 'react';
import { OPPORTUNITIES, OPPORTUNITY_FRAMEWORK } from '@/lib/packaging/opportunities';
import { BOTTLENECKS } from '@/lib/packaging/bottlenecks';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';
import type { Opportunity } from '@/lib/packaging/types';
import {
  Eyebrow, KnowledgeCheck, LearnOnly, Matrix, Note, Panel, Prose,
  ScoreDots, Section, SubHead, Tabs, Td, Th,
} from '../ui';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;
const quiz = (id: string) => QUIZZES.find((q) => q.sectionId === id)!.questions;

/* ================================================================== */
/* 15 — Opportunity matrix                                             */
/* ================================================================== */

type SortKey = 'successLikelihood' | 'tamScore' | 'capitalScore' | 'difficulty' | 'timeScore' | 'incumbentStrength' | 'certificationBarrier' | 'founderScore';

const COLS: { key: SortKey; label: string; title: string; invert: boolean; text?: (o: Opportunity) => string }[] = [
  { key: 'tamScore', label: 'TAM', title: 'Addressable market size. 5 = largest.', invert: false, text: (o) => o.tam },
  { key: 'capitalScore', label: 'Capital', title: 'Capital required to first revenue. 5 = LEAST capital needed.', invert: false, text: (o) => o.capital },
  { key: 'difficulty', label: 'Difficulty', title: 'Technical difficulty. 5 = hardest.', invert: true },
  { key: 'timeScore', label: 'Time to rev.', title: 'Speed to first revenue. 5 = fastest.', invert: false, text: (o) => o.timeToRevenue },
  { key: 'incumbentStrength', label: 'Incumbent', title: 'Strength of incumbents. 5 = strongest.', invert: true },
  { key: 'certificationBarrier', label: 'Cert. barrier', title: 'Qualification/certification burden. 5 = heaviest.', invert: true },
  { key: 'founderScore', label: 'Founder bar', title: 'Technical depth required in the founding team. 5 = highest.', invert: true },
  { key: 'successLikelihood', label: 'Odds', title: 'Likelihood a well-run startup succeeds here. 5 = best odds.', invert: false },
];

const VERDICT_STYLE: Record<Opportunity['verdict'], string> = {
  viable: 'bg-possoft text-pos',
  hard: 'bg-midsoft text-mid',
  crowded: 'bg-negsoft text-neg',
  contrarian: 'bg-accentsoft text-accent',
};

export function OpportunitiesSection() {
  const m = meta('opportunities');
  const [sort, setSort] = useState<SortKey>('successLikelihood');
  const [sel, setSel] = useState('metrology');
  const [filter, setFilter] = useState<'all' | Opportunity['verdict']>('all');

  const rows = useMemo(() => {
    const base = filter === 'all' ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => o.verdict === filter);
    return [...base].sort((a, b) => b[sort] - a[sort]);
  }, [sort, filter]);

  const o = OPPORTUNITIES.find((x) => x.id === sel)!;

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="The honest version">
          Four of the fifteen rows below are there so you can recognise and <em>reject</em> them. Conventional substrates,
          frontal bonding equipment and structural materials in existing categories are not startup opportunities — they are
          well-funded ways to lose, usually pitched with an onshoring narrative attached. The scoring is judgement, not
          measurement; disagree with it, but disagree with a reason.
        </Note>
      </LearnOnly>

      <div className="flex flex-wrap items-center gap-2">
        <Eyebrow>Filter</Eyebrow>
        {(['all', 'viable', 'contrarian', 'hard', 'crowded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-[4px] border px-2.5 py-1 text-[11.5px] font-medium capitalize transition-colors ${
              filter === f ? 'border-accent bg-accentsoft text-accent' : 'border-line text-muted hover:border-faint hover:text-ink'
            }`}
          >
            {f === 'all' ? 'All 15' : f}
          </button>
        ))}
        <span className="pk-num ml-auto text-[10px] text-faint">Click a column header to sort · click a row for detail</span>
      </div>

      <Matrix
        head={
          <tr>
            <Th className="w-[210px]">Entry point</Th>
            {COLS.map((c) => (
              <Th key={c.key} title={c.title} onClick={() => setSort(c.key)} active={sort === c.key}>
                {c.label}
              </Th>
            ))}
            <Th className="w-[100px]">Verdict</Th>
          </tr>
        }
      >
        {rows.map((row) => (
          <tr
            key={row.id}
            onClick={() => setSel(row.id)}
            className={`cursor-pointer transition-colors hover:bg-raised/60 ${row.id === sel ? 'bg-raised' : ''}`}
          >
            <Td className="font-medium text-ink">{row.name}</Td>
            {COLS.map((c) => (
              <Td key={c.key}>
                <ScoreDots n={row[c.key]} invert={c.invert} label={c.label} />
              </Td>
            ))}
            <Td>
              <span className={`pk-num rounded-[3px] px-1.5 py-[1px] text-[9px] uppercase tracking-[0.08em] ${VERDICT_STYLE[row.verdict]}`}>
                {row.verdict}
              </span>
            </Td>
          </tr>
        ))}
      </Matrix>

      <Panel key={o.id} className="pk-fade p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{o.name}</h4>
          <span className={`pk-num rounded-[3px] px-1.5 py-[2px] text-[9.5px] uppercase tracking-[0.08em] ${VERDICT_STYLE[o.verdict]}`}>
            {o.verdict}
          </span>
        </div>
        <Prose className="mt-2.5 max-w-[78ch] text-[13px] leading-[1.7] text-body">{o.thesis}</Prose>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3.5 border-y border-hairline py-4 sm:grid-cols-4">
          <div>
            <Eyebrow>TAM</Eyebrow>
            <div className="pk-num mt-1 text-[12px] text-ink">{o.tam}</div>
          </div>
          <div>
            <Eyebrow>Capital required</Eyebrow>
            <div className="pk-num mt-1 text-[12px] text-ink">{o.capital}</div>
          </div>
          <div>
            <Eyebrow>Time to revenue</Eyebrow>
            <div className="pk-num mt-1 text-[12px] text-ink">{o.timeToRevenue}</div>
          </div>
          <div>
            <Eyebrow>Odds for a startup</Eyebrow>
            <div className="mt-1.5">
              <ScoreDots n={o.successLikelihood} label="Odds" />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Eyebrow>Founder requirement</Eyebrow>
            <p className="mt-1 text-[12.5px] leading-relaxed text-body">{o.founderRequirement}</p>
          </div>
          <div>
            <Eyebrow>Who is already here</Eyebrow>
            <p className="mt-1 text-[12.5px] leading-relaxed text-body">{o.examples.join(' · ')}</p>
          </div>
        </div>

        <div className="mt-4 border-l-2 border-accent/50 bg-accentsoft/50 py-3 pl-4 pr-3">
          <Eyebrow className="text-accent">The wedge — and the honest risk</Eyebrow>
          <Prose className="mt-1.5 max-w-[76ch] text-[12.5px] leading-relaxed text-body">{o.wedge}</Prose>
        </div>
      </Panel>

      <div>
        <SubHead note="Six rules that generalise across every row above.">How to think about entry</SubHead>
        <div className="grid gap-3 lg:grid-cols-2">
          {OPPORTUNITY_FRAMEWORK.map((f, i) => (
            <Panel key={i} className="p-4">
              <div className="flex gap-3">
                <span className="pk-num mt-[2px] text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="text-[13px] font-semibold text-ink">{f.rule}</h4>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-body">{f.body}</p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      <KnowledgeCheck sectionId="opportunities" questions={quiz('opportunities')} />
    </Section>
  );
}

/* ================================================================== */
/* 16 — Bottleneck dashboard                                           */
/* ================================================================== */

const STATUS_STYLE: Record<string, string> = {
  acute: 'bg-negsoft text-neg',
  chronic: 'bg-midsoft text-mid',
  emerging: 'bg-accentsoft text-accent',
  easing: 'bg-possoft text-pos',
};

export function BottlenecksSection() {
  const m = meta('bottlenecks');
  const [sel, setSel] = useState('thermalbn');
  const [view, setView] = useState('board');
  const b = BOTTLENECKS.find((x) => x.id === sel)!;
  const sorted = useMemo(() => [...BOTTLENECKS].sort((a, z) => z.severity - a.severity), []);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="Read this with a timestamp in mind">
          Bottlenecks rotate. Since 2023 the binding constraint has moved from interposer capacity to HBM to substrates to test
          time, and it will move again. The durable insight is not <em>which</em> is tight today — it is the structural reason
          the system keeps producing shortages: the constraint reliably sits with a low-margin supplier while the upside sits
          with a high-margin customer, so nobody with the incentive has the capital and nobody with the capital has the
          incentive.
        </Note>
      </LearnOnly>

      <Tabs
        tabs={[
          { id: 'board', label: 'Dashboard' },
          { id: 'table', label: 'Table view' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'board' ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {sorted.map((x) => (
            <button key={x.id} onClick={() => setSel(x.id)} className="text-left">
              <Panel tone={x.id === sel ? 'accent' : 'default'} className="h-full p-3 transition-colors hover:border-accent/40">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[12.5px] leading-tight font-semibold text-ink">{x.name}</h4>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`pk-num rounded-[3px] px-1.5 py-[1px] text-[8.5px] uppercase tracking-[0.08em] ${STATUS_STYLE[x.status]}`}>
                    {x.status}
                  </span>
                  <ScoreDots n={x.severity} invert label="Severity" />
                </div>
              </Panel>
            </button>
          ))}
        </div>
      ) : (
        <Matrix
          head={
            <tr>
              <Th className="w-[200px]">Bottleneck</Th>
              <Th>Status</Th>
              <Th title="Severity, 5 = most severe">Severity</Th>
              <Th className="w-[260px]">Who suffers</Th>
              <Th className="w-[300px]">Current workaround</Th>
            </tr>
          }
        >
          {sorted.map((x) => (
            <tr key={x.id} onClick={() => { setSel(x.id); setView('board'); }} className="cursor-pointer transition-colors hover:bg-raised/60">
              <Td className="font-medium text-ink">{x.name}</Td>
              <Td>
                <span className={`pk-num rounded-[3px] px-1.5 py-[1px] text-[9px] uppercase tracking-[0.08em] ${STATUS_STYLE[x.status]}`}>
                  {x.status}
                </span>
              </Td>
              <Td><ScoreDots n={x.severity} invert label="Severity" /></Td>
              <Td className="text-muted">{x.whoSuffers.join('; ')}</Td>
              <Td className="text-muted">{x.workaround}</Td>
            </tr>
          ))}
        </Matrix>
      )}

      <Panel key={b.id} className="pk-fade p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{b.name}</h4>
          <span className={`pk-num rounded-[3px] px-1.5 py-[2px] text-[9.5px] uppercase tracking-[0.08em] ${STATUS_STYLE[b.status]}`}>
            {b.status}
          </span>
          <span className="flex items-center gap-2">
            <Eyebrow>Severity</Eyebrow>
            <ScoreDots n={b.severity} invert label="Severity" />
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <Eyebrow>Why it exists</Eyebrow>
            <Prose className="mt-1 max-w-[80ch] text-[13px] leading-[1.7] text-body">{b.why}</Prose>
          </div>
          <div className="grid gap-4 border-y border-hairline py-4 sm:grid-cols-2">
            <div>
              <Eyebrow>Who suffers</Eyebrow>
              <ul className="mt-1.5 space-y-1">
                {b.whoSuffers.map((w) => (
                  <li key={w} className="ml-3.5 list-disc pl-1 text-[12.5px] leading-snug text-body marker:text-neg">
                      {w}
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>Current workaround</Eyebrow>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-body">{b.workaround}</p>
            </div>
          </div>
          <div>
            <Eyebrow>What an ideal solution looks like</Eyebrow>
            <p className="mt-1 text-[12.5px] leading-relaxed text-body">{b.idealSolution}</p>
          </div>
          <div className="border-l-2 border-accent/50 bg-accentsoft/50 py-3 pl-4 pr-3">
            <Eyebrow className="text-accent">Startup opportunity</Eyebrow>
            <Prose className="mt-1.5 max-w-[78ch] text-[12.5px] leading-relaxed text-body">{b.opportunity}</Prose>
          </div>
          <div>
            <Eyebrow>Watch for</Eyebrow>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{b.watchFor}</p>
          </div>
        </div>
      </Panel>

      <KnowledgeCheck sectionId="bottlenecks" questions={quiz('bottlenecks')} />
    </Section>
  );
}

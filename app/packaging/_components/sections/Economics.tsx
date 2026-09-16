'use client';

import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  BOM_ITEMS, BOM_CONTEXT, DEFAULT_YIELD_INPUTS, YIELD_LESSONS,
  WHY_YIELD_MATTERS, computeYield, type YieldInputs,
} from '@/lib/packaging/economics';
import { QUAL_STAGES, SWITCHING_COST_MATH, WHY_DEFENSIBLE } from '@/lib/packaging/qualification';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';
import {
  Conf, DepthBlock, Disclosure, Eyebrow, KnowledgeCheck, LearnOnly, Matrix,
  Note, Panel, Prose, Section, SubHead, Td, Th,
} from '../ui';
import { StackedCost, YieldCurve } from '../diagrams';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;
const quiz = (id: string) => QUIZZES.find((q) => q.sectionId === id)!.questions;

const usd = (n: number) => '$' + Math.round(n).toLocaleString();
const pct = (n: number, d = 1) => (n * 100).toFixed(d) + '%';

/* ------------------------------------------------------------------ */
/* Slider control                                                      */
/* ------------------------------------------------------------------ */

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[12px] font-medium text-ink">{label}</label>
        <span className="pk-num text-[12px] tabular-nums text-accent">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 h-[3px] w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-accent)]"
        aria-label={label}
      />
      {hint && <p className="mt-1 text-[10.5px] leading-snug text-faint">{hint}</p>}
    </div>
  );
}

/* ================================================================== */
/* 10 — Economics + yield lab                                          */
/* ================================================================== */

export function EconomicsSection() {
  const m = meta('economics');
  const [inputs, setInputs] = useState<YieldInputs>(DEFAULT_YIELD_INPUTS);
  const set = <K extends keyof YieldInputs>(k: K, v: YieldInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => computeYield(inputs), [inputs]);
  const baseline = useMemo(() => computeYield(DEFAULT_YIELD_INPUTS), []);

  const [bomLevel, setBomLevel] = useState<'low' | 'mid' | 'high'>('mid');
  const bomValues = BOM_ITEMS.map((b) => ({
    ...b,
    value: bomLevel === 'low' ? b.low : bomLevel === 'high' ? b.high : (b.low + b.high) / 2,
  }));
  const bomTotal = bomValues.reduce((a, b) => a + b.value, 0);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="Before the numbers">
          Everything below is either an <strong className="text-ink">estimate</strong> or a{' '}
          <strong className="text-ink">model</strong>, and both are labelled. Nobody outside the companies involved knows the
          real numbers, and the real numbers change every quarter. What does not change is the <em>shape</em>: memory dominates
          the bill of materials, packaging is the second-largest line, leading-edge logic is smaller than people expect, and
          yield multiplies rather than adds. Learn the shape.
        </Note>
      </LearnOnly>

      {/* ---------------- BOM ---------------- */}
      <div>
        <SubHead note="One flagship-class accelerator package: two reticle-class compute dies plus eight HBM3E stacks on a bridge interposer. Manufactured cost, not price.">
          Where the money sits <Conf c="model" />
        </SubHead>

        <Panel className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Eyebrow>Estimated manufactured cost</Eyebrow>
              <div className="pk-num mt-1 text-[26px] leading-none font-medium tracking-tight text-ink">{usd(bomTotal)}</div>
              <p className="mt-1.5 text-[11.5px] text-muted">
                against an estimated selling price of {BOM_CONTEXT.asp} <Conf c="est" />
              </p>
            </div>
            <div className="flex rounded-[5px] border border-line p-[2px]">
              {(['low', 'mid', 'high'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setBomLevel(l)}
                  className={`pk-num rounded-[3px] px-2.5 py-[3px] text-[10px] font-medium uppercase tracking-[0.08em] transition-colors ${
                    bomLevel === l ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                  }`}
                >
                  {l === 'low' ? 'Low est.' : l === 'high' ? 'High est.' : 'Midpoint'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <StackedCost items={bomValues} total={bomTotal} />
          </div>

          <div className="mt-5 border-t border-hairline pt-1">
            {bomValues.map((b) => (
              <div key={b.id} className="flex items-baseline gap-3 border-b border-hairline py-2.5 last:border-b-0">
                <span className="pk-num w-[86px] shrink-0 text-right text-[12.5px] tabular-nums text-ink">{usd(b.value)}</span>
                <span className="pk-num w-[46px] shrink-0 text-right text-[10.5px] tabular-nums text-faint">
                  {((b.value / bomTotal) * 100).toFixed(0)}%
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-ink">
                    {b.name}
                    <Conf c={b.confidence} />
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{b.basis}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {BOM_CONTEXT.takeaways.map((t, i) => (
            <div key={i} className="flex gap-3 rounded-md border border-line bg-surface p-3.5">
              <span className="pk-num mt-[2px] text-[10px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[12.5px] leading-relaxed text-body">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- yield lab ---------------- */}
      <div>
        <SubHead note="Change the assumptions. This is the arithmetic that decides whether an advanced package is a business or a science project.">
          Yield lab <Conf c="model" />
        </SubHead>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <Panel className="p-4">
            <div className="flex items-center justify-between">
              <Eyebrow>Assumptions</Eyebrow>
              <button
                onClick={() => setInputs(DEFAULT_YIELD_INPUTS)}
                className="pk-num inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] text-faint hover:text-accent"
              >
                <RotateCcw size={10} /> Reset
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <Slider
                label="Dies in the package"
                value={inputs.chipletCount}
                min={1}
                max={16}
                step={1}
                onChange={(v) => set('chipletCount', v)}
                format={(v) => `${v}`}
                hint="Compute chiplets bonded to the interposer."
              />
              <Slider
                label="Per-die yield"
                value={inputs.dieYield}
                min={0.8}
                max={0.999}
                step={0.001}
                onChange={(v) => set('dieYield', v)}
                format={(v) => pct(v, 1)}
                hint="Probability an individual die is actually good."
              />
              <Slider
                label="Test coverage (KGD)"
                value={inputs.kgdCoverage}
                min={0.8}
                max={1}
                step={0.005}
                onChange={(v) => set('kgdCoverage', v)}
                format={(v) => pct(v, 1)}
                hint="Share of defects caught before assembly. The rest escape."
              />
              <Slider
                label="Per-attach assembly yield"
                value={inputs.assemblyYield}
                min={0.98}
                max={1}
                step={0.0005}
                onChange={(v) => set('assemblyYield', v)}
                format={(v) => pct(v, 2)}
                hint="Applied once per die and once per HBM stack."
              />
              <Slider
                label="HBM stacks"
                value={inputs.hbmStacks}
                min={0}
                max={12}
                step={1}
                onChange={(v) => set('hbmStacks', v)}
                format={(v) => `${v}`}
              />
              <Slider
                label="HBM stack yield"
                value={inputs.hbmStackYield}
                min={0.95}
                max={1}
                step={0.001}
                onChange={(v) => set('hbmStackYield', v)}
                format={(v) => pct(v, 1)}
                hint="Probability a purchased stack is good on arrival."
              />
              <div className="border-t border-hairline pt-4">
                <Slider label="Cost per die" value={inputs.dieCost} min={50} max={1200} step={10} onChange={(v) => set('dieCost', v)} format={usd} />
                <div className="mt-4">
                  <Slider label="Cost per HBM stack" value={inputs.hbmCost} min={100} max={800} step={10} onChange={(v) => set('hbmCost', v)} format={usd} />
                </div>
                <div className="mt-4">
                  <Slider label="Packaging & test cost" value={inputs.packagingCost} min={100} max={2000} step={25} onChange={(v) => set('packagingCost', v)} format={usd} />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 border-t border-hairline pt-3.5">
                <input
                  type="checkbox"
                  checked={inputs.reworkable}
                  onChange={(e) => set('reworkable', e.target.checked)}
                  className="accent-[var(--color-accent)]"
                />
                <span className="text-[12px] text-body">Rework recovers half of assembly failures</span>
              </label>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel className="p-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <div>
                  <Eyebrow>Naive intuition</Eyebrow>
                  <div className="pk-num mt-1 text-[22px] leading-none font-medium text-faint">{pct(r.naiveYield)}</div>
                  <p className="mt-1 text-[10.5px] leading-snug text-faint">&ldquo;the die yield&rdquo;</p>
                </div>
                <div>
                  <Eyebrow>Actual package yield</Eyebrow>
                  <div className={`pk-num mt-1 text-[22px] leading-none font-medium ${r.packageYield < 0.7 ? 'text-neg' : r.packageYield < 0.88 ? 'text-mid' : 'text-pos'}`}>
                    {pct(r.packageYield)}
                  </div>
                  <p className="mt-1 text-[10.5px] leading-snug text-muted">−{r.yieldGapPoints.toFixed(1)} pts vs intuition</p>
                </div>
                <div>
                  <Eyebrow>Committed value</Eyebrow>
                  <div className="pk-num mt-1 text-[22px] leading-none font-medium text-ink">{usd(r.committedValue)}</div>
                  <p className="mt-1 text-[10.5px] leading-snug text-muted">at risk per assembly</p>
                </div>
                <div>
                  <Eyebrow>Cost per good package</Eyebrow>
                  <div className="pk-num mt-1 text-[22px] leading-none font-medium text-accent">{usd(r.costPerGoodPackage)}</div>
                  <p className="mt-1 text-[10.5px] leading-snug text-muted">incl. {usd(r.scrapPerGoodPackage)} scrap</p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-hairline pt-4">
                {[
                  { k: 'All dies genuinely good', v: r.allDiesGood, note: `test lets ${pct(1 - r.trueGoodGivenPass, 2)} of "good" dies through bad` },
                  { k: 'All HBM stacks good', v: r.hbmAllGood, note: `${inputs.hbmStacks} stacks at ${pct(inputs.hbmStackYield)}` },
                  { k: 'Every attach survives', v: r.assemblySurvival, note: `${inputs.chipletCount + inputs.hbmStacks} attach operations` },
                ].map((row) => (
                  <div key={row.k} className="flex items-center gap-3">
                    <span className="w-[170px] shrink-0 text-[11.5px] text-body">{row.k}</span>
                    <span className="h-[5px] min-w-0 flex-1 overflow-hidden rounded-full bg-sunk">
                      <span className="block h-full rounded-full bg-ink/60" style={{ width: `${row.v * 100}%` }} />
                    </span>
                    <span className="pk-num w-[58px] shrink-0 text-right text-[11.5px] tabular-nums text-ink">{pct(row.v, 1)}</span>
                    <span className="hidden w-[210px] shrink-0 text-[10.5px] leading-snug text-faint sm:block">{row.note}</span>
                  </div>
                ))}
              </div>

              {Math.abs(r.costPerGoodPackage - baseline.costPerGoodPackage) > 1 && (
                <p className="mt-4 border-t border-hairline pt-3 text-[12px] text-muted">
                  Versus the default case, cost per good package moves{' '}
                  <span className={r.costPerGoodPackage > baseline.costPerGoodPackage ? 'text-neg' : 'text-pos'}>
                    {r.costPerGoodPackage > baseline.costPerGoodPackage ? '+' : '−'}
                    {usd(Math.abs(r.costPerGoodPackage - baseline.costPerGoodPackage))}
                  </span>{' '}
                  per unit. On five million units a year that is{' '}
                  <span className="pk-num text-ink">
                    ${(Math.abs(r.costPerGoodPackage - baseline.costPerGoodPackage) * 5e6 / 1e9).toFixed(2)}bn
                  </span>
                  .
                </p>
              )}
            </Panel>

            <Panel className="p-4">
              <Eyebrow>Package yield vs die count</Eyebrow>
              <div className="mt-2">
                <YieldCurve dieYield={inputs.dieYield} chipletCount={inputs.chipletCount} />
              </div>
            </Panel>
          </div>
        </div>

        <Panel className="mt-4 px-4">
          {YIELD_LESSONS.map((l, i) => (
            <Disclosure key={i} title={l.title} defaultOpen={i === 0}>
              <Prose>{l.body}</Prose>
            </Disclosure>
          ))}
        </Panel>
      </div>

      <DepthBlock d={WHY_YIELD_MATTERS} title="Why a point of yield is worth so much" />

      <KnowledgeCheck sectionId="economics" questions={quiz('economics')} />
    </Section>
  );
}

/* ================================================================== */
/* 11 — Qualification                                                  */
/* ================================================================== */

export function QualificationSection() {
  const m = meta('qualification');

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="The most commercially important section on this page">
          Almost every failed semiconductor hardware startup died here, not in the lab. The technology worked; the company ran
          out of money waiting for a customer to finish qualifying it. If you internalise one commercial mechanism from this
          whole manual, make it this one.
        </Note>
      </LearnOnly>

      <div>
        <SubHead note="Six stages from first meeting to sustained production. Note the cumulative elapsed time at the bottom.">
          The qualification gauntlet
        </SubHead>
        <div className="space-y-0">
          {QUAL_STAGES.map((s, i) => (
            <div key={s.id} className="flex gap-4 border-b border-hairline py-4 last:border-b-0">
              <div className="w-[96px] shrink-0">
                <div className="pk-num text-[11px] font-medium text-accent">{s.duration}</div>
                <div className="mt-2 h-[3px] w-full rounded-full bg-sunk">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${[18, 55, 45, 30, 40, 100][i]}%` }}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[13.5px] font-semibold text-ink">{s.name}</h4>
                <p className="mt-1 text-[12.5px] font-medium text-body">{s.what}</p>
                <Prose className="mt-1.5 max-w-[76ch] text-[12.5px] leading-relaxed text-muted">{s.detail}</Prose>
                <div className="mt-2.5 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  <p className="text-[11.5px] leading-snug text-muted">
                    <span className="pk-num text-[9.5px] uppercase tracking-[0.1em] text-faint">Cost · </span>
                    {s.cost}
                  </p>
                  <p className="text-[11.5px] leading-snug text-neg">
                    <span className="pk-num text-[9.5px] uppercase tracking-[0.1em]">If it fails · </span>
                    {s.failureConsequence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SubHead note="The numbers a founder should be able to recite.">The arithmetic of switching</SubHead>
        <Matrix
          head={
            <tr>
              <Th className="w-[320px]">Quantity</Th>
              <Th className="w-[240px]">Value</Th>
              <Th>Note</Th>
            </tr>
          }
        >
          {SWITCHING_COST_MATH.map((s) => (
            <tr key={s.item} className="transition-colors hover:bg-raised/60">
              <Td className="font-medium text-ink">{s.item}</Td>
              <Td className="pk-num text-accent">{s.value}</Td>
              <Td className="text-muted">{s.note}</Td>
            </tr>
          ))}
        </Matrix>
      </div>

      <DepthBlock d={WHY_DEFENSIBLE} title="Why this creates defensibility — and how to use it" />

      <KnowledgeCheck sectionId="qualification" questions={quiz('qualification')} />
    </Section>
  );
}

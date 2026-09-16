'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import type { Confidence, Depth, Score } from '@/lib/packaging/types';
import { GLOSSARY } from '@/lib/packaging/glossary';

/* ------------------------------------------------------------------ */
/* App-wide context: reading mode + progress ledger                     */
/* ------------------------------------------------------------------ */

export type Mode = 'learn' | 'ref';

interface AppCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  answered: Set<string>;
  markAnswered: (key: string) => void;
  visited: Set<string>;
  markVisited: (id: string) => void;
  openTerm: (term: string) => void;
}

export const AppContext = createContext<AppCtx>({
  mode: 'learn',
  setMode: () => {},
  answered: new Set(),
  markAnswered: () => {},
  visited: new Set(),
  markVisited: () => {},
  openTerm: () => {},
});

export const useApp = () => useContext(AppContext);

/* ------------------------------------------------------------------ */
/* Small primitives                                                     */
/* ------------------------------------------------------------------ */

const CONF_LABEL: Record<Confidence, { short: string; title: string }> = {
  fact: { short: 'FACT', title: 'Published specification, filing, or otherwise checkable.' },
  est: { short: 'EST', title: 'Industry estimate, analyst consensus or reported range. Directionally right; treat the magnitude, not the digits.' },
  model: { short: 'MODEL', title: 'Arithmetic constructed here to illustrate a mechanism. Not a measurement.' },
};

export function Conf({ c }: { c: Confidence }) {
  const m = CONF_LABEL[c];
  return (
    <span
      title={m.title}
      className={
        'pk-num ml-1.5 inline-block translate-y-[-1px] rounded-[3px] border px-1 text-[9px] leading-[14px] font-medium tracking-[0.06em] align-middle ' +
        (c === 'fact'
          ? 'border-pos/30 text-pos'
          : c === 'est'
            ? 'border-mid/30 text-mid'
            : 'border-line text-faint')
      }
    >
      {m.short}
    </span>
  );
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={'pk-num text-[10px] font-medium uppercase tracking-[0.14em] text-faint ' + className}>{children}</div>
  );
}

export function Panel({
  children,
  className = '',
  tone = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'sunk' | 'accent';
}) {
  const tones = {
    default: 'bg-surface border-line',
    sunk: 'bg-raised border-hairline',
    accent: 'bg-accentsoft border-accent/25',
  };
  return <div className={`rounded-md border ${tones[tone]} ${className}`}>{children}</div>;
}

/** Numbered stat, used in the dense header strips. */
export function Stat({
  label,
  value,
  note,
  confidence,
}: {
  label: string;
  value: string;
  note?: string;
  confidence?: Confidence;
}) {
  return (
    <div className="min-w-0 border-l border-line py-1 pl-3 first:border-l-0 first:pl-0">
      <Eyebrow>{label}</Eyebrow>
      <div className="pk-num mt-1 text-[15px] leading-tight font-medium text-ink">
        {value}
        {confidence && <Conf c={confidence} />}
      </div>
      {note && <div className="mt-0.5 text-[11px] leading-snug text-muted">{note}</div>}
    </div>
  );
}

/** 1–5 dot scale. `invert` flips the colour meaning (high = bad). */
export function ScoreDots({ n, invert = false, label }: { n: Score | number; invert?: boolean; label?: string }) {
  const good = invert ? n <= 2 : n >= 4;
  const bad = invert ? n >= 4 : n <= 2;
  const color = good ? 'bg-pos' : bad ? 'bg-neg' : 'bg-mid';
  return (
    <span className="inline-flex items-center gap-1" title={label ? `${label}: ${n}/5` : `${n}/5`}>
      <span className="flex gap-[3px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-[5px] w-[5px] rounded-full ${i <= n ? color : 'bg-line'}`} />
        ))}
      </span>
    </span>
  );
}

export function Bar({ value, max, tone = 'ink' }: { value: number; max: number; tone?: 'ink' | 'accent' | 'pos' | 'neg' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const bg = { ink: 'bg-ink/70', accent: 'bg-accent', pos: 'bg-pos', neg: 'bg-neg' }[tone];
  return (
    <span className="inline-block h-[6px] w-full overflow-hidden rounded-full bg-sunk align-middle">
      <span className={`block h-full rounded-full ${bg}`} style={{ width: `${pct}%` }} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Disclosure / accordion                                               */
/* ------------------------------------------------------------------ */

export function Disclosure({
  title,
  meta,
  children,
  defaultOpen = false,
  dense = false,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  dense?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => setOpen(defaultOpen), [defaultOpen]);
  return (
    <div className="border-b border-hairline last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`group flex w-full items-start gap-3 text-left ${dense ? 'py-2.5' : 'py-3.5'} transition-colors hover:bg-raised/60`}
      >
        <span className="mt-[3px] text-faint transition-colors group-hover:text-accent">
          {open ? <Minus size={13} strokeWidth={2} /> : <Plus size={13} strokeWidth={2} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] leading-snug font-medium text-ink">{title}</span>
          {meta && <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{meta}</span>}
        </span>
      </button>
      {open && <div className="pk-fade pb-4 pl-6 text-[13px] leading-[1.65] text-body">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simple ⇄ Founder depth switch (spec §19)                             */
/* ------------------------------------------------------------------ */

export function DepthBlock({ d, title, compact = false }: { d: Depth; title?: string; compact?: boolean }) {
  const { mode } = useApp();
  const [level, setLevel] = useState<'simple' | 'founder'>(mode === 'ref' ? 'founder' : 'simple');
  useEffect(() => setLevel(mode === 'ref' ? 'founder' : 'simple'), [mode]);

  return (
    <div className={compact ? '' : 'rounded-md border border-line bg-surface'}>
      <div className={`flex items-center justify-between gap-3 ${compact ? 'pb-2' : 'border-b border-hairline px-4 py-2.5'}`}>
        {title ? <Eyebrow>{title}</Eyebrow> : <span />}
        <div className="flex shrink-0 rounded-[5px] border border-line p-[2px]">
          {(['simple', 'founder'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`pk-num rounded-[3px] px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.08em] transition-colors ${
                level === l ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              {l === 'simple' ? 'Simple' : 'Founder depth'}
            </button>
          ))}
        </div>
      </div>
      <div className={compact ? '' : 'px-4 py-3.5'}>
        <Prose key={level} className="pk-fade">
          {level === 'simple' ? d.simple : d.founder}
        </Prose>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Prose with paragraph splitting + inline glossary linking             */
/* ------------------------------------------------------------------ */

const TERM_INDEX = (() => {
  const map = new Map<string, string>();
  for (const g of GLOSSARY) {
    map.set(g.term.toLowerCase(), g.term);
    for (const a of g.aka ?? []) map.set(a.toLowerCase(), g.term);
  }
  return map;
})();

/** Terms worth auto-linking in body copy — high-value, unambiguous. */
const AUTOLINK = [
  'hybrid bonding', 'known-good-die', 'compound yield', 'beachfront', 'reticle',
  'interposer', 'microbump', 'substrate', 'chiplet', 'warpage', 'underfill',
  'TSV', 'RDL', 'ABF', 'OSAT', 'CoWoS', 'HBM', 'CTE', 'die shift', 'panel-level packaging',
  'electromigration', 'adaptive patterning', 'energy per bit',
].sort((a, b) => b.length - a.length);

/**
 * One pass matches either *emphasis* or a glossary term, so the two never
 * collide. Glossary linking is capped per paragraph — the point is to offer a
 * definition, not to turn the body copy into a field of links.
 */
const RICH_RE = new RegExp(
  `(\\*[^*\\n]+\\*)|\\b(${AUTOLINK.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi',
);

export function Prose({ children, className = '' }: { children: string; className?: string }) {
  const { openTerm } = useApp();
  const paragraphs = useMemo(() => String(children).split('\n\n'), [children]);

  const render = useCallback(
    (text: string, pi: number) => {
      const out: React.ReactNode[] = [];
      let last = 0;
      let linked = 0;
      RICH_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = RICH_RE.exec(text)) !== null) {
        if (m[1]) {
          out.push(text.slice(last, m.index));
          out.push(
            <em key={`e${pi}-${m.index}`} className="italic text-ink">
              {m[1].slice(1, -1)}
            </em>,
          );
          last = m.index + m[0].length;
          continue;
        }
        if (linked >= 4) continue;
        const canonical = TERM_INDEX.get(m[0].toLowerCase());
        if (!canonical) continue;
        out.push(text.slice(last, m.index));
        out.push(
          <button
            key={`t${pi}-${m.index}`}
            onClick={() => openTerm(canonical)}
            className="cursor-help border-b border-dotted border-faint/70 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {m[0]}
          </button>,
        );
        last = m.index + m[0].length;
        linked++;
      }
      out.push(text.slice(last));
      return out;
    },
    [openTerm],
  );

  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? 'mt-3' : ''}>
          {render(p, i)}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                               */
/* ------------------------------------------------------------------ */

export function Matrix({
  head,
  children,
  className = '',
}: {
  head: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={'-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 ' + className}>
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>{head}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({
  children,
  className = '',
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <th
      title={title}
      onClick={onClick}
      className={`pk-num border-b border-line pb-2 pr-3 text-[9.5px] font-medium uppercase tracking-[0.1em] align-bottom ${
        onClick ? 'cursor-pointer select-none hover:text-ink' : ''
      } ${active ? 'text-accent' : 'text-faint'} ${className}`}
    >
      {children}
      {active && <span className="ml-1">▾</span>}
    </th>
  );
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b border-hairline py-2.5 pr-3 align-top text-[12.5px] leading-snug ${className}`}>{children}</td>;
}

/* ------------------------------------------------------------------ */
/* Section scaffolding                                                  */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  n,
  group,
  title,
  dek,
  children,
}: {
  id: string;
  n: number;
  group: string;
  title: string;
  dek: string;
  children: React.ReactNode;
}) {
  const { markVisited } = useApp();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) markVisited(id);
      },
      { rootMargin: '-25% 0px -55% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, markVisited]);

  return (
    <section ref={ref} id={id} className="scroll-mt-20 border-t border-line pt-10 pb-4 first:border-t-0">
      <header className="mb-7">
        <div className="flex items-baseline gap-3">
          <span className="pk-num text-[11px] font-medium tabular-nums text-accent">{String(n).padStart(2, '0')}</span>
          <Eyebrow>{group}</Eyebrow>
        </div>
        <h2 className="mt-2 text-[26px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink sm:text-[30px]">{title}</h2>
        <p className="mt-2.5 max-w-[68ch] text-[14px] leading-[1.6] text-muted">{dek}</p>
      </header>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

export function SubHead({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="mb-3.5">
      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{children}</h3>
      {note && <p className="mt-1 max-w-[70ch] text-[12.5px] leading-relaxed text-muted">{note}</p>}
    </div>
  );
}

/** Editorial callout for the "read this twice" points. */
export function Note({ children, label = 'Founder note' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="border-l-2 border-accent/50 bg-accentsoft/50 py-3 pl-4 pr-4">
      <Eyebrow className="text-accent">{label}</Eyebrow>
      <div className="mt-1.5 text-[13px] leading-[1.65] text-body">{children}</div>
    </div>
  );
}

/** Learning-mode-only preamble. Hidden in Reference mode to raise density. */
export function LearnOnly({ children }: { children: React.ReactNode }) {
  const { mode } = useApp();
  if (mode === 'ref') return null;
  return <div className="pk-fade">{children}</div>;
}

export function RefOnly({ children }: { children: React.ReactNode }) {
  const { mode } = useApp();
  if (mode === 'learn') return null;
  return <div className="pk-fade">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Selectable list + detail — the workhorse layout of this page         */
/* ------------------------------------------------------------------ */

export function SplitList<T extends { id: string }>({
  items,
  selected,
  onSelect,
  renderLabel,
  renderDetail,
  listClass = '',
}: {
  items: T[];
  selected: string;
  onSelect: (id: string) => void;
  renderLabel: (item: T, active: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  listClass?: string;
}) {
  const active = items.find((i) => i.id === selected) ?? items[0];
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      <div className={'max-h-none overflow-y-auto lg:max-h-[560px] ' + listClass}>
        <div className="flex flex-col">
          {items.map((it) => {
            const on = it.id === active.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelect(it.id)}
                className={`border-l-2 py-2 pl-3 pr-2 text-left transition-colors ${
                  on ? 'border-accent bg-raised' : 'border-transparent hover:border-line hover:bg-raised/50'
                }`}
              >
                {renderLabel(it, on)}
              </button>
            );
          })}
        </div>
      </div>
      <Panel className="p-5">
        <div key={active.id} className="pk-fade">
          {renderDetail(active)}
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Knowledge check                                                      */
/* ------------------------------------------------------------------ */

export function KnowledgeCheck({ sectionId, questions }: { sectionId: string; questions: { q: string; a: string; trap?: string }[] }) {
  const { answered, markAnswered } = useApp();
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <div className="rounded-md border border-line bg-raised/60">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
        <Eyebrow>Knowledge check</Eyebrow>
        <span className="pk-num text-[10px] text-faint">
          {questions.filter((_, i) => answered.has(`${sectionId}:${i}`)).length}/{questions.length} revealed
        </span>
      </div>
      <div className="divide-y divide-hairline">
        {questions.map((q, i) => {
          const key = `${sectionId}:${i}`;
          const isOpen = !!open[i];
          return (
            <div key={i} className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="pk-num mt-[3px] text-[10px] text-faint">Q{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] leading-snug font-medium text-ink">{q.q}</p>
                  {!isOpen ? (
                    <button
                      onClick={() => {
                        setOpen((o) => ({ ...o, [i]: true }));
                        markAnswered(key);
                      }}
                      className="pk-num mt-2 rounded-[4px] border border-line px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      Reveal answer
                    </button>
                  ) : (
                    <div className="pk-fade mt-2">
                      <Prose className="text-[12.5px] leading-[1.65] text-body">{q.a}</Prose>
                      {q.trap && (
                        <p className="mt-2 text-[12px] leading-snug text-neg">
                          <span className="pk-num text-[9.5px] uppercase tracking-[0.1em]">Common wrong answer · </span>
                          {q.trap}
                        </p>
                      )}
                      <button
                        onClick={() => setOpen((o) => ({ ...o, [i]: false }))}
                        className="pk-num mt-2 text-[10px] uppercase tracking-[0.08em] text-faint hover:text-ink"
                      >
                        Hide
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                 */
/* ------------------------------------------------------------------ */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; hint?: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          title={t.hint}
          className={`-mb-px border-b-2 px-3 py-2 text-[12.5px] font-medium transition-colors ${
            active === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Chevron({ open }: { open: boolean }) {
  return <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />;
}

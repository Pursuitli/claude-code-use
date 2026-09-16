'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GLOSSARY } from '@/lib/packaging/glossary';
import { THIRTY_THINGS, SMART_QUESTIONS, REVEALING_QUESTIONS } from '@/lib/packaging/cheatsheet';
import { SECTIONS } from '@/lib/packaging/nav';
import type { GlossaryTag } from '@/lib/packaging/types';
import { Eyebrow, Note, Panel, Prose, Section, SubHead, Tabs, useApp } from '../ui';

const meta = (id: string) => SECTIONS.find((s) => s.id === id)!;

const TAGS: { id: GlossaryTag | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'basics', label: 'Basics' },
  { id: 'structure', label: 'Structure' },
  { id: 'process', label: 'Process' },
  { id: 'materials', label: 'Materials' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'memory', label: 'Memory' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'thermal', label: 'Thermal' },
  { id: 'test', label: 'Test' },
  { id: 'economics', label: 'Economics' },
  { id: 'business', label: 'Business' },
];

/* ================================================================== */
/* 17 — Glossary                                                       */
/* ================================================================== */

export function GlossarySection() {
  const m = meta('glossary');
  const [q, setQ] = useState('');
  const [tag, setTag] = useState<GlossaryTag | 'all'>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (tag !== 'all' && !g.tags.includes(tag)) return false;
      if (!needle) return true;
      return (
        g.term.toLowerCase().includes(needle) ||
        (g.aka ?? []).some((a) => a.toLowerCase().includes(needle)) ||
        g.oneLine.toLowerCase().includes(needle) ||
        g.technical.toLowerCase().includes(needle)
      );
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [q, tag]);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <div className="sticky top-[57px] z-20 -mx-1 bg-paper/95 px-1 pt-2 pb-3 backdrop-blur">
        <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
          <Search size={14} className="shrink-0 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${GLOSSARY.length} terms — try "beachfront", "warpage", "allocation"`}
            className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-faint"
          />
          {q && (
            <button onClick={() => setQ('')} className="pk-num shrink-0 text-[10px] text-faint hover:text-ink">
              CLEAR
            </button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {TAGS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTag(t.id)}
              className={`rounded-[4px] border px-2 py-[3px] text-[11px] transition-colors ${
                tag === t.id ? 'border-accent bg-accentsoft text-accent' : 'border-line text-muted hover:border-faint hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
          <span className="pk-num ml-auto self-center text-[10px] text-faint">{items.length} shown</span>
        </div>
      </div>

      <div className="divide-y divide-hairline border-y border-hairline">
        {items.map((g) => {
          const isOpen = !!open[g.term];
          return (
            <div key={g.term} id={`term-${g.term.replace(/\s+/g, '-').toLowerCase()}`} className="py-3">
              <button
                onClick={() => setOpen((o) => ({ ...o, [g.term]: !isOpen }))}
                className="flex w-full items-baseline gap-3 text-left"
              >
                <span className="w-[200px] shrink-0 text-[13px] font-semibold text-ink">
                  {g.term}
                  {g.aka && (
                    <span className="pk-num block text-[10px] font-normal leading-tight text-faint">{g.aka[0]}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1 text-[12.5px] leading-snug text-body">{g.oneLine}</span>
              </button>
              {isOpen && (
                <div className="pk-fade mt-3 grid gap-4 pl-0 sm:grid-cols-2 sm:pl-[212px]">
                  <div>
                    <Eyebrow>Technically</Eyebrow>
                    <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{g.technical}</Prose>
                  </div>
                  <div>
                    <Eyebrow className="text-accent">Why a founder cares</Eyebrow>
                    <Prose className="mt-1 text-[12.5px] leading-relaxed text-body">{g.founder}</Prose>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && <p className="py-8 text-center text-[13px] text-faint">No terms match that search.</p>}
      </div>
    </Section>
  );
}

/* ================================================================== */
/* 18 — Cheat sheet                                                    */
/* ================================================================== */

export function CheatSheetSection() {
  const m = meta('cheatsheet');
  const [view, setView] = useState('thirty');
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const groups = useMemo(() => Array.from(new Set(THIRTY_THINGS.map((t) => t.group))), []);

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <Tabs
        tabs={[
          { id: 'thirty', label: 'The 30 things' },
          { id: 'ask', label: '10 questions to ask' },
          { id: 'reveal', label: '10 questions that reveal understanding' },
        ]}
        active={view}
        onChange={setView}
      />

      {view === 'thirty' && (
        <div className="space-y-8">
          {groups.map((grp) => (
            <div key={grp}>
              <Eyebrow className="mb-3">{grp}</Eyebrow>
              <div className="divide-y divide-hairline border-y border-hairline">
                {THIRTY_THINGS.filter((t) => t.group === grp).map((t) => (
                  <div key={t.n} className="flex gap-4 py-3">
                    <span className="pk-num w-6 shrink-0 pt-[2px] text-right text-[11px] tabular-nums text-accent">{t.n}</span>
                    <div className="min-w-0">
                      <p className="text-[13.5px] leading-snug font-medium text-ink">{t.claim}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{t.because}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'ask' && (
        <>
          <Note label="How to use these">
            These are diagnostic, not rhetorical. Each one is designed so that a vague answer is itself informative — if
            someone cannot tell you their point of no return or their compound yield, that is the finding.
          </Note>
          <div className="mt-4 divide-y divide-hairline border-y border-hairline">
            {SMART_QUESTIONS.map((s, i) => (
              <div key={i} className="flex gap-4 py-3.5">
                <span className="pk-num w-6 shrink-0 pt-[2px] text-right text-[11px] tabular-nums text-accent">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[13.5px] leading-snug font-medium text-ink">&ldquo;{s.q}&rdquo;</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                    <span className="pk-num text-[9.5px] uppercase tracking-[0.1em] text-faint">Why it works · </span>
                    {s.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'reveal' && (
        <>
          <Note label="Test yourself first">
            Answer each one out loud before revealing. If your answer matches the &ldquo;weak answer&rdquo; column, go back to
            the relevant section — the gap is real and it will show in a conversation.
          </Note>
          <div className="mt-4 space-y-2">
            {REVEALING_QUESTIONS.map((r, i) => (
              <Panel key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <span className="pk-num w-6 shrink-0 pt-[2px] text-right text-[11px] tabular-nums text-accent">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] leading-snug font-medium text-ink">{r.q}</p>
                    {!revealed[i] ? (
                      <button
                        onClick={() => setRevealed((o) => ({ ...o, [i]: true }))}
                        className="pk-num mt-2 rounded-[4px] border border-line px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.08em] text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        Reveal
                      </button>
                    ) : (
                      <div className="pk-fade mt-2.5 grid gap-3 sm:grid-cols-2">
                        <div className="border-l-2 border-pos/50 pl-3">
                          <Eyebrow className="text-pos">Strong answer</Eyebrow>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-body">{r.good}</p>
                        </div>
                        <div className="border-l-2 border-neg/50 pl-3">
                          <Eyebrow className="text-neg">Weak answer</Eyebrow>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-body">{r.bad}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}

      <Closing />
    </Section>
  );
}

function Closing() {
  const { answered } = useApp();
  return (
    <Panel tone="sunk" className="p-5">
      <Eyebrow>Where to go next</Eyebrow>
      <div className="mt-2.5 max-w-[76ch] space-y-3 text-[13px] leading-[1.7] text-body">
        <p>
          This manual gets you to roughly the halfway mark: enough to follow a technical conversation, read industry news
          critically, and tell a real bottleneck from a marketed one. The second half is not readable — it is acquired by
          talking to people who run lines.
        </p>
        <p>
          Three concrete next steps, in order of value per hour. Visit a back-end line (Penang is a two-hour flight and the
          density of relevant operators there is higher than anywhere else in Southeast Asia). Open a conversation with A*STAR
          IME about their advanced packaging programmes — a pilot line you do not have to build is the single largest capital
          saving available to a hardware founder in Singapore. And pick one bottleneck from section 16, then spend a month
          trying to disprove that it is a business; the ones that survive that treatment are the ones worth your next five
          years.
        </p>
        <p className="text-muted">
          {answered.size > 0
            ? `You have revealed ${answered.size} knowledge-check answers so far. The ones you got wrong are more informative than the ones you got right — go back to those sections.`
            : 'You have not worked through the knowledge checks yet. They are the fastest way to find out what you have actually absorbed rather than merely read.'}
        </p>
      </div>
    </Panel>
  );
}

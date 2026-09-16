'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, LayoutGrid, Menu, Moon, Sun, X } from 'lucide-react';
import { SECTIONS, GROUPS } from '@/lib/packaging/nav';
import { TOTAL_QUESTIONS } from '@/lib/packaging/quizzes';
import { GLOSSARY } from '@/lib/packaging/glossary';
import { AppContext, Eyebrow, type Mode } from './ui';

const LS_KEY = 'pk-manual-state-v1';

interface Persisted {
  mode: Mode;
  theme: 'light' | 'dark';
  answered: string[];
  visited: string[];
}

function load(): Partial<Persisted> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('learn');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(SECTIONS[0].id);
  const [navOpen, setNavOpen] = useState(false);
  const [term, setTerm] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* ---- persistence ---- */
  useEffect(() => {
    const s = load();
    if (s.mode) setMode(s.mode);
    if (s.theme) setTheme(s.theme);
    if (s.answered) setAnswered(new Set(s.answered));
    if (s.visited) setVisited(new Set(s.visited));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({ mode, theme, answered: [...answered], visited: [...visited] }),
      );
    } catch {
      /* private mode, quota — the page works without persistence */
    }
  }, [mode, theme, answered, visited, hydrated]);

  const markAnswered = useCallback((k: string) => setAnswered((s) => (s.has(k) ? s : new Set(s).add(k))), []);
  const markVisited = useCallback((id: string) => {
    setActive(id);
    setVisited((s) => (s.has(id) ? s : new Set(s).add(id)));
  }, []);

  /* ---- progress: 40% for coverage, 60% for recall, capped at the stated 50% ---- */
  const progress = useMemo(() => {
    const coverage = visited.size / SECTIONS.length;
    const recall = answered.size / TOTAL_QUESTIONS;
    return Math.min(50, (coverage * 0.4 + recall * 0.6) * 50);
  }, [visited, answered]);

  const entry = term ? GLOSSARY.find((g) => g.term === term) : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTerm(null);
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const ctx = useMemo(
    () => ({ mode, setMode, answered, markAnswered, visited, markVisited, openTerm: setTerm }),
    [mode, answered, markAnswered, visited, markVisited],
  );

  return (
    <AppContext.Provider value={ctx}>
      <div className={`pk-root min-h-screen ${theme === 'dark' ? 'pk-dark' : ''}`}>
        {/* ================= top bar ================= */}
        <header className="pk-noprint sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setNavOpen(true)}
              className="-ml-1 rounded p-1.5 text-muted hover:text-ink lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={17} />
            </button>

            <div className="min-w-0">
              <div className="truncate text-[13.5px] leading-tight font-semibold tracking-[-0.01em] text-ink">
                Advanced Packaging
              </div>
              <div className="pk-num hidden text-[9.5px] leading-tight tracking-[0.1em] text-faint sm:block">
                A FOUNDER OPERATING MANUAL
              </div>
            </div>

            {/* progress meter */}
            <div className="ml-auto hidden min-w-[210px] items-center gap-2.5 md:flex">
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="pk-num text-[9.5px] uppercase tracking-[0.1em] text-faint">Founder knowledge</span>
                  <span className="pk-num text-[11px] tabular-nums font-medium text-accent">
                    {progress.toFixed(0)}<span className="text-faint">/50%</span>
                  </span>
                </div>
                <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-sunk">
                  <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(progress / 50) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* mode toggle */}
            <div className="flex shrink-0 rounded-[5px] border border-line p-[2px]">
              {(
                [
                  ['learn', 'Learning', BookOpen],
                  ['ref', 'Reference', LayoutGrid],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  title={
                    id === 'learn'
                      ? 'Learning mode — sequential explanations, plain-English first'
                      : 'Reference mode — hides the teaching scaffolding, raises information density'
                  }
                  className={`pk-num inline-flex items-center gap-1.5 rounded-[3px] px-2 py-[4px] text-[10px] font-medium uppercase tracking-[0.07em] transition-colors ${
                    mode === id ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                  }`}
                >
                  <Icon size={11} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="shrink-0 rounded p-1.5 text-muted transition-colors hover:text-ink"
              aria-label="Toggle colour scheme"
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        </header>

        <div className="mx-auto flex max-w-[1500px] gap-8 px-4 sm:px-6">
          {/* ================= left rail ================= */}
          <nav className="pk-noprint sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[228px] shrink-0 overflow-y-auto py-8 pr-2 lg:block">
            <NavList active={active} visited={visited} onNavigate={() => {}} />
            <Legend />
          </nav>

          {/* ================= mobile drawer ================= */}
          {navOpen && (
            <div className="pk-noprint fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-ink/40" onClick={() => setNavOpen(false)} />
              <div className="pk-fade absolute inset-y-0 left-0 w-[280px] overflow-y-auto border-r border-line bg-paper p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Eyebrow>Contents</Eyebrow>
                  <button onClick={() => setNavOpen(false)} className="text-muted hover:text-ink" aria-label="Close navigation">
                    <X size={16} />
                  </button>
                </div>
                <NavList active={active} visited={visited} onNavigate={() => setNavOpen(false)} />
                <Legend />
              </div>
            </div>
          )}

          {/* ================= main ================= */}
          <main className="min-w-0 max-w-[1120px] flex-1 pb-28">{children}</main>
        </div>

        {/* ================= glossary popover ================= */}
        {entry && (
          <div className="pk-noprint fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal>
            <div className="absolute inset-0 bg-ink/40" onClick={() => setTerm(null)} />
            <div className="pk-fade relative max-h-[80vh] w-full max-w-[620px] overflow-y-auto rounded-t-lg border border-line bg-paper p-5 shadow-xl sm:rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{entry.term}</h3>
                  {entry.aka && <p className="pk-num mt-0.5 text-[10.5px] text-faint">also: {entry.aka.join(' · ')}</p>}
                </div>
                <button onClick={() => setTerm(null)} className="text-muted hover:text-ink" aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed font-medium text-body">{entry.oneLine}</p>
              <div className="mt-4 space-y-4 border-t border-hairline pt-4">
                <div>
                  <Eyebrow>Technically</Eyebrow>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-body">{entry.technical}</p>
                </div>
                <div>
                  <Eyebrow className="text-accent">Why a founder cares</Eyebrow>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-body">{entry.founder}</p>
                </div>
              </div>
              <a
                href="#glossary"
                onClick={() => setTerm(null)}
                className="pk-num mt-5 inline-block text-[10px] uppercase tracking-[0.08em] text-faint hover:text-accent"
              >
                See all {GLOSSARY.length} terms →
              </a>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

function NavList({ active, visited, onNavigate }: { active: string; visited: Set<string>; onNavigate: () => void }) {
  return (
    <div className="space-y-5">
      {GROUPS.map((g) => {
        const items = SECTIONS.filter((s) => s.group === g);
        if (!items.length) return null;
        return (
          <div key={g}>
            <Eyebrow className="mb-1.5">{g}</Eyebrow>
            <ul className="space-y-[1px]">
              {items.map((s) => {
                const on = s.id === active;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={onNavigate}
                      className={`group flex items-center gap-2 border-l-2 py-[5px] pl-2.5 pr-1 text-[12.5px] leading-snug transition-colors ${
                        on ? 'border-accent font-medium text-ink' : 'border-transparent text-muted hover:border-line hover:text-ink'
                      }`}
                    >
                      <span className={`pk-num text-[9.5px] tabular-nums ${on ? 'text-accent' : 'text-faint'}`}>
                        {String(s.n).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{s.short}</span>
                      {visited.has(s.id) && <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-pos/70" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-8 border-t border-hairline pt-4">
      <Eyebrow className="mb-2">Confidence labels</Eyebrow>
      <ul className="space-y-2 text-[11px] leading-snug text-muted">
        {(
          [
            ['FACT', 'border-pos/30 text-pos', 'published spec or filing'],
            ['EST', 'border-mid/30 text-mid', 'industry estimate or range'],
            ['MODEL', 'border-line text-faint', 'illustrative arithmetic'],
          ] as const
        ).map(([k, cls, desc]) => (
          <li key={k} className="flex items-center gap-2">
            <span className={`pk-num shrink-0 rounded-[3px] border px-1 py-[1px] text-[9px] leading-[13px] ${cls}`}>{k}</span>
            <span className="min-w-0">{desc}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10.5px] leading-snug text-faint">
        Dotted terms open the glossary. Progress is stored in your browser only.
      </p>
    </div>
  );
}

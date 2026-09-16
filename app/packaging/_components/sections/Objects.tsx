'use client';

import React, { useState } from 'react';
import { SECTIONS } from '@/lib/packaging/nav';
import { QUIZZES } from '@/lib/packaging/quizzes';
import { Eyebrow, KnowledgeCheck, LearnOnly, Note, Panel, Section, SubHead, Tabs } from '../ui';
import { Photo } from '../Figure';
import { FabLoopDiagram, FAB_LOOP, ScaleLadder, SCALE_RUNGS, TransistorDiagram, WaferDiagram } from '../primer';

const m = SECTIONS.find((s) => s.id === 'objects')!;
const quiz = QUIZZES.find((q) => q.sectionId === 'objects')!.questions;

export function ObjectsSection() {
  const [rung, setRung] = useState('die');
  const [loop, setLoop] = useState(2);
  const [view, setView] = useState('transistor');
  const r = SCALE_RUNGS.find((x) => x.id === rung)!;

  return (
    <Section id={m.id} n={m.n} group={m.group} title={m.title} dek={m.dek}>
      <LearnOnly>
        <Note label="Why this section is here at all">
          The rest of this manual talks fluently about wafers, dies and fabs. If you have never held one of these things or
          seen one made, that vocabulary stays abstract and everything built on top of it stays abstract too. Five minutes
          here makes the next four hours land.
        </Note>
      </LearnOnly>

      {/* ---------- scale ---------- */}
      <div>
        <SubHead note="Click any rung. The industry spans roughly ten orders of magnitude, and almost every confusion in it comes from mixing up two of them.">
          The scale ladder
        </SubHead>
        <Panel className="p-4">
          <ScaleLadder active={rung} onSelect={setRung} />
          <div key={r.id} className="pk-fade mt-3 border-t border-hairline pt-3">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-[14px] font-semibold text-ink">{r.label}</span>
              <span className="pk-num text-[11px] text-accent">{r.size}</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-body">{r.note}</p>
          </div>
        </Panel>
      </div>

      {/* ---------- what the things are ---------- */}
      <div>
        <SubHead note="Three objects, in the order they exist.">What each thing actually is</SubHead>
        <Tabs
          tabs={[
            { id: 'transistor', label: '1 · A transistor' },
            { id: 'wafer', label: '2 · A wafer' },
            { id: 'fab', label: '3 · What a fab does' },
          ]}
          active={view}
          onChange={setView}
        />
        <Panel className="mt-4 p-4">
          {view === 'transistor' && (
            <div className="pk-fade">
              <TransistorDiagram />
              <div className="mt-3 grid gap-4 border-t border-hairline pt-3 sm:grid-cols-2">
                <p className="text-[12.5px] leading-relaxed text-body">
                  A transistor is an electrically operated switch with no moving parts. A voltage on the{' '}
                  <strong className="font-medium text-ink">gate</strong> either allows or blocks current between the{' '}
                  <strong className="font-medium text-ink">source</strong> and the{' '}
                  <strong className="font-medium text-ink">drain</strong>. That is the entire device.
                </p>
                <p className="text-[12.5px] leading-relaxed text-body">
                  Everything a computer does is built from billions of these switching billions of times a second. &ldquo;3
                  nm&rdquo; is a marketing name for a generation of them, not a measurement of anything on the device —
                  which is worth knowing before anyone quotes node numbers at you.
                </p>
              </div>
            </div>
          )}
          {view === 'wafer' && (
            <div className="pk-fade">
              <WaferDiagram />
              <div className="mt-3 grid gap-4 border-t border-hairline pt-3 sm:grid-cols-2">
                <p className="text-[12.5px] leading-relaxed text-body">
                  Silicon is grown as a single cylindrical crystal, sliced into discs 300 mm across and under a millimetre
                  thick, and polished to a mirror. Every chip in the world starts as one of these.
                </p>
                <p className="text-[12.5px] leading-relaxed text-body">
                  Chips are built <em className="italic text-ink">hundreds at a time</em> on one wafer, which is why cost is
                  quoted per wafer and why die size matters so much: a bigger die means fewer per wafer, and — as the
                  economics section shows — disproportionately more of them defective.
                </p>
              </div>
            </div>
          )}
          {view === 'fab' && (
            <div className="pk-fade">
              <FabLoopDiagram active={loop} onSelect={setLoop} />
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-hairline pt-3">
                {FAB_LOOP.map((s, i) => (
                  <button
                    key={s.k}
                    onClick={() => setLoop(i)}
                    className={`rounded-[4px] border px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                      i === loop ? 'border-accent bg-accentsoft text-accent' : 'border-line text-muted hover:border-faint hover:text-ink'
                    }`}
                  >
                    {s.k}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-body">
                A fab does not &ldquo;print a chip&rdquo;. It repeats this loop a thousand times, building the device up in
                layers a few atoms thick. Three to four months per wafer, in a room cleaner than an operating theatre.
                Hold that picture and the phrase &ldquo;advanced packaging is done in a fab now&rdquo; stops sounding like
                a detail and starts sounding like the capital-expenditure problem it is.
              </p>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Photo id="wafer" />
        <Panel tone="sunk" className="p-4">
          <Eyebrow>The handover</Eyebrow>
          <p className="mt-2 text-[13px] leading-relaxed text-body">
            At the end of all that you have a wafer covered in finished circuits that cannot connect to anything, cannot be
            handled, cannot shed heat and will crack if you look at them wrongly.
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-body">
            Everything from here on — the rest of this manual — is about the second half of the problem: turning that into
            something you can put in a computer. That second half is now the harder and more valuable one.
          </p>
        </Panel>
      </div>

      <KnowledgeCheck sectionId="objects" questions={quiz} />
    </Section>
  );
}

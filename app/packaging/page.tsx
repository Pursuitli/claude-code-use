'use client';

import React from 'react';
import { Shell } from './_components/Shell';
import { Eyebrow } from './_components/ui';
import { ObjectsSection } from './_components/sections/Objects';
import { FundamentalsSection, ValueChainSection } from './_components/sections/Fundamentals';
import { LadderSection, AnatomySection, CowosSection, HbmSection } from './_components/sections/Technology';
import { ProcessSection, MaterialsSection, EquipmentSection } from './_components/sections/Manufacturing';
import { EconomicsSection, QualificationSection } from './_components/sections/Economics';
import { PlayersSection, GeographySection, CustomersSection } from './_components/sections/Ecosystem';
import { OpportunitiesSection, BottlenecksSection } from './_components/sections/Opportunity';
import { GlossarySection, CheatSheetSection } from './_components/sections/Reference';
import { GLOSSARY } from '@/lib/packaging/glossary';
import { TOTAL_QUESTIONS } from '@/lib/packaging/quizzes';
import { SECTIONS } from '@/lib/packaging/nav';

function Masthead() {
  return (
    <header className="border-b border-line pt-10 pb-10">
      <Eyebrow>Semiconductor advanced packaging · operating manual</Eyebrow>
      <h1 className="mt-3 max-w-[19ch] text-[34px] leading-[1.06] font-semibold tracking-[-0.03em] text-ink sm:text-[46px]">
        The industry that decides how fast AI can grow.
      </h1>
      <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.7] text-body">
        Written for someone who is commercially strong and has no engineering background — and who intends to end up able to
        argue with a packaging engineer, challenge a founder&apos;s thesis, and form their own view on where the money moves
        next. It starts in plain English and does not stay there.
      </p>
      <p className="mt-3 max-w-[70ch] text-[13.5px] leading-[1.7] text-muted">
        This is a compressed primer, not an explainer. Expect to spend three to five hours inside it, to be uncomfortable
        somewhere around section four, and to come back to the yield lab and the opportunity matrix more than once. Every
        number carries a confidence label, because you are going to build opinions on this material.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-4">
        {[
          ['Sections', String(SECTIONS.length), true],
          ['Knowledge checks', String(TOTAL_QUESTIONS), true],
          ['Glossary terms', String(GLOSSARY.length), true],
          ['Target', 'Roughly half of what a founder needs', false],
        ].map(([k, v, mono]) => (
          <div key={k as string}>
            <Eyebrow>{k}</Eyebrow>
            <div className={`mt-1.5 leading-tight font-medium text-ink ${mono ? 'pk-num text-[19px]' : 'text-[13px] leading-snug'}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-l-2 border-accent/50 bg-accentsoft/50 py-3 pl-4 pr-4">
        <Eyebrow className="text-accent">Two controls worth knowing before you start</Eyebrow>
        <p className="mt-1.5 max-w-[74ch] text-[13px] leading-[1.65] text-body">
          <strong className="font-medium text-ink">Learning ⇄ Reference</strong> in the top bar switches between sequential
          teaching and a dense dashboard that strips the scaffolding out. Throughout the page,{' '}
          <strong className="font-medium text-ink">Simple ⇄ Founder depth</strong> toggles sit on every hard concept — start
          simple, then read the same idea again at depth. Dotted terms open the glossary in place.
        </p>
      </div>
    </header>
  );
}

function Colophon() {
  return (
    <footer className="mt-16 border-t border-line pt-8 pb-6">
      <Eyebrow>On sourcing and honesty</Eyebrow>
      <div className="mt-3 max-w-[76ch] space-y-3 text-[12.5px] leading-[1.7] text-muted">
        <p>
          Figures labelled <span className="pk-num text-pos">FACT</span> are published specifications or otherwise checkable.{' '}
          <span className="pk-num text-mid">EST</span> means an industry estimate, analyst consensus or reported range —
          directionally useful, not precise, and frequently stale within a quarter.{' '}
          <span className="pk-num text-faint">MODEL</span> means arithmetic constructed here to demonstrate a mechanism; the
          yield lab and the bill of materials are both models, and their purpose is to teach the shape of the relationship
          rather than to predict anyone&apos;s cost.
        </p>
        <p>
          Company positioning, scoring and the startup-opportunity verdicts are judgements. They are stated with conviction
          because hedged analysis is useless, not because they are certain. The scores are meant to be argued with, and the
          most valuable thing you can do with the opportunity matrix is disagree with a row and be able to say why.
        </p>
        <p>
          All content lives in structured data files under <span className="pk-num text-body">lib/packaging/</span>, separate
          from the components that render it, so that any figure which drifts can be corrected in one place.
        </p>
      </div>
    </footer>
  );
}

export default function PackagingPage() {
  return (
    <Shell>
      <Masthead />
      <ObjectsSection />
      <FundamentalsSection />
      <ValueChainSection />
      <LadderSection />
      <AnatomySection />
      <CowosSection />
      <HbmSection />
      <ProcessSection />
      <MaterialsSection />
      <EquipmentSection />
      <EconomicsSection />
      <QualificationSection />
      <PlayersSection />
      <GeographySection />
      <CustomersSection />
      <OpportunitiesSection />
      <BottlenecksSection />
      <GlossarySection />
      <CheatSheetSection />
      <Colophon />
    </Shell>
  );
}

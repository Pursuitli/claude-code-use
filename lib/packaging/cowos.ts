import type { Depth, Score } from './types';

export const COWOS_MEANING: Depth = {
  simple:
    '"Chip on Wafer on Substrate". The chips are attached to a wafer-sized slab of silicon first, and that whole thing is then attached to a package substrate. It is TSMC\'s brand name for putting a processor and its memory side by side on an ultra-fine wiring layer.',
  founder:
    'The name is the process order, and the process order is the differentiator. Chip-on-Wafer: known-good compute dies and known-good HBM stacks are bonded onto an interposer *wafer* while it is still whole, so placement, underfill, moulding and thinning all happen with wafer-scale tooling and wafer-scale handling. Wafer-on-Substrate: the interposer is then thinned to reveal its TSVs, singulated, and flip-chip attached to a large ABF substrate, with stiffener and lid added. Doing chip-on-wafer first is what makes the economics work — you use fab equipment and fab process control on a step that an OSAT would otherwise do unit by unit — and it is also what makes capacity so hard to add, because every one of those steps needs cleanroom space and fab-class tools.',
};

export const COWOS_VARIANTS: {
  id: string;
  name: string;
  interposer: string;
  introduced: string;
  maxSize: string;
  density: Score;
  cost: Score;
  bestFor: string;
  detail: string;
  users: string;
}[] = [
  {
    id: 's',
    name: 'CoWoS-S',
    interposer: 'Monolithic silicon interposer with TSVs',
    introduced: '2012',
    maxSize: 'Historically up to ~2.5–3.3× reticle via stitching',
    density: 5,
    cost: 4,
    bestFor: 'Maximum interconnect density; the original HBM platform.',
    detail:
      'The classic 2.5D build: a full silicon interposer, damascene copper routing, TSVs down to the substrate. Highest routing density and the best-characterised reliability, but the interposer is expensive silicon that performs no computation, and size is capped by how many reticle fields you can stitch before yield collapses. Every extra square millimetre of interposer is silicon area that must yield perfectly to avoid scrapping dies already bonded to it.',
    users: 'Most HBM-era accelerators through roughly the H100 generation.',
  },
  {
    id: 'r',
    name: 'CoWoS-R',
    interposer: 'RDL (polymer) interposer — no TSV silicon',
    introduced: '~2019–2020',
    maxSize: 'Larger bodies than -S; no reticle stitching constraint',
    density: 3,
    cost: 2,
    bestFor: 'Cost-sensitive designs that do not need maximum density.',
    detail:
      'Replaces silicon with a fine-line organic redistribution structure — roughly 2 µm line/space instead of sub-µm. Cheaper, mechanically more forgiving of large bodies, and free of the reticle ceiling. The trade-offs are lower routing density, higher dielectric loss, and harder warpage control because polymer CTE does not match silicon. Good enough for many designs; marginal for the maximum-HBM-count flagships.',
    users: 'Networking silicon, cost-optimised accelerators, some HPC parts.',
  },
  {
    id: 'l',
    name: 'CoWoS-L',
    interposer: 'RDL interposer with embedded Local Silicon Interconnect bridges',
    introduced: '~2023',
    maxSize: 'Roadmapped past 5.5× reticle equivalent',
    density: 5,
    cost: 4,
    bestFor: 'The largest AI packages — multiple compute dies plus 8–12 HBM stacks.',
    detail:
      'The synthesis: silicon-grade density exactly where dies meet (via small embedded LSI bridge tiles) and cheap organic routing everywhere else. It sidesteps the reticle limit because the RDL carrier has no stepper ceiling, and it avoids paying for thousands of square millimetres of silicon. The price is process complexity — the bridges must be embedded and positioned to fab tolerances inside a moulded/RDL structure, and any misplacement is unrecoverable. CoWoS-L is where flagship AI capacity is concentrating, which is why its ramp rate is the number to watch.',
    users: 'Blackwell-class and successor accelerators; the largest custom hyperscaler ASICs.',
  },
];

export const COWOS_WHY_STRATEGIC: string[] = [
  'It is the only qualified, high-volume path to putting 6–12 HBM stacks next to multiple reticle-sized compute dies. There is no drop-in substitute with equivalent maturity.',
  'It is single-sourced in practice for flagship parts. Samsung and Intel have credible alternatives; the qualification cost of moving a shipping product is measured in quarters and tens of millions of dollars.',
  'Its capacity is contracted years ahead. When people say "CoWoS capacity", they mean allocated wafer starts per month, not spare machines.',
  'It converts a packaging step into an allocation mechanism. Whoever gets CoWoS slots ships accelerators; whoever does not, does not — regardless of how good their silicon design is.',
  'It changed the industry\'s margin geography: a step that used to be a 20%-gross-margin OSAT service became a foundry-margin product.',
];

/** Illustrative capacity trajectory. Widely reported analyst estimates — directionally right, not audited. */
export const COWOS_CAPACITY: { period: string; wpm: number; note: string }[] = [
  { period: 'End 2022', wpm: 9000, note: 'Pre-ChatGPT baseline; served HPC, FPGA and networking.' },
  { period: 'End 2023', wpm: 15000, note: 'First AI-driven scramble; allocation becomes the constraint.' },
  { period: 'End 2024', wpm: 35000, note: 'Roughly a doubling; still short of stated demand.' },
  { period: 'End 2025', wpm: 70000, note: 'Aggressive build-out including new fabs and outsourced steps.' },
  { period: 'End 2026 (planned)', wpm: 110000, note: 'Planned; subject to substrate and equipment delivery.' },
];

export const COWOS_SUPPLY_NODES: {
  id: string;
  name: string;
  role: string;
  suppliers: string;
  constrained: 'high' | 'medium' | 'low';
  why: string;
}[] = [
  {
    id: 'logic',
    name: 'Compute die wafers',
    role: 'Leading-edge logic from the foundry',
    suppliers: 'TSMC (N4/N3 class)',
    constrained: 'medium',
    why: 'Leading-edge capacity is large and was expanded ahead of demand; rarely the binding constraint for AI parts.',
  },
  {
    id: 'hbmsupply',
    name: 'HBM stacks',
    role: 'Memory, pre-stacked and tested by the DRAM maker',
    suppliers: 'SK hynix, Samsung, Micron',
    constrained: 'high',
    why: 'HBM consumes ~2–3× the wafer area per bit of commodity DRAM, plus TSV and stacking capacity, plus test time. Sold out well in advance.',
  },
  {
    id: 'interposerw',
    name: 'Interposer / RDL carriers',
    role: 'The fine-wiring plane itself',
    suppliers: 'TSMC, with UMC and others supplying silicon interposers',
    constrained: 'medium',
    why: 'Expanded substantially; bridge-based variants reduce silicon demand per package but add process steps.',
  },
  {
    id: 'abf',
    name: 'Large-body ABF substrates',
    role: 'The laminate the whole assembly sits on',
    suppliers: 'Ibiden, Shinko, Unimicron, Nan Ya, AT&S, Kyocera',
    constrained: 'high',
    why: 'Very large, high-layer-count bodies yield poorly; capacity additions take 2–3 years and suppliers are scarred by the 2022–23 over-build.',
  },
  {
    id: 'abffilm',
    name: 'ABF dielectric film',
    role: 'The build-up dielectric inside the substrate',
    suppliers: 'Ajinomoto Fine-Techno (near-monopoly)',
    constrained: 'medium',
    why: 'A single specialty supplier for effectively the entire high-end market. Not currently the binding constraint, but a systemic single point of failure.',
  },
  {
    id: 'bonders',
    name: 'Bonding & assembly tools',
    role: 'TCB and hybrid bonders, moulders, platers',
    suppliers: 'ASMPT, BESI, Applied Materials, K&S, TOWA',
    constrained: 'medium',
    why: 'Tool lead times of 9–18 months; hybrid bonder throughput is the structural limiter on the next generation.',
  },
  {
    id: 'testcap',
    name: 'Test capacity',
    role: 'Wafer probe, HBM stack test, final and system-level test',
    suppliers: 'Advantest, Teradyne, KYEC, in-house lines',
    constrained: 'high',
    why: 'Test time per part keeps rising as packages get more complex; high-end tester supply has been a reported gate on HBM output.',
  },
  {
    id: 'cleanroom',
    name: 'Cleanroom floor space & people',
    role: 'The physical plant and the engineers who run it',
    suppliers: 'TSMC AP fabs, outsourced partners (ASE/SPIL, Amkor)',
    constrained: 'high',
    why: 'The least discussed and most binding: an advanced packaging fab takes ~2 years to build and needs process engineers who do not exist in surplus anywhere.',
  },
];

export const WHY_CAPACITY_IS_HARD: {
  reason: string;
  detail: string;
}[] = [
  {
    reason: 'It is a fab, not a factory floor',
    detail:
      'Advanced packaging needs Class 100–1000 cleanroom, lithography, plating, CMP, deposition and metrology. Construction plus tool install plus qualification runs roughly 18–30 months from decision to first qualified output — and that assumes the tools arrive on time.',
  },
  {
    reason: 'Equipment lead times are long and lumpy',
    detail:
      'Steppers, bonders and platers have 9–18 month lead times. If everyone expands at once, the equipment makers become the constraint — which is exactly what happened in 2023–24.',
  },
  {
    reason: 'Qualification is per-product, not per-line',
    detail:
      'A new line is not fungible with an existing one. Each customer product must be re-qualified on the new line: reliability testing, characterisation, and customer sign-off take months even when the line is physically ready.',
  },
  {
    reason: 'Yield learning is site-specific',
    detail:
      'A new advanced packaging line does not start at the mature line\'s yield. Ramping a large-body 2.5D process from first silicon to mature yield takes quarters, and early output is expensive scrap.',
  },
  {
    reason: 'The supply chain must expand in lockstep',
    detail:
      'Interposer capacity is useless without substrates, HBM, bonders and testers arriving at the same time. The system moves at the pace of its slowest element, and that element keeps changing.',
  },
  {
    reason: 'Nobody wants to own the cycle risk',
    detail:
      'The most important reason, and the least technical. Substrate makers earn 15–25% gross margin and remember the 2022–23 glut vividly. They will not build speculative capacity for a customer earning 70% margin unless that customer prepays or guarantees volume. Expect prepayments, take-or-pay contracts and equity investments — and read them as the real signal about who believes the demand.',
  },
];

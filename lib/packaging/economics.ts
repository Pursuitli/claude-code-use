import type { Confidence, Depth } from './types';

/**
 * Illustrative bill of materials for one flagship-class AI accelerator package
 * (two reticle-class compute dies + 8 HBM3E stacks on a bridge interposer).
 *
 * These are *manufactured cost* estimates assembled from public analyst
 * commentary and first-principles arithmetic — not a vendor disclosure. They
 * exist to teach the shape of the cost stack, which is stable, rather than the
 * exact numbers, which are not.
 */
export const BOM_ITEMS: {
  id: string;
  name: string;
  low: number;
  high: number;
  confidence: Confidence;
  basis: string;
  category: 'silicon' | 'memory' | 'packaging' | 'test' | 'other';
}[] = [
  {
    id: 'logic',
    name: 'Compute dies (2 × ~800 mm², N4-class)',
    low: 500,
    high: 900,
    confidence: 'model',
    basis:
      '~$16–18k per 300 mm wafer ÷ ~70 gross die ÷ ~70% die yield ≈ $330–370 per good die; two per package. Counter-intuitive but important: the leading-edge silicon is not the expensive part.',
    category: 'silicon',
  },
  {
    id: 'hbm',
    name: 'HBM3E (8 stacks × 24 GB)',
    low: 2400,
    high: 3600,
    confidence: 'est',
    basis:
      'Reported contract pricing roughly $300–450 per 24 GB stack during the tight period. Typically the single largest line in the BOM — usually more than everything else combined.',
    category: 'memory',
  },
  {
    id: 'interposer',
    name: 'Interposer / RDL carrier with bridges',
    low: 180,
    high: 400,
    confidence: 'est',
    basis: 'Large multi-reticle carrier, thinned and TSV-revealed or bridge-embedded. Scales with area and with stitch count.',
    category: 'packaging',
  },
  {
    id: 'substrate',
    name: 'Large-body ABF substrate (18–24 layer)',
    low: 80,
    high: 200,
    confidence: 'est',
    basis: 'Very large body, high layer count, poor yield. Cheap per unit relative to its power as a bottleneck.',
    category: 'packaging',
  },
  {
    id: 'assembly',
    name: 'Assembly services (CoWoS-class flow)',
    low: 250,
    high: 600,
    confidence: 'est',
    basis: 'Bonding, underfill, moulding, thinning, substrate attach, lid attach — plus the foundry\'s margin on a scarce process.',
    category: 'packaging',
  },
  {
    id: 'lid',
    name: 'Lid, stiffener, TIM1',
    low: 20,
    high: 60,
    confidence: 'model',
    basis: 'Small cost, disproportionate influence on achievable clock speed.',
    category: 'other',
  },
  {
    id: 'test',
    name: 'Test, burn-in, binning',
    low: 150,
    high: 400,
    confidence: 'est',
    basis: 'Long test times on multi-million-dollar testers, plus system-level test on high-value parts.',
    category: 'test',
  },
  {
    id: 'scrap',
    name: 'Yield loss & scrap allocation',
    low: 300,
    high: 900,
    confidence: 'model',
    basis:
      'The cost of packages that fail after good components were committed to them. Highly sensitive to assembly yield — which is exactly what the yield lab below lets you play with.',
    category: 'packaging',
  },
];

export const BOM_CONTEXT = {
  asp: '$25,000–40,000',
  aspNote: 'Estimated street/contract price for a flagship accelerator module — varies enormously by customer, volume and configuration.',
  takeaways: [
    'Memory is usually the largest single line in the BOM — often larger than the compute silicon by a factor of four or more. The company whose name is on the box is not the company capturing most of the component cost.',
    'Packaging plus memory typically accounts for the large majority of manufactured cost. Leading-edge logic silicon, the thing everybody talks about, is a minority of it.',
    'Gross margin at the accelerator vendor is created by architecture, software and scarcity — not by cheap manufacturing. That is why supply allocation, not cost reduction, is the strategic lever.',
    'A 1% improvement in assembly yield on a package with ~$4,000 of committed components is worth roughly $40 per unit. Across millions of units that is a serious business — and it is why yield-improvement tools sell at high prices.',
  ],
};

export interface YieldInputs {
  chipletCount: number;
  dieYield: number;      // 0–1, probability an individual die is good
  kgdCoverage: number;   // 0–1, fraction of defects caught by pre-assembly test
  assemblyYield: number; // 0–1, per-attach assembly success
  hbmStacks: number;
  hbmStackYield: number; // 0–1, probability a purchased stack is good
  dieCost: number;
  hbmCost: number;
  packagingCost: number;
  reworkable: boolean;
}

export interface YieldResult {
  kgdPassRate: number;      // fraction of dies that pass test (incl. escapes)
  trueGoodGivenPass: number;// P(die actually good | passed test)
  allDiesGood: number;
  assemblySurvival: number;
  hbmAllGood: number;
  packageYield: number;
  naiveYield: number;       // what someone gets wrong: dieYield itself
  committedValue: number;
  costPerGoodPackage: number;
  scrapPerGoodPackage: number;
  yieldGapPoints: number;
}

export const DEFAULT_YIELD_INPUTS: YieldInputs = {
  chipletCount: 8,
  dieYield: 0.99,
  kgdCoverage: 0.98,
  assemblyYield: 0.998,
  hbmStacks: 8,
  hbmStackYield: 0.995,
  dieCost: 330,
  hbmCost: 380,
  packagingCost: 700,
  reworkable: false,
};

/**
 * Compound-yield model.
 *
 * Deliberately simple and transparent: independent defects, no partial repair,
 * no binning recovery. Real lines do better because of redundancy, repair and
 * rework. The point is the exponent, not the decimal places.
 */
export function computeYield(i: YieldInputs): YieldResult {
  const { chipletCount, dieYield, kgdCoverage, assemblyYield, hbmStacks, hbmStackYield } = i;

  // A die ships as "known good" if it is good, or bad but missed by test.
  const escapeRate = (1 - dieYield) * (1 - kgdCoverage);
  const kgdPassRate = dieYield + escapeRate;
  const trueGoodGivenPass = kgdPassRate > 0 ? dieYield / kgdPassRate : 0;

  const allDiesGood = Math.pow(trueGoodGivenPass, chipletCount);
  const hbmAllGood = Math.pow(hbmStackYield, hbmStacks);
  // Each die and each HBM stack is an attach operation that can itself fail.
  const attaches = chipletCount + hbmStacks;
  const assemblySurvival = Math.pow(assemblyYield, attaches);

  const packageYield = allDiesGood * hbmAllGood * assemblySurvival;

  const committedValue =
    chipletCount * (i.dieCost / Math.max(kgdPassRate, 1e-6)) +
    hbmStacks * i.hbmCost +
    i.packagingCost;

  // Rework recovers a share of packages that fail for assembly reasons only.
  const reworkRecovery = i.reworkable ? (1 - assemblySurvival) * 0.5 : 0;
  const effectiveYield = Math.min(0.9999, packageYield + reworkRecovery);

  const costPerGoodPackage = committedValue / Math.max(effectiveYield, 1e-6);
  const scrapPerGoodPackage = costPerGoodPackage - committedValue;

  return {
    kgdPassRate,
    trueGoodGivenPass,
    allDiesGood,
    assemblySurvival,
    hbmAllGood,
    packageYield: effectiveYield,
    naiveYield: dieYield,
    committedValue,
    costPerGoodPackage,
    scrapPerGoodPackage,
    yieldGapPoints: (dieYield - effectiveYield) * 100,
  };
}

export const YIELD_LESSONS: { title: string; body: string }[] = [
  {
    title: 'Yield compounds multiplicatively, and intuition is linear',
    body:
      'Eight dies at 99% each is 0.99⁸ = 92.3%, not 99%. At 95% each it is 66.3%. Every additional die in the package is another multiplication, so the tolerable per-die defect rate falls as you integrate more. This is the single most important number in advanced packaging economics, and it is why chiplet counts do not grow without limit.',
  },
  {
    title: 'Known-good-die is a probability, not a fact',
    body:
      'No test catches everything. If per-die yield is 95% and test coverage is 98%, then 0.1% of shipped dies are secretly bad — and in an eight-die package that is a ~0.8% package loss from escapes alone, each one destroying seven good dies and all the assembly work. Test coverage is therefore worth far more than its cost, which is why test equipment vendors have such durable pricing power.',
  },
  {
    title: 'Value committed before the last test is the real exposure',
    body:
      'By the time HBM stacks are bonded to an interposer, roughly $4,000 of components are committed. A failure there is not a $50 loss, it is a $4,000 loss. This asymmetry drives the entire architecture of the back end: test early, test often, and never commit expensive components to an unverified assembly.',
  },
  {
    title: 'One weak supplier can destroy the package economics',
    body:
      'If HBM stacks arrive at 99.5% good and you use eight, that alone costs 3.9% of packages — about $160 per good unit at these values. Your yield is a function of your worst supplier\'s process control, which is why qualification audits are about their factory, not your line.',
  },
  {
    title: 'Repair and redundancy are the counter-move',
    body:
      'Spare rows in DRAM, spare TSVs, spare compute cores that let a partially defective die be sold into a lower bin, and rework flows that let a failed attach be recovered. Every one of these is an engineering investment made purely to bend the compound-yield curve — and each is a legitimate startup surface.',
  },
];

export const WHY_YIELD_MATTERS: Depth = {
  simple:
    'Yield is the share of things you build that actually work. Because the components in a modern package are so expensive, and because a package fails if any one part fails, small changes in yield swing profitability enormously.',
  founder:
    'Three reasons a point of yield matters more here than almost anywhere else in manufacturing. (1) Value concentration: the components committed to a single assembly cost thousands of dollars, so a percentage point of scrap is tens of dollars per unit — on a product shipping in the millions. (2) Supply elasticity: in an allocation-constrained market, improving yield is the only way to increase sellable units without new capex. A supplier moving from 70% to 80% package yield gains 14% more output immediately, which at these prices is worth more than most companies\' entire revenue. (3) Compounding: because yield is multiplicative across steps, an improvement at any step multiplies the whole chain. The commercial reading is that yield-improvement tools — inspection, metrology, adaptive test, analytics — can be priced against the value of the scrap they prevent rather than against their manufacturing cost. That is the structural reason KLA earns ~60% gross margins and why yield analytics is one of the few genuinely open software markets in this industry.',
};

/**
 * Shared shapes for the packaging manual's content layer.
 *
 * Everything the page renders lives in `lib/packaging/*.ts` as plain data so
 * that a number which drifts (CoWoS capacity, HBM bandwidth, a gross margin)
 * can be corrected in one place without touching a component.
 *
 * Confidence is explicit on purpose. The reader is being asked to build an
 * investment thesis on this material, so every quantity is tagged:
 *   fact  — published spec, filing, or otherwise checkable
 *   est   — industry estimate / analyst consensus / reported range
 *   model — arithmetic invented here to illustrate a mechanism
 */
export type Confidence = 'fact' | 'est' | 'model';

/** 1–5 scored attribute used across the comparison matrices. */
export type Score = 1 | 2 | 3 | 4 | 5;

export interface Metric {
  label: string;
  value: string;
  confidence: Confidence;
  note?: string;
}

/** A two-level explanation: plain English first, founder depth underneath. */
export interface Depth {
  simple: string;
  founder: string;
}

export interface GlossaryEntry {
  term: string;
  aka?: string[];
  oneLine: string;
  technical: string;
  founder: string;
  tags: GlossaryTag[];
}

export type GlossaryTag =
  | 'basics'
  | 'structure'
  | 'process'
  | 'materials'
  | 'equipment'
  | 'memory'
  | 'economics'
  | 'business'
  | 'thermal'
  | 'electrical'
  | 'test';

export interface QuizQuestion {
  q: string;
  a: string;
  /** The trap — what a superficial reader answers instead. */
  trap?: string;
}

export interface SectionQuiz {
  sectionId: string;
  questions: QuizQuestion[];
}

export interface ValueChainLayer {
  id: string;
  name: string;
  what: string;
  detail: string;
  grossMargin: string;
  capitalIntensity: Score;
  switchingCost: Score;
  technicalDifficulty: Score;
  concentration: string;
  concentrationScore: Score;
  startupEntry: Score;
  startupNote: string;
  companies: { name: string; note: string }[];
  valueCapture: string;
}

export interface Technology {
  id: string;
  name: string;
  family: 'legacy' | 'flipchip' | 'wafer-level' | '2.5d' | '3d' | 'platform';
  /** Position on the ladder: 1 = cheapest/simplest, 10 = most advanced. */
  rung: number;
  era: string;
  problem: string;
  how: Depth;
  interconnectPitch: string;
  relativeCost: string;
  costIndex: number;
  densityIndex: number;
  performance: string;
  thermal: string;
  useCases: string[];
  players: string[];
  difficulty: Score;
  gotcha: string;
}

export interface ProcessStep {
  id: string;
  n: number;
  name: string;
  stage: 'wafer' | 'assembly' | 'substrate' | 'final';
  what: string;
  detail: string;
  machine: string;
  vendors: string[];
  failureModes: string[];
  yieldRisk: Score;
  opportunity: string;
  cycleTime?: string;
}

export interface Material {
  id: string;
  name: string;
  purpose: string;
  detail: string;
  suppliers: { name: string; share?: string }[];
  concentration: string;
  concentrationScore: Score;
  bottleneck: string;
  substitutable: string;
  substitutionScore: Score;
  opportunity: string;
  spotlight?: boolean;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  what: string;
  detail: string;
  leaders: { name: string; note?: string }[];
  barrier: Score;
  barrierWhy: string;
  toolPrice: string;
  opportunity: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  ticker?: string;
  hq: string;
  layer: string;
  role: string;
  strengths: string[];
  customers: string[];
  moat: string;
  vulnerabilities: string[];
  doNotCompete: string;
  numbers: Metric[];
}

export interface Region {
  id: string;
  name: string;
  share: string;
  why: string;
  capabilities: string[];
  labor: string;
  talent: string;
  cluster: string;
  geopolitics: string;
  newCapacity: string[];
  x: number;
  y: number;
  weight: Score;
  spotlight?: boolean;
}

export interface CustomerPersona {
  id: string;
  name: string;
  who: string;
  mindset: string;
  priorities: { criterion: string; weight: Score; why: string }[];
  buysFrom: string;
  killCriteria: string;
  salesCycle: string;
}

export interface Opportunity {
  id: string;
  name: string;
  thesis: string;
  tam: string;
  tamScore: Score;
  capital: string;
  capitalScore: Score;
  difficulty: Score;
  timeToRevenue: string;
  timeScore: Score;
  incumbentStrength: Score;
  certificationBarrier: Score;
  founderRequirement: string;
  founderScore: Score;
  successLikelihood: Score;
  wedge: string;
  examples: string[];
  verdict: 'crowded' | 'viable' | 'hard' | 'contrarian';
}

export interface Bottleneck {
  id: string;
  name: string;
  severity: Score;
  status: 'acute' | 'chronic' | 'easing' | 'emerging';
  why: string;
  whoSuffers: string[];
  workaround: string;
  idealSolution: string;
  opportunity: string;
  watchFor: string;
}

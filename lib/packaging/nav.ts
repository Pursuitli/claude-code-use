export interface NavSection {
  id: string;
  n: number;
  title: string;
  short: string;
  group: string;
  dek: string;
}

export const GROUPS = [
  'Fundamentals',
  'Technology',
  'Manufacturing',
  'Economics',
  'Ecosystem',
  'Startup opportunities',
  'Reference',
] as const;

export const SECTIONS: NavSection[] = [
  {
    id: 'fundamentals',
    n: 1,
    title: 'The industry in five minutes',
    short: 'Industry in 5 minutes',
    group: 'Fundamentals',
    dek: 'What packaging is, why a bare die is useless on its own, what separates fabrication from assembly, and the specific mechanism by which AI turned a cost line into a chokepoint.',
  },
  {
    id: 'valuechain',
    n: 2,
    title: 'The value chain, layer by layer',
    short: 'Value chain map',
    group: 'Fundamentals',
    dek: 'Thirteen layers from design software to the data centre, scored on margin, capital intensity, switching cost, concentration and whether a startup can realistically enter.',
  },
  {
    id: 'ladder',
    n: 3,
    title: 'The packaging technology ladder',
    short: 'Technology ladder',
    group: 'Technology',
    dek: 'Sixteen technologies from wire bonding to hybrid bonding, positioned by cost and interconnect density. What each solves, how it works, and where it breaks.',
  },
  {
    id: 'anatomy',
    n: 4,
    title: 'Anatomy of an AI accelerator package',
    short: 'Accelerator anatomy',
    group: 'Technology',
    dek: 'Eleven layers from cold plate to PCB, and the six system-level quantities — bandwidth, energy per bit, signal integrity, power, thermal density, size — that they exist to manage.',
  },
  {
    id: 'cowos',
    n: 5,
    title: 'CoWoS deep dive',
    short: 'CoWoS',
    group: 'Technology',
    dek: 'The platform that rations global AI compute. What the name means, how -S, -R and -L differ, what is actually constrained behind it, and why capacity takes years to add.',
  },
  {
    id: 'hbm',
    n: 6,
    title: 'HBM and the memory wall',
    short: 'HBM & memory',
    group: 'Technology',
    dek: 'Why memory is stacked, why width beats frequency, how a stack is built, why supply sits with three companies, and how stack yield propagates into accelerator economics.',
  },
  {
    id: 'process',
    n: 7,
    title: 'The packaging line, step by step',
    short: 'Process line',
    group: 'Manufacturing',
    dek: 'Fifteen process steps. For each: the machine, the vendors who sell it, what goes wrong, how much yield is at risk, and where a startup could wedge in.',
  },
  {
    id: 'materials',
    n: 8,
    title: 'Materials map',
    short: 'Materials',
    group: 'Manufacturing',
    dek: 'Twelve material systems, their supply concentration and substitutability. Special attention to ABF, glass substrates and thermal interface materials.',
  },
  {
    id: 'equipment',
    n: 9,
    title: 'Equipment landscape',
    short: 'Equipment',
    group: 'Manufacturing',
    dek: 'Twelve tool categories, who dominates each, why the barriers are where they are, and which categories are genuinely open to a new entrant.',
  },
  {
    id: 'economics',
    n: 10,
    title: 'Economics & the yield lab',
    short: 'Economics + yield lab',
    group: 'Economics',
    dek: 'Where the money sits inside a $30,000 accelerator, and an interactive compound-yield model. Change the assumptions and watch the cost per good package move.',
  },
  {
    id: 'qualification',
    n: 11,
    title: 'Qualification & switching costs',
    short: 'Qualification moat',
    group: 'Economics',
    dek: 'Why a technically superior supplier cannot simply replace an incumbent — and why that same barrier is the most valuable asset you will ever own in this industry.',
  },
  {
    id: 'players',
    n: 12,
    title: 'Players & strategic positioning',
    short: 'Major players',
    group: 'Ecosystem',
    dek: 'Thirteen companies: where they sit, what they are strong at, where they are exposed, and precisely what a startup should not attempt to compete with head-on.',
  },
  {
    id: 'geography',
    n: 13,
    title: 'Geography of packaging',
    short: 'Geography',
    group: 'Ecosystem',
    dek: 'Eight hubs and what each actually contributes. Extended treatment of Southeast Asia and a specific operating thesis for a founder based in Singapore.',
  },
  {
    id: 'customers',
    n: 14,
    title: 'What customers actually care about',
    short: 'Customer priorities',
    group: 'Ecosystem',
    dek: 'Six buyer personas with weighted buying criteria, kill criteria and sales-cycle length. Pitch the wrong one and a good technology dies on the vine.',
  },
  {
    id: 'opportunities',
    n: 15,
    title: 'Where startups can actually enter',
    short: 'Opportunity matrix',
    group: 'Startup opportunities',
    dek: 'Fifteen entry points scored across eight dimensions, sortable, including the ones you should reject. Not "AI packaging is growing" — where a wedge exists and why.',
  },
  {
    id: 'bottlenecks',
    n: 16,
    title: 'What is broken right now',
    short: 'Bottleneck dashboard',
    group: 'Startup opportunities',
    dek: 'Ten structural bottlenecks: why each exists, who suffers, the current workaround, what an ideal solution looks like, and what to watch for evidence of change.',
  },
  {
    id: 'glossary',
    n: 17,
    title: 'Founder vocabulary',
    short: 'Glossary',
    group: 'Reference',
    dek: 'Over a hundred terms. Each with a one-line definition, the technical explanation underneath, and a line on why a founder should care.',
  },
  {
    id: 'cheatsheet',
    n: 18,
    title: 'The cheat sheet',
    short: 'Cheat sheet',
    group: 'Reference',
    dek: 'Thirty things worth remembering, ten questions you can ask without sounding stupid, and ten that reveal whether someone actually understands this industry.',
  },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

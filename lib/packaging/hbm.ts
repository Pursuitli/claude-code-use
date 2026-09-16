import type { Depth } from './types';

export const HBM_WHAT: Depth = {
  simple:
    'High Bandwidth Memory is DRAM stacked into a tower and placed inside the processor package. Ordinary memory sits on the motherboard and talks through a narrow, fast channel. HBM sits millimetres away and talks through an enormously wide, slower channel — and width wins.',
  founder:
    'HBM trades frequency for width. A DDR5 module runs a 64-bit channel at high per-pin rates over a board; an HBM stack runs a 1,024-bit interface (2,048-bit from HBM4) at comparatively modest per-pin rates over a sub-millimetre interposer trace. Width is only affordable when the wires are short: 1,024 wires across a motherboard would be an unroutable, unpowerable disaster, but across an interposer they are microns of damascene copper. That single trade is why HBM is inseparable from advanced packaging. Commercially, HBM broke DRAM\'s commodity structure — it is qualified per customer, contracted a year or more ahead, priced at a large premium per bit, and constrained by TSV wafer capacity, stacking throughput and test time simultaneously. It converted a spot-price business into a design-win business, which is why the HBM leader earns foundry-like margins while the laggard does not.',
};

export const HBM_GENERATIONS: {
  gen: string;
  year: string;
  perStack: number;
  perStackLabel: string;
  pinRate: string;
  width: string;
  stackHeight: string;
  capacity: string;
  note: string;
}[] = [
  {
    gen: 'HBM1',
    year: '2015',
    perStack: 128,
    perStackLabel: '~128 GB/s',
    pinRate: '1 Gbps',
    width: '1024-bit',
    stackHeight: '4-Hi',
    capacity: '1 GB',
    note: 'First product (AMD Fiji). Proved the concept; volumes were negligible.',
  },
  {
    gen: 'HBM2',
    year: '2016',
    perStack: 256,
    perStackLabel: '~256 GB/s',
    pinRate: '2 Gbps',
    width: '1024-bit',
    stackHeight: '4/8-Hi',
    capacity: '4–8 GB',
    note: 'Entered HPC and datacentre GPUs; still a niche premium product.',
  },
  {
    gen: 'HBM2E',
    year: '2019–20',
    perStack: 460,
    perStackLabel: '~460 GB/s',
    pinRate: '3.6 Gbps',
    width: '1024-bit',
    stackHeight: '8-Hi',
    capacity: '16 GB',
    note: 'A100-era. The generation where HBM became strategically important.',
  },
  {
    gen: 'HBM3',
    year: '2022',
    perStack: 819,
    perStackLabel: '~819 GB/s',
    pinRate: '6.4 Gbps',
    width: '1024-bit',
    stackHeight: '8/12-Hi',
    capacity: '16–24 GB',
    note: 'H100-era. SK hynix\'s early qualification lead became a multi-year commercial advantage.',
  },
  {
    gen: 'HBM3E',
    year: '2024',
    perStack: 1230,
    perStackLabel: '~1.2 TB/s',
    pinRate: '9.6 Gbps',
    width: '1024-bit',
    stackHeight: '8/12-Hi',
    capacity: '24–36 GB',
    note: 'Blackwell-era. 12-Hi stacks push thinning and warpage control to the limit.',
  },
  {
    gen: 'HBM4',
    year: '2026 (ramping)',
    perStack: 2000,
    perStackLabel: '~2 TB/s',
    pinRate: '~8+ Gbps',
    width: '2048-bit',
    stackHeight: '12/16-Hi',
    capacity: '36–64 GB',
    note: 'Doubles interface width. The base die becomes a logic die — built on a foundry process, sometimes by a foundry.',
  },
];

/** Bandwidth comparison for the chart. Per-device figures, approximate. */
export const BANDWIDTH_COMPARISON: {
  name: string;
  gbps: number;
  kind: 'ddr' | 'gddr' | 'hbm' | 'system';
  note: string;
}[] = [
  { name: 'DDR5-6400 DIMM', gbps: 51, kind: 'ddr', note: 'One 64-bit module. Servers use 8–12 channels.' },
  { name: 'DDR5 server, 12 ch.', gbps: 614, kind: 'ddr', note: 'A whole CPU socket\'s memory subsystem.' },
  { name: 'GDDR6X, 384-bit', gbps: 1008, kind: 'gddr', note: 'Consumer GPU memory; on the board, not in the package.' },
  { name: 'HBM3 stack ×1', gbps: 819, kind: 'hbm', note: 'One stack matches an entire CPU socket.' },
  { name: 'HBM3E stack ×1', gbps: 1230, kind: 'hbm', note: 'Roughly 24 DDR5 DIMMs of bandwidth, in 11 × 11 mm.' },
  { name: 'HBM4 stack ×1', gbps: 2000, kind: 'hbm', note: '2,048-bit interface.' },
  { name: 'H100 (5 stacks HBM3)', gbps: 3350, kind: 'system', note: 'Vendor spec.' },
  { name: 'H200 (HBM3E)', gbps: 4800, kind: 'system', note: 'Same compute die, more memory bandwidth — and it matters.' },
  { name: 'B200-class (8 stacks)', gbps: 8000, kind: 'system', note: 'Two compute dies, eight HBM3E stacks.' },
];

export const HBM_STACK_ANATOMY: {
  id: string;
  name: string;
  what: string;
  detail: string;
}[] = [
  {
    id: 'top',
    name: 'Top DRAM die',
    what: 'The uppermost memory layer; often thicker for mechanical strength.',
    detail:
      'The top die carries no TSVs going further up, and is left thicker to give the stack rigidity and a decent thermal path to the lid.',
  },
  {
    id: 'core',
    name: 'Core DRAM dies (×8–12)',
    what: 'Thinned memory dies, each ~30–50 µm thick, connected vertically by TSVs.',
    detail:
      'Thinning to ~30 µm for a 12-high stack is close to the practical limit of handling: at that thickness silicon is flexible and any particle under the die becomes a crack. This is the main reason 12-Hi yields below 8-Hi, and why hybrid bonding is required beyond ~16 layers.',
  },
  {
    id: 'tsvcol',
    name: 'TSV columns',
    what: 'Thousands of copper vias running vertically through every die.',
    detail:
      'The TSV field is a shared bus running up the stack. It consumes die area on every layer — an area tax paid by every tier — and each via is a potential open or void.',
  },
  {
    id: 'gap',
    name: 'Gap fill — MR-MUF or TC-NCF',
    what: 'The material filling the space between stacked dies.',
    detail:
      'SK hynix uses Mass Reflow–Molded Underfill: bond the whole stack at once, then inject a thermally enhanced moulding compound. Samsung has used Thermal Compression–Non-Conductive Film: a film applied per die, bonded layer by layer. MR-MUF is generally credited with better heat conduction and throughput; the choice is a genuine competitive variable, not a detail.',
  },
  {
    id: 'base',
    name: 'Base die (logic die)',
    what: 'The bottom layer: PHY, test logic, repair and routing to the host.',
    detail:
      'Historically a simple DRAM-process die. From HBM4 it becomes a real logic die, built on a foundry logic process — which is why SK hynix works with TSMC on HBM4 base dies and why memory-maker and foundry roadmaps are now entangled. Strategically this is the most interesting development in memory: the base die is where customer-specific logic can be placed, turning a commodity into a semi-custom product.',
  },
  {
    id: 'ubump',
    name: 'Microbumps to interposer',
    what: 'The stack\'s connection to the package.',
    detail:
      'The whole stack is tested as a unit before shipment, but stack-level test cannot catch everything, and any escape becomes a scrapped accelerator later.',
  },
];

export const HBM_CONCENTRATION: {
  point: string;
  detail: string;
}[] = [
  {
    point: 'Only three companies in the world make DRAM',
    detail:
      'SK hynix, Samsung and Micron. Decades of consolidation removed every other entrant; the capital and process learning required make a fourth entrant implausible outside state-directed programmes.',
  },
  {
    point: 'HBM is a much harder subset of DRAM',
    detail:
      'It needs TSV processing, ultra-thin die handling, precision stacking, and per-stack test. Not all DRAM capacity converts to HBM capacity, and the conversion costs both capex and time.',
  },
  {
    point: 'HBM consumes disproportionate wafer area',
    detail:
      'Per bit, HBM is commonly estimated to take 2–3× the wafer area of commodity DRAM — TSV overhead, larger die, and yield loss. Every HBM bit therefore removes multiple commodity bits from the market, which is why an HBM boom tightens ordinary DRAM pricing too.',
  },
  {
    point: 'Qualification is per-customer and slow',
    detail:
      'An accelerator vendor qualifies specific HBM parts from specific vendors at specific speed bins. Being second to qualify means being second to revenue, with no way to catch up within the generation. SK hynix\'s HBM3 lead is the cleanest recent example of how durable that advantage is.',
  },
  {
    point: 'The foundry is now inside the memory supply chain',
    detail:
      'With HBM4 base dies moving to logic processes, TSMC becomes a participant in HBM production. That further couples two supply chains that were previously independent — and creates an interesting question about who captures the margin on a semi-custom base die.',
  },
];

export const HBM_YIELD_ECONOMICS: Depth = {
  simple:
    'Building an HBM stack means bonding a dozen memory chips together. If any one of them is bad, you throw away all twelve. That makes the effective yield much lower than the yield of a single chip, and it is why HBM is expensive.',
  founder:
    'Work the arithmetic. Suppose each DRAM die tests good at 92% and stack-assembly yield is 95%. A 12-high stack yields roughly 0.92¹² × 0.95 ≈ 35%. That is the mechanism behind reported HBM yields well below commodity DRAM — and it is why the industry invests so heavily in per-die testing before stacking, and in redundancy and repair (spare rows, spare TSVs, spare channels) that let a marginally defective die be rescued rather than scrapped. Three founder-level implications. (1) Yield improvement is worth more than price increases: going from 35% to 50% effective stack yield cuts unit cost ~30% and instantly expands sellable supply, which is why a memory maker\'s gross margin can move violently without any price change. (2) The scrap value is asymmetric: losing a stack at final test destroys twelve good dies plus all the stacking work, so test-before-stack is worth paying a lot for — a durable demand signal for test and inspection equipment. (3) When the stack is later bonded onto a $20,000 accelerator, the cost of an escape multiplies again, which is why accelerator vendors care intensely about their memory supplier\'s process control, not merely their price.',
};

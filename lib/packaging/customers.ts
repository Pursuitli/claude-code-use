import type { CustomerPersona, Depth } from './types';

export const PERSONAS: CustomerPersona[] = [
  {
    id: 'aidesigner',
    name: 'AI accelerator designer',
    who: 'An NVIDIA-like company shipping flagship training and inference silicon.',
    mindset:
      'Supply is the business. Every unit they can build, they can sell, so anything that adds units — more capacity, higher yield, faster qualification — is worth extraordinary amounts. Cost per unit is almost a rounding error next to availability and schedule.',
    priorities: [
      { criterion: 'Capacity & allocation', weight: 5, why: 'Units shipped is the P&L. Capacity they cannot get is revenue they cannot book.' },
      { criterion: 'Time to qualification', weight: 5, why: 'A product cycle is roughly a year. Six months of qualification is half the window gone.' },
      { criterion: 'Yield', weight: 5, why: 'Yield converts directly into sellable units when capacity is fixed.' },
      { criterion: 'Thermal performance', weight: 4, why: 'Junction temperature sets sustainable clocks, which sets benchmark position.' },
      { criterion: 'Supply security', weight: 5, why: 'A single-source disruption stops the flagship product line entirely.' },
      { criterion: 'Cost', weight: 2, why: 'At 70%+ gross margin, a few hundred dollars of BOM is not the decision variable.' },
      { criterion: 'Reliability', weight: 4, why: 'Field failures at hyperscale become headlines and warranty liabilities.' },
    ],
    buysFrom: 'Foundries (packaging), memory makers (HBM), substrate makers via the foundry, and increasingly direct relationships with materials suppliers.',
    killCriteria: 'Anything that jeopardises the launch schedule. Being cheap and late is worse than being expensive and early.',
    salesCycle: '12–24 months from first engagement to production, if it goes well.',
  },
  {
    id: 'cloud',
    name: 'Cloud / hyperscaler',
    who: 'A company buying tens of thousands of accelerators and also designing its own.',
    mindset:
      'Thinks in total cost of ownership per unit of useful work, across a multi-year asset life — not in component prices. Power and cooling are operating costs they pay for years, so a package that runs hotter is a permanent line item.',
    priorities: [
      { criterion: 'Performance per watt', weight: 5, why: 'Power is the dominant operating cost and increasingly the binding site constraint.' },
      { criterion: 'Supply security', weight: 5, why: 'They are committing billions of capex on a build schedule that cannot slip.' },
      { criterion: 'Reliability at scale', weight: 5, why: 'A 0.1% annual failure rate across 100,000 units is 100 field replacements.' },
      { criterion: 'Thermal / coolability', weight: 4, why: 'Determines rack density, which determines how much compute fits in a building.' },
      { criterion: 'Cost', weight: 4, why: 'At this scale, dollars per unit genuinely matter.' },
      { criterion: 'Vendor diversity', weight: 4, why: 'They actively fund second sources to avoid being price-taken.' },
    ],
    buysFrom: 'Accelerator vendors, ODMs, and — for their custom silicon — directly from foundries, memory makers and packaging providers.',
    killCriteria: 'Anything that cannot demonstrate reliability at fleet scale, or that creates a single point of failure in their supply.',
    salesCycle: '18–36 months, with long qualification and staged deployment.',
  },
  {
    id: 'auto',
    name: 'Automotive chip company',
    who: 'A supplier of silicon into vehicles with 15-year service lives.',
    mindset:
      'Risk-averse to a degree that is genuinely difficult for software-native founders to internalise. A field failure can mean a recall, regulatory action, or a fatality. They would rather have a proven inferior technology than an unproven superior one — and they are right to.',
    priorities: [
      { criterion: 'Reliability & qualification', weight: 5, why: 'AEC-Q100 grade 0/1, −40 °C to +150 °C, 15-year life, functional safety requirements.' },
      { criterion: 'Supply longevity', weight: 5, why: 'They need the identical part, from the identical line, for 10–15 years.' },
      { criterion: 'Cost', weight: 4, why: 'Automotive volumes are large and margins are thin.' },
      { criterion: 'Traceability', weight: 5, why: 'Every unit must be traceable to a lot, a line and a date for recall containment.' },
      { criterion: 'Thermal cycling robustness', weight: 5, why: 'Under-bonnet parts see thousands of brutal thermal cycles.' },
      { criterion: 'Time to market', weight: 2, why: 'Design cycles are years long; nobody is in a hurry.' },
    ],
    buysFrom: 'Amkor, ASE and specialist automotive-qualified OSATs, with rigorous supplier audits.',
    killCriteria: 'Any process change without full requalification. "We improved it" is a threat, not a benefit.',
    salesCycle: '3–5 years from engagement to volume production.',
  },
  {
    id: 'mobile',
    name: 'Smartphone chip company',
    who: 'A high-volume mobile SoC vendor.',
    mindset:
      'Cost and physical dimensions dominate everything. Volumes in the hundreds of millions mean a $0.20 packaging saving is worth tens of millions of dollars a year, and a 0.2 mm z-height saving can win a design slot.',
    priorities: [
      { criterion: 'Cost per unit', weight: 5, why: 'Enormous volume multiplies every cent.' },
      { criterion: 'Z-height & form factor', weight: 5, why: 'Phone internal volume is the scarcest resource in the product.' },
      { criterion: 'Power efficiency', weight: 5, why: 'Battery life is the primary consumer-visible specification.' },
      { criterion: 'Capacity at ramp', weight: 5, why: 'A launch needs tens of millions of units inside a quarter.' },
      { criterion: 'Thermal', weight: 3, why: 'Passive cooling only — a few watts sustained, managed by throttling.' },
      { criterion: 'Absolute performance', weight: 3, why: 'Matters, but always subordinate to power and cost.' },
    ],
    buysFrom: 'TSMC (InFO), ASE, Amkor, and in-house lines at the largest vendors.',
    killCriteria: 'Cost per unit that does not clear the bill-of-materials target. The conversation ends there.',
    salesCycle: '12–18 months aligned to annual product cycles.',
  },
  {
    id: 'foundry',
    name: 'Foundry (as a buyer)',
    who: 'A TSMC-like company buying equipment, materials and outsourced services.',
    mindset:
      'Buys for yield and for capacity, and evaluates every purchase against its effect on a line producing enormous value per hour. They will pay almost anything for a tool that measurably improves yield, and almost nothing for one that merely looks better on paper.',
    priorities: [
      { criterion: 'Proven yield impact', weight: 5, why: 'Everything is judged in yield points and tool uptime.' },
      { criterion: 'Tool reliability / uptime', weight: 5, why: 'An hour of downtime on a constrained line is enormously expensive.' },
      { criterion: 'Process integration', weight: 5, why: 'A tool must fit an existing flow; forcing changes upstream or downstream is usually disqualifying.' },
      { criterion: 'Supplier viability', weight: 4, why: 'They need you to exist and support the tool in ten years. Startups are audited on their balance sheet.' },
      { criterion: 'Price', weight: 3, why: 'Real, but subordinate to yield and uptime.' },
      { criterion: 'Roadmap alignment', weight: 4, why: 'The tool must serve the next two nodes, not just this one.' },
    ],
    buysFrom: 'Equipment and materials vendors, under multi-year qualification and joint development agreements.',
    killCriteria: 'Inability to demonstrate results on their own wafers, in their own fab, at production throughput.',
    salesCycle: '2–4 years from first demo to production tool of record.',
  },
  {
    id: 'osatbuyer',
    name: 'OSAT (as a buyer)',
    who: 'An ASE- or Amkor-like company buying equipment and materials.',
    mindset:
      'Runs a 15–25% gross margin service business and thinks in payback periods. Will buy a tool that shortens cycle time, raises throughput or lets them win a specific customer qualification — and will negotiate hard on everything else.',
    priorities: [
      { criterion: 'Return on capital', weight: 5, why: 'Payback period is the deciding metric, usually 2–3 years.' },
      { criterion: 'Throughput (units per hour)', weight: 5, why: 'Revenue is a direct function of throughput.' },
      { criterion: 'Customer-qualification enablement', weight: 4, why: 'A tool that wins a specific customer programme justifies itself.' },
      { criterion: 'Price', weight: 4, why: 'Thin margins mean capital cost is scrutinised line by line.' },
      { criterion: 'Flexibility', weight: 4, why: 'They serve many customers and package types; single-purpose tools sit idle.' },
      { criterion: 'Service & spares', weight: 4, why: 'Local support in Asia is non-negotiable.' },
    ],
    buysFrom: 'Equipment vendors (ASMPT, BESI, DISCO, K&S), materials suppliers, and increasingly software vendors.',
    killCriteria: 'A payback period that does not clear their hurdle rate, or a tool too specialised to keep loaded.',
    salesCycle: '9–18 months — the shortest cycle among serious buyers in this industry, and therefore the best beachhead for a startup.',
  },
];

export const BUYING_CRITERIA_NOTE: Depth = {
  simple:
    'Different customers want different things. An AI chip company will pay almost anything for capacity and speed. A car chip company will refuse a better product because it is not proven. Knowing which one you are talking to determines your entire pitch.',
  founder:
    'Three practical conclusions. (1) Sell to the customer whose binding constraint you relieve. An AI accelerator vendor is capacity-constrained, so pitch units-gained, not dollars-saved — the same technology framed as a 5% yield improvement is worth ten times more than framed as a cost reduction. (2) Match your sales cycle to your runway. Automotive is a 3–5 year cycle; a seed-stage company cannot survive it, no matter how attractive the long-term stickiness looks. OSATs at 9–18 months are the realistic beachhead. (3) Understand who actually holds the pen. In advanced packaging the accelerator vendor frequently specifies materials and processes down into its foundry\'s supply chain, which means your buyer and your user may be different companies — and your champion may be an engineer at a customer who does not write you a cheque. Map that path explicitly before you build.',
};

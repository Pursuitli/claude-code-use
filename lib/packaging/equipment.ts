import type { EquipmentCategory } from './types';

export const EQUIPMENT: EquipmentCategory[] = [
  {
    id: 'diebond',
    name: 'Die attach & flip-chip bonding',
    what: 'Places dies onto substrates or interposers and forms the joints.',
    detail:
      'The workhorse category. Mass-reflow flip-chip bonders are fast and coarse; thermocompression bonders hold each die under force and heat for accuracy around ±3–5 µm at a cost of seconds per die. The throughput-versus-accuracy trade governs the cost of every advanced package, and each generation asks for more accuracy without giving back cycle time.',
    leaders: [
      { name: 'ASMPT', note: 'Broadest back-end portfolio; strong in TCB.' },
      { name: 'BESI', note: 'High-accuracy die attach; the most profitable pure-play in the segment.' },
      { name: 'Kulicke & Soffa', note: 'Wire bond leader moving up into thermocompression and fluxless bonding.' },
      { name: 'Shinkawa', note: 'Japanese precision bonding, strong in memory stacking.' },
    ],
    barrier: 4,
    barrierWhy:
      'Precision motion control, thermal management of the bond head, vision alignment, and decades of process recipes per customer. The install base and the recipe library are the moat, not the mechanics.',
    toolPrice: '$1–3m per system (est.)',
    opportunity:
      'Throughput at accuracy is an unsolved problem. Anything that lets a bonder hit hybrid-bonding placement at TCB throughput is worth a very large business.',
  },
  {
    id: 'hybridbond',
    name: 'Hybrid bonding systems',
    what: 'Bonds copper pads directly to copper with no solder, at sub-10 µm pitch.',
    detail:
      'The most contested new equipment category in semiconductors. Requirements: sub-200 nm placement accuracy, near-zero particles, plasma surface activation, and nanometre-level control of copper recess from the CMP step before. Wafer-to-wafer tools are relatively mature; die-to-wafer — which is what logic and HBM actually need, because it preserves known-good-die — is where the race is.',
    leaders: [
      { name: 'BESI + Applied Materials', note: 'Partnered die-to-wafer hybrid bonding platform.' },
      { name: 'ASMPT', note: 'Competing die-to-wafer systems.' },
      { name: 'EV Group', note: 'Wafer-to-wafer bonding and alignment; the long-standing technology leader.' },
      { name: 'SUSS MicroTec', note: 'Bonding and temporary bonding.' },
    ],
    barrier: 5,
    barrierWhy:
      'Nanometre placement plus cleanroom particle control plus metrology plus CMP integration. It is a systems-engineering problem spanning four disciplines, and customers will only qualify a tool they can see running at yield.',
    toolPrice: '$3–6m+ per system (est.)',
    opportunity:
      'Genuinely open. Adjacent niches — in-situ bond inspection, particle control, die preparation and cleaning, bond-interface metrology — are startup-scale problems attached to a market that is about to be very large.',
  },
  {
    id: 'litho',
    name: 'Packaging lithography',
    what: 'Patterns RDL, bumps and interposer layers.',
    detail:
      'Not EUV, and not even leading-edge DUV. This is i-line and broadband steppers, projection scanners and laser direct imaging working at 1–10 µm features over large fields and non-flat surfaces. The distinctive requirement is adaptive patterning: because dies shift during moulding, the tool must measure where each die actually landed and compensate the exposure per unit — a capability that does not exist in front-end lithography at all.',
    leaders: [
      { name: 'Veeco', note: 'Advanced packaging lithography (AP steppers).' },
      { name: 'Onto Innovation', note: 'JetStep packaging lithography plus inspection and metrology.' },
      { name: 'ASML', note: 'Older-generation DUV repurposed for high-end interposers.' },
      { name: 'Ushio / SCREEN', note: 'Direct imaging and coat/develop.' },
    ],
    barrier: 4,
    barrierWhy: 'Optics, overlay control on warped substrates, and integration with the metrology that feeds adaptive patterning.',
    toolPrice: '$5–15m per system (est.)',
    opportunity: 'Panel-format lithography with wafer-class overlay is an open problem and a prerequisite for panel-level packaging economics.',
  },
  {
    id: 'inspect',
    name: 'Inspection',
    what: 'Finds defects — particles, voids, cracks, bridges, missing bumps.',
    detail:
      'Packaging inspection is harder than front-end inspection in one specific way: the surfaces are rough, multi-material and non-planar, so the optical assumptions that work on a polished wafer break down. Modalities include optical, infrared (which sees through silicon), X-ray and scanning acoustic microscopy (which finds delamination and voids). The economic argument writes itself: a defect found at incoming inspection costs a few dollars; the same defect found at final test costs thousands.',
    leaders: [
      { name: 'KLA', note: 'The reference standard in inspection; packaging-specific product lines.' },
      { name: 'Onto Innovation', note: 'Strong packaging inspection and metrology franchise.' },
      { name: 'Camtek', note: 'Cost-effective packaging inspection; broad OSAT install base.' },
      { name: 'Nordson / Bruker', note: 'X-ray and acoustic inspection.' },
    ],
    barrier: 4,
    barrierWhy: 'Detection physics plus the classification software plus a defect library built from years of customer data.',
    toolPrice: '$1–5m per system (est.)',
    opportunity:
      'In-line, non-destructive inspection of *buried* interfaces — voids under a bonded die, a cracked TSV, a delaminated underfill — is the clearest unmet need on the line. Today much of this is destructive or sampled.',
  },
  {
    id: 'metrology',
    name: 'Metrology',
    what: 'Measures — bump height, overlay, warpage, thickness, bond-line uniformity.',
    detail:
      'Inspection asks "is there a defect?"; metrology asks "what is the number?" Packaging metrology is dominated by three quantities: coplanarity (will every joint touch?), overlay (did the pattern land where the die actually is?) and warpage (will this body stay flat through reflow?). Warpage metrology in particular has moved from a lab measurement to an in-line requirement as bodies have grown.',
    leaders: [
      { name: 'Onto Innovation', note: 'Packaging metrology leader.' },
      { name: 'KLA', note: 'Overlay and film metrology.' },
      { name: 'Bruker', note: 'Surface and warpage metrology.' },
      { name: 'Camtek / Nova', note: 'Growing packaging-specific portfolios.' },
    ],
    barrier: 3,
    barrierWhy: 'Lower barrier than inspection — measurement physics is more tractable than defect classification — but integration and throughput still gate adoption.',
    toolPrice: '$0.5–3m per system (est.)',
    opportunity:
      'The most accessible equipment entry point for a startup. In-line warpage at temperature, bond-line thickness measurement, and buried-interface metrology are all real, specific, purchasable needs.',
  },
  {
    id: 'dicegrind',
    name: 'Dicing & grinding',
    what: 'Thins wafers and cuts them into dies.',
    detail:
      'DISCO holds a share usually estimated at 70–80% and earns operating margins that most equipment companies envy, on a product that looks superficially like a precision saw. The moat is consumables (blades and wheels, sold with the tools), process recipes per material stack, and an install base that has standardised on their platform. It is the best case study in the industry of a "boring" category that is actually a monopoly.',
    leaders: [
      { name: 'DISCO', note: 'Dominant in both grinders and dicers; consumables attach.' },
      { name: 'Accretech (Tokyo Seimitsu)', note: 'Second source.' },
      { name: 'Plasma-Therm', note: 'Plasma dicing for ultra-thin and fragile die.' },
    ],
    barrier: 5,
    barrierWhy: 'Install base plus consumables plus recipe library. Customers will not requalify a dicing process to save money.',
    toolPrice: '$0.5–2m per system (est.)',
    opportunity: 'Almost none frontally. Adjacent: die-edge strength metrology, and singulation methods for glass and other new substrate materials.',
  },
  {
    id: 'deposition',
    name: 'Deposition, etch & plating',
    what: 'Builds the films and metal in interposers, RDL and TSVs.',
    detail:
      'The same physics as front-end at looser dimensions, which is why the front-end giants all have packaging product lines. Plating is the distinctive one: void-free fill of high-aspect-ratio TSVs and flat plating of fine RDL lines are chemistry-plus-hardware problems where the tool and the bath must be co-developed.',
    leaders: [
      { name: 'Applied Materials', note: 'Broad portfolio plus a dedicated packaging business.' },
      { name: 'Lam Research', note: 'TSV etch and copper plating.' },
      { name: 'Tokyo Electron', note: 'Coat/develop, etch, bonding.' },
      { name: 'Ebara', note: 'Plating and CMP; strong in TSV.' },
    ],
    barrier: 5,
    barrierWhy: 'Process physics, decades of recipe development, and the service organisation required to keep tools running.',
    toolPrice: '$2–8m per system (est.)',
    opportunity: 'None frontally. The only realistic route is a new process step that no incumbent tool addresses.',
  },
  {
    id: 'test',
    name: 'Test equipment',
    what: 'ATE, probers, probe cards, burn-in and system-level test.',
    detail:
      'Advantest and Teradyne are a near-duopoly at the high end, with Advantest particularly strong in the SoC and HBM test that AI parts require. The structural attraction of test is that it scales with *complexity*, not with unit volume: more chiplets, more channels, more interfaces and more parametric variation all mean more test time, and test time is the product.',
    leaders: [
      { name: 'Advantest', note: 'Dominant in high-end SoC and memory test.' },
      { name: 'Teradyne', note: 'Broad ATE; strong in mobile and industrial.' },
      { name: 'FormFactor', note: 'Probe cards — the consumable that touches every die.' },
      { name: 'Cohu / Chroma', note: 'Handlers, burn-in and back-end test cells.' },
    ],
    barrier: 5,
    barrierWhy:
      'The moat is the customer\'s own test programs. Millions of engineer-hours of test code are written against a specific platform; that code does not port, so the switching cost is effectively prohibitive.',
    toolPrice: '$2–10m+ per system (est.)',
    opportunity:
      'Not the tester — the software around it. Adaptive test, test-time reduction, cross-insertion data correlation and ML failure triage are real markets with short sales cycles and no install-base lock-in.',
  },
  {
    id: 'thermalproc',
    name: 'Thermal processing',
    what: 'Reflow ovens, cure ovens, anneal, plasma treatment.',
    detail:
      'Unglamorous and essential. The reflow profile determines whether joints wet properly and how much warpage the assembly develops on cooling. As bodies get larger, uniform heating and controlled cooling become genuinely difficult — a temperature gradient across a 100 mm body becomes a warpage gradient.',
    leaders: [{ name: 'Rehm' }, { name: 'Heller' }, { name: 'BTU / Amtech' }, { name: 'Koyo Thermo' }],
    barrier: 2,
    barrierWhy: 'Lower technical barrier; competition is on uniformity, throughput and cost.',
    toolPrice: '$0.2–1m per system (est.)',
    opportunity: 'Per-unit adaptive reflow — measuring each body\'s warpage and tailoring its profile — is a plausible, tractable wedge.',
  },
  {
    id: 'mold',
    name: 'Moulding & encapsulation',
    what: 'Presses epoxy compound over the assembly.',
    detail:
      'TOWA is the share leader in compression moulding. The technical frontier is large-body and panel-format moulding with controlled die shift and warpage — the enabling capability for panel-level packaging economics.',
    leaders: [{ name: 'TOWA', note: 'Share leader in compression moulding.' }, { name: 'ASMPT' }, { name: 'Apic Yamada' }],
    barrier: 3,
    barrierWhy: 'Mould design, compound interaction and a large installed base.',
    toolPrice: '$0.5–2m per system (est.)',
    opportunity: 'Panel-format moulding with die-shift compensation; integration with adaptive lithography.',
  },
  {
    id: 'placement',
    name: 'Advanced placement & handling',
    what: 'Moves ultra-thin, fragile dies and wafers without breaking them.',
    detail:
      'The quiet constraint. A 30 µm die is flexible and fragile; a populated interposer wafer carries thousands of dollars of components; a glass panel cracks if it is looked at wrongly. Handling automation, carriers, chucks and end-effectors are where a lot of unglamorous yield is won or lost, and the vendor base here is fragmented.',
    leaders: [{ name: 'ASMPT' }, { name: 'BESI' }, { name: 'Rorze / Daifuku', note: 'Automation and wafer handling.' }, { name: 'EV Group' }],
    barrier: 3,
    barrierWhy: 'Mechanical engineering rather than exotic physics — which is exactly why it is more accessible.',
    toolPrice: '$0.2–2m per system (est.)',
    opportunity:
      'Underrated. Handling ultra-thin die, populated wafers and glass panels is a real, fragmented, solvable problem with a short qualification path relative to process tools.',
  },
];

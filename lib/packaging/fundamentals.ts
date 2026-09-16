import type { Depth } from './types';

/** The seven jobs a package does. Each is a place where value and risk sit. */
export const PACKAGING_JOBS: {
  id: string;
  name: string;
  oneLine: string;
  detail: string;
  failure: string;
  number: string;
}[] = [
  {
    id: 'connectivity',
    name: 'Connectivity',
    oneLine: 'Turn thousands of microscopic pads on the die into something a circuit board can touch.',
    detail:
      "A modern die exposes its I/O as copper pillars on a pitch measured in tens of microns. A printed circuit board's finest features are measured in tens of *thousands* of microns. The package is the translation layer — a pitch and scale converter. Every step up the packaging ladder is fundamentally about surviving a tighter pitch: 150 µm C4 bumps → 40–55 µm microbumps → sub-10 µm hybrid bonds.",
    failure: 'An open or a short on one of 100,000+ interconnects scraps a package worth five figures.',
    number: '~100,000 interconnects on a large 2.5D package',
  },
  {
    id: 'power',
    name: 'Power delivery',
    oneLine: 'Get ~1,000 A into a piece of silicon the size of a postage stamp without the voltage collapsing.',
    detail:
      'An 1,100 W accelerator running at ~0.8 V draws current on the order of 1,000+ amperes. That current arrives through the board, through the substrate, through the bumps, and finally into the die. Every milliohm of resistance is a voltage droop the chip must be designed to tolerate, and every nanohenry of inductance is a transient it must ride out. Power delivery network (PDN) design is now a first-order packaging constraint, not an afterthought — it is why a large share of the bumps on a modern package carry power and ground rather than signals.',
    failure: 'IR droop forces the chip to clock down — you paid for silicon you cannot use.',
    number: '>1,000 A at <1 V on a flagship accelerator',
  },
  {
    id: 'heat',
    name: 'Heat extraction',
    oneLine: 'Move a kilowatt out of a few square centimetres before the silicon cooks itself.',
    detail:
      "Heat leaves the die upward through the thermal interface material (TIM), lid and cold plate. The package's job is to present a low thermal resistance path and to hold flat contact under load. Power density on an AI accelerator is comparable to a stovetop element, and it is not uniform — hot spots sit over the compute tiles while HBM stacks, which must stay cooler, sit millimetres away on the same interposer.",
    failure: 'HBM throttles at a lower temperature than logic, so the memory sets the thermal budget.',
    number: '~100 W/cm² local hot-spot flux; HBM prefers <95–105 °C junction',
  },
  {
    id: 'memory',
    name: 'Memory proximity',
    oneLine: 'Put the memory close enough that you can afford the wires.',
    detail:
      'Bandwidth costs energy per bit, and energy per bit scales with distance and with how much drive circuitry a signal needs. A DDR link across a motherboard costs on the order of tens of picojoules per bit; an HBM link across a silicon interposer a few millimetres long costs on the order of a single-digit picojoule per bit or less. Multiply by terabytes per second and the difference between "memory on the board" and "memory in the package" is hundreds of watts. That is the entire reason 2.5D packaging exists.',
    failure: 'Without in-package memory, an AI accelerator starves: the arithmetic units idle waiting for data.',
    number: '~1 pJ/bit in-package vs ~15–20 pJ/bit off-package (est.)',
  },
  {
    id: 'protection',
    name: 'Physical protection',
    oneLine: 'Silicon is a brittle ceramic 50–100 µm thick. It needs armour.',
    detail:
      'Thinned die is fragile, moisture-sensitive, and mechanically mismatched to everything around it. Silicon expands at ~2.6 ppm/K; the organic substrate under it at ~15–17 ppm/K. Every thermal cycle tries to pull the stack apart. Underfill, mould compound, stiffeners and lids exist to manage that mismatch and to keep contamination out over a ten-year service life.',
    failure: 'Warpage and delamination — the dominant reliability failure mode as packages get larger.',
    number: 'CTE mismatch: 2.6 ppm/K (Si) vs ~17 ppm/K (substrate)',
  },
  {
    id: 'yield',
    name: 'Yield recovery',
    oneLine: 'Packaging is how you stop paying for defects you cannot avoid.',
    detail:
      'Defect density is roughly constant per unit area, so the probability a die is good falls exponentially with its size. Splitting a 800 mm² monolithic design into four 200 mm² chiplets raises the yield of the silicon dramatically — but only if you can test each piece before assembly (known-good-die) and then join them without losing what you gained. Chiplets convert a silicon yield problem into a packaging yield problem, which is a *better* problem, not a solved one.',
    failure: 'A bad die discovered after assembly destroys every good die bonded to it.',
    number: 'Yield ≈ e^(−D·A): double the area, square the loss',
  },
  {
    id: 'form',
    name: 'Form factor',
    oneLine: 'Make it fit — in a phone, in a car, in a 1U server sled.',
    detail:
      'Form factor is the constraint that made fan-out packaging a consumer technology: Apple adopted integrated fan-out with package-on-package memory because it removed a substrate layer and a millimetre of z-height from the phone. At the other extreme, a data-centre accelerator is limited by how large a substrate can be manufactured flat, how large an interposer can be stitched within reticle limits, and how large a package a socket and cold plate can hold.',
    failure: 'Package size limits are now a hard ceiling on how much compute you can put in one "chip".',
    number: 'Reticle limit 26 × 33 mm = 858 mm²; big 2.5D packages run ~3.3–5.5× reticle',
  },
];

/** The seven-stage flow from design to a rack. Every stage is clickable. */
export const FLOW_STAGES: {
  id: string;
  name: string;
  actor: string;
  duration: string;
  what: string;
  detail: string;
  economics: string;
  whoWins: string;
}[] = [
  {
    id: 'design',
    name: 'Chip design',
    actor: 'Fabless designer + EDA + IP',
    duration: '18–36 months',
    what: 'Turn an architecture into a set of photomask patterns.',
    detail:
      'A team specifies an architecture, writes it in a hardware description language, verifies it in simulation, then uses EDA software to place and route billions of transistors into physical layout. Third-party IP blocks (CPU cores, memory controllers, SerDes, PHYs) are licensed rather than built. The output is a tape-out: a GDSII/OASIS database that becomes a mask set. A leading-edge mask set alone runs into the tens of millions of dollars, which is why nobody tapes out speculatively.',
    economics: 'Cost is almost entirely people + EDA licences + mask set. Near-zero marginal cost afterwards.',
    whoWins: 'NVIDIA, AMD, Broadcom, Apple, Google (TPU), Amazon (Trainium) — and Synopsys/Cadence/Arm who tax all of them.',
  },
  {
    id: 'fab',
    name: 'Wafer fabrication',
    actor: 'Foundry (TSMC, Samsung, Intel)',
    duration: '3–4 months cycle time',
    what: 'Build the transistors, layer by layer, on a 300 mm silicon wafer.',
    detail:
      'A 300 mm wafer passes through 1,000+ process steps: deposit a film, pattern it with lithography, etch it, clean, repeat. Leading-edge logic uses EUV lithography for the finest layers. This is the step people mean when they say "chip manufacturing". It produces a wafer holding tens to hundreds of copies of the same die, still joined together and with no way to connect to the outside world.',
    economics: 'A leading-edge 3 nm wafer is reported around $18,000–$20,000+ (est.). Foundry gross margin ~50–60%.',
    whoWins: 'TSMC holds roughly 90%+ of leading-edge logic foundry output (est.).',
  },
  {
    id: 'probe',
    name: 'Wafer test (probe)',
    actor: 'Foundry / test house',
    duration: 'Hours per wafer',
    what: 'Touch every die with needles and find out which ones work.',
    detail:
      'A prober steps a probe card across the wafer, making temporary contact with each die\'s pads and running electrical tests. The output is a wafer map marking good and bad die. This step is where "known-good-die" is established — and its accuracy is the single most important input to advanced packaging economics, because every die you bond into a multi-die package has to have been tested well enough that you trust it.',
    economics: 'Test cost is small per die but test *escape* cost is enormous once dies are stacked.',
    whoWins: 'Advantest and Teradyne (testers); FormFactor (probe cards); KYEC and ASE (test services).',
  },
  {
    id: 'dice',
    name: 'Dicing',
    actor: 'Foundry or OSAT',
    duration: 'Hours per wafer',
    what: 'Thin the wafer and cut it into individual dies.',
    detail:
      'The wafer is ground from ~775 µm down to as little as 50–100 µm (thinner still for stacked die), mounted on tape, and singulated — by diamond blade, by laser, or by plasma etch for the most delicate cases. Thin silicon behaves like a potato crisp: every subsequent handling step is a chance to chip an edge and start a crack that propagates later in the field.',
    economics: 'Low cost per wafer, high cost of error — a chipped die is discovered after you have paid for everything upstream.',
    whoWins: 'DISCO dominates grinders and dicers with an estimated 70–80% share.',
  },
  {
    id: 'package',
    name: 'Packaging / assembly',
    actor: 'OSAT or foundry (TSMC, ASE, Amkor)',
    duration: 'Days to weeks',
    what: 'Attach, connect, encapsulate — turn dies into a usable component.',
    detail:
      'For a commodity part this is wire bonding and moulding in seconds. For an AI accelerator it is a multi-week sequence: bump the wafer, bond compute dies and HBM stacks onto a silicon interposer, underfill, mould, thin and reveal through-silicon vias, attach the reconstituted assembly to a large organic substrate, add a stiffener and lid. This is the step that used to be an afterthought and is now the industry\'s binding constraint.',
    economics: 'Commodity packaging: single-digit dollars. Advanced 2.5D packaging: hundreds to low thousands of dollars per unit (est.).',
    whoWins: 'TSMC (CoWoS/InFO/SoIC), ASE, Amkor, Samsung, Intel, JCET.',
  },
  {
    id: 'ftest',
    name: 'Final test & burn-in',
    actor: 'OSAT / test house',
    duration: 'Minutes to hours per unit',
    what: 'Prove the assembled package works — at speed, at temperature, at voltage.',
    detail:
      'The package is tested as a system: all memory channels exercised, all die-to-die links trained, thermal behaviour characterised, and parts binned into speed and power grades. High-value parts increasingly get system-level test (running something close to real workloads) and burn-in (elevated voltage and temperature to force infant-mortality failures out before shipment). Test time is expensive: a tester costs millions and its hours are a scarce resource.',
    economics: 'Test can be 5–15% of finished cost for complex parts (est.) and is rising as packages get more complex.',
    whoWins: 'Advantest (dominant in high-end SoC and HBM test), Teradyne, KYEC.',
  },
  {
    id: 'system',
    name: 'Module, system & data centre',
    actor: 'OEM/ODM → cloud operator',
    duration: 'Weeks',
    what: 'Solder the package onto a board, add cooling, put it in a rack.',
    detail:
      'The accelerator is mounted on a module (an OAM or SXM board), combined with voltage regulators, a cold plate, and high-speed interconnect, then integrated into a server and finally a rack that may draw over 100 kW. At this level packaging choices become facilities choices: a hotter, denser package means liquid cooling, which means different data-centre plumbing and a different capex profile for the operator.',
    economics: 'The package is a few percent of a rack\'s cost but sets the ceiling on everything above it.',
    whoWins: 'Foxconn, Quanta, Wistron, Supermicro at the box level; Microsoft, Google, Amazon, Meta, and neoclouds at the top.',
  },
];

export const FAB_VS_PACKAGING: Depth = {
  simple:
    'Fabrication builds the transistors inside a slab of silicon. Packaging takes that slab and turns it into something you can actually plug into a computer — giving it connections, power, cooling and armour. Fabrication is "front-end". Packaging and test are "back-end".',
  founder:
    'The distinction matters commercially more than technically. Front-end is a scale-and-lithography game: ~$20bn fabs, EUV, 50–60% gross margins, one dominant supplier, and progress historically governed by transistor scaling. Back-end has been the opposite: labour-intensive, fragmented across OSATs in Taiwan/China/Southeast Asia, 15–25% gross margins, and a commoditised bid-for-volume business. Advanced packaging is the collision of the two. When TSMC does CoWoS it applies front-end economics — wafer-scale processing, cleanrooms, lithography, CMP — to what used to be a back-end job. That is why TSMC, not ASE, captured the AI packaging profit pool, and why "OSAT" and "advanced packaging" are no longer synonyms. If you are looking for a startup wedge, the single most useful question is: which back-end step is currently being re-invented with front-end tooling, and who owns the tool?',
};

export const WHY_NOT_BARE_DIE: Depth = {
  simple:
    'A bare die has pads a few tens of microns across, no mechanical strength, no way to shed heat, and it degrades on contact with air and moisture. You cannot solder it to a normal circuit board any more than you could staple a human nerve to a garden hose.',
  founder:
    'Four hard blockers, in order of how often they kill the naive answer. (1) Pitch: die pads sit at 40–150 µm pitch and PCB manufacturing economically resolves ~50–75 µm lines at best on exotic builds; the package is a pitch translator and an escape-routing device. (2) Thermomechanical: silicon\'s CTE is ~2.6 ppm/K against ~17 ppm/K for an organic board, so direct attach cracks joints within a few hundred thermal cycles. (3) Power integrity: the die needs a very low-impedance path to decoupling capacitance, which means controlled-impedance planes and cap placement within millimetres — a package problem. (4) Handling, contamination and test: bare die cannot be handled in conventional pick-and-place, cannot be burned in, and cannot be returned for failure analysis. Note the exception that proves the rule: chip-on-board and direct-attach *are* used in low-pin-count, low-power products (LED modules, some sensors, some smart cards). The moment power density or pin count rises, the package becomes non-optional.',
};

export const WHAT_IS_ADVANCED: Depth = {
  simple:
    'Traditional packaging connects one chip to a board. Advanced packaging connects several pieces of silicon to *each other* at almost the same density as wires inside a chip — so that a group of dies behaves like one big chip.',
  founder:
    'A workable definition: packaging is "advanced" when the interconnect between dies is built with wafer-fab processes (lithography, plating, CMP, TSV etch) rather than with board processes (drilling, lamination, wire bonding). Practically that means: fan-out RDL, 2.5D interposers (silicon, RDL or bridge-based), 3D stacking with TSVs, and hybrid bonding. Three commercial consequences follow. First, advanced packaging consumes fab-like capex and fab-like cleanroom space, so capacity expands on fab timelines (18–30 months), not on OSAT timelines. Second, it moves gross margin from the 15–25% OSAT band toward the 40–60% foundry band, which is precisely why TSMC, Intel and Samsung all built it in-house. Third, it makes packaging a *design* problem — the die floorplan, the interposer routing and the power delivery must be co-designed, which creates a software and IP layer (die-to-die PHYs, thermal co-simulation, chiplet standards like UCIe) that did not previously exist.',
};

export const WHY_AI_CHANGED_IT: Depth = {
  simple:
    'AI models need to move enormous amounts of data between the processor and its memory. The only way to do that affordably is to put the memory inside the same package, millimetres away. That requires advanced packaging — so suddenly the world\'s most valuable chips could not be built without it.',
  founder:
    'Three forces converged. (1) The memory wall: transformer training and inference are bandwidth-bound far more than they are FLOP-bound; an accelerator with half the bandwidth does not run at half speed on real workloads, it runs worse. HBM in-package is the only economically viable answer, and HBM requires 2.5D. (2) The reticle wall: you cannot print a die larger than ~858 mm², and the biggest accelerators want several times that, so they are now assembled from multiple reticle-limited dies joined in-package — Blackwell-class parts use two compute dies on one interposer. (3) Scaling economics: node shrinks now deliver less density improvement per dollar, so the cheapest remaining path to more performance per package is integration, not lithography. The strategic result is that packaging capacity became a rationed input to the most profitable product cycle in the industry\'s history. When a single supplier\'s CoWoS line gates how many accelerators exist in a year, packaging stops being a cost line and becomes a control point — which is exactly the kind of structure that creates both extraordinary incumbent returns and genuine startup openings around the edges.',
};

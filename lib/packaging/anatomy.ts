import type { Depth } from './types';

/** Layers of an AI accelerator package, top of the stack to bottom. */
export const PACKAGE_LAYERS: {
  id: string;
  name: string;
  thickness: string;
  material: string;
  what: string;
  detail: string;
  fails: string;
}[] = [
  {
    id: 'coldplate',
    name: 'Cold plate / heat sink',
    thickness: '10–40 mm',
    material: 'Copper, with liquid channels',
    what: 'Carries the heat away from the package into air or liquid.',
    detail:
      'At 700–1,400 W per package, air cooling runs out of physics. Direct-to-chip liquid cooling pumps coolant through microchannels a few millimetres above the die. This is where the package stops being a component and becomes a facilities decision: liquid cooling changes rack design, plumbing, redundancy and the data centre\'s capital plan.',
    fails: 'Uneven contact pressure → a hot spot the package cannot escape.',
  },
  {
    id: 'tim1',
    name: 'TIM1 — thermal interface material',
    thickness: '25–100 µm',
    material: 'Indium solder, polymer TIM, or liquid metal',
    what: 'Fills the microscopic gaps between the die back and the lid.',
    detail:
      'Two surfaces that look flat still touch across only a few percent of their area; the rest is air, which is an insulator. TIM1 fills that gap. It is a tiny amount of material with an outsized effect: a few tenths of a °C·cm²/W of thermal resistance here translates into several degrees of junction temperature, which translates into clock speed. Indium-based solder TIM performs best but adds assembly complexity and reliability concerns under thermal cycling.',
    fails: 'Pump-out and dry-out over thermal cycles — performance decays over months in the field.',
  },
  {
    id: 'lid',
    name: 'Lid / integrated heat spreader',
    thickness: '1–3 mm',
    material: 'Nickel-plated copper',
    what: 'Spreads heat laterally and protects the dies mechanically.',
    detail:
      'The lid also acts as a stiffener, fighting the warpage that a large package develops as it cools from reflow. On the largest packages the lid, stiffener ring and substrate form a mechanical system that must stay flat to tens of microns across 80+ mm — while made of materials that expand at different rates.',
    fails: 'Warpage-induced non-uniform TIM thickness; lid-attach adhesive delamination.',
  },
  {
    id: 'hbm',
    name: 'HBM stacks',
    thickness: '~720–775 µm tall stack',
    material: '8–12 DRAM die + base die, TSV-connected',
    what: 'The memory. Usually 4–8 stacks flanking the compute dies.',
    detail:
      'Each stack presents a 1,024-bit-wide interface (2,048-bit from HBM4) running at comparatively modest per-pin speeds. Width, not frequency, is what makes HBM fast — and width is only affordable because the wires are microns long, inside the package. Stacks must be within a few millimetres of the compute die for the link budget to work, and they must be height-matched to the compute die so one lid can touch everything.',
    fails: 'One weak DRAM die in a 12-high stack scraps a component worth hundreds of dollars.',
  },
  {
    id: 'compute',
    name: 'Compute die(s)',
    thickness: '~50–775 µm (thinned if stacked)',
    material: 'Leading-edge logic silicon',
    what: 'The actual processor — often two reticle-limited dies side by side.',
    detail:
      'The reticle limit of ~858 mm² caps a single die. Flagship accelerators exceed that by placing two near-reticle dies adjacent on the interposer and connecting them with an extremely wide, short die-to-die link — on Blackwell-class parts, a link on the order of 10 TB/s — so that software can treat them as one device. The die-to-die link is itself a design tax: it consumes edge area ("beachfront") and power that could have been compute.',
    fails: 'Die-to-die link training failures; power droop under synchronised workloads.',
  },
  {
    id: 'microbump',
    name: 'Microbumps',
    thickness: '~20–40 µm tall',
    material: 'Copper pillar + SnAg solder cap',
    what: 'The tens of thousands of joints between dies and interposer.',
    detail:
      'At 40–55 µm pitch, a large die presents on the order of 100,000 microbumps. Every one must wet, none may bridge to its neighbour, and all must survive a decade of thermal cycling. Non-wet opens are the dominant assembly defect. The industry roadmap tightens this pitch continuously, and each tightening makes placement accuracy, flux residue and warpage harder at the same time.',
    fails: 'Non-wet open, bridging, electromigration under high current density.',
  },
  {
    id: 'interposer',
    name: 'Interposer',
    thickness: '~100 µm after thinning',
    material: 'Silicon with TSVs, or RDL with embedded bridges',
    what: 'The ultra-fine wiring plane connecting compute dies to HBM.',
    detail:
      'Routes thousands of wires per millimetre of die edge at sub-2 µm line/space, which is 50–100× finer than a substrate can manage. TSVs pass power and lower-speed signals down to the substrate. Because it is printed with a stepper, a silicon interposer larger than one reticle field must be stitched — multiple exposures aligned to each other — and each stitch is a yield risk. "3.3× reticle" packages are at the edge of what is manufacturable.',
    fails: 'Stitching misalignment, TSV voids, interposer cracking during handling.',
  },
  {
    id: 'c4',
    name: 'C4 bumps',
    thickness: '~80–100 µm',
    material: 'Solder',
    what: 'Joins the interposer assembly to the organic substrate.',
    detail:
      'Coarser than microbumps (~130–150 µm pitch) because they must absorb the CTE mismatch between a silicon interposer and an organic substrate — the single largest mechanical stress in the package. This joint is where warpage most often shows up as a defect.',
    fails: 'Corner joint cracking, cold joints from warpage during reflow.',
  },
  {
    id: 'substrate',
    name: 'Organic substrate',
    thickness: '1–2 mm',
    material: 'ABF build-up layers over a core',
    what: 'Fans the connections out to the board and distributes power.',
    detail:
      'A 16–24 layer ABF laminate, 80–120 mm on a side for a large AI package. It carries kilowatt-scale power inward and thousands of high-speed I/O outward. Yield falls sharply with body size and layer count, and a substrate this large is difficult to keep flat — which is exactly the problem glass cores promise to solve.',
    fails: 'Warpage, via cracking, layer-to-layer registration loss on very large bodies.',
  },
  {
    id: 'bga',
    name: 'BGA balls / socket',
    thickness: '~300–600 µm',
    material: 'Solder',
    what: 'Connects the package to the module board.',
    detail:
      'Thousands of balls, most of them power and ground. From here the design problem becomes the board\'s: voltage regulators are placed as close as physically possible — sometimes directly underneath the package on the reverse side — because every millimetre of copper between the regulator and the die is resistance and inductance the chip must tolerate.',
    fails: 'Second-level reliability failures under thermal cycling and shock.',
  },
  {
    id: 'pcb',
    name: 'Module PCB',
    thickness: '2–4 mm',
    material: 'High-speed laminate, 16–30 layers',
    what: 'Carries power in and high-speed links out to the rest of the system.',
    detail:
      'The board hosts voltage regulator modules delivering 1,000+ A, plus the chip-to-chip fabric links to other accelerators. At these speeds the laminate\'s dielectric loss matters, which is why low-loss materials have become a constrained supply item in their own right.',
    fails: 'Insufficient decoupling; insertion loss on long high-speed traces.',
  },
];

export const SYSTEM_CONCEPTS: {
  id: string;
  name: string;
  number: string;
  numberNote: string;
  explain: Depth;
}[] = [
  {
    id: 'membw',
    name: 'Memory bandwidth',
    number: '~8 TB/s',
    numberNote: 'Per-accelerator HBM bandwidth on a current flagship part (fact, vendor spec)',
    explain: {
      simple:
        'How fast the processor can read and write its memory. For AI workloads this matters more than raw arithmetic speed, because the chip spends much of its time waiting for data to arrive.',
      founder:
        'Express it as arithmetic intensity: FLOPs per byte moved. A transformer decode step reads the entire weight set to produce a handful of tokens, so it is bandwidth-bound almost by definition — an accelerator with half the bandwidth does not deliver half the tokens per second, it delivers worse, because utilisation collapses. This is why "FLOPS" is the wrong headline number and why HBM capacity and bandwidth, not compute, are the binding specification in most purchase decisions. It is also why memory vendors captured an unusual share of the AI profit pool.',
    },
  },
  {
    id: 'd2d',
    name: 'Die-to-die bandwidth',
    number: '~10 TB/s',
    numberNote: 'Reported die-to-die link bandwidth on a two-die flagship package (est./vendor claim)',
    explain: {
      simple:
        'How fast two chips inside the same package can talk to each other. If it is fast enough, software can pretend they are a single chip.',
      founder:
        'Two figures of merit: bandwidth per millimetre of die edge (beachfront density, GB/s/mm) and energy per bit (pJ/bit). On-chip wires cost roughly 0.1 pJ/bit; an in-package advanced link ~0.3–0.5 pJ/bit; a standard-package link ~0.5–1 pJ/bit; an off-package SerDes 5–10 pJ/bit; a DDR link 15–20+ pJ/bit. Every order of magnitude you move outward costs power that would otherwise be compute. Beachfront is the scarce resource: a die has finite edge, so bandwidth per millimetre — which is set by the interconnect pitch, hence by the packaging technology — directly caps how a system can be partitioned. This is the precise mechanism by which packaging choice constrains chip architecture.',
    },
  },
  {
    id: 'si',
    name: 'Signal integrity',
    number: '<1 mm',
    numberNote: 'Typical die-to-interposer-to-HBM routing length (est.)',
    explain: {
      simple:
        'Whether a signal still looks like a clean 1 or 0 when it arrives. Longer, thinner, or more crowded wires distort signals until the receiver cannot read them.',
      founder:
        'The relevant physics is loss (dielectric and conductor), crosstalk, reflection from impedance discontinuities, and jitter. At high data rates you either shorten and clean the channel or you spend power and silicon on equalisation, forward error correction and retimers — and those cost latency as well as watts. This is the real reason HBM sits on an interposer rather than on the board: with a sub-millimetre channel you can run a 1,024-bit-wide bus at modest per-pin rates with almost no equalisation. Widen the distance and you would need SerDes on every lane, which would cost more power than the memory access itself.',
    },
  },
  {
    id: 'pdn',
    name: 'Power delivery',
    number: '>1,000 A',
    numberNote: 'Current into a flagship accelerator package at sub-1 V (est.)',
    explain: {
      simple:
        'Getting enough electricity into the chip. At very low voltage you need enormous current, and thin metal wires lose voltage along the way.',
      founder:
        'The power delivery network is a distributed impedance problem across regulator, board, substrate, bumps and on-die grid. Two failure modes: static IR drop (resistance × current, so the die core sees less voltage than the regulator provides) and dynamic droop (a sudden current step through the network\'s inductance). Designers guard-band the voltage upward to survive the worst case, and that guard band costs power quadratically. Mitigations are migrating into the package: on-package inductors and capacitors, vertical power delivery, and backside power delivery (moving the power rails to the wafer\'s reverse side, freeing the front side for signals). Backside power is the clearest case of a front-end process change driven primarily by a packaging-level constraint.',
    },
  },
  {
    id: 'thermal',
    name: 'Thermal density',
    number: '~100 W/cm²',
    numberNote: 'Local hot-spot heat flux on a high-end accelerator (est.)',
    explain: {
      simple:
        'How much heat is produced per unit of chip area. Modern accelerators are comparable to a stovetop element, spread unevenly.',
      founder:
        'Junction temperature is set by power times the total thermal resistance from junction to coolant, and that resistance is a series chain: die → TIM1 → lid → TIM2 → cold plate → coolant. Each link is a business. Two complications specific to advanced packages: non-uniformity (a matrix-multiply unit at 150 W/cm² sits next to an HBM stack that wants to stay below ~95–105 °C), and 3D stacking (heat from a lower tier must pass through every tier above it). Thermal is now the constraint that actually limits how much silicon you can integrate — not lithography, not interconnect. If you want a durable startup thesis in packaging, thermal is the most defensible place to look, because the physics is getting worse every generation.',
    },
  },
  {
    id: 'size',
    name: 'Package size limits',
    number: '858 mm²',
    numberNote: 'Reticle field, 26 × 33 mm (fact)',
    explain: {
      simple:
        'There is a hard maximum to how big a single chip can be printed, and a practical maximum to how big a package can be before it bends too much.',
      founder:
        'Three stacked ceilings. (1) Reticle: a stepper exposes 26 × 33 mm, so a monolithic die cannot exceed ~858 mm². (2) Interposer: going past one reticle requires stitched exposures, and yield falls with stitch count — hence the "3.3× reticle" and "5.5× reticle" language in AI-chip roadmaps. (3) Substrate: body sizes beyond roughly 100 mm square face warpage that current organic laminate struggles to hold flat, which is the core argument for glass and for panel-level processing. Every one of these ceilings is a business: bridges exist to dodge the reticle limit, glass exists to dodge the warpage limit, and panel-level processing exists to dodge the wafer-area limit.',
    },
  },
];

export const BOTTLENECK_NARRATIVE: Depth = {
  simple:
    'For thirty years the chip itself was the hard part and packaging was a finishing step. Now the chip is limited by how much memory and how many dies you can physically attach to it — so packaging decides how fast the product can be.',
  founder:
    'Trace the constraint historically. In the 1990s–2000s performance was gated by transistor scaling; packaging was a cost line item managed by procurement. Dennard scaling ended around 2005 and the constraint moved to power. Around 2015 economics shifted again: node shrinks stopped delivering proportional cost-per-transistor improvement, so integration became the cheaper path to performance, and the reticle limit became a hard wall. Transformers then made bandwidth the binding resource, and in-package memory the only affordable answer. The result is a supply chain where the scarce asset is not wafers but *assembly slots* — CoWoS lines, HBM stacking capacity, large-body ABF substrates, high-end testers. Three consequences worth internalising. First, capacity is contracted rather than traded: allocation is negotiated years ahead by a handful of buyers, so there is no spot market to arbitrage. Second, the constraint moves — it has rotated from interposer capacity to HBM supply to substrates to test time, and it will keep rotating, so any thesis anchored to today\'s specific shortage has a short shelf life. Third, and most usefully for a founder: whenever the binding constraint sits with a supplier whose gross margin is 20%, that supplier will under-invest in capacity relative to what the system needs, because they carry the cycle risk while someone downstream at 70% margin captures the upside. That persistent misalignment — between where the constraint sits and where the margin sits — is the most reliable generator of opportunity in this industry.',
};

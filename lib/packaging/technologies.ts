import type { Technology } from './types';

/**
 * The packaging ladder, cheapest/simplest to most advanced.
 * `costIndex` and `densityIndex` are relative 1–100 scales used for the
 * scatter plot — illustrative positioning, not quoted prices.
 */
export const TECHNOLOGIES: Technology[] = [
  {
    id: 'wirebond',
    name: 'Wire bonding',
    family: 'legacy',
    rung: 1,
    era: '1957 → today',
    problem: 'Connect a die to a lead frame or substrate as cheaply as physically possible.',
    how: {
      simple:
        'A machine welds a hair-thin gold or copper wire from a pad on the edge of the chip to a pad on the package, one wire at a time, several times per second.',
      founder:
        'Thermosonic ball-wedge bonding: a capillary forms a free-air ball on the wire tip, presses it onto the die pad under heat and ultrasonic energy to form an intermetallic weld, loops to the substrate and forms a wedge bond. Copper replaced gold for cost, at the price of a harder bond requiring tighter process control and pad-under-bond design. Key constraint: pads must be on the die *perimeter*, so I/O count scales with the die\'s circumference, not its area. That single geometric fact is why wire bonding cannot serve high-I/O logic and why flip chip had to be invented.',
    },
    interconnectPitch: '35–60 µm pad pitch, perimeter only',
    relativeCost: 'Cents to low single-digit dollars per package',
    costIndex: 4,
    densityIndex: 5,
    performance: 'Wire inductance (~1 nH/mm) limits speed; fine for sub-GHz and power devices.',
    thermal: 'Heat exits mostly downward through the lead frame; adequate to a few watts.',
    useCases: ['Microcontrollers', 'Power discretes', 'Sensors', 'NAND flash stacks', 'Analog / RF'],
    players: ['ASE', 'Amkor', 'JCET', 'K&S and ASMPT (tooling)'],
    difficulty: 1,
    gotcha:
      'Still the majority of the world\'s packaged units by count. "Old" does not mean "dead" — it means the profit pool is elsewhere.',
  },
  {
    id: 'flipchip',
    name: 'Flip chip',
    family: 'flipchip',
    rung: 2,
    era: '1960s (IBM C4) → today',
    problem: 'Escape the perimeter: use the entire die face for connections, and shorten every connection.',
    how: {
      simple:
        'Instead of wires from the edge, the chip is covered in a grid of tiny solder balls, flipped face-down, and soldered directly onto the substrate.',
      founder:
        'Controlled Collapse Chip Connection (C4). Solder bumps — increasingly copper pillars with a solder cap, because pillars do not collapse and so support finer pitch — are plated across the whole die face. The die is flipped, reflowed onto the substrate, then underfilled with a capillary epoxy that redistributes the CTE-mismatch stress across the joint field instead of concentrating it at the corner bumps. Flip chip buys you area-array I/O (I/O scales with die area), ~an order of magnitude less interconnect inductance than wire, and a direct thermal path out of the back of the die. It is the foundation every advanced package is built on.',
    },
    interconnectPitch: '~130–150 µm (C4), ~80–110 µm with copper pillar',
    relativeCost: 'Single-digit to low tens of dollars per package',
    costIndex: 15,
    densityIndex: 25,
    performance: 'Enables multi-GHz I/O and proper power delivery through the die face.',
    thermal: 'Good — the die back is exposed for a lid and cold plate.',
    useCases: ['CPUs', 'GPUs', 'High-end SoCs', 'Networking ASICs'],
    players: ['Everyone. Table stakes since the 2000s.'],
    difficulty: 2,
    gotcha:
      'Underfill is where flip chip actually succeeds or fails. It is a materials and dispense-process problem, not an electrical one.',
  },
  {
    id: 'fanin',
    name: 'Fan-in WLP (wafer-level packaging)',
    family: 'wafer-level',
    rung: 3,
    era: '2000s → today',
    problem: 'Package a small, low-I/O die with essentially zero added area or cost.',
    how: {
      simple:
        'Do the packaging while the chips are still on the wafer, then cut them up. The finished package is exactly the size of the chip.',
      founder:
        'Wafer-level chip-scale packaging (WLCSP): passivation, a thin redistribution layer and under-bump metallisation are patterned across the whole wafer, solder balls dropped, and the wafer singulated into finished packages. Cost is per-wafer rather than per-unit, which makes it devastatingly cheap for small die — and useless for large die, because the ball count is capped by the die\'s own area and board-level reliability degrades as the package grows. The limitation of "package = die size" is precisely what fan-out was invented to remove.',
    },
    interconnectPitch: '~300–400 µm ball pitch, RDL at 5–10 µm lines',
    relativeCost: 'Cents per die at volume',
    costIndex: 8,
    densityIndex: 15,
    performance: 'Shortest possible path to the board for small parts.',
    thermal: 'Limited — no lid, no spreader, small area.',
    useCases: ['Power management ICs', 'RF front ends', 'Sensors', 'Mobile companion chips'],
    players: ['ASE', 'Amkor', 'TSMC (WLCSP)', 'JCET'],
    difficulty: 2,
    gotcha:
      'Board-level reliability, not the package, is the limiting factor — solder joints under a rigid silicon package fatigue under thermal cycling.',
  },
  {
    id: 'fanout',
    name: 'Fan-out WLP',
    family: 'wafer-level',
    rung: 4,
    era: '2009 (eWLB) → mainstream 2016 (InFO)',
    problem: 'Get more I/O than the die\'s own area allows, without paying for a substrate.',
    how: {
      simple:
        'Cut the chips out, spread them apart on a carrier with gaps between them, mould them into an artificial "wafer" of plastic, then print wiring across both the chips and the moulded area. You now have more room for connections than the chip itself has.',
      founder:
        'Reconstituted-wafer processing. Known-good die are placed face-down (or face-up, in chip-last/RDL-first flows) on a carrier, over-moulded, the carrier released, and RDL built directly onto the die face and out over the mould. This removes the laminate substrate entirely — less z-height, lower inductance, better thermal and lower cost at the right volumes. Two commercial facts matter: (1) Apple\'s adoption of TSMC\'s InFO for the A10 application processor in 2016 made fan-out a high-volume technology overnight; (2) die shift — the few microns each die moves during moulding — is *the* yield problem, and solving it with adaptive lithography is what separates a viable fan-out line from an expensive one.',
    },
    interconnectPitch: 'RDL 2/2 µm to 10/10 µm lines/spaces',
    relativeCost: 'Low tens of dollars; cheaper than 2.5D by a wide margin',
    costIndex: 25,
    densityIndex: 40,
    performance: 'Good die-to-die bandwidth at a fraction of interposer cost.',
    thermal: 'Mould compound is a poor conductor; needs exposed die or integrated heat spreader.',
    useCases: ['Mobile application processors', 'RF modules', 'Automotive radar', 'Mid-range chiplet products'],
    players: ['TSMC (InFO)', 'ASE (FOCoS)', 'Amkor (S-SWIFT)', 'Samsung', 'JCET'],
    difficulty: 3,
    gotcha:
      'Panel-level fan-out (rectangular 500+ mm panels instead of 300 mm wafers) is the cost lever everyone is chasing — more usable area per pass, but harder warpage and lithography uniformity.',
  },
  {
    id: 'tsv',
    name: 'TSV — through-silicon via',
    family: '3d',
    rung: 5,
    era: 'Volume since ~2013 (HBM)',
    problem: 'Get a signal from the top of a die to the bottom, so dies can be stacked.',
    how: {
      simple:
        'Drill microscopic holes straight through the silicon and fill them with copper, so the chip has wiring running vertically through it as well as horizontally across it.',
      founder:
        'Deep reactive-ion etch (Bosch process) creates high-aspect-ratio vias, typically ~5–10 µm diameter on 10:1 to 20:1 aspect ratio; they are lined with an insulator and barrier, then copper-plated. "Via-middle" integration — after transistors, before back-end metal — is the mainstream flow. The wafer is then bonded to a temporary carrier, thinned from the back until the copper is exposed ("TSV reveal"), and backside pads are formed. Three founder-relevant consequences: TSVs consume die area and impose keep-out zones, so they are a real silicon tax; copper expands ~3× faster than silicon so each via creates a local stress field that transistors must be kept away from; and the whole flow requires temporary bonding/debonding, which is a distinct equipment and materials market (EVG, SUSS, Brewer Science).',
    },
    interconnectPitch: '~5–10 µm diameter, 40–50 µm pitch',
    relativeCost: 'Adds meaningful cost per wafer; the price of admission to 3D',
    costIndex: 35,
    densityIndex: 55,
    performance: 'Enables vertical bandwidth impossible any other way — the basis of HBM.',
    thermal: 'Copper vias help conduct heat vertically, but stacked die still trap heat internally.',
    useCases: ['HBM stacks', 'Silicon interposers', 'CMOS image sensors', '3D logic'],
    players: ['SK hynix', 'Samsung', 'Micron', 'TSMC', 'Intel'],
    difficulty: 4,
    gotcha:
      'The TSV itself is mature. The hard part is everything around it: thinning to 50 µm, handling the thinned wafer, and the stress keep-out rules that cost you usable silicon.',
  },
  {
    id: 'interposer',
    name: 'Silicon interposer (2.5D)',
    family: '2.5d',
    rung: 6,
    era: '2011 (Xilinx Virtex-7) → today',
    problem: 'Wire two or more dies together at nearly on-chip density, when a substrate cannot.',
    how: {
      simple:
        'Put a blank slice of silicon underneath the chips and use it as an ultra-fine circuit board. Because it is made in a chip factory, its wires can be a hundred times finer than a normal board\'s.',
      founder:
        'A passive (usually) silicon wafer carrying several layers of damascene copper at ~0.4–2 µm line/space, plus TSVs so that power and low-speed signals can pass through to the substrate below. Dies attach to the interposer top with microbumps at 40–55 µm pitch; the interposer attaches to the organic substrate with C4 bumps. Why silicon: matched CTE with the dies (no thermal fighting), fab-grade lithography (routing density), and a smooth enough surface for fine microbumps. Why it hurts: interposers are printed with the same steppers as chips, so a single interposer field is limited to the ~858 mm² reticle, and going bigger requires stitching multiple exposures — which is a yield and alignment problem that grows superlinearly with area. Every "3.3× reticle" or "5.5× reticle" figure you read in AI-chip coverage is describing exactly this constraint.',
    },
    interconnectPitch: 'Microbumps 40–55 µm; RDL ~0.4–2 µm line/space',
    relativeCost: 'Hundreds of dollars per unit for large AI-class interposers (est.)',
    costIndex: 65,
    densityIndex: 80,
    performance: 'Terabytes/second between dies; the enabler for in-package HBM.',
    thermal: 'Silicon conducts heat well, but the interposer adds a thermal resistance layer beneath the dies.',
    useCases: ['AI accelerators', 'HPC', 'High-end FPGAs', 'Networking switch silicon'],
    players: ['TSMC (CoWoS-S)', 'Samsung (I-Cube)', 'UMC', 'Amkor', 'ASE'],
    difficulty: 5,
    gotcha:
      'Interposer area is expensive silicon that computes nothing. The entire industry roadmap is about using *less* of it — bridges, organic interposers, glass.',
  },
  {
    id: 'organic',
    name: 'Organic / RDL interposer',
    family: '2.5d',
    rung: 6,
    era: '2016 → today',
    problem: 'Get most of the interposer\'s density without paying for silicon or a reticle limit.',
    how: {
      simple:
        'Instead of a silicon slice, build the fine wiring directly in high-grade plastic layers. Cheaper and unlimited in size, but the wires cannot be quite as fine.',
      founder:
        'Polymer-dielectric RDL (polyimide or PID) built on a carrier, giving ~2 µm line/space — roughly 3–5× coarser than silicon damascene but 5–10× finer than a conventional ABF substrate. No reticle limit, so package size scales freely; no TSVs, so cost drops. TSMC\'s CoWoS-R and Amkor\'s S-SWIFT sit here. The trade-offs are real: polymer has higher CTE than silicon, so warpage management is harder on big bodies; dielectric loss is higher at very high frequencies; and dimensional stability limits how fine you can go. Eliyan\'s thesis — that a well-designed PHY over organic can rival interposer bandwidth — is the sharpest commercial bet on this layer.',
    },
    interconnectPitch: 'RDL ~2/2 µm; microbumps 40–55 µm',
    relativeCost: 'Meaningfully cheaper than silicon interposer (est. 30–60% less)',
    costIndex: 45,
    densityIndex: 60,
    performance: 'Sufficient for many chiplet designs; marginal for maximum-bandwidth HBM stacks.',
    thermal: 'Polymer conducts heat poorly; thermal design is harder than silicon.',
    useCases: ['Networking', 'Mid-range accelerators', 'Chiplet SoCs', 'Cost-down 2.5D'],
    players: ['TSMC (CoWoS-R, InFO_oS)', 'Amkor (S-SWIFT)', 'ASE (FOCoS)', 'Eliyan (IP)'],
    difficulty: 4,
    gotcha:
      'This is the layer where cost-driven volume will land. If you believe 2.5D goes mainstream beyond flagship AI, you should believe organic wins the units even if silicon keeps the headlines.',
  },
  {
    id: 'bridge',
    name: 'Silicon bridge (EMIB / LSI)',
    family: '2.5d',
    rung: 7,
    era: '2017 (Intel EMIB) → today',
    problem: 'You only need extreme density *where two dies meet*, so stop paying for a full silicon sheet.',
    how: {
      simple:
        'Bury a small piece of silicon in the substrate exactly under the seam between two chips. Only the seam gets ultra-fine wiring; everything else uses the ordinary cheap substrate.',
      founder:
        'Intel\'s Embedded Multi-die Interconnect Bridge embeds a small passive silicon die in a cavity in the organic substrate; dies land partly on the bridge (fine pitch) and partly on the substrate (coarse pitch, power). TSMC\'s CoWoS-L uses the same idea with Local Silicon Interconnect tiles embedded in an RDL interposer. The economics are compelling: bridge silicon is a few tens of mm² instead of 2,500+ mm², there is no reticle ceiling on package size, and no TSVs are required. The cost is process complexity — cavity formation, bridge placement accuracy, and the co-planarity of a die sitting on two different materials at once. Bridges are the compromise the industry converged on, which is why CoWoS-L became the platform for the largest AI packages.',
    },
    interconnectPitch: 'Bridge region ~45–55 µm microbump; roadmap to sub-25 µm',
    relativeCost: 'Between organic and silicon interposer',
    costIndex: 55,
    densityIndex: 75,
    performance: 'Interposer-class bandwidth on the links that need it.',
    thermal: 'Better than full interposer — fewer intervening layers over most of the die area.',
    useCases: ['Intel CPUs/GPUs', 'Largest AI accelerators (CoWoS-L)', 'Multi-HBM designs'],
    players: ['Intel (EMIB)', 'TSMC (CoWoS-L / LSI)', 'IBM/others in research'],
    difficulty: 5,
    gotcha:
      'Bridge placement accuracy inside a laminate cavity is the hidden yield killer — you are asking a substrate line to hit fab-like tolerances.',
  },
  {
    id: '3dstack',
    name: '3D stacking (microbump)',
    family: '3d',
    rung: 8,
    era: '2013 (HBM) → today',
    problem: 'Put dies on top of each other to shorten wires and multiply density per unit of board area.',
    how: {
      simple:
        'Stack chips vertically like floors in a building, with the TSVs acting as lift shafts and tiny solder bumps as the joins between floors.',
      founder:
        'Die-to-die or die-to-wafer stacking using microbumps at 40–55 µm pitch, with TSVs carrying signal and power through each tier. Bonded thermocompressively, with either capillary/non-conductive film underfill (Samsung\'s TC-NCF) or a mass-reflow-then-mould approach (SK hynix\'s MR-MUF, which also improves heat conduction through the gap material). Physical limits bite fast: each bump layer adds thickness, so a 12-high stack must use ~30 µm-thin die; heat from the bottom tiers must travel through every tier above; and the whole stack is only as good as the worst die in it. HBM is the volume application, and its economics are why known-good-die and stack-level repair matter so much.',
    },
    interconnectPitch: '40–55 µm microbump pitch',
    relativeCost: 'Significant adder; the reason HBM costs several times commodity DRAM per bit',
    costIndex: 60,
    densityIndex: 70,
    performance: 'Thousands of vertical connections; the basis of HBM\'s 1,024-bit-wide interface.',
    thermal: 'The core problem. Stacked die trap heat; the gap material dominates thermal resistance.',
    useCases: ['HBM', '3D NAND controllers', 'Stacked sensors', 'Logic-on-logic (early)'],
    players: ['SK hynix', 'Samsung', 'Micron', 'TSMC', 'Amkor'],
    difficulty: 4,
    gotcha:
      'Microbump 3D is a dead end above ~12 tiers. Everything past that requires hybrid bonding, which is why HBM4/HBM5 roadmaps and bonder capex are the same conversation.',
  },
  {
    id: 'hybrid',
    name: 'Hybrid bonding (Cu–Cu direct bond)',
    family: '3d',
    rung: 9,
    era: '2016 (image sensors) → logic from ~2021',
    problem: 'Remove the solder entirely — get 10–100× more vertical connections and less resistance.',
    how: {
      simple:
        'Polish two chip surfaces until they are atomically flat, press them together so the copper pads fuse directly with no solder at all, and heat them so the bond completes. The connections can then be ten times closer together.',
      founder:
        'Dielectric-to-dielectric bond (SiO₂/SiCN) forms at room temperature by Van der Waals then covalent bonding; a low-temperature anneal (~200–300 °C) causes the recessed copper pads to expand and form a metallic Cu–Cu joint. Requirements are brutal: sub-nanometre surface roughness, copper dishing controlled to a few nanometres by CMP, sub-200 nm placement accuracy, and near-total particle exclusion — a single particle creates a void that scraps both wafers. Pitches reach below 10 µm today with roadmaps toward 1 µm, against 40–55 µm for microbumps; since connection density goes as pitch², that is a 25–2,500× density improvement, plus much lower parasitic capacitance and resistance per link. Wafer-to-wafer bonding is highest throughput but requires identical die sizes and wastes a good wafer when paired with a bad one; die-to-wafer preserves known-good-die but is far slower, which is exactly the throughput problem BESI/AMAT and ASMPT are selling tools against.',
    },
    interconnectPitch: '<10 µm today; roadmap to 1–3 µm',
    relativeCost: 'High — new tools, new cleanliness class, low throughput today',
    costIndex: 85,
    densityIndex: 98,
    performance: 'The highest-density die-to-die connection that exists.',
    thermal: 'Better than microbump (no low-conductivity solder/underfill gap), but stacked power density still rises.',
    useCases: ['AMD 3D V-Cache', 'CMOS image sensors', 'HBM4+ base die', 'Future logic-on-logic'],
    players: ['TSMC (SoIC)', 'Intel (Foveros Direct)', 'Samsung (SAINT)', 'Sony', 'BESI/AMAT, ASMPT (tools)'],
    difficulty: 5,
    gotcha:
      'This is the single most important process transition in packaging. Yield and throughput — not capability — are what is holding it back, and that is precisely where startup value can be created.',
  },
  {
    id: 'chiplet',
    name: 'Chiplets',
    family: 'platform',
    rung: 7,
    era: '2017 (AMD EPYC) → industry standard',
    problem: 'Monolithic dies got too big to yield and too expensive to scale.',
    how: {
      simple:
        'Instead of one huge chip, build several smaller specialised chips and connect them inside one package. Each small chip is cheaper to make and more likely to work.',
      founder:
        'A design and business strategy rather than a process. Three independent wins: (1) yield — defect probability scales with area, so four 200 mm² dies yield far better than one 800 mm² die; (2) heterogeneity — put the cache on a mature cheap node, the SerDes on a node tuned for analog, the compute on the leading edge, instead of paying leading-edge prices for everything; (3) reuse — one compute chiplet can serve several SKUs, amortising a nine-figure design cost. The costs are equally real: die-to-die interfaces burn power and beachfront area, the package gets more expensive, test complexity multiplies, and thermal management gets harder. UCIe is the attempt to standardise the interface so that a merchant chiplet market can exist; whether that market ever materialises — versus chiplets remaining an internal technique of large vertically integrated designers — is one of the genuinely open strategic questions in the industry, and the one most worth forming a view on.',
    },
    interconnectPitch: 'Depends on substrate: 45 µm (standard) to <10 µm (advanced/hybrid)',
    relativeCost: 'Lowers silicon cost, raises packaging and test cost',
    costIndex: 50,
    densityIndex: 65,
    performance: 'Enables designs far past the reticle limit.',
    thermal: 'Multiple hot dies in one package; non-uniform, harder to cool than a monolith.',
    useCases: ['AMD EPYC/MI300', 'Intel Meteor Lake', 'NVIDIA Blackwell/Rubin class', 'Custom hyperscaler ASICs'],
    players: ['AMD', 'Intel', 'NVIDIA', 'Broadcom', 'Marvell', 'Silicon Box', 'UCIe consortium'],
    difficulty: 4,
    gotcha:
      'Ask any chiplet startup: who is your second customer? The technology is real; the *merchant market* is mostly still theoretical.',
  },
  {
    id: 'cowos',
    name: 'CoWoS (TSMC)',
    family: 'platform',
    rung: 8,
    era: '2012 → today',
    problem: 'Deliver 2.5D integration as a productised, qualified, high-volume service.',
    how: {
      simple:
        'TSMC\'s brand name for its 2.5D packaging: chips are placed on a wafer-scale interposer first, and then that whole assembly is mounted on a substrate.',
      founder:
        '"Chip on Wafer on Substrate" describes the order of operations, and the order is the point: dies are bonded to the interposer wafer *before* the interposer is singulated and attached to the substrate, which allows wafer-scale handling and testing of the assembly. Three variants: CoWoS-S (silicon interposer, highest density, reticle-stitching limited), CoWoS-R (RDL/organic interposer, cheaper, larger), CoWoS-L (LSI bridge tiles in an RDL interposer — the platform for the largest current AI packages). CoWoS is the closest thing the industry has to a physical bottleneck on AI compute supply, which makes its capacity guidance one of the most-watched numbers in semis.',
    },
    interconnectPitch: 'Microbumps 40–55 µm; interposer RDL sub-µm to 2 µm depending on variant',
    relativeCost: 'Several hundred to low thousands of dollars per large package (est.)',
    costIndex: 80,
    densityIndex: 88,
    performance: 'Supports 8–12 HBM stacks alongside multiple reticle-sized compute dies.',
    thermal: 'Requires lid, high-performance TIM and, at the top end, direct liquid cooling.',
    useCases: ['Essentially every high-end AI training accelerator'],
    players: ['TSMC', 'with Amkor/SPIL/ASE doing outsourced portions of the flow'],
    difficulty: 5,
    gotcha:
      'CoWoS capacity is contracted years ahead by a handful of customers. "Available capacity" is a meaningless phrase here — allocation is the currency.',
  },
  {
    id: 'info',
    name: 'InFO (TSMC)',
    family: 'platform',
    rung: 5,
    era: '2016 → today',
    problem: 'High-density packaging for mobile, where cost and thickness dominate.',
    how: {
      simple:
        'TSMC\'s fan-out technology — the one inside iPhone processors. It removes the substrate entirely to save cost and thickness.',
      founder:
        'Integrated Fan-Out. The flagship variant, InFO-PoP, stacks a memory package on top of the fan-out application processor with through-InFO vias carrying signals up. Winning the Apple A10 socket in 2016 gave TSMC both the volume to industrialise fan-out and a strategic lock on Apple. Variants extended into InFO_oS (on substrate) and InFO_SoW (system-on-wafer, used by Tesla\'s Dojo) — the latter being the most radical: a whole wafer kept intact as a single compute module.',
    },
    interconnectPitch: 'RDL 2/2 µm typical',
    relativeCost: 'Low tens of dollars; cheaper than a substrate-based equivalent',
    costIndex: 30,
    densityIndex: 45,
    performance: 'Excellent for mobile power/thickness budgets.',
    thermal: 'Mould compound limits; acceptable at mobile power levels.',
    useCases: ['Apple A/M-series', 'Mobile SoCs', 'Tesla Dojo (InFO_SoW)'],
    players: ['TSMC'],
    difficulty: 4,
    gotcha:
      'InFO is the reminder that packaging innovation is not only an AI story — the largest-volume advanced packaging on earth is in phones.',
  },
  {
    id: 'soic',
    name: 'SoIC (TSMC)',
    family: '3d',
    rung: 9,
    era: '2020 → today',
    problem: 'Stack logic on logic with on-chip-like interconnect density.',
    how: {
      simple:
        'TSMC\'s hybrid bonding product — chips fused directly face-to-face with no bumps, so they behave almost like one chip.',
      founder:
        'System on Integrated Chips: bumpless Cu–Cu hybrid bonding, chip-on-wafer, supporting both face-to-face and face-to-back configurations with sub-10 µm bond pitch. Commercially proven by AMD\'s 3D V-Cache, where an SRAM die is bonded on top of a CPU core complex die. SoIC is routinely combined with CoWoS — stack logic vertically with SoIC, then place those stacks plus HBM on an interposer. That combination (3D inside 2.5D) is where high-end packaging is going, and it multiplies the number of ways a package can fail.',
    },
    interconnectPitch: '<10 µm bond pitch; roadmap tighter',
    relativeCost: 'Premium; adds hybrid bonding cost on top of 2.5D',
    costIndex: 90,
    densityIndex: 95,
    performance: 'Bandwidth density an order of magnitude above microbump 3D.',
    thermal: 'Hardest thermal case in packaging — logic directly on logic.',
    useCases: ['AMD 3D V-Cache', 'Next-gen AI accelerators', 'HBM base-die integration'],
    players: ['TSMC'],
    difficulty: 5,
    gotcha:
      'Stacking logic on logic doubles the power density in the same footprint. The limiter is thermal, not electrical.',
  },
  {
    id: 'foveros',
    name: 'Foveros (Intel)',
    family: '3d',
    rung: 8,
    era: '2019 → today',
    problem: 'Stack active dies on an active base die to build modular CPUs.',
    how: {
      simple:
        'Intel\'s 3D stacking: a base chip acts as the foundation and does useful work, with other chips stacked on top of it.',
      founder:
        'Face-to-face die stacking on an *active* base die that carries power delivery, I/O and interconnect fabric — distinct from a passive interposer. Microbump pitch has scaled from 50 µm (Lakefield) to 36 µm (Meteor Lake) and to 25 µm and below in Foveros Omni/Direct. Foveros Direct switches to hybrid bonding, sub-10 µm. Combined with EMIB, this is Intel\'s claim to packaging leadership — and it is a genuine one. Intel Foundry sells advanced packaging as a standalone service, which is worth noticing: you can buy Intel packaging without buying Intel silicon.',
    },
    interconnectPitch: '36 µm → 25 µm → sub-10 µm (Direct)',
    relativeCost: 'Comparable to other 3D approaches',
    costIndex: 75,
    densityIndex: 85,
    performance: 'Enables disaggregated CPU architectures.',
    thermal: 'Active-on-active stacking concentrates power; a leading constraint.',
    useCases: ['Intel Meteor/Arrow Lake', 'Ponte Vecchio', 'Foundry customers'],
    players: ['Intel'],
    difficulty: 5,
    gotcha:
      'Intel\'s packaging is technically excellent and commercially under-monetised. Whether that gap closes is one of the sector\'s more interesting bets.',
  },
  {
    id: 'glass',
    name: 'Glass core substrates',
    family: 'platform',
    rung: 8,
    era: 'Pilot; volume targeted later this decade',
    problem: 'Organic substrates warp and cannot support fine enough wiring for the biggest packages.',
    how: {
      simple:
        'Replace the plastic core of the substrate with a sheet of glass. Glass is flatter, stiffer, and can have very precise holes drilled through it by laser — so wiring can be finer and the package can be bigger without bending.',
      founder:
        'Glass offers CTE tuneable toward silicon (~3–8 ppm/K vs ~17 for organic), far better dimensional stability, higher stiffness, and through-glass vias at pitches organic laminate cannot reach. That means larger package bodies with less warpage, higher interconnect density, and potentially the elimination of a separate silicon interposer. The barriers are real: glass is brittle and cracks propagate catastrophically, TGV formation at scale is not yet cheap, handling infrastructure does not exist at volume, and — the most underrated point — nobody has a decade of field-reliability data. Watch Absolics (SKC) in Georgia, Intel\'s programme, Samsung, Corning, AGC and Schott. This is the highest-profile "reset the incumbent learning curve" opportunity in packaging.',
    },
    interconnectPitch: 'TGV roadmap toward <100 µm pitch; RDL 2 µm and below',
    relativeCost: 'Unproven; currently expensive, argued to be cheaper at maturity',
    costIndex: 70,
    densityIndex: 80,
    performance: 'Enables very large, very flat packages.',
    thermal: 'Glass conducts heat poorly (~1 W/m·K vs ~150 for silicon) — a genuine unsolved trade-off.',
    useCases: ['Future large AI packages', 'Co-packaged optics', 'Panel-level integration'],
    players: ['Intel', 'Absolics/SKC', 'Samsung', 'Corning', 'AGC', 'Schott', 'LG Innotek'],
    difficulty: 5,
    gotcha:
      'The bull case is real but the timeline slips constantly. Ask anyone selling you glass: what is your crack-propagation and field-reliability data, and on how many units?',
  },
];

export const LADDER_AXES = {
  cost: { label: 'Relative cost per package', low: 'cents', high: 'thousands of $' },
  density: { label: 'Interconnect density', low: 'perimeter wires', high: 'sub-10 µm hybrid bond' },
};

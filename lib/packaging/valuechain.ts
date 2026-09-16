import type { ValueChainLayer } from './types';

/**
 * Thirteen layers, ordered from most abstract (design tools) to most physical
 * (data centre). Margins and concentration figures are industry estimates and
 * move with the cycle — treat the *ordering* as the durable insight.
 */
export const VALUE_CHAIN: ValueChainLayer[] = [
  {
    id: 'eda',
    name: 'EDA software',
    what: 'The software used to design, verify and lay out a chip.',
    detail:
      'Without EDA no chip exists. Synopsys and Cadence together hold the majority of the market, with Siemens EDA third. The business is licence + maintenance, sold to every designer on earth, with switching costs measured in retrained engineering organisations and requalified flows. Advanced packaging created a new EDA surface area: multi-die floorplanning, thermal co-simulation, warpage prediction and chiplet assembly flows.',
    grossMargin: '~80–90%',
    capitalIntensity: 1,
    switchingCost: 5,
    technicalDifficulty: 5,
    concentration: 'Synopsys + Cadence ≈ 70%+ of EDA',
    concentrationScore: 5,
    startupEntry: 3,
    startupNote:
      'Point tools do get bought — multi-die thermal, warpage and chiplet-assembly analysis are genuinely underserved. You are building to be acquired by Synopsys/Cadence, not to displace them.',
    companies: [
      { name: 'Synopsys', note: 'Largest EDA vendor; also the biggest third-party IP supplier.' },
      { name: 'Cadence', note: 'Strong in analog/custom, packaging & system analysis (Allegro, Clarity, Celsius).' },
      { name: 'Siemens EDA', note: 'Formerly Mentor; strong in verification, test (Tessent) and PCB/package.' },
      { name: 'Ansys', note: 'Multiphysics — thermal, warpage, signal/power integrity. Acquired by Synopsys.' },
    ],
    valueCapture: 'Taxes every design, captures no manufacturing risk. Best margins in the chain.',
  },
  {
    id: 'ip',
    name: 'Semiconductor IP',
    what: 'Pre-designed, pre-verified circuit blocks licensed into other people\'s chips.',
    detail:
      'Arm licenses CPU architectures and cores; Synopsys, Cadence and Alphawave license the hard blocks nobody wants to build twice — DDR/HBM memory controllers and PHYs, SerDes, PCIe, and now die-to-die interfaces (UCIe). The die-to-die PHY is the interesting new slot: as chiplet designs proliferate, whoever owns the interconnect IP sits at a toll booth between every pair of dies.',
    grossMargin: '~90%+',
    capitalIntensity: 1,
    switchingCost: 5,
    technicalDifficulty: 5,
    concentration: 'Arm dominant in CPU ISA; Synopsys/Cadence dominant in interface IP',
    concentrationScore: 4,
    startupEntry: 3,
    startupNote:
      'Interface IP startups are real (Alphawave, Eliyan) but require silicon-proven results on a leading node — that is a $30m+ proof point before your first meaningful licence.',
    companies: [
      { name: 'Arm', note: 'CPU architecture licensing; royalty on billions of units.' },
      { name: 'Synopsys IP', note: 'Largest interface IP portfolio — HBM PHY, PCIe, UCIe.' },
      { name: 'Alphawave', note: 'High-speed SerDes and chiplet connectivity.' },
      { name: 'Eliyan', note: 'Startup: high-bandwidth die-to-die over organic substrate rather than silicon interposer.' },
    ],
    valueCapture: 'Royalty on volume. Zero manufacturing exposure, extreme design-win latency.',
  },
  {
    id: 'fabless',
    name: 'Fabless chip designers',
    what: 'Companies that design and sell chips but own no factories.',
    detail:
      'They capture the architectural and software value, outsource the capital. In AI this layer has captured the majority of the industry\'s incremental profit, because the scarce asset turned out to be a full-stack platform (silicon + interconnect + software) rather than any single manufacturing capability. Note that these companies are now *packaging customers of record*: NVIDIA books CoWoS capacity directly with TSMC and buys HBM directly from the memory makers.',
    grossMargin: '~45–75% (NVIDIA at the top, merchant SoC vendors lower)',
    capitalIntensity: 2,
    switchingCost: 5,
    technicalDifficulty: 5,
    concentration: 'AI accelerators: NVIDIA holds the large majority of merchant volume',
    concentrationScore: 5,
    startupEntry: 2,
    startupNote:
      'Designing a competitive AI accelerator costs $100m+ before first revenue, and the moat is software, not silicon. Most AI-chip startups die on the software and ecosystem side, not the hardware side.',
    companies: [
      { name: 'NVIDIA', note: 'GPU + CUDA + NVLink + systems. Largest single consumer of advanced packaging and HBM.' },
      { name: 'AMD', note: 'Earliest large-scale chiplet adopter; MI-series uses 2.5D + 3D stacking together.' },
      { name: 'Broadcom', note: 'Custom ASICs for hyperscalers plus networking silicon; a quiet giant of advanced packaging demand.' },
      { name: 'Apple', note: 'Drove fan-out (InFO) into consumer volume; UltraFusion bridges two dies.' },
      { name: 'Marvell', note: 'Custom silicon, optics DSPs, and a chiplet/HBM integration platform.' },
    ],
    valueCapture: 'Captures the system-level margin; bears inventory and supply-allocation risk.',
  },
  {
    id: 'foundry',
    name: 'Foundries',
    what: 'Contract manufacturers of the transistors themselves.',
    detail:
      'The most capital-intensive business in the chain and now, via CoWoS/InFO/SoIC, also the most important advanced packaging provider. TSMC\'s strategic move was to refuse to let packaging be outsourced for its top customers — keeping the die and the interposer under one roof shortens the debug loop and captures margin that would have gone to OSATs.',
    grossMargin: '~50–60% (TSMC); far lower for sub-scale players',
    capitalIntensity: 5,
    switchingCost: 5,
    technicalDifficulty: 5,
    concentration: 'TSMC ~90%+ of leading-edge logic (est.)',
    concentrationScore: 5,
    startupEntry: 1,
    startupNote:
      'A leading-edge fab is $20bn+ and a decade of process learning. There is no startup path. Specialty and packaging-only "fabs" (see Silicon Box) are the only realistic adjacent play.',
    companies: [
      { name: 'TSMC', note: 'Leading edge + CoWoS, InFO, SoIC. The system\'s load-bearing wall.' },
      { name: 'Samsung Foundry', note: 'Second leading-edge source; uniquely also makes HBM, and sells turnkey logic+memory+packaging.' },
      { name: 'Intel Foundry', note: 'EMIB and Foveros are genuinely differentiated packaging assets, sold increasingly as standalone services.' },
      { name: 'GlobalFoundries / UMC', note: 'Mature nodes; UMC partners on interposers and packaging capacity.' },
    ],
    valueCapture: 'Owns the physical chokepoint. Converts capex into pricing power during shortage.',
  },
  {
    id: 'wfe',
    name: 'Wafer fab equipment',
    what: 'The machines that etch, deposit, pattern, polish and measure.',
    detail:
      'Structurally the best business in hardware: an oligopoly per process step, sold into a capex cycle, with service and spares revenue attached. ASML\'s EUV monopoly is the most extreme example in modern industry. Advanced packaging is now a growth segment for all of them, because interposer and RDL processing needs the same lithography, plating, CMP and metrology toolset as front-end, just at looser dimensions.',
    grossMargin: '~45–60%',
    capitalIntensity: 2,
    switchingCost: 5,
    technicalDifficulty: 5,
    concentration: 'ASML monopoly in EUV; AMAT/Lam/TEL oligopoly per step',
    concentrationScore: 5,
    startupEntry: 2,
    startupNote:
      'New categories are where startups enter — hybrid bonding alignment, panel-level handling, in-line metrology for packaging. Displacing an incumbent in an established step is close to impossible.',
    companies: [
      { name: 'ASML', note: 'EUV and DUV lithography. Sole EUV source worldwide.' },
      { name: 'Applied Materials', note: 'Broadest portfolio; deposition, etch, CMP, plus a dedicated packaging product line.' },
      { name: 'Lam Research', note: 'Etch and deposition; TSV etch and copper plating for packaging.' },
      { name: 'Tokyo Electron', note: 'Coat/develop, etch, bonding; strong Japanese OSAT and memory relationships.' },
    ],
    valueCapture: 'Sells picks and shovels to every gold rush. Cyclical but structurally advantaged.',
  },
  {
    id: 'materials',
    name: 'Materials & chemicals',
    what: 'Substrate films, resins, underfills, mould compounds, slurries, plating chemistry.',
    detail:
      'Low-visibility, high-leverage. Materials are qualified into a specific process recipe, which makes them extremely sticky, and several categories are effectively single-sourced. Ajinomoto Build-up Film is the textbook case: a specialty chemical from a food company that gates every high-performance package on earth. Margins are good but volumes are modest — this is a niche-monopoly business, not a scale business.',
    grossMargin: '~30–50%',
    capitalIntensity: 3,
    switchingCost: 5,
    technicalDifficulty: 4,
    concentration: 'Extreme in specific SKUs (ABF, certain underfills, EUV resists)',
    concentrationScore: 5,
    startupEntry: 3,
    startupNote:
      'Real opportunity — but qualification takes 2–4 years and you need a customer willing to co-develop. Thermal interface materials and glass-substrate-adjacent chemistry are the live areas.',
    companies: [
      { name: 'Ajinomoto Fine-Techno', note: 'ABF build-up film. Near-monopoly on high-end substrate dielectric.' },
      { name: 'Resonac (Showa Denko)', note: 'Mould compounds, films, CMP slurries; leads the JOINT packaging consortium.' },
      { name: 'Shin-Etsu', note: 'Silicon wafers, photoresists, encapsulants, thermal materials.' },
      { name: 'Namics / Henkel', note: 'Underfills, adhesives, thermal interface materials.' },
    ],
    valueCapture: 'Small revenue, outsized control. A single-sourced material is a systemic risk.',
  },
  {
    id: 'memory',
    name: 'Memory (DRAM / HBM / NAND)',
    what: 'Commodity storage and, in the AI era, the scarcest premium component in the package.',
    detail:
      'DRAM is historically the industry\'s most brutal cycle — three players, undifferentiated product, capacity that arrives in lumps. HBM broke the pattern: it is contracted in advance, qualified per-customer, priced at a large premium per bit, and constrained by both wafer capacity and packaging yield. It moved DRAM from a spot-price business toward a design-win business, which is why the leader in HBM earns foundry-like margins while the laggards do not.',
    grossMargin: 'Cyclical: negative in troughs, 40–60%+ at HBM-driven peaks',
    capitalIntensity: 5,
    switchingCost: 4,
    technicalDifficulty: 5,
    concentration: 'SK hynix, Samsung, Micron ≈ the entire DRAM market',
    concentrationScore: 5,
    startupEntry: 1,
    startupNote:
      'No startup builds DRAM. Adjacent plays exist in stacking, test and thermal management of memory — not in the memory cell itself.',
    companies: [
      { name: 'SK hynix', note: 'HBM leader; early NVIDIA qualification and the MR-MUF stacking approach.' },
      { name: 'Samsung', note: 'Scale across DRAM, foundry and packaging; the only fully integrated option.' },
      { name: 'Micron', note: 'Third source; US-based, strategically important for supply diversification.' },
    ],
    valueCapture: 'In a shortage, captures enormous rent. In a glut, destroys its own balance sheet.',
  },
  {
    id: 'substrate',
    name: 'Package substrates',
    what: 'The miniature multilayer circuit board the die sits on.',
    detail:
      'Substrates are the unglamorous constraint. High-layer-count ABF substrates for large AI packages are made by a handful of Japanese and Taiwanese firms on long lead-time lines, with yield that falls sharply as body size and layer count grow. Capacity additions take 2–3 years and the industry has been burned before by building into a peak, which makes incumbents rationally cautious — and keeps the shortage structural.',
    grossMargin: '~15–30%',
    capitalIntensity: 4,
    switchingCost: 4,
    technicalDifficulty: 4,
    concentration: 'Ibiden + Shinko lead the high end; Unimicron, Nan Ya, AT&S, Kyocera, Samsung Electro-Mechanics follow',
    concentrationScore: 4,
    startupEntry: 2,
    startupNote:
      'A conventional substrate startup is a bad idea — it is a capital-heavy, low-margin, qualification-gated business. Glass core substrates are the exception, because they reset the incumbent learning curve.',
    companies: [
      { name: 'Ibiden', note: 'Highest-end ABF substrates; historically the constrained supplier for flagship parts.' },
      { name: 'Shinko Electric', note: 'Premium substrates and interposer-adjacent products.' },
      { name: 'Unimicron', note: 'Largest Taiwanese supplier; volume leader across grades.' },
      { name: 'AT&S', note: 'European supplier; Kulim (Malaysia) plant targets high-end AI substrates.' },
    ],
    valueCapture: 'Low margin, high criticality — the classic bottleneck profile.',
  },
  {
    id: 'osat',
    name: 'OSAT (outsourced assembly & test)',
    what: 'Contract packagers and testers — the back-end equivalent of a foundry.',
    detail:
      'The traditional OSAT business is a volume-scale, price-competitive service: customers move volume between ASE, Amkor and JCET on price and capacity. Advanced packaging is bifurcating the sector. The leading-edge 2.5D work went to TSMC; OSATs are fighting for the large second tier — chiplet assembly for merchant silicon, automotive, RF, memory modules, and the overflow the foundries will not take.',
    grossMargin: '~15–25%',
    capitalIntensity: 4,
    switchingCost: 3,
    technicalDifficulty: 3,
    concentration: 'ASE (incl. SPIL) ~30% of OSAT revenue; Amkor and JCET next (est.)',
    concentrationScore: 3,
    startupEntry: 2,
    startupNote:
      'Silicon Box (Singapore) is the live counterexample: a well-capitalised chiplet-assembly startup taking a panel/wafer-level approach. It required ~$1bn+ and a team of industry veterans — a real business, not a garage business.',
    companies: [
      { name: 'ASE Technology', note: 'Largest OSAT; broad portfolio including fan-out and 2.5D (VIPack).' },
      { name: 'Amkor', note: 'US-headquartered; strong automotive and RF; Arizona and Vietnam expansion.' },
      { name: 'JCET', note: 'Largest Chinese OSAT; owns STATS ChipPAC (Singapore/Korea).' },
      { name: 'Powertech (PTI)', note: 'Memory packaging and test specialist.' },
    ],
    valueCapture: 'Sells capacity and labour. Thin margins unless it owns a differentiated process.',
  },
  {
    id: 'aptools',
    name: 'Packaging equipment',
    what: 'Bonders, dicers, moulders, platers, packaging litho, inspection.',
    detail:
      'The fastest-changing equipment segment. Die bonding is moving from ~5 µm placement accuracy at high throughput (thermocompression) to sub-200 nm (hybrid bonding), and that jump is redrawing the competitive map. Tool prices are climbing from hundreds of thousands to several million dollars per system, which changes the economics of the whole back end.',
    grossMargin: '~35–65% (BESI and DISCO at the top)',
    capitalIntensity: 2,
    switchingCost: 4,
    technicalDifficulty: 5,
    concentration: 'DISCO in dicing/grinding; BESI/ASMPT/AMAT in advanced bonding',
    concentrationScore: 4,
    startupEntry: 3,
    startupNote:
      'The most credible hardware-startup zone in the whole chain. New process = new tool = no incumbent install base to displace.',
    companies: [
      { name: 'BE Semiconductor (BESI)', note: 'Hybrid bonding and advanced die attach; partnered with Applied Materials.' },
      { name: 'ASMPT', note: 'Broadest back-end portfolio: wire bond, TCB, hybrid bonding, moulding.' },
      { name: 'DISCO', note: 'Grinding and dicing; near-monopolistic share and famously high margins.' },
      { name: 'Kulicke & Soffa', note: 'Wire bonding leader (Singapore HQ), thermocompression and fluxless bonding.' },
    ],
    valueCapture: 'Where a new packaging process becomes a new equipment monopoly.',
  },
  {
    id: 'test',
    name: 'Test — equipment & services',
    what: 'Automated test equipment, probe cards, burn-in, system-level test.',
    detail:
      'Test scales with complexity, not with unit volume, which makes it a structural winner in the chiplet era. Every chiplet must be tested before assembly (known-good-die), every stack must be tested after assembly, and high-value parts increasingly need system-level test on real workloads. Test time per part is rising and tester capacity has itself become a reported constraint on HBM output.',
    grossMargin: '~45–60% equipment; ~20–30% services',
    capitalIntensity: 3,
    switchingCost: 4,
    technicalDifficulty: 4,
    concentration: 'Advantest and Teradyne are a near-duopoly in high-end ATE',
    concentrationScore: 5,
    startupEntry: 3,
    startupNote:
      'Test *software* and adaptive-test analytics are genuinely open. Building a competing high-end tester is not: the moat is a decade of device-interface engineering and installed test programs.',
    companies: [
      { name: 'Advantest', note: 'Dominant in high-end SoC and HBM test.' },
      { name: 'Teradyne', note: 'Broad ATE portfolio; strong in mobile and industrial.' },
      { name: 'FormFactor', note: 'Probe cards — the consumable that touches every die at probe.' },
      { name: 'KYEC', note: 'Largest independent test house; a real chokepoint for high-end parts.' },
    ],
    valueCapture: 'Charges for certainty. Grows with package complexity regardless of node.',
  },
  {
    id: 'oem',
    name: 'System OEM / ODM',
    what: 'Builds boards, servers, racks and cooling.',
    detail:
      'Where packaging decisions become facilities decisions. A rack of liquid-cooled accelerators demands cold plates, manifolds, coolant distribution units and a data centre plumbed to accept them. The ODMs are scale assemblers with thin margins; the interesting value has moved to thermal and power subsystems, which are being pulled inward toward the package.',
    grossMargin: '~5–15%',
    capitalIntensity: 3,
    switchingCost: 2,
    technicalDifficulty: 3,
    concentration: 'Foxconn, Quanta, Wistron, Supermicro dominate AI server assembly',
    concentrationScore: 3,
    startupEntry: 3,
    startupNote:
      'Not the box — the thermal and power subsystems inside it. Cold plates, coolant distribution and in-package cooling have real startup activity and shorter qualification cycles than anything in the fab.',
    companies: [
      { name: 'Foxconn / Hon Hai', note: 'Largest AI server assembler.' },
      { name: 'Quanta / Wistron', note: 'Major ODM builders of hyperscaler platforms.' },
      { name: 'Vertiv / CoolIT / Boyd', note: 'Liquid cooling and thermal management subsystems.' },
    ],
    valueCapture: 'Volume without pricing power — unless it owns the thermal solution.',
  },
  {
    id: 'cloud',
    name: 'Cloud & data centre',
    what: 'The end buyer whose capex funds the entire chain.',
    detail:
      'Hyperscalers are simultaneously the largest customers and increasingly competitors — Google, Amazon, Microsoft and Meta all design custom accelerators, and those designs consume the same advanced packaging and HBM supply as merchant parts. Their buying behaviour distorts the whole chain: they pre-book packaging and memory capacity years ahead, which is why "capacity" in this industry means contracted allocation, not idle machines.',
    grossMargin: 'Cloud services ~60%+; AI infrastructure economics still unsettled',
    capitalIntensity: 5,
    switchingCost: 4,
    technicalDifficulty: 4,
    concentration: 'A handful of hyperscalers plus neoclouds drive the majority of AI capex',
    concentrationScore: 4,
    startupEntry: 2,
    startupNote:
      'Not a packaging opportunity, but the demand signal you must read correctly. Their capex guidance is the leading indicator for every layer below.',
    companies: [
      { name: 'Microsoft / Google / Amazon / Meta', note: 'Both largest buyers and custom-silicon designers.' },
      { name: 'CoreWeave / neoclouds', note: 'Capacity aggregators; sensitive to accelerator supply timing.' },
    ],
    valueCapture: 'Sets the clock for the entire industry through capex guidance.',
  },
];

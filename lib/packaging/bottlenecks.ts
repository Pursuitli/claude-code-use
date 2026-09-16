import type { Bottleneck } from './types';

export const BOTTLENECKS: Bottleneck[] = [
  {
    id: 'cowoscap',
    name: 'Advanced 2.5D packaging capacity',
    severity: 5,
    status: 'chronic',
    why:
      'CoWoS-class capacity requires fab-grade cleanroom, lithography, plating and metrology. It expands on an 18–30 month cycle while AI demand re-forecasts quarterly. Capacity has multiplied several times over since 2023 and has still not caught demand.',
    whoSuffers: ['Accelerator designers who cannot get allocation', 'Second-tier AI chip startups, who get nothing', 'Cloud operators whose build schedules slip'],
    workaround:
      'Multi-sourcing to Samsung, Intel and OSATs; shifting from CoWoS-S to CoWoS-L to use less silicon per package; pre-paying and equity-investing to secure allocation.',
    idealSolution:
      'A packaging technology delivering equivalent bandwidth density with substantially fewer process steps and no reticle-limited silicon — which is exactly the pitch for organic interposers, bridges and panel-level assembly.',
    opportunity:
      'Anything that increases effective throughput of an existing line — yield improvement, cycle-time reduction, rework recovery — is worth enormous money right now, because it creates units without creating capex.',
    watchFor: 'TSMC capacity guidance, Samsung and Intel qualification wins, and the CoWoS-S to CoWoS-L mix shift.',
  },
  {
    id: 'hbmsupply',
    name: 'HBM supply',
    severity: 5,
    status: 'chronic',
    why:
      'Only three companies make DRAM; HBM needs TSV, stacking and test capacity that not all DRAM capacity can provide; per bit it consumes 2–3× the wafer area of commodity DRAM; and 12-high stack yields are materially below 8-high.',
    whoSuffers: ['Every accelerator vendor', 'Buyers of commodity DRAM, whose supply is being displaced', 'Anyone qualified late in a generation'],
    workaround: 'Long-term supply agreements and prepayments, multi-vendor qualification, and designing around lower memory capacity where the workload allows.',
    idealSolution:
      'Higher stack yields, hybrid bonding to enable taller stacks without the thinning limit, and better stack-level repair so a marginal die can be rescued rather than scrapped.',
    opportunity:
      'HBM stacking yield, thin-die handling, stack-level test and thermal management of stacks. The memory makers are unusually willing to pay for anything that raises stack yield, because the leverage is immediate.',
    watchFor: 'HBM4 ramp timing, 16-high stack yields, and whether Samsung fully closes its qualification gap.',
  },
  {
    id: 'substrateavail',
    name: 'Large-body ABF substrate availability',
    severity: 4,
    status: 'chronic',
    why:
      'Very large, high-layer-count substrates yield poorly and are made by a handful of suppliers. Capacity takes 2–3 years to add, and suppliers earning 15–25% gross margin are rationally unwilling to build speculatively after being burned in the 2022–23 glut.',
    whoSuffers: ['Packaging providers', 'Accelerator vendors', 'Anyone whose package body is unusually large'],
    workaround: 'Design for smaller bodies, qualify multiple substrate vendors, prepay for capacity, and accept lower layer counts where the design permits.',
    idealSolution: 'Glass cores (better flatness, fewer layers needed) and panel-level substrate processing for better area utilisation.',
    opportunity:
      'Substrate yield improvement — inspection, warpage control, process analytics. Note the structural point: the constraint sits with a low-margin supplier while the value sits with a high-margin customer. That misalignment is where a well-positioned supplier can extract real value.',
    watchFor: 'Ibiden and Unimicron capex announcements, AT&S Kulim ramp, and glass-core qualification milestones.',
  },
  {
    id: 'thermalbn',
    name: 'Thermal management',
    severity: 5,
    status: 'emerging',
    why:
      'Package power has gone from ~300 W to 1,000 W+ within a few years, and 3D stacking concentrates it further. Heat must exit through a series chain of thermal resistances, each of which is near its practical limit. HBM wants to run cooler than the logic beside it, so the solution must be non-uniform on purpose.',
    whoSuffers: ['Everyone — this is now the limiting constraint on integration', 'Data centre operators facing cooling retrofits', 'Chip architects forced to leave performance on the table'],
    workaround: 'Direct-to-chip liquid cooling, aggressive throttling, larger packages to spread heat, and conservative clock targets.',
    idealSolution:
      'Cooling brought inside the package: microfluidic channels in the die or interposer, better TIM, embedded vapour chambers, and thermal isolation between logic and memory.',
    opportunity:
      'The highest-conviction long-term opportunity in packaging. The physics gets worse every generation, the customer can measure your benefit in degrees within weeks, and no incumbent has solved it. If you want one thesis to develop deeply, make it this one.',
    watchFor: 'Adoption of in-package cooling by a major vendor; microfluidics moving from research to product.',
  },
  {
    id: 'hybridyield',
    name: 'Hybrid bonding yield & throughput',
    severity: 4,
    status: 'emerging',
    why:
      'Sub-200 nm placement, sub-nanometre surface roughness and near-zero particle tolerance. A single particle voids a bond and can scrap the assembly. Die-to-wafer throughput is far below what volume production needs.',
    whoSuffers: ['Anyone whose roadmap depends on sub-10 µm 3D interconnect', 'HBM makers planning 16-high and beyond', 'Logic vendors planning logic-on-logic'],
    workaround: 'Stay on microbumps longer; use hybrid bonding only for small, high-value die; accept low throughput on premium products.',
    idealSolution: 'A bonding approach with hybrid-bonding density at thermocompression throughput, with in-situ verification so failures are caught immediately rather than at final test.',
    opportunity:
      'Everything adjacent to the bonder: surface preparation, cleaning, particle control, CMP recess control, in-situ inspection, and die handling. The tool vendors are themselves buyers for the pieces they have not solved.',
    watchFor: 'Die-to-wafer throughput figures from BESI/AMAT and ASMPT; the first high-volume logic product on hybrid bonding.',
  },
  {
    id: 'warpage',
    name: 'Large package warpage',
    severity: 4,
    status: 'chronic',
    why:
      'Materials with mismatched thermal expansion — silicon at ~2.6 ppm/K, substrate at ~17 — are bonded at high temperature and cooled. The resulting bow scales roughly with the square of body size, so a package that is fine at 50 mm is a serious problem at 100 mm.',
    whoSuffers: ['Packaging providers at assembly', 'Substrate makers', 'Anyone pushing package size to get more HBM in'],
    workaround: 'Stiffeners and lids, tuned mould compounds, carefully engineered reflow profiles, and — most often — simply limiting body size.',
    idealSolution: 'Glass cores with silicon-matched CTE; predictive per-unit warpage compensation; low-shrinkage compounds designed for large bodies.',
    opportunity:
      'In-line warpage metrology at temperature, predictive simulation coupled to process control, and per-unit adaptive reflow. This is a well-defined problem with a measurable output — unusually tractable for a startup.',
    watchFor: 'Package body sizes in new product announcements; glass-core reliability data.',
  },
  {
    id: 'interconnect',
    name: 'Interconnect density limits',
    severity: 3,
    status: 'chronic',
    why:
      'Bandwidth between dies is bounded by beachfront (finite die edge) times linear bump density. Microbump pitch has scaled slowly; each step down makes placement, warpage and cleanliness harder simultaneously.',
    whoSuffers: ['Chiplet architects partitioning designs', 'Anyone whose design is bandwidth-bound at the die boundary'],
    workaround: 'Wider, slower interfaces; more aggressive protocol efficiency; hybrid bonding for the links that need it most; careful floorplanning to minimise cross-die traffic.',
    idealSolution: 'Sub-1 µm pitch at production throughput, or optical interconnect that removes the beachfront constraint entirely.',
    opportunity: 'Die-to-die IP with better bandwidth per millimetre; packaging that supports finer pitch at acceptable yield; co-packaged optics in the long run.',
    watchFor: 'UCIe roadmap milestones and announced bump-pitch reductions.',
  },
  {
    id: 'testcomplex',
    name: 'Test complexity & capacity',
    severity: 4,
    status: 'chronic',
    why:
      'Each chiplet needs pre-assembly test, each stack needs stack test, and the assembled package needs full-system test. Test time per part is rising while high-end tester supply is finite — tester availability has itself been reported as a gate on HBM output.',
    whoSuffers: ['Everyone shipping complex packages', 'OSATs whose test floors are the constraint', 'Memory makers'],
    workaround: 'Statistical sampling where risk allows, more parallel test sites, and design-for-test investment to shorten test programs.',
    idealSolution: 'Adaptive test that concentrates time on the parts most likely to fail, better built-in self-test, and in-situ monitoring that replaces some external test entirely.',
    opportunity:
      'Test-time reduction is directly monetisable — you can quantify the saving in tester-hours at a known dollar rate. One of the cleanest value propositions available to a startup in this industry.',
    watchFor: 'Advantest lead times and capacity commentary; adoption of system-level test on AI parts.',
  },
  {
    id: 'powerbn',
    name: 'Power delivery at sub-volt, kiloamp scale',
    severity: 4,
    status: 'emerging',
    why:
      'Current rises as voltage falls for a given power, and resistive loss scales with the square of current. Delivering 1,000+ A through a package without unacceptable droop is approaching the limits of conventional distribution.',
    whoSuffers: ['Chip architects forced to add guard band', 'Board and package designers', 'Anyone pushing package power higher'],
    workaround: 'Larger guard bands (which cost power quadratically), more package layers dedicated to power, regulators placed as close as physically possible.',
    idealSolution: 'Integrated voltage regulation inside the package, vertical power delivery through the substrate, and backside power delivery on the die.',
    opportunity: 'In-package passives, integrated regulation components, and power-integrity analysis tooling for multi-die packages.',
    watchFor: 'Backside power delivery adoption at leading nodes; in-package regulator announcements.',
  },
  {
    id: 'packcost',
    name: 'Packaging cost as a share of device cost',
    severity: 3,
    status: 'emerging',
    why:
      'Packaging has gone from a few percent of device cost to a large share for advanced parts. That is tolerable at 70% product gross margin; it is prohibitive for the broader market that would like to use chiplets.',
    whoSuffers: ['Anyone trying to use advanced packaging outside flagship AI', 'Mid-market chip vendors', 'Cost-sensitive segments'],
    workaround: 'Use organic interposers instead of silicon, reduce HBM count, or stay monolithic and accept the yield penalty.',
    idealSolution: 'Panel-level packaging for better area utilisation, simpler bridge-based architectures, and standardised chiplet interfaces that amortise design cost across more products.',
    opportunity:
      'Cost-down is where the *volume* opportunity lives. Flagship AI is a few million units a year; if advanced packaging gets cheap enough for mainstream devices the unit count grows by orders of magnitude. Most founders chase the flagship; the larger business is probably underneath it.',
    watchFor: 'Panel-level packaging production announcements; advanced packaging appearing in mid-range products.',
  },
];

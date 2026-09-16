import type { SectionQuiz } from './types';

export const QUIZZES: SectionQuiz[] = [
  {
    sectionId: 'objects',
    questions: [
      {
        q: 'What does a transistor actually do?',
        a: 'It is an electrically operated switch with no moving parts: a voltage on the gate either permits or blocks current flowing from source to drain through a channel. Everything else — logic, memory, arithmetic — is built from billions of these switching billions of times a second.',
        trap: '"It amplifies signals" describes one use of one kind of transistor. The switch is the thing that matters for digital logic.',
      },
      {
        q: 'Why is chip cost quoted per wafer rather than per chip?',
        a: 'Because the fab processes the whole wafer at once — the same thousand-plus steps run regardless of how the wafer is divided up. Cost per die is therefore wafer price divided by the number of *good* dies on it, which is why die size and yield drive cost far more than the chip\'s complexity does.',
      },
      {
        q: 'A vendor says their chip is on a "3 nm" node. What does 3 nm measure?',
        a: 'Nothing physical on the device. Node names stopped corresponding to any actual dimension years ago; they are generation labels. The useful questions are transistor density, performance per watt and cost per transistor — ask for those instead.',
        trap: 'Assuming it is the gate length or the smallest feature. It has not been either for over a decade.',
      },
      {
        q: 'Why does the fab process take three to four months per wafer?',
        a: 'Because it is a loop — deposit, coat, expose, develop, etch, clean — repeated more than a thousand times to build the device up in layers a few atoms thick. The time is sequential and largely irreducible, which is why fab capacity cannot be surged in response to demand.',
      },
    ],
  },
  {
    sectionId: 'fundamentals',
    questions: [
      {
        q: 'Why can\'t a bare silicon die simply be soldered to a normal circuit board?',
        a: 'Four independent blockers. Pitch: die pads are 40–150 µm apart, PCBs economically resolve ~50–75 µm features at best. Thermomechanical: silicon expands at ~2.6 ppm/K against ~17 for an organic board, so direct joints crack within a few hundred thermal cycles. Power integrity: the die needs decoupling capacitance within millimetres and a controlled-impedance path. Practical: bare die cannot be handled, burned in, or returned for failure analysis. Low-pin-count, low-power parts genuinely do get chip-on-board attached — which tells you the constraint is pin count and power density, not some absolute rule.',
        trap: '"It would break" — true but useless. The specific answer is pitch translation plus CTE mismatch.',
      },
      {
        q: 'What is the difference between fabrication and packaging, and why does the distinction matter commercially?',
        a: 'Fabrication builds transistors in silicon (front-end); packaging connects, powers, cools and protects them (back-end). Commercially they were opposite businesses: front-end is $20bn fabs at 50–60% gross margin with one dominant supplier; back-end was labour-intensive OSAT work at 15–25% margin. Advanced packaging collapses the distinction by applying front-end tooling to back-end problems — which is precisely why the profit pool moved to TSMC rather than to ASE.',
      },
      {
        q: 'Give the mechanism, not the slogan, for why AI made packaging strategic.',
        a: 'Three converging constraints. (1) Transformers are bandwidth-bound, and in-package HBM is the only affordable way to deliver terabytes per second, which requires 2.5D. (2) The reticle limit caps a die at ~858 mm², so the largest accelerators must be assembled from multiple dies. (3) Node shrinks stopped delivering proportional cost improvement, making integration the cheaper path to performance. The result: packaging capacity rations how many accelerators exist in a year.',
        trap: '"Because AI chips are complicated" explains nothing. Name the memory wall, the reticle wall and the scaling economics.',
      },
      {
        q: 'Why is yield recovery listed as one of the jobs a package does?',
        a: 'Because defect probability scales with die area — roughly Y ≈ e^(−D·A) — so a large monolithic die yields badly. Splitting it into chiplets improves silicon yield dramatically, but only if each piece can be tested before assembly and joined without losing the gain. Packaging is what converts a silicon yield problem into a (better, but real) packaging yield problem.',
      },
    ],
  },
  {
    sectionId: 'valuechain',
    questions: [
      {
        q: 'Why do OSATs earn 15–25% gross margins while foundries earn 50–60%, when both are contract manufacturers?',
        a: 'Differentiation and switching cost. Leading-edge foundry capability exists at essentially one company, and a customer\'s design is co-optimised to its process — so switching means a re-spin. Traditional OSAT services are substitutable: three credible suppliers bid for the same volume, and the customer can move it. The moment an OSAT-like service becomes non-substitutable — as CoWoS did — its margin structure moves toward the foundry band. Margin follows substitutability, not process complexity.',
      },
      {
        q: 'Which layer of the chain has the most control relative to its revenue, and why does that matter to a founder?',
        a: 'Materials — and ABF is the cleanest example: a single supplier for a product that gates every high-performance package on earth, in a category worth a fraction of the substrate market it enables. It matters because it shows that control comes from being non-substitutable within a qualification-gated flow, not from being large. A startup cannot be large; it can be non-substitutable.',
      },
      {
        q: 'Why would a hyperscaler design its own accelerator when NVIDIA already makes one?',
        a: 'To escape a margin transfer, and to match silicon to their own workloads. But notice the constraint: their custom chip consumes the same CoWoS capacity, the same HBM supply and the same substrates. They can bypass the designer\'s margin; they cannot bypass the physical bottleneck — which is why custom silicon shifts who captures profit without relieving the shortage.',
      },
      {
        q: 'Where in the chain can a startup realistically enter, and what does that tell you about the structure?',
        a: 'Equipment (especially new process steps), metrology and inspection, specialty materials for new structures, EDA point tools, test software and thermal. Never foundry, memory or leading-edge fab. The pattern: startups can enter where a *new* capability is being created, never where an incumbent has accumulated decades of qualification and yield learning.',
      },
    ],
  },
  {
    sectionId: 'ladder',
    questions: [
      {
        q: 'Why did flip chip have to replace wire bonding for high-performance logic?',
        a: 'Geometry. Wire bonds attach only to the die perimeter, so I/O count scales with circumference — linearly with die size. Flip chip uses the entire die face, so I/O scales with area. Add roughly an order of magnitude lower interconnect inductance and a direct thermal path out of the die back, and there is no contest above a few hundred pins.',
      },
      {
        q: 'What exactly does an interposer do that a substrate cannot?',
        a: 'Routing density. A silicon interposer carries wiring at ~0.4–2 µm line/space because it is made with fab lithography; an organic substrate manages perhaps 10–15 µm. That is a 50–100× difference in wires per millimetre, which is what makes a 1,024-bit HBM interface physically routable. It also matches silicon\'s CTE and provides a smooth enough surface for 40–55 µm microbumps.',
        trap: '"It connects the chips" is not an answer — so does the substrate. The answer is wires per millimetre.',
      },
      {
        q: 'Why is hybrid bonding considered the most important process transition in packaging?',
        a: 'Because connection density scales with the inverse square of pitch. Going from 45 µm microbumps to sub-10 µm hybrid bonds is a 25× density improvement, with roadmaps to 1 µm implying far more — plus lower resistance and capacitance per link because there is no solder. It is what makes taller HBM stacks and true logic-on-logic possible. The blockers are yield and throughput, not capability, which is exactly why it is an investable area.',
      },
      {
        q: 'Why did the industry converge on embedded bridges (EMIB, CoWoS-L) rather than ever-larger silicon interposers?',
        a: 'Cost and the reticle limit. A full interposer is thousands of square millimetres of silicon that computes nothing, and going past one reticle field requires stitched exposures whose yield degrades with each stitch. A bridge puts fine wiring only where two dies meet — a few tens of mm² — and the organic carrier has no reticle ceiling. You get density where it is needed and cheap routing everywhere else.',
      },
      {
        q: 'What is the honest argument against chiplets?',
        a: 'They move cost rather than removing it: die-to-die interfaces burn power and consume beachfront area, packaging cost rises, test complexity multiplies, and thermal management gets harder with multiple hot dies. They win when the silicon yield saving exceeds those costs — which is true for very large designs and often false for small ones. And the merchant chiplet market, as opposed to chiplets as an internal technique, still barely exists.',
      },
    ],
  },
  {
    sectionId: 'anatomy',
    questions: [
      {
        q: 'Why does HBM have to sit inside the package rather than on the board?',
        a: 'Energy per bit and routability. An in-package link costs roughly 1 pJ/bit; a board-level DDR link 15–20+. At 8 TB/s that difference is hundreds of watts — more than the rest of the chip. Separately, a 1,024-bit-wide bus is simply not routable across a motherboard at acceptable signal integrity without SerDes on every lane, which would cost more power than the memory access itself.',
      },
      {
        q: 'Why can\'t NVIDIA just use ordinary PCB traces instead of an interposer?',
        a: 'A PCB cannot resolve the feature sizes. HBM needs roughly a thousand connections per stack escaping from an 11 × 11 mm footprint; that requires sub-2 µm wiring, and PCBs manage tens of microns. Even if it could be routed, the channel length would force equalisation, retiming and far higher energy per bit. The interposer exists because fab lithography can draw wires 50–100× finer than board manufacturing can.',
        trap: 'The answer is not "PCBs are slow" — it is wires per millimetre and energy per bit.',
      },
      {
        q: 'What is "beachfront" and why does it constrain architecture?',
        a: 'The usable perimeter of a die available for die-to-die I/O. Bandwidth across a boundary equals beachfront length times bandwidth per millimetre, and bandwidth per millimetre is set by interconnect pitch — that is, by the packaging technology. So packaging choice directly caps how a chip can be partitioned. A designer cannot simply decide to split a chip; the package has to be able to carry the traffic across the seam.',
      },
      {
        q: 'Why is thermal now the binding constraint rather than lithography?',
        a: 'Junction temperature equals power times the series thermal resistance from junction to coolant, and every link in that chain is near its practical limit. Meanwhile 3D stacking concentrates power further and forces lower tiers to dump heat through the tiers above. You can always integrate more silicon; you increasingly cannot cool it. That is what "thermally limited" means in practice.',
      },
    ],
  },
  {
    sectionId: 'cowos',
    questions: [
      {
        q: 'What do the three letters in CoWoS-S, -R and -L actually change?',
        a: 'The interposer. -S is a monolithic silicon interposer with TSVs: highest density, most expensive, reticle-stitching limited. -R replaces it with polymer RDL: cheaper, larger, lower density. -L embeds small silicon bridge tiles in an RDL carrier: silicon-grade density at the seams, organic cost elsewhere, and no reticle ceiling — which is why the largest AI packages use it.',
      },
      {
        q: 'Why is packaging capacity harder to expand than renting more servers?',
        a: 'It is a fab. Construction plus tool install plus qualification is 18–30 months; bonders and steppers have 9–18 month lead times; each customer product must be re-qualified on the new line; and a new line starts below the mature line\'s yield. Servers are a commodity you rent from an elastic pool; packaging capacity is a physical asset built on a multi-year cycle by people who remember the last glut.',
      },
      {
        q: 'Which part of the CoWoS supply chain would you worry about most, and why?',
        a: 'Reasonable answers: HBM (three suppliers, low 12-high yields, sold out ahead); large-body substrates (few suppliers, poor yield, 2–3 year expansion, low-margin suppliers unwilling to build speculatively); and cleanroom space plus process engineers, which is the least discussed and arguably most binding. ABF film is a systemic single point of failure but is not currently the volume constraint — knowing that distinction is the point.',
      },
      {
        q: 'Why do substrate makers not simply build more capacity when everyone says there is a shortage?',
        a: 'Because they carry the cycle risk and someone else captures the upside. At 15–25% gross margin, a speculative line that arrives into a downturn is an impairment — and they lived through exactly that in 2022–23. Expansion therefore requires prepayment, take-or-pay contracts or equity from the customer. When you see those announcements, that is the real demand signal.',
      },
    ],
  },
  {
    sectionId: 'hbm',
    questions: [
      {
        q: 'Why is HBM stacked rather than spread out?',
        a: 'To get a very wide interface into a tiny footprint with very short wires. Stacking with TSVs gives 1,024 (now 2,048) parallel connections in an ~11 × 11 mm area. Spread horizontally, those wires would be long enough to need equalisation and far more energy per bit, and the interposer area required would be unaffordable.',
      },
      {
        q: 'HBM runs at lower per-pin speeds than GDDR. Why is it faster?',
        a: 'Width. HBM3E runs a 1,024-bit interface at ~9.6 Gbps per pin; GDDR runs a much narrower bus at far higher per-pin rates. Wide-and-slow is more power-efficient per bit than narrow-and-fast, and it is only physically possible because the wires are microns long inside the package. This is the single cleanest illustration of why packaging determines performance.',
      },
      {
        q: 'Why does a 12-high stack yield worse than an 8-high, and why does that matter beyond memory?',
        a: 'More dies multiply: yield goes as per-die yield to the power of stack height, and 12-high also requires thinner die (~30 µm), which is at the edge of handling. It matters beyond memory because the same compound-yield arithmetic governs every multi-die package — and because HBM scrap propagates: a bad stack discovered late destroys the accelerator it was bonded to.',
      },
      {
        q: 'Why is HBM supply so concentrated, and what would it take to change?',
        a: 'Three DRAM makers exist at all; HBM is a harder subset requiring TSV, thin-die stacking and per-stack test; not all DRAM capacity converts; and qualification is per-customer and per-generation, so being late means being late for the whole generation. Changing it would require a fourth DRAM entrant (implausible outside state programmes) or a fundamentally different memory architecture. Neither is near.',
      },
      {
        q: 'Why is the HBM4 base die strategically interesting?',
        a: 'It moves from a DRAM process to a foundry logic process, which brings TSMC into the memory supply chain and makes the base die a place to put customer-specific logic. That turns a commodity into a semi-custom product — and raises a genuinely open question about who captures the margin on it: the memory maker, the foundry, or the accelerator designer who specified it.',
      },
    ],
  },
  {
    sectionId: 'process',
    questions: [
      {
        q: 'Why is known-good-die test the highest-leverage step on the line?',
        a: 'Because of what is committed downstream. Testing a die costs a few dollars; discovering it is bad after it has been bonded alongside seven other dies and eight HBM stacks destroys several thousand dollars of good components plus all the assembly work. Test coverage is therefore worth far more than its cost — which is also why test equipment vendors have such durable pricing power.',
      },
      {
        q: 'What is "die shift" and why does it require a new kind of lithography?',
        a: 'In fan-out, dies are placed on a carrier and over-moulded; the mould\'s cure shrinkage moves each die a few microns from where it was placed. Subsequent RDL layers must land on the die as it actually is, not as it was intended to be — so the tool measures each unit and compensates the exposure per unit. That is adaptive patterning, and it has no equivalent in front-end lithography.',
      },
      {
        q: 'Why does underfill get harder as bump pitch shrinks?',
        a: 'The gap under the die shrinks with the bumps, so filler particles must get smaller to flow through it — but smaller fillers raise viscosity, which fights the capillary flow you need to travel across a 30 mm die without trapping a void. That tension between filler size and flow is the core formulation problem, and it is why non-conductive films and moulded underfill exist as alternatives.',
      },
      {
        q: 'Which single step would you buy a tool company in, and why?',
        a: 'A defensible answer: die attach and bonding, because the accuracy-versus-throughput trade governs the cost of every advanced package and the hybrid-bonding transition is redrawing the competitive map. A more capital-efficient answer: metrology and inspection, because those tools do not touch the product and therefore qualify in months rather than years. Both are right; they differ in the capital they require.',
      },
    ],
  },
  {
    sectionId: 'materials',
    questions: [
      {
        q: 'Why is ABF film the most-cited single point of failure in the supply chain?',
        a: 'One company supplies effectively all high-end build-up dielectric, and every high-performance package on earth uses it. Alternatives exist but requalifying a substrate stack-up takes 1–3 years. It is not usually the binding volume constraint — the substrate fabricators are — but it is the clearest example of systemic risk concentrated in an unglamorous, low-revenue category.',
      },
      {
        q: 'Why are thermal interface materials the most attractive materials wedge for a startup?',
        a: 'Because the customer can measure your benefit in degrees on their own hardware within weeks, everyone already agrees thermal is the problem, and qualification is shorter than for structural materials because you are not changing the mechanical stack. Compare underfill, where you would need years of reliability data against an incumbent\'s existing data set.',
      },
      {
        q: 'What is the honest bear case on glass substrates?',
        a: 'Brittleness with catastrophic crack propagation, immature and expensive through-glass via formation, no volume handling infrastructure, poor thermal conductivity (~1 W/m·K), essentially no field-reliability history, repeated timeline slips — and an organic incumbent that keeps improving. Glass has to beat a moving target, and a startup that runs out of money waiting for the market is still dead.',
      },
      {
        q: 'Why do material suppliers have such high switching costs despite selling commodity-looking chemistry?',
        a: 'Because the material is qualified into a specific process recipe backed by reliability data. Switching means requalifying the package, which the customer will not do to save money — only to unblock something. The moat is the reliability data set, not the molecule.',
      },
    ],
  },
  {
    sectionId: 'equipment',
    questions: [
      {
        q: 'Why does DISCO earn such high margins on what looks like a precision saw?',
        a: 'Consumables and recipes. Blades and grinding wheels are sold with the tools as a recurring revenue stream; the process recipes for each material stack are developed jointly with customers over years; and the install base has standardised on their platform. No customer requalifies a dicing process to save money. It is the industry\'s best case study in a "boring" category that is actually a monopoly.',
      },
      {
        q: 'Why is test equipment\'s moat unusually durable?',
        a: 'The moat is the customer\'s own asset, not the vendor\'s. Millions of engineer-hours of test programs are written against a specific platform and do not port. Switching testers means rewriting them, which nobody does voluntarily. That is why the answer for a startup is the software layer above test, not a competing tester.',
      },
      {
        q: 'Where is the most credible equipment opening for a startup, and why that one?',
        a: 'Metrology and inspection — because those tools do not touch the product, so they qualify in months rather than years, and because the specific unmet need (non-destructive inspection of buried interfaces, in-line warpage at temperature) is well-defined and purchasable. Hybrid-bonding adjacencies are next, because the process is new enough that nobody holds a qualification head start.',
      },
    ],
  },
  {
    sectionId: 'economics',
    questions: [
      {
        q: 'Eight chiplets each yielding 99% — what is the package yield, and what is the general lesson?',
        a: '0.99⁸ = 92.3%, before any assembly loss. At 95% per die it is 66.3%. Yield compounds multiplicatively while intuition is linear, so the tolerable per-die defect rate falls as you integrate more dies. This is the arithmetic that caps how many chiplets a package can economically contain.',
        trap: 'Anyone who answers "99%" has just told you they do not understand advanced packaging economics.',
      },
      {
        q: 'Why can a 1% yield improvement be worth more than a 10% price increase?',
        a: 'Two reasons. Value concentration: with ~$4,000 of components committed to an assembly, a point of yield is roughly $40 per unit across millions of units. And supply elasticity: when capacity is the constraint, yield is the only way to create sellable units without capex — a supplier moving 70% to 80% package yield gains 14% more output immediately, which it can sell at full price into a shortage.',
      },
      {
        q: 'Which line dominates the BOM of a flagship AI accelerator, and why is that surprising?',
        a: 'Memory — typically several times the cost of the compute silicon. It is surprising because public attention focuses on the leading-edge process node, but leading-edge logic is a minority of manufactured cost. The company whose name is on the box is not the company capturing most of the component spend.',
      },
      {
        q: 'What does known-good-die actually mean, and why is the phrase slightly dishonest?',
        a: 'It means a die that has passed pre-assembly test. It does not mean a die that is good — no test has 100% coverage. If per-die yield is 95% and coverage 98%, about 0.1% of shipped dies are secretly bad, and in an eight-die package that is roughly 0.8% package loss from escapes alone, each one destroying seven good dies. "Known-good" is a probability wearing a certainty\'s clothes.',
      },
    ],
  },
  {
    sectionId: 'qualification',
    questions: [
      {
        q: 'Why can a technically superior startup not simply replace a qualified supplier?',
        a: 'Because adoption costs the customer 18–36 months and $2–20m, plus the career risk of a yield excursion on a line where mistakes are visible. Against that, "20% better" is not worth doing. Switching happens when the customer is blocked and you are the only unblock — or when there is no incumbent because the process is new.',
      },
      {
        q: 'Qualification is a barrier. Why is it also an asset?',
        a: 'Because it is symmetric. The same 24-month barrier that keeps you out keeps your competitor out once you are in, and your customer has no incentive to help them clear it. That asymmetry is why packaging suppliers with mediocre technology earn good returns for a decade, and why investors underwrite qualification milestones rather than product milestones.',
      },
      {
        q: 'You have 24 months of runway and an 18-month sales cycle. What do you change?',
        a: 'The customer, not the product. Go to OSATs (9–18 months) rather than foundries (2–4 years) or automotive (3–5 years). Sell an evaluation tool into an engineering budget rather than a production tool into a capex committee. Get a joint development agreement with NRE — both for cash and as a commitment signal. Or pick a category that does not touch the product, where qualification is measured in months.',
      },
      {
        q: 'Why is automotive qualification treated as a separate species?',
        a: 'AEC-Q100 grade 0/1 means −40 °C to +150 °C, 15-year service life, thousands of thermal cycles, full lot traceability for recall containment, functional safety requirements, and a commitment to supply the identical part from the identical line for a decade or more. The cycle is 3–5 years. It is the stickiest business in packaging and the one least compatible with startup runway.',
      },
    ],
  },
  {
    sectionId: 'players',
    questions: [
      {
        q: 'What is TSMC\'s actual moat — and what would it take to erode it?',
        a: 'Compounding yield learning on the most complex processes, customers whose designs are co-optimised to its PDKs, and packaging capacity contracted years ahead. Eroding it would require either a sustained process-leadership loss or a customer-driven push to second-source that outlasts a product cycle. Geographic concentration is the risk to the world; it is not, by itself, a competitive weakness.',
      },
      {
        q: 'Why did TSMC capture the advanced packaging profit pool rather than ASE?',
        a: 'Because it made packaging non-substitutable and applied fab economics to it. CoWoS is co-designed with the silicon, runs on fab tooling and process control, and cannot be second-sourced quickly. ASE\'s services remain substitutable, and substitutable services earn substitutable margins — 15–25%, regardless of how technically capable the company is.',
      },
      {
        q: 'SK hynix and Samsung both make HBM. Why did one pull ahead?',
        a: 'Qualification timing and process choice. SK hynix qualified HBM3 with the dominant accelerator customer first and used MR-MUF stacking, generally credited with better heat conduction and throughput. In a market where qualification is per-generation and customers cannot switch mid-cycle, being first is worth more than being cheaper — and the lead compounds into the next generation through co-development.',
      },
      {
        q: 'Name three companies a packaging startup should never compete with head-on, and why.',
        a: 'Any of: TSMC (foundry or general 2.5D — capital and learning curve), the DRAM three (memory manufacturing is closed), DISCO (dicing — install base plus consumables plus recipes), the substrate incumbents (capital-heavy, low-margin, decades of yield learning), Advantest/Teradyne frontally (the moat is the customer\'s own test code). The pattern is always the same: never enter where a decades-long learning curve is already owned.',
      },
    ],
  },
  {
    sectionId: 'geography',
    questions: [
      {
        q: 'Why does back-end capacity diversify to Southeast Asia while front-end stays in Taiwan?',
        a: 'Cluster dependency. Leading-edge fabs need dense supplier ecosystems and engineers who can debug a yield excursion in the same room on the same day — which money cannot replicate quickly. Back-end is more labour-intensive, less ecosystem-dependent and politically easier to place, so it moves to Penang, Bac Ninh and elsewhere. Note that advanced packaging is drifting back toward front-end characteristics, which partly slows this.',
      },
      {
        q: 'What is Singapore actually good for in this industry?',
        a: 'Headquarters, IP, equipment and instrument design, materials R&D, software, and being a neutral counterparty that American, Japanese, Taiwanese, Korean and Chinese customers can all sign with. Plus A*STAR IME for pilot-line access. Not volume assembly — the cost structure does not work and nobody expects it to. Run the company from Singapore; manufacture in Malaysia or Vietnam.',
      },
      {
        q: 'Why is Japan strategically important despite making little advanced packaging itself?',
        a: 'Materials and equipment. ABF (effectively a monopoly), mould compounds, underfills, photoresists, DISCO in dicing and grinding, Advantest in test, TOWA in moulding. The 2019 Japan–Korea materials dispute demonstrated exactly how much leverage that confers: you do not need to make the product to be able to stop it being made.',
      },
      {
        q: 'What is the strongest argument against the US onshoring push succeeding quickly?',
        a: 'People and supplier density, not money. The US has a genuine shortage of back-end process technicians because the work left decades ago, and the supplier ecosystem — chemicals, precision machining, maintenance — has to be rebuilt alongside the fabs. Subsidies address capital; they do not address a workforce that takes a decade to train.',
      },
    ],
  },
  {
    sectionId: 'customers',
    questions: [
      {
        q: 'You have a technology that cuts packaging cost 30%. Who is the wrong first customer?',
        a: 'An AI accelerator vendor. They are capacity-constrained, not cost-constrained — at 70%+ gross margin a few hundred dollars of BOM is not the decision variable. Take cost reduction to mobile, where volumes multiply every cent. Take the same technology to AI only if you can reframe it as capacity gained or schedule saved.',
      },
      {
        q: 'Why is an OSAT the best first customer for most packaging startups?',
        a: 'Sales cycle: 9–18 months, the shortest among serious buyers. They think in payback periods, so if you can show a credible 2–3 year return on capital or a specific customer qualification you unlock, the decision is tractable. Foundries take 2–4 years and automotive 3–5, which most seed-stage companies cannot finance.',
      },
      {
        q: 'Why does an automotive customer treat a process improvement as a threat?',
        a: 'Because any change invalidates the reliability data set and requires requalification, and because their risk is asymmetric — a field failure can mean a recall or worse. They optimise for the identical part from the identical line for 15 years. "We improved it" means "we changed it", and change is the thing they are structurally built to resist.',
      },
    ],
  },
  {
    sectionId: 'opportunities',
    questions: [
      {
        q: 'Why is metrology a better startup entry point than bonding equipment?',
        a: 'Metrology tools do not touch the product, so they cannot cause a field failure and qualify in months rather than years; they can be sold as evaluation units into engineering budgets; and capital to a production tool is $15–40m rather than $100–300m. Bonding has a larger TAM but partner-funded incumbents with install bases and recipe libraries you would be three years behind.',
      },
      {
        q: 'What is the strongest argument against a glass substrate startup?',
        a: 'Timing risk. The technology may well win eventually, but it has slipped repeatedly, the reliability data does not exist, and a startup that runs out of money waiting for a market is dead regardless of being right. It is only attractive with patient capital or a strategic partner funding the wait — which is a financing question, not a technology question.',
      },
      {
        q: 'Give the general rule for where a packaging startup can wedge in.',
        a: 'Where there is no incumbent to displace (new process step), where qualification is short because you do not touch the product (metrology, software, test analytics), or where a customer is blocked and you are the only unblock. If your plan requires a customer to requalify a shipping product in order to adopt you, you do not have a plan.',
      },
      {
        q: 'Why should "AI packaging is growing" never appear in your thesis?',
        a: 'Because it is true of every layer simultaneously and therefore discriminates nothing. Growth accrues to whoever is non-substitutable within a qualification-gated flow. The useful questions are: where is the constraint, who holds it, what margin do they earn, and is there a step where no incumbent has a head start? Those produce a thesis; "the market is growing" produces a slide.',
      },
    ],
  },
  {
    sectionId: 'bottlenecks',
    questions: [
      {
        q: 'Why do bottlenecks in this industry rotate rather than resolve?',
        a: 'Because the system expands element by element and the slowest element moves. It has rotated from interposer capacity to HBM to substrates to test time. Any thesis anchored to today\'s specific shortage has a short shelf life; a thesis anchored to a constraint that worsens structurally — thermal, interconnect density, test time per part — does not.',
      },
      {
        q: 'Where does the margin sit relative to where the constraint sits, and why does that matter?',
        a: 'They are systematically misaligned. Substrates and OSATs hold real constraints at 15–25% gross margin while designers and foundries capture 50–75%. The constraint-holder therefore under-invests in capacity relative to what the system needs, because they carry the cycle risk and someone else captures the upside. That persistent misalignment is the most reliable generator of opportunity in the industry.',
      },
      {
        q: 'Which bottleneck would you build a company against for a ten-year horizon?',
        a: 'Thermal has the best structural case: the physics worsens every generation, it is already the binding constraint on integration, the customer can measure your benefit in degrees within weeks, and no incumbent has solved it. Test complexity is a close second — it scales with package complexity regardless of node and is directly monetisable in tester-hours saved.',
      },
      {
        q: 'Why is packaging cost listed as a bottleneck when flagship AI customers are not cost-sensitive?',
        a: 'Because cost is what gates the much larger market underneath the flagship. Advanced packaging at current prices is affordable only at 70% product gross margin; if it got cheap enough for mainstream devices, unit volumes would grow by orders of magnitude. Most founders chase the flagship — the bigger business is probably the one that makes the flagship\'s technology affordable to everyone else.',
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUIZZES.reduce((n, q) => n + q.questions.length, 0);

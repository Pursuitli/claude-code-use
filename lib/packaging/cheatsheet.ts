/** The 30 things. Ordered roughly from mechanism to strategy. */
export const THIRTY_THINGS: { n: number; group: string; claim: string; because: string }[] = [
  { n: 1, group: 'Mechanism', claim: 'Packaging is a pitch converter.', because: 'Die pads sit at 40–150 µm; boards resolve tens of microns. Every packaging generation is fundamentally a smaller pitch.' },
  { n: 2, group: 'Mechanism', claim: 'Advanced packaging means fab processes applied to assembly.', because: 'Lithography, plating, CMP and TSV etch instead of drilling and wire bonding. That one change moved margins from 20% to 50%+.' },
  { n: 3, group: 'Mechanism', claim: 'The reticle limit is 26 × 33 mm = 858 mm².', because: 'Nothing monolithic is bigger. Every "3.3× reticle" headline is describing a stitched interposer at the edge of manufacturability.' },
  { n: 4, group: 'Mechanism', claim: 'Energy per bit is the number that decides architecture.', because: 'In-package ~1 pJ/bit vs board-level DDR 15–20+. At 8 TB/s that difference is hundreds of watts.' },
  { n: 5, group: 'Mechanism', claim: 'HBM must be in the package or it cannot exist.', because: 'A 1,024-bit bus is only routable and only affordable over sub-millimetre interposer traces.' },
  { n: 6, group: 'Mechanism', claim: 'HBM is fast because it is wide, not because it is quick.', because: 'Wide-and-slow beats narrow-and-fast on energy per bit — and is only possible because the wires are microns long.' },
  { n: 7, group: 'Mechanism', claim: 'Beachfront caps how a chip can be partitioned.', because: 'Cross-boundary bandwidth = die edge × bandwidth per mm, and bandwidth per mm is set by the packaging technology.' },
  { n: 8, group: 'Mechanism', claim: 'CTE mismatch causes most packaging failures.', because: 'Silicon at ~2.6 ppm/K against a substrate at ~17, bonded hot and cooled. Warpage, cracked joints, delamination all trace back here.' },
  { n: 9, group: 'Mechanism', claim: 'Warpage scales with the square of body size.', because: 'It is the hard ceiling on package size, and the core argument for glass cores.' },
  { n: 10, group: 'Mechanism', claim: 'Thermal, not lithography, now limits integration.', because: 'You can always add silicon; you increasingly cannot cool it. 3D stacking makes it worse every generation.' },
  { n: 11, group: 'Economics', claim: 'Yield compounds multiplicatively.', because: 'Eight dies at 99% is 92.3%, not 99%. This single fact caps chiplet counts and drives all test investment.' },
  { n: 12, group: 'Economics', claim: '"Known-good-die" is a probability, not a fact.', because: 'Escape rate = (1 − yield) × (1 − coverage). Always ask for the escape rate.' },
  { n: 13, group: 'Economics', claim: 'Memory usually dominates an AI accelerator\'s BOM.', because: 'Often several times the compute silicon. The leading-edge logic everyone talks about is a minority of manufactured cost.' },
  { n: 14, group: 'Economics', claim: 'A point of yield is worth ~$40 per unit on a $4,000 assembly.', because: 'And in a shortage it creates sellable units without capex — which is worth far more than the arithmetic suggests.' },
  { n: 15, group: 'Economics', claim: 'Scrap cost equals everything committed before the failure.', because: 'Which is why the back end is architected around testing early and never committing value to an unverified assembly.' },
  { n: 16, group: 'Economics', claim: 'Gross margin tracks substitutability, not difficulty.', because: 'Substrates are hard and earn 20%. EDA is hard and earns 85%. The difference is whether the customer has an alternative.' },
  { n: 17, group: 'Economics', claim: 'Packaging cost is what gates the market beneath the flagship.', because: 'Advanced packaging is affordable at 70% product margin. Make it cheap and unit volumes grow by orders of magnitude.' },
  { n: 18, group: 'Structure', claim: 'TSMC captured advanced packaging by making it non-substitutable.', because: 'CoWoS is co-designed with the silicon and cannot be second-sourced quickly. ASE\'s services can be.' },
  { n: 19, group: 'Structure', claim: 'Capacity means allocation, not idle machines.', because: 'It is contracted years ahead by a handful of buyers. There is no spot market to arbitrage.' },
  { n: 20, group: 'Structure', claim: 'Packaging capacity expands on an 18–30 month cycle.', because: 'Construction, tool lead times, per-product requalification, and a yield ramp that starts below mature.' },
  { n: 21, group: 'Structure', claim: 'The constraint and the margin sit in different places.', because: 'Substrates and OSATs hold real constraints at 20% margins while designers capture 70%. So they under-invest — permanently.' },
  { n: 22, group: 'Structure', claim: 'Bottlenecks rotate; they do not resolve.', because: 'Interposer → HBM → substrate → test. Any thesis anchored to today\'s shortage has a short shelf life.' },
  { n: 23, group: 'Structure', claim: 'Three companies make DRAM; one leads in HBM.', because: 'And qualification is per-customer, per-generation, so being late means being late for the whole generation.' },
  { n: 24, group: 'Structure', claim: 'Japan controls materials and can stop the line.', because: 'ABF, mould compounds, underfills, resists, DISCO, Advantest, TOWA. You do not need to make the product to be able to halt it.' },
  { n: 25, group: 'Structure', claim: 'Taiwan concentration is the industry\'s defining risk.', because: 'And every diversification plan to date is a partial hedge, not a solution.' },
  { n: 26, group: 'Strategy', claim: 'Qualification is 18–36 months and $2–20m.', because: 'It is your customer-acquisition cost, paid in time you must finance before revenue exists.' },
  { n: 27, group: 'Strategy', claim: 'Qualification cuts both ways.', because: 'The barrier that keeps you out protects you once you are in. Investors underwrite qualification milestones, not product milestones.' },
  { n: 28, group: 'Strategy', claim: '"Better" does not win; "unblocked" wins.', because: 'A 20% improvement gets a meeting. Being the only path to the next product gets a purchase order and funded qualification.' },
  { n: 29, group: 'Strategy', claim: 'Prefer things that do not touch the product.', because: 'Metrology, inspection, software and test analytics qualify in months because they cannot cause a field failure. That determines your capital need.' },
  { n: 30, group: 'Strategy', claim: 'Enter where no incumbent has a head start.', because: 'Glass, hybrid bonding adjacencies, panel-level, in-package cooling. New process, no accumulated qualification advantage.' },
];

export const SMART_QUESTIONS: { q: string; why: string }[] = [
  { q: 'What is your interconnect pitch today, and what does the roadmap say for the next two generations?', why: 'Pitch is the honest measure of a packaging technology. It also reveals whether they have a roadmap or a product.' },
  { q: 'Where is your point of no return — after which step does a failure scrap the whole assembly?', why: 'Shows you understand that packaging economics are dominated by committed value, not unit cost.' },
  { q: 'What is your compound yield across all dies and attaches, not your per-step yield?', why: 'Per-step yield is what people quote. Compound yield is what determines the business.' },
  { q: 'What is your test escape rate, and how do you bound it?', why: 'Distinguishes someone who says "known-good-die" from someone who has measured it.' },
  { q: 'Which supplier in your chain has the lowest margin and the highest criticality?', why: 'That is where your supply risk actually lives — and they have the least incentive to expand for you.' },
  { q: 'What is your qualification path, with whom, and what have they already committed?', why: 'Separates a customer conversation from a purchase order. NRE and joint development agreements are the tell.' },
  { q: 'What happens to your thermal solution at 1.5× the current power?', why: 'Thermal is the binding constraint. If they have not modelled the next generation, they are solving yesterday\'s problem.' },
  { q: 'What would make a customer requalify a shipping product to adopt you?', why: 'If the answer is "we are better", they do not understand their own sales cycle.' },
  { q: 'Is your warpage budget verified at temperature, on production-size bodies?', why: 'Room-temperature data on small coupons is where optimistic packaging claims go to hide.' },
  { q: 'If your technology works perfectly, who loses — and what do they do about it?', why: 'Tests whether they have thought about incumbent response, which in this industry is usually price plus a roadmap announcement.' },
];

export const REVEALING_QUESTIONS: { q: string; good: string; bad: string }[] = [
  {
    q: 'Why is HBM fast?',
    good: 'Because it is very wide (1,024/2,048-bit) over very short in-package wires, which makes wide-and-slow affordable on energy per bit.',
    bad: '"Because it is stacked" or "because it is new memory" — describes the shape, not the mechanism.',
  },
  {
    q: 'Eight chiplets at 99% yield each. What is the package yield?',
    good: '92.3% before assembly losses, and lower after. Compound yield is multiplicative.',
    bad: 'Anything near 99%. This single answer sorts people instantly.',
  },
  {
    q: 'Why not just make the interposer bigger?',
    good: 'The reticle limit forces stitching, whose yield degrades per seam; interposer silicon computes nothing; and warpage scales with body size squared.',
    bad: '"It would be expensive" — true but non-specific.',
  },
  {
    q: 'Why did TSMC capture advanced packaging rather than the OSATs?',
    good: 'It made packaging non-substitutable and applied fab economics and process control to it. Substitutable services earn substitutable margins.',
    bad: '"Because they are bigger" — misses the mechanism entirely.',
  },
  {
    q: 'What is actually constrained in the CoWoS supply chain?',
    good: 'HBM, large-body substrates, test capacity, and cleanroom plus process engineers. ABF film is a systemic single point of failure but not currently the volume gate.',
    bad: '"CoWoS capacity" as a single undifferentiated thing.',
  },
  {
    q: 'Why can\'t a better supplier just replace the incumbent?',
    good: '18–36 months and $2–20m of customer cost, plus career risk on a production line. Switching happens when the customer is blocked, not when you are better.',
    bad: '"Because incumbents have relationships" — true but shallow; the barrier is economic and quantifiable.',
  },
  {
    q: 'What limits how much compute fits in one package?',
    good: 'Thermal first, then substrate warpage and body size, then interconnect density and power delivery. Not lithography.',
    bad: '"Moore\'s Law" — the wrong constraint for this question.',
  },
  {
    q: 'Where should a packaging startup enter?',
    good: 'Where there is no incumbent to displace, or where qualification is short because you do not touch the product. Metrology, thermal, test software, hybrid-bonding adjacencies.',
    bad: '"Advanced packaging is growing" — true of every layer simultaneously, so it discriminates nothing.',
  },
  {
    q: 'Why do substrate makers not expand faster in a shortage?',
    good: 'They earn 15–25% margins, carry the cycle risk, and were burned in 2022–23. Expansion requires prepayment or take-or-pay from a customer earning far more.',
    bad: '"They are being cautious" — correct but misses the structural incentive misalignment.',
  },
  {
    q: 'What would make you change your mind about advanced packaging as an investment area?',
    good: 'Specific falsifiable triggers: capacity overshooting demand, a memory architecture that removes the HBM constraint, panel-level economics arriving faster than expected, or AI capex guidance rolling over.',
    bad: 'No answer. Anyone without disconfirming conditions has a narrative, not a thesis.',
  },
];

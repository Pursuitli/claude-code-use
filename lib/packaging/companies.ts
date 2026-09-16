import type { CompanyProfile } from './types';

/**
 * Financial figures are approximate, cycle-dependent and tagged as estimates.
 * The durable content is the *structural* read: moat, vulnerability, and what
 * a startup should not walk into.
 */
export const COMPANIES: CompanyProfile[] = [
  {
    id: 'tsmc',
    name: 'TSMC',
    ticker: 'TSM / 2330.TW',
    hq: 'Hsinchu, Taiwan',
    layer: 'Foundry + advanced packaging',
    role: 'Manufactures the leading-edge silicon and, through CoWoS/InFO/SoIC, the packaging that makes it usable.',
    strengths: [
      'Leading-edge process leadership with the deepest yield-learning curve in the industry',
      'CoWoS is the de facto standard platform for AI accelerators',
      'Trusted neutral foundry — does not compete with its customers\' products',
      'Co-optimises die and package under one roof, which materially shortens debug cycles',
    ],
    customers: ['NVIDIA', 'Apple', 'AMD', 'Broadcom', 'Qualcomm', 'MediaTek', 'hyperscaler custom silicon'],
    moat:
      'Compounding yield learning on the most complex processes, a customer base that has co-designed around its PDKs, and packaging capacity that is contracted years ahead. Switching costs are measured in product generations, not quarters.',
    vulnerabilities: [
      'Geographic concentration in Taiwan is the industry\'s defining systemic risk',
      'Extreme customer concentration — a handful of buyers drive a large share of leading-edge revenue',
      'Capex intensity means a demand air-pocket hurts disproportionately',
      'Overseas fabs (Arizona, Kumamoto, Dresden) run at structurally higher cost',
    ],
    doNotCompete:
      'Do not attempt to be a foundry, and do not attempt to be a general-purpose 2.5D packaging provider. Sell them a tool, a material, or a capability they have chosen not to build.',
    numbers: [
      { label: 'Gross margin', value: '~53–60%', confidence: 'est' },
      { label: 'Leading-edge foundry share', value: '~90%+', confidence: 'est' },
      { label: 'Capex', value: '~$30–45bn/yr', confidence: 'est' },
    ],
  },
  {
    id: 'ase',
    name: 'ASE Technology (incl. SPIL)',
    ticker: 'ASX / 3711.TW',
    hq: 'Kaohsiung, Taiwan',
    layer: 'OSAT',
    role: 'The world\'s largest outsourced assembly and test provider, across everything from wire bond to fan-out and 2.5D.',
    strengths: [
      'Scale — the broadest capacity and technology menu of any OSAT',
      'VIPack platform covering fan-out, 2.5D and embedded bridge approaches',
      'Deep relationships across fabless customers who do not want to be locked to a foundry',
      'Takes outsourced portions of foundry packaging flows during shortages',
    ],
    customers: ['Broad fabless base', 'Automotive and industrial', 'Networking', 'overflow from foundry packaging'],
    moat:
      'Scale, capacity flexibility and qualification breadth. Customers keep second sources at OSATs precisely to avoid depending entirely on a foundry.',
    vulnerabilities: [
      'Margin structure is 15–25% gross — it cannot fund fab-like capex from cash flow the way a foundry can',
      'Lost the flagship 2.5D profit pool to TSMC',
      'Price competition from Chinese OSATs at the commodity end',
    ],
    doNotCompete:
      'Do not build a general-purpose OSAT. You will compete on price against a company with twenty times your scale and no incentive to let you win a single socket.',
    numbers: [
      { label: 'Gross margin', value: '~16–24%', confidence: 'est' },
      { label: 'OSAT market share', value: '~30%', confidence: 'est' },
    ],
  },
  {
    id: 'amkor',
    name: 'Amkor Technology',
    ticker: 'AMKR',
    hq: 'Tempe, Arizona, USA',
    layer: 'OSAT',
    role: 'Second-largest OSAT; the largest US-headquartered one, with strong automotive and RF franchises.',
    strengths: [
      'Automotive qualification depth — a slow, sticky, high-barrier business',
      'Geographic diversity: Korea, Philippines, Vietnam, China, Portugal, and Arizona',
      'S-SWIFT and S-Connect fan-out and bridge technologies',
      'Arizona site positions it as the US onshore packaging partner adjacent to TSMC Arizona',
    ],
    customers: ['Automotive semiconductor vendors', 'Apple (RF/other)', 'Broad fabless base', 'Infineon, NXP, TI'],
    moat: 'Automotive qualifications and a Western-headquartered footprint at a moment when that is strategically valuable.',
    vulnerabilities: [
      'Same structural margin ceiling as all OSATs',
      'Customer concentration in specific programmes',
      'Trails TSMC badly in leading-edge 2.5D capability',
    ],
    doNotCompete:
      'Do not try to out-qualify them in automotive. That moat took twenty years and is made of paperwork and field data, not technology.',
    numbers: [
      { label: 'Gross margin', value: '~14–18%', confidence: 'est' },
      { label: 'Revenue', value: '~$6–7bn', confidence: 'est' },
    ],
  },
  {
    id: 'jcet',
    name: 'JCET',
    ticker: '600584.SS',
    hq: 'Jiangyin, China',
    layer: 'OSAT',
    role: 'Largest Chinese OSAT; owns STATS ChipPAC, giving it Singapore and Korea operations.',
    strengths: [
      'Scale and cost position in China',
      'Beneficiary of domestic substitution policy and state support',
      'XDFOI fan-out platform and growing advanced capability',
      'Non-China footprint via STATS ChipPAC',
    ],
    customers: ['Chinese fabless designers', 'domestic memory and logic', 'some international customers'],
    moat: 'Policy tailwind and cost. A domestic Chinese customer has strong non-commercial reasons to use them.',
    vulnerabilities: [
      'Export controls restrict access to the most advanced tooling and to HBM',
      'Technology gap at the leading edge of 2.5D/3D',
      'Geopolitical constraints limit Western customer adoption for sensitive products',
    ],
    doNotCompete:
      'Do not compete on cost for commodity packaging. If you are non-Chinese, do not assume the Chinese domestic market is addressable — increasingly it is not.',
    numbers: [
      { label: 'Gross margin', value: '~12–16%', confidence: 'est' },
      { label: 'Global OSAT rank', value: '#3', confidence: 'est' },
    ],
  },
  {
    id: 'intel',
    name: 'Intel',
    ticker: 'INTC',
    hq: 'Santa Clara, USA',
    layer: 'IDM + foundry + advanced packaging',
    role: 'Designs and manufactures its own chips, and sells foundry and packaging services to others.',
    strengths: [
      'EMIB and Foveros are genuinely differentiated and shipping in volume',
      'The most advanced glass-substrate programme publicly disclosed',
      'US and EU manufacturing footprint aligned with industrial policy',
      'Sells advanced packaging as a standalone service — you can buy Intel packaging without Intel silicon',
    ],
    customers: ['Internal products', 'foundry and packaging-only customers', 'US government programmes'],
    moat: 'Packaging IP and a Western footprint. EMIB in particular is a real technical asset that competitors had to work around.',
    vulnerabilities: [
      'Balance sheet and capex constraints limit how fast it can build',
      'Process-technology credibility has to be re-earned with each node',
      'Customers hesitate to depend on a supplier that also competes with them in products',
    ],
    doNotCompete:
      'Do not build a competing bridge technology. Do consider being a supplier into their packaging-services ecosystem — they are unusually open to partnership because they need external validation.',
    numbers: [
      { label: 'Gross margin', value: '~30–40%', confidence: 'est', note: 'Well below historical norms' },
      { label: 'Packaging sites', value: 'US, Malaysia, Ireland, Israel, Costa Rica', confidence: 'fact' },
    ],
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics',
    ticker: '005930.KS',
    hq: 'Suwon, South Korea',
    layer: 'Memory + foundry + packaging',
    role: 'The only company that makes leading-edge logic, DRAM/HBM and advanced packaging under one roof.',
    strengths: [
      'Turnkey offering — logic, memory and packaging from a single supplier',
      'Enormous capital capacity and willingness to build through a cycle',
      'I-Cube and X-Cube advanced packaging platforms',
      'Vertical integration into substrates via Samsung Electro-Mechanics',
    ],
    customers: ['Internal', 'Tesla and other foundry customers', 'HBM customers across the accelerator market'],
    moat: 'Vertical integration and capital scale. In principle nobody else can offer the full stack.',
    vulnerabilities: [
      'Trailed SK hynix in HBM qualification for a full generation — a costly, visible miss',
      'Foundry yield credibility gap versus TSMC',
      'Competes with its own customers, which limits trust in the turnkey pitch',
    ],
    doNotCompete:
      'Do not compete on capital. Samsung will outspend you in any segment it decides matters, and will accept losses for years to do it.',
    numbers: [
      { label: 'DRAM share', value: '~35–40%', confidence: 'est' },
      { label: 'Foundry share', value: '~8–12%', confidence: 'est' },
    ],
  },
  {
    id: 'skhynix',
    name: 'SK hynix',
    ticker: '000660.KS',
    hq: 'Icheon, South Korea',
    layer: 'Memory / HBM',
    role: 'The HBM leader — first to qualify HBM3 with the dominant accelerator vendor and the primary beneficiary of the AI memory cycle.',
    strengths: [
      'HBM process leadership, including the MR-MUF stacking approach',
      'First-mover qualification with the largest accelerator customer',
      'Deep co-development relationship with that customer and with TSMC on HBM4 base dies',
    ],
    customers: ['NVIDIA', 'AMD', 'Broadcom', 'hyperscaler custom silicon'],
    moat:
      'Qualification lead. In HBM, being first to qualify in a generation is worth more than being 10% cheaper, because the customer cannot switch mid-generation without requalifying.',
    vulnerabilities: [
      'Still exposed to the commodity DRAM cycle for the rest of its business',
      'Customer concentration in a single dominant buyer',
      'Samsung and Micron are both investing heavily to close the gap',
    ],
    doNotCompete:
      'Do not try to make memory. Do consider selling into the HBM process — stacking, thinning, test and thermal are all places where an HBM maker will pay for an advantage.',
    numbers: [
      { label: 'HBM share', value: '~50%+ at peak', confidence: 'est' },
      { label: 'Gross margin', value: 'Cyclical; ~50%+ at HBM-driven peaks', confidence: 'est' },
    ],
  },
  {
    id: 'micron',
    name: 'Micron',
    ticker: 'MU',
    hq: 'Boise, Idaho, USA',
    layer: 'Memory / HBM',
    role: 'The third DRAM supplier and the only US-headquartered one.',
    strengths: [
      'Credible HBM3E entry with competitive power efficiency claims',
      'US-headquartered — strategically valuable for supply diversification and policy support',
      'Strong Singapore and Japan manufacturing footprint',
    ],
    customers: ['NVIDIA', 'AMD', 'broad compute and mobile customers'],
    moat: 'Being the third source in a three-supplier market is itself a franchise — customers structurally need you to exist.',
    vulnerabilities: [
      'Smallest of the three; capex disadvantage through a cycle',
      'Later to HBM than SK hynix, with the resulting allocation disadvantage',
      'Full exposure to DRAM cycle violence',
    ],
    doNotCompete: 'Same as the others: memory manufacturing is closed. The adjacencies are open.',
    numbers: [
      { label: 'DRAM share', value: '~20–25%', confidence: 'est' },
      { label: 'Singapore presence', value: 'Major NAND fab and back-end operations', confidence: 'fact' },
    ],
  },
  {
    id: 'ibiden',
    name: 'Ibiden',
    ticker: '4062.T',
    hq: 'Ogaki, Japan',
    layer: 'Package substrates',
    role: 'The premium ABF substrate supplier — historically the constrained source for the highest-end packages.',
    strengths: [
      'Highest layer-count, largest-body ABF capability',
      'Decades of process learning on a product where yield is everything',
      'Deep, exclusive-feeling relationships with the top logic customers',
    ],
    customers: ['Intel (historically)', 'NVIDIA-adjacent supply chain', 'leading logic vendors'],
    moat: 'Yield on the hardest substrates. Anyone can make a 12-layer substrate; very few can make a 24-layer, 100 mm body at acceptable yield.',
    vulnerabilities: [
      'Modest margins relative to strategic importance — the classic bottleneck profile',
      'Capacity additions take 2–3 years and are capital-heavy',
      'Scarred by past over-build cycles, hence structurally cautious about expansion',
      'Glass substrates could eventually reset its learning-curve advantage',
    ],
    doNotCompete:
      'Do not build a conventional ABF substrate business. Capital-heavy, low-margin, qualification-gated, and you would be entering at the bottom of a learning curve someone else started in the 1990s.',
    numbers: [
      { label: 'Gross margin', value: '~20–28%', confidence: 'est' },
      { label: 'Lead time to add capacity', value: '2–3 years', confidence: 'est' },
    ],
  },
  {
    id: 'unimicron',
    name: 'Unimicron',
    ticker: '3037.TW',
    hq: 'Taoyuan, Taiwan',
    layer: 'Package substrates',
    role: 'The largest Taiwanese substrate maker; volume leader across a broad range of grades.',
    strengths: ['Scale and breadth', 'Proximity to the Taiwanese packaging cluster', 'Moving up into higher-end ABF and interposer-adjacent products'],
    customers: ['Broad — logic, memory, networking, mobile'],
    moat: 'Scale and cluster proximity. Being twenty minutes from the assembly line is worth real money.',
    vulnerabilities: ['Cyclical earnings', 'Lower-end mix exposed to price competition', 'Trails Ibiden/Shinko at the very top end'],
    doNotCompete: 'The volume substrate market is a scale-and-yield game you cannot enter from a standing start.',
    numbers: [{ label: 'Gross margin', value: '~15–30% through cycle', confidence: 'est' }],
  },
  {
    id: 'shinko',
    name: 'Shinko Electric Industries',
    ticker: '6967.T',
    hq: 'Nagano, Japan',
    layer: 'Package substrates',
    role: 'Premium substrate and lead-frame maker; a key high-end supplier alongside Ibiden.',
    strengths: ['High-end substrate capability', 'Strong Japanese materials-ecosystem relationships', 'Products adjacent to interposers and embedded structures'],
    customers: ['Leading logic and HPC vendors'],
    moat: 'Technical depth at the top of the substrate range, plus the Japanese materials cluster around it.',
    vulnerabilities: ['Ownership transition following its acquisition by a Japanese investment consortium', 'Capacity constraints', 'Same margin structure as the rest of the substrate industry'],
    doNotCompete: 'As with Ibiden — this is not a market you enter, it is a market you supply.',
    numbers: [{ label: 'Position', value: 'Top-tier high-end ABF supplier', confidence: 'est' }],
  },
  {
    id: 'besi',
    name: 'BE Semiconductor (BESI)',
    ticker: 'BESI.AS',
    hq: 'Duiven, Netherlands',
    layer: 'Packaging equipment',
    role: 'High-accuracy die attach and hybrid bonding systems.',
    strengths: [
      'Best-in-class placement accuracy',
      'Partnership with Applied Materials on die-to-wafer hybrid bonding',
      'Exceptional margin structure for an equipment company',
    ],
    customers: ['TSMC', 'Intel', 'memory makers', 'OSATs'],
    moat: 'Precision engineering plus early positioning in hybrid bonding, the next mandatory process transition.',
    vulnerabilities: ['Small relative to AMAT/ASML — vulnerable if a giant decides to compete directly', 'Revenue tied to a narrow set of large customers', 'Hybrid bonding adoption timing is uncertain and has slipped before'],
    doNotCompete:
      'Do not build a competing hybrid bonder — you will be three years behind against a partner-backed incumbent. Build the metrology, inspection or cleaning that their tool needs and does not provide.',
    numbers: [
      { label: 'Gross margin', value: '~60–67%', confidence: 'est' },
      { label: 'Focus', value: 'Die attach, hybrid bonding, plating', confidence: 'fact' },
    ],
  },
  {
    id: 'asmpt',
    name: 'ASMPT',
    ticker: '0522.HK',
    hq: 'Singapore / Hong Kong',
    layer: 'Packaging equipment',
    role: 'The broadest back-end equipment portfolio: wire bond, flip chip, TCB, hybrid bonding, moulding, SMT.',
    strengths: [
      'Full-line coverage lets it sell a whole line rather than a tool',
      'Large installed base across every OSAT on earth',
      'Credible thermocompression and hybrid bonding programmes',
      'Singapore presence — relevant if you are building in Southeast Asia',
    ],
    customers: ['Every major OSAT', 'foundries', 'memory makers'],
    moat: 'Breadth and install base. When a customer is buying a line, the vendor who can supply eight of the twelve tools has an advantage on all twelve.',
    vulnerabilities: ['Lower margins than focused competitors like BESI or DISCO', 'Exposed to the commodity SMT cycle', 'Must defend on many fronts at once'],
    doNotCompete: 'Do not compete across the line. Compete on one step where you can be clearly, measurably better.',
    numbers: [
      { label: 'Gross margin', value: '~33–42%', confidence: 'est' },
      { label: 'Portfolio', value: 'Widest in back-end equipment', confidence: 'est' },
    ],
  },
];

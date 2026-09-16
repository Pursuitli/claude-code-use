import type { Depth } from './types';

export const QUAL_STAGES: {
  id: string;
  name: string;
  duration: string;
  what: string;
  detail: string;
  cost: string;
  failureConsequence: string;
}[] = [
  {
    id: 'eval',
    name: '0. Technical evaluation',
    duration: '3–6 months',
    what: 'The customer decides whether your thing is even worth testing.',
    detail:
      'Data package review, a technical exchange, sometimes a sample build on their materials. The gatekeepers are process engineers who are measured on yield stability, not on innovation — so their default answer is no, and it is a rational default. You are asking them to take personal risk on a line where a mistake is visible and expensive.',
    cost: 'Your engineering time; usually no customer money.',
    failureConsequence: 'Nothing lost but months. Most engagements die here, and most should.',
  },
  {
    id: 'dev',
    name: '1. Development / joint engineering',
    duration: '6–18 months',
    what: 'Iterate with the customer until the process works on their line, with their materials.',
    detail:
      'This is where a startup either survives or discovers it has built a demo. A result on your equipment with your samples means very little; the customer needs it on their tool set, at their throughput, with their operators. Expect to discover that your process interacts badly with steps you had never heard of.',
    cost: 'Heavy. Sometimes partially funded by an NRE or joint development agreement — always try to get one, both for cash and as a commitment signal.',
    failureConsequence: 'A year of runway spent. This is where most hardware startups actually die.',
  },
  {
    id: 'rel',
    name: '2. Reliability qualification',
    duration: '6–12 months',
    what: 'Prove the package survives its intended service life.',
    detail:
      'The standard battery, largely per JEDEC: temperature cycling (typically −55 °C to +125 °C, 500–1,000+ cycles), high-temperature storage, highly accelerated stress testing, unbiased HAST for moisture, biased life testing, drop and bend tests, and moisture-sensitivity-level classification. Some tests simply take calendar time and cannot be compressed — 1,000 thermal cycles is 1,000 thermal cycles.',
    cost: 'Hundreds of thousands to low millions of dollars in test time, units and lab access.',
    failureConsequence: 'A failure here restarts the clock with a modified design. This is the schedule risk that kills product launches.',
  },
  {
    id: 'cust',
    name: '3. Customer validation',
    duration: '3–9 months',
    what: 'The customer tests it in their actual product, in their actual system.',
    detail:
      'System-level validation, thermal and electrical characterisation in the real chassis, software and firmware bring-up, and field trials. New failure modes appear here that no component-level test predicted, because the system introduces interactions the component test could not.',
    cost: 'Shared, but the schedule risk is yours.',
    failureConsequence: 'Late-stage failure is the worst outcome: maximum spend, maximum reputational damage, and you have consumed a product cycle.',
  },
  {
    id: 'ramp',
    name: '4. Production ramp',
    duration: '6–12 months',
    what: 'Scale from demonstrated units to volume at stable yield.',
    detail:
      'Yield at 100 units tells you almost nothing about yield at 100,000. Ramp exposes lot-to-lot variation, operator variation, tool-to-tool variation and supply-chain variation all at once. Customers stage volume deliberately so that a yield excursion does not take down their product line.',
    cost: 'Working capital — and this is where an undercapitalised supplier fails even after winning.',
    failureConsequence: 'Second-sourcing. The customer qualifies your competitor and you become the backup, permanently.',
  },
  {
    id: 'sustain',
    name: '5. Sustaining & failure analysis',
    duration: 'Forever',
    what: 'Support the part for its entire production life.',
    detail:
      'Failure analysis on returns within contractual turnaround times, corrective action reports, process change notifications with customer approval required for any change, and continuity of supply commitments. For automotive this runs 15 years — long enough that the original engineering team will have left.',
    cost: 'Ongoing organisational overhead that startups routinely underestimate.',
    failureConsequence: 'Poor failure-analysis response loses the next programme, regardless of how good the product is.',
  },
];

export const SWITCHING_COST_MATH: {
  item: string;
  value: string;
  note: string;
}[] = [
  { item: 'Elapsed time to qualify a new packaging supplier', value: '18–36 months', note: 'Longer for automotive; shorter only for genuine drop-in replacements.' },
  { item: 'Direct cost of a full qualification', value: '$2–20m', note: 'Engineering time, test units, lab capacity, opportunity cost.' },
  { item: 'Value of a product cycle missed', value: 'Hundreds of millions', note: 'In AI, a two-quarter slip can cost an entire generation of market share.' },
  { item: 'Probability a technically superior newcomer wins on merit alone', value: 'Low', note: 'Merit is necessary and nowhere near sufficient.' },
  { item: 'Improvement typically required to trigger a switch', value: '2–10× on a metric the customer is already blocked on', note: '"20% better" does not move anyone. Being blocked is the trigger, not being better.' },
];

export const WHY_DEFENSIBLE: Depth = {
  simple:
    'Even if your product is clearly better, the customer has to spend two years and millions of dollars proving it is safe to use — and if it goes wrong, someone gets fired. So they mostly do not bother unless their current supplier cannot solve a problem they urgently have.',
  founder:
    'Qualification is an economic moat disguised as an engineering process, and it cuts both ways — which is the part founders miss. Against you: the customer\'s switching cost is your customer-acquisition cost, paid in time you must finance. A 24-month qualification means 24 months of burn before revenue, which sets your minimum viable raise before you have written a line of a business plan. For you, later: once you are the qualified supplier, your position is remarkably durable, because your competitor now faces the same 24-month barrier and your customer has no incentive to help them. That asymmetry is why packaging suppliers with mediocre technology can earn good returns for a decade, and why investors in this sector underwrite qualification milestones rather than product milestones.\n\nThe practical consequence is that your go-to-market must be designed around the moat, not against it. Three plays actually work. (1) Enter where there is no incumbent to displace — a new process step, a new material system, a new package architecture. Glass and hybrid bonding are attractive for precisely this reason: nobody has a twenty-year qualification head start. (2) Enter where the customer is blocked and has no alternative. "Better" loses; "the only thing that unblocks my roadmap" wins, and the customer will then pay for and accelerate your qualification themselves. (3) Enter through a step whose qualification is inherently shorter — metrology and inspection tools do not touch the product, so they qualify in months rather than years, which is why they are the most capital-efficient hardware entry point in this industry. If your plan requires a customer to requalify a shipping product to adopt you, you do not have a plan.',
};

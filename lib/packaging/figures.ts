/**
 * Captions and annotations for the explanatory figures.
 *
 * Kept beside the rest of the content so a figure's numbers are corrected in
 * the same place as the prose that cites them.
 */
import type { Confidence } from './types';

export interface FigureMeta {
  id: string;
  title: string;
  caption: string;
  reading: string;
  confidence: Confidence;
}

export const FIGURES: Record<string, FigureMeta> = {
  pitch: {
    id: 'pitch',
    title: 'The area 1,000 connections need',
    caption:
      'Squares drawn at true relative area, sharing a corner. Area scales with the square of pitch, so each step down the packaging ladder shrinks the footprint dramatically rather than gradually.',
    reading:
      'This is the whole industry in one picture. Going from board-level pitch to hybrid bonding is not an incremental improvement in density — it is a factor of roughly 6,000 in the area the same thousand wires occupy.',
    confidence: 'model',
  },
  perimeter: {
    id: 'perimeter',
    title: 'Why flip chip had to replace wire bonding',
    caption:
      'Wire bonds attach only around the die edge, so I/O grows with circumference. Flip chip uses the whole face, so I/O grows with area. Same die, same pad pitch.',
    reading:
      'Double the die and wire bonding gives you twice the connections; flip chip gives you four times. That single geometric fact ended wire bonding for high-pin-count logic.',
    confidence: 'model',
  },
  yield: {
    id: 'yield',
    title: 'Why big dies are disproportionately expensive',
    caption:
      'One wafer, one fixed set of randomly placed defects. Only the die size changes. Drag the slider and watch the good-die count collapse faster than the die count falls.',
    reading:
      'Defects land per unit area, so a die twice the area is far more than twice as likely to contain one. This is the arithmetic that created the chiplet industry.',
    confidence: 'model',
  },
  reticle: {
    id: 'reticle',
    title: 'The reticle limit, and stitching past it',
    caption:
      'A stepper exposes one 26 x 33 mm field. Anything larger must be built from multiple exposures aligned to each other, and every seam is a place where alignment and yield can fail.',
    reading:
      'When coverage says a package is "3.3x reticle", this is the picture it is describing. The seams are the reason interposer yield falls as packages grow.',
    confidence: 'fact',
  },
  energy: {
    id: 'energy',
    title: 'What distance costs, in picojoules per bit',
    caption:
      'Interconnect distance on a logarithmic scale against the energy needed to move one bit across it. Each step outward from the die costs roughly an order of magnitude more.',
    reading:
      'Multiply the right-hand end by terabytes per second and you get hundreds of watts. That product — not chip architecture — is why memory had to move inside the package.',
    confidence: 'est',
  },
  warpage: {
    id: 'warpage',
    title: 'Where warpage comes from',
    caption:
      'Silicon and organic substrate are joined flat at reflow temperature, then cool at different rates. The mismatch has nowhere to go except into curvature.',
    reading:
      'Bow grows roughly with the square of body size, which is why a package that behaves at 50 mm becomes a yield problem at 100 mm — and why glass cores are interesting.',
    confidence: 'est',
  },
  fanout: {
    id: 'fanout',
    title: 'Fan-in versus fan-out',
    caption:
      'Fan-in packages route within the die footprint, so connection count is capped by the die\'s own area. Fan-out rebuilds the die inside a larger moulded body and routes outward past its edge.',
    reading:
      'Fan-out buys I/O that the die itself has no room for, without paying for a laminate substrate. That is why it went from niche to every flagship phone.',
    confidence: 'model',
  },
  chiplet: {
    id: 'chiplet',
    title: 'The chiplet trade, both sides of it',
    caption:
      'The same total silicon area as one monolithic die or as four tested chiplets, measured in silicon consumed per working part rather than in yield percentage.',
    reading:
      'Worth reading twice, because the obvious version of this argument is wrong. The probability that all four chiplets are good is identical to the monolith\'s yield — the exponents simply add. The real win is that bad silicon is thrown away in 200 mm² pieces and only tested-good dies are assembled, which is roughly a quarter less silicon per working product. The costs are equally real: more package steps, more test insertions, and power burned crossing every new boundary.',
    confidence: 'model',
  },
  scale: {
    id: 'scale',
    title: 'How big these things actually are',
    caption:
      'Package bodies drawn at true relative scale against a Singapore one-dollar coin (24.65 mm).',
    reading:
      'A flagship accelerator package is roughly the size of a drink coaster and carries over a kilowatt. Holding that physical fact makes the thermal and warpage sections much easier to follow.',
    confidence: 'est',
  },
  processline: {
    id: 'processline',
    title: 'What the wafer looks like at each step',
    caption:
      'The state of the material through the back-end flow, from an incoming wafer to a lidded, tested package.',
    reading:
      'Notice where the value concentrates: by the substrate-attach step the assembly already carries thousands of dollars of tested components, which is why late-stage scrap dominates the economics.',
    confidence: 'model',
  },
};

/**
 * Curated photographs. Files are fetched separately (scripts/fetch-figures.mjs)
 * because they are third-party CC-licensed works, not repo content — the page
 * renders correctly whether or not they are present on disk.
 */
export interface PhotoMeta {
  id: string;
  file: string;
  title: string;
  why: string;
  commonsTitle: string;
  section: string;
}

export const PHOTOS: PhotoMeta[] = [
  {
    id: 'wafer',
    file: 'wafer.jpg',
    title: 'Silicon wafers',
    why: 'Before it is a chip it is this: a mirror-polished disc holding hundreds of copies of the same die, still joined together.',
    commonsTitle: 'File:Wafer 2 Zoll bis 8 Zoll 2.jpg',
    section: 'fundamentals',
  },
  {
    id: 'wirebond',
    file: 'wirebond.jpg',
    title: 'Wire bonds under magnification',
    why: 'The oldest interconnect in the industry, still the majority of packaged units by count. Note that every wire lands on the die perimeter.',
    commonsTitle: 'File:Wire bonding detail.jpg',
    section: 'ladder',
  },
  {
    id: 'flipchip',
    file: 'flipchip.jpg',
    title: 'Flip-chip bumps',
    why: 'The area array that replaced perimeter wires — connections across the entire die face.',
    commonsTitle: 'File:Flip chip bumps.jpg',
    section: 'ladder',
  },
  {
    id: 'package',
    file: 'package.jpg',
    title: 'A delidded processor package',
    why: 'The substrate, the die, the lid and the thermal interface — the stack from the anatomy section, as a physical object.',
    commonsTitle: 'File:Delidded Intel CPU.jpg',
    section: 'anatomy',
  },
  {
    id: 'probecard',
    file: 'probecard.jpg',
    title: 'A probe card',
    why: 'Thousands of needles that touch every die at wafer test. This is where known-good-die is decided.',
    commonsTitle: 'File:Probe card.jpg',
    section: 'process',
  },
  {
    id: 'cleanroom',
    file: 'cleanroom.jpg',
    title: 'A semiconductor cleanroom',
    why: 'Advanced packaging now happens in rooms like this rather than on an assembly floor. That change is why capacity takes years to add.',
    commonsTitle: 'File:Cleanroom.jpg',
    section: 'cowos',
  },
];

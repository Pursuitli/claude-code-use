#!/usr/bin/env node
/**
 * Download the curated photographs used by /packaging from Wikimedia Commons.
 *
 *   node scripts/fetch-figures.mjs
 *
 * These are third-party Creative Commons works, so they are fetched rather than
 * committed: the repo stays free of other people's images, and the licence and
 * author for each one are recorded in public/figures/CREDITS.md at download
 * time, straight from the Commons API rather than from memory.
 *
 * The page renders correctly without them — <Photo> falls back to a labelled
 * placeholder — so this script is optional and safe to re-run.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'figures');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'omulabs-packaging-manual/1.0 (https://demo.omulabs.co; figure fetch)';
const WIDTH = 1200;

/**
 * Each entry lists candidates in preference order — Commons files get renamed
 * and deleted, so a single hard-coded title is fragile. The first candidate
 * that resolves wins; if none do, the search term is used as a fallback.
 */
const WANTED = [
  { file: 'wafer.jpg',     search: 'silicon wafer',        candidates: ['File:Wafer 2 Zoll bis 8 Zoll 2.jpg', 'File:Silicon wafer.jpg'] },
  { file: 'wirebond.jpg',  search: 'wire bonding chip',    candidates: ['File:Wire bonding detail.jpg', 'File:Bonddraht.jpg'] },
  { file: 'flipchip.jpg',  search: 'flip chip solder bump',candidates: ['File:Flip chip bumps.jpg', 'File:Solder bumps.jpg'] },
  { file: 'package.jpg',   search: 'delidded cpu die',     candidates: ['File:Delidded Intel CPU.jpg', 'File:CPU die exposed.jpg'] },
  { file: 'probecard.jpg', search: 'wafer probe card',     candidates: ['File:Probe card.jpg', 'File:Wafer prober.jpg'] },
  { file: 'cleanroom.jpg', search: 'semiconductor cleanroom',candidates: ['File:Cleanroom.jpg', 'File:Semiconductor cleanroom.jpg'] },
];

const api = async (params) => {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

/** Resolve a Commons title to a thumbnail URL plus its licence metadata. */
const resolve = async (title) => {
  const data = await api({
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: String(WIDTH),
    titles: title,
  });
  const page = Object.values(data?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl) return null;
  const meta = info.extmetadata ?? {};
  const strip = (v) => (v ? String(v.value).replace(/<[^>]*>/g, '').trim() : '');
  return {
    title: page.title,
    url: info.thumburl,
    descriptionUrl: info.descriptionurl,
    author: strip(meta.Artist) || 'Unknown',
    licence: strip(meta.LicenseShortName) || 'see Commons page',
  };
};

const search = async (term) => {
  const data = await api({
    action: 'query', list: 'search', srsearch: `${term} filetype:bitmap`,
    srnamespace: '6', srlimit: '5',
  });
  return (data?.query?.search ?? []).map((r) => r.title);
};

const run = async () => {
  await mkdir(OUT, { recursive: true });
  const credits = [];
  let ok = 0;

  for (const want of WANTED) {
    let hit = null;
    for (const title of [...want.candidates, ...(await search(want.search))]) {
      try {
        hit = await resolve(title);
        if (hit) break;
      } catch { /* try the next candidate */ }
    }
    if (!hit) {
      console.warn(`  skip  ${want.file} — nothing resolved for "${want.search}"`);
      continue;
    }
    const res = await fetch(hit.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.warn(`  skip  ${want.file} — download failed (${res.status})`);
      continue;
    }
    await writeFile(join(OUT, want.file), Buffer.from(await res.arrayBuffer()));
    credits.push({ ...hit, file: want.file });
    ok++;
    console.log(`  ok    ${want.file}  ←  ${hit.title}  [${hit.licence}]`);
  }

  const md = [
    '# Figure credits',
    '',
    'Photographs used on `/packaging`, downloaded from Wikimedia Commons by',
    '`scripts/fetch-figures.mjs`. Each remains the property of its author under the',
    'licence shown. Re-run the script to refresh this file.',
    '',
    `Generated ${new Date().toISOString().slice(0, 10)}.`,
    '',
    '| File | Source | Author | Licence |',
    '| --- | --- | --- | --- |',
    ...credits.map((c) => `| \`${c.file}\` | [${c.title}](${c.descriptionUrl}) | ${c.author} | ${c.licence} |`),
    '',
  ].join('\n');
  await writeFile(join(OUT, 'CREDITS.md'), md);

  console.log(`\n${ok}/${WANTED.length} images written to public/figures/`);
  if (ok < WANTED.length) {
    console.log('Missing images degrade gracefully — the page shows a labelled placeholder.');
  }
  console.log('Review public/figures/CREDITS.md before publishing: confirm each licence');
  console.log('permits your use, and keep the attribution visible.');
};

run().catch((err) => {
  console.error('fetch-figures failed:', err.message);
  process.exitCode = 1;
});

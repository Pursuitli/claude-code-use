# omulabs site

A Next.js (App Router) site with three pages, statically exported (`output: 'export'`) so it deploys on any static host or framework-aware platform (Vercel, Netlify, Cloudflare Pages…).

| Route | Page |
| --- | --- |
| `/` | **Love Island 🏝❤** — low-poly 3D browser game (Three.js) |
| `/songyun` | **宋韻** — Song-dynasty aesthetics scroll page |
| `/chinese-painting` | **入畫 · 山水隨行** — immersive scroll-journey landscape |
| `/bus` | **KMB 巴士到站 · Bus ETA** — real-time Hong Kong KMB bus checker ([details](#kmb-bus-eta-bus)) |
| `/packaging` | **Advanced Packaging — A Founder Operating Manual** — interactive semiconductor packaging primer ([details](#advanced-packaging-packaging)) |

## Develop

```sh
npm install
npm run dev      # http://localhost:3000
```

## Build

```sh
npm run build    # static export written to out/
```

Serve `out/` with any static file server. `trailingSlash: true` keeps `/songyun/` and `/chinese-painting/` working as plain directories.

## Structure

- `app/page.jsx` + `lib/love-island.js` — the game. The React page renders the HUD/overlay DOM; `startGame()` (the original game runtime, now an ES module importing `three` from npm) boots the renderer in a `useEffect` and returns a cleanup for unmounts.
- `app/songyun/` and `app/chinese-painting/` — each page is a client component with its scroll choreography in `useEffect` and route-scoped CSS (`.songyun-root` / `.ruhua-root` wrappers).
- `public/assets/` — game portraits and reference art.

## Love Island

Drive the scooter with **W/S** (throttle/brake) and **A/D** (steer); touch devices get a virtual joystick. Charm as many girls as you can in 60 seconds, and refuel at the town gas station before the tank runs dry. Golden girls (end of the pier, behind the lighthouse…) are worth +5 ❤.

### Portraits

`generate_girls.py` generates the 10 profile portraits in `public/assets/girls/` via the OpenAI Images API (`gpt-image-2`, needs `OPENAI_API_KEY` and network access to `api.openai.com`):

```sh
OPENAI_API_KEY=sk-... python generate_girls.py
```

The repo currently contains illustrated placeholder portraits (from `make_placeholders.py`) because the build environment's network policy blocked `api.openai.com`. Re-running `generate_girls.py` overwrites them with the real photos — same filenames, no code changes needed.

---

## KMB Bus ETA (`/bus`)

A full, mobile-first Hong Kong **KMB bus route checker** built on the public
[KMB Open Data API](https://data.etabus.gov.hk/) (`https://data.etabus.gov.hk/v1/transport/kmb`).
No API key is required (the API is CORS-enabled and key-less).

**Hybrid data path** (deployed on Vercel):

- **Semi-static data** (route list, stop list, route-stop mapping) is served
  through Vercel **Route Handlers** at `/api/kmb/*` that fetch KMB once and
  return an **edge-cached** (`s-maxage=86400`), trimmed payload. So KMB is hit
  ~once a day per region instead of once per visitor, and the ~1 MB stop list is
  slimmed to the fields the UI uses.
- **Live ETA** is fetched **client-direct** from KMB for lowest latency and
  maximum freshness (no server hop), and is never cached.

> Because of the server Route Handlers this app is **not** a static export; it
> runs as a Next.js app on Vercel. (The rest of the site still pre-renders to
> static pages — only `/api/kmb/*` runs on the server.)

Theme colour is the KMB red **`#E70013`**, sampled directly from the KMB logo.

### Features

- **Route search** — search by route number (`87D`, `40`, `680`); shows every
  variant with origin → destination in 繁中 / English.
- **Route detail** (`/bus/route?route=87D&dir=outbound&st=1`) — inbound/outbound
  toggle, service-type variants, full ordered stop sequence, and the next 3 live
  ETAs per stop (stop name TC/EN, sequence, `stop_id`, remarks). Refreshes every 30s.
- **Stop search & detail** (`/bus/stop?id=…`) — search by name
  (`沙田第一城` / `City One Shatin`); shows **all** KMB routes serving the stop
  via `/stop-eta/{stop_id}`, grouped by route + destination.
- **Nearby stops** (`/bus/nearby`) — browser geolocation finds stops within
  300 m / 500 m / 1 km, sorted by distance.
- **Favorites** (`/bus/favorites`) — save a route-stop-direction
  (e.g. *87D 沙田第一城 → 紅磡站*); the page shows live ETA immediately and
  persists in `localStorage`.
- **ETA display** — large glanceable minute numbers, HK wall-clock time,
  destination, remark, and a live/scheduled tag. Null/missing ETAs are handled
  gracefully. Loading skeletons, error states with retry, "last updated"
  timestamp, manual refresh, and dark mode (via `prefers-color-scheme`).

### Architecture

| Concern | Where |
| --- | --- |
| Typed API client | `lib/kmb/api.ts` (`getRoutes`, `getStops`, `getStop`, `getRouteStops`, `getEta`, `getStopEta`, `getRouteEta`) |
| Server proxy (edge-cached static data) | `app/api/kmb/{routes,stops,route-stop}/…` + `lib/kmb/server.ts` |
| API response types | `lib/kmb/types.ts` |
| Static-data cache (route/stop/route-stop, **1×/day**) | `lib/kmb/cache.ts` (localStorage, with stale-on-error fallback) |
| Data hooks | `lib/kmb/hooks.ts` (`useAsync`, `usePolling` — 30s ETA refresh) |
| Favorites store + hook | `lib/kmb/favorites.ts`, `lib/kmb/useFavorites.ts` |
| Geo / formatting helpers | `lib/kmb/geo.ts`, `lib/kmb/format.ts` |
| Pages | `app/bus/{page,route,stop,nearby,favorites}` |
| Shared UI | `app/bus/_components/` |

Static data (route list, stop list, route-stop mapping) is treated as
semi-static and cached in `localStorage` for 24h; **ETA data is never cached**
and is polled every 30 seconds while a page is open. Dynamic data is passed via
query strings (not dynamic route segments) so the whole app stays statically
exportable.

> **Stack note:** the brief suggested Tailwind + React Query/SWR + TypeScript.
> This app is integrated into an existing **non-Tailwind** Next.js site, so
> styling is scoped plain CSS namespaced under `.kmb` (`app/bus/bus.css`) to
> avoid leaking into the other pages, and data fetching uses small purpose-built
> hooks instead of an extra dependency. TypeScript is used throughout the bus
> app, its API client, and the server proxy.

### Try it

```sh
npm install && npm run dev   # http://localhost:3000/bus
```

1. Open `/bus`, search **`87D`**, open the route.
2. Find **沙田第一城 / City One Shatin** in the sequence — see live arrivals
   toward 紅磡站 (`ST510`) and/or 錦英苑 (`ST146`).
3. Tap ☆ to save it; reopen `/bus/favorites` to see live ETA from favorites.
4. On a phone at a bus stop, open `/bus/nearby` and allow location.

> Stop ids such as `E7133179F5800E85` are **discovered through the API**
> (route-stop → stop join), never hardcoded.

## Advanced Packaging (`/packaging`)

A single-page, interactive primer on the semiconductor advanced-packaging industry,
written for a commercially strong reader with no engineering background. Nineteen
sections across seven groups (Fundamentals, Technology, Manufacturing, Economics,
Ecosystem, Startup opportunities, Reference), 68 knowledge-check questions, a
115-term glossary, and fourteen hand-built explanatory figures.

### Structure

- `lib/packaging/*.ts` — **all content lives here as typed data**, separate from the
  components that render it. Figures drift (CoWoS capacity, HBM bandwidth, gross
  margins), so each one is editable in exactly one place. `types.ts` defines the shapes;
  `nav.ts` is the section registry that drives the left rail.
- `app/packaging/_components/ui.tsx` — design-system primitives (`Section`, `Panel`,
  `Matrix`, `Disclosure`, `DepthBlock`, `KnowledgeCheck`, `ScoreDots`, `Conf`).
- `app/packaging/_components/diagrams.tsx`, `primer.tsx`, `figures-a.tsx`,
  `figures-b.tsx` — every diagram is hand-built inline SVG: package cross-section, HBM
  stack, cost/density scatter, supply-chain flow, hub map, yield curve, plus the
  explanatory figures (interconnect area at true relative scale, perimeter vs area I/O,
  defects on a wafer, reticle stitching, energy per bit, warpage, fan-out geometry, the
  chiplet trade, true-scale package sizes, and material state through the line).
- `app/packaging/_components/Figure.tsx` — the frame every figure shares, the photo
  slot, and `Mark`, the typographic company mark.
- `app/packaging/_components/sections/*.tsx` — the eighteen sections, grouped by theme.
- `app/packaging/packaging.css` — Tailwind v4 entry plus the design tokens. Tokens are
  declared in `@theme` and re-bound under `.pk-dark`, so light/dark flips by swapping
  variable values rather than duplicating utilities.

### Confidence labelling

Every quantity is tagged `FACT` (published spec or filing), `EST` (industry estimate or
reported range) or `MODEL` (arithmetic constructed to illustrate a mechanism). The
bill-of-materials breakdown and the yield lab are both models — they teach the shape of
the relationship, not anyone's actual cost.

### Two reading modes

**Learning** shows the sequential teaching scaffolding; **Reference** strips it out and
raises information density. Independently, `Simple ⇄ Founder depth` toggles sit on every
hard concept. Reading mode, colour scheme and progress persist in `localStorage`.

### Notes

- Tailwind CSS v4 (`@tailwindcss/postcss`) and `lucide-react` were added for this route.
  The stylesheet is imported by `app/packaging/layout.tsx`, so Tailwind's preflight is
  scoped to this route segment and does not affect the other pages.
- `app/globals.css` declares its `*` reset inside `@layer base`. This matters: cascade
  layers always lose to unlayered author styles, so an unlayered `* { padding: 0 }` would
  silently defeat every Tailwind spacing utility on this route.
- Inter and JetBrains Mono are self-hosted (`public/fonts/`, ~180 KB of woff2) rather than
  linked from a CDN, so the page renders identically offline and on first paint.

### Figures

Diagrams are drawn, not generated. Diffusion models cannot render accurate technical
cross-sections or legible labels, and a plausible-but-wrong diagram on a page whose
premise is "every number is tagged for confidence" would undermine the diagrams that
are correct.

The figures are interactive where interaction teaches something — drag the die size on
the wafer figure and watch good-die count collapse; toggle the warpage figure between
reflow and room temperature.

One figure is worth reading the code for. `ChipletFigure` in `figures-b.tsx` deliberately
states the result most chiplet explanations get wrong: under Poisson yield the
probability that all four chiplets are good is *identical* to the monolith's yield,
because the exponents add. The real benefit is harvesting tested dies, so the figure
measures silicon consumed per working part instead of quoting a yield percentage.

### Photographs

Six curated Creative Commons photographs sit alongside the diagrams where physical
intuition matters. They are **not committed** — they are third-party works, so
`public/figures/` is gitignored apart from its credits file. Install them with:

```sh
node scripts/fetch-figures.mjs
```

The script resolves each image through the Wikimedia Commons API, downloads a 1200px
rendition, and writes `public/figures/CREDITS.md` with the author and licence it read
back from the API rather than from memory. Review that file before publishing and keep
the attribution visible.

Without the images the page is fully readable — each photo slot renders a labelled
placeholder telling you how to install them.

Company marks are typographic rather than real logos. Reproducing corporate logos on a
published site is a per-company trademark question (Apple's mark in particular is not
freely licensed), and a set of mismatched raster logos would look worse here than one
consistent treatment.

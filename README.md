# omulabs site

A Next.js (App Router) site with three pages, statically exported (`output: 'export'`) so it deploys on any static host or framework-aware platform (Vercel, Netlify, Cloudflare Pages…).

| Route | Page |
| --- | --- |
| `/` | **Love Island 🏝❤** — low-poly 3D browser game (Three.js) |
| `/songyun` | **宋韻** — Song-dynasty aesthetics scroll page |
| `/chinese-painting` | **入畫 · 山水隨行** — immersive scroll-journey landscape |
| `/bus` | **KMB 巴士到站 · Bus ETA** — real-time Hong Kong KMB bus checker ([details](#kmb-bus-eta-bus)) |

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

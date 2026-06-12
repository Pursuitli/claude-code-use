# omulabs site

A Next.js (App Router) site with three pages, statically exported (`output: 'export'`) so it deploys on any static host or framework-aware platform (Vercel, Netlify, Cloudflare Pages…).

| Route | Page |
| --- | --- |
| `/` | **Love Island 🏝❤** — low-poly 3D browser game (Three.js) |
| `/songyun` | **宋韻** — Song-dynasty aesthetics scroll page |
| `/chinese-painting` | **入畫 · 山水隨行** — immersive scroll-journey landscape |

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

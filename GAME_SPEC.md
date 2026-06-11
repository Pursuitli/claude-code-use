# Island Heart Rush 心動小島 — Full Build Prompt

> Paste this entire document as the first message of a fresh AI coding session.
> Provide your Seedream API key as an environment variable (`ARK_API_KEY`) —
> never paste it into code or commit it.

---

Build me a complete, polished 3D browser game called **Island Heart Rush（心動小島）**.

## Story & Tone

You are a cheerful young boy on a little red scooter, spending a summer on a
miniature toy island. Beautiful girls are waiting at scenic spots all around
the island — the beach, the lighthouse, the café terrace, the flower field.
Drive up, stop beside a girl for a moment, and a charm interaction plays
(hearts burst, a happy jingle) — she's smitten and hops on to join your
convoy, trailing behind your scooter like ducklings. Every girl who joins
adds her portrait card to your collection album.

Tone: wholesome anime seaside-summer romantic comedy. Cute, warm, playful.
All UI text in Traditional Chinese (zh-Hant).

## Core Loop

- 90-second run, 3-2-1-GO countdown.
- 8–10 unique girls; one waits at a scenic spot, a new one spawns at another
  spot each time one joins you.
- To charm: stop within 2 m of a girl for 1 second → heart particles,
  +1 companion, her portrait slides into the HUD album strip, she joins the
  follow-train (spring-damped trailing motion).
- Risk/reward: each follower slightly lowers your acceleration.
- Fuel system: throttle drains an analog E/F fuel dial; empty = push-speed
  only + "冇油呀!" banner; refuel by stopping at the gas station (2.5 s
  progress bar).
- End screen: companions collected, album of portraits, playful rank title
  (e.g. 「萬人迷」「島上傳說」), replay button.

## Tech Requirements

- Single-page web app, three.js ES modules (importmap, three@0.160+),
  no build step required to run.
- 60 fps on desktop and mobile.
- Desktop controls: W/S throttle & brake, A/D steer.
- Mobile controls: big gas/brake touch buttons, left virtual joystick, and a
  gyroscope tilt-steering toggle (handle the iOS
  `DeviceOrientationEvent.requestPermission()` flow from a user gesture;
  pick the tilt axis based on `screen.orientation.angle`).
- Scooter physics: speed-sensitive steering, lean into turns, collision
  slide against obstacles, soft boundary at the coastline.

## Visual Quality Bar — do not ship less than this

Toybox / diorama low-poly style, soft pastel palette, MeshStandardMaterial,
PCFSoft shadows, gentle distance fog, hemisphere + warm directional light.

1. **Island**: irregular organic coastline (displaced polygon outline, NOT a
   plain cylinder) with layered sand ring → grass plateau → gentle hills.
2. **Town**: 8–12 houses with varied pastel roofs, a café with a parasol,
   rounded gray road network winding through town.
3. **Lighthouse**: red/white striped, on a rocky point.
4. **Vegetation**: palm trees on beaches (curved trunks, blade fronds),
   round fruit trees in town, flower patches, bushes, rocks.
5. **Sea**: deep/shallow two-tone water, animated sparkle particles,
   4–6 satellite mini-islands offshore with palms, 2–3 small boats bobbing
   and slowly cruising with white wake dots.
6. **Sky**: puffy 3-sphere clouds drifting; optional AI-generated
   equirectangular sky panorama as scene background.
7. **Camera**: slow 360° aerial orbit of the island on the title screen
   (cinematic establishing shot); on START, swoop down and blend into a
   third-person chase camera behind the scooter.
8. **Characters**: stylized minifig proportions. The boy: helmet, backpack.
   Each girl: unique hair color/style, dress color, and idle animation
   (waving, twirling, hair sway). Followers trail with springy motion.

## AI-Generated Imagery (Seedream)

Generate 2D art at **build time** with a script (Node or shell) that calls
Seedream and saves results into `/assets`. Never call the API from the
shipped client; never embed the key.

Endpoint:

```
POST https://ark.ap-southeast.bytepluses.com/api/v3/images/generations
Authorization: Bearer $ARK_API_KEY
Content-Type: application/json

{
  "model": "seedream-5-0-260128",
  "prompt": "<see prompts below>",
  "sequential_image_generation": "disabled",
  "response_format": "url",
  "size": "2K",
  "watermark": false
}
```

Assets to generate:

1. **10 girl portrait cards** — keep one consistent style string and vary
   only the subject description:
   - Style base: `cute anime-style half-body portrait, pastel seaside summer,
     soft warm lighting, clean cream background, sticker style, high quality`
   - Vary: hair (silver bob / long chestnut / pink twin-tails / ...), outfit
     (sundress, sailor top, café apron...), one-word personality in the pose.
2. **Title key art**: `young boy on a red scooter waving, miniature toy
   island with lighthouse and village behind, aerial view, warm summer
   afternoon, anime movie poster style`
3. **Optional sky panorama**: `equirectangular 360 panorama, soft anime
   summer sky, cumulus clouds, pastel blue, no ground`

Wire the portraits into the HUD album strip and the end-screen album grid.

## Code Quality

- One `index.html` entry + `/assets` for generated images + one
  `generate-assets.mjs` build script (reads `ARK_API_KEY` from env).
- Organized sections: scene build / characters / physics / HUD / game state.
- Comments in Traditional Chinese where non-obvious.
- Graceful fallback: if an asset image is missing, use a colored placeholder
  card so the game still runs.

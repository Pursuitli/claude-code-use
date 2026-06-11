# Love Island 🏝❤

A polished low-poly 3D browser game built with Three.js — no build step.

## Run

```sh
python -m http.server 8000
# open http://localhost:8000
```

Drive the scooter with **W/S** (throttle/brake) and **A/D** (steer); touch devices get a virtual joystick. Charm as many girls as you can in 60 seconds, and refuel at the town gas station before the tank runs dry. Golden girls (end of the pier, behind the lighthouse…) are worth +5 ❤.

## Portraits

`generate_girls.py` generates the 10 profile portraits in `assets/girls/` via the OpenAI Images API (`gpt-image-2`, needs `OPENAI_API_KEY` and network access to `api.openai.com`):

```sh
OPENAI_API_KEY=sk-... python generate_girls.py
```

The repo currently contains illustrated placeholder portraits (from `make_placeholders.py`) because the build environment's network policy blocked `api.openai.com`. Re-running `generate_girls.py` overwrites them with the real photos — same filenames, no code changes needed.

Three.js is vendored at `vendor/three.module.js` (the importmap points there) so the game also runs fully offline.

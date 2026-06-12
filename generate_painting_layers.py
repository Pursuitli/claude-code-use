#!/usr/bin/env python3
"""Generate Song-Dynasty-style 青綠山水 painting layers via OpenAI Images API (gpt-image-2).

Generates 5 parallax/scene layers for the 入畫 page:
  far.webp    — distant mountains emerging from mist (遠山)
  mid.webp    — middle-ground jade ridges (中山)
  near.webp   — bold foreground peaks (近山)
  bridge.webp — ancient stone arch bridge over water (橋)
  bamboo.webp — ink-wash bamboo stalks (竹)

Output goes to  public/assets/painting/  (Next.js static dir).
Saved as webp for smaller file size (requires Pillow).

Usage:
    OPENAI_API_KEY=sk-... python3 generate_painting_layers.py [--force]

Install deps if needed:
    pip install requests pillow
"""
import base64
import io
import os
import sys
import time

import requests
try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: pip install pillow")

API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    sys.exit("OPENAI_API_KEY environment variable not set.")

ROOT    = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "public", "assets", "painting")
FORCE   = "--force" in sys.argv
os.makedirs(OUT_DIR, exist_ok=True)

SIZE = "1536x1024"          # landscape orientation; gpt-image-2 supports this

STYLE = (
    "Traditional Chinese Song-Dynasty landscape painting (宋代青綠山水), "
    "style of Wang Ximeng 《千里江山圖》. Malachite green (石綠) and azurite blue (石青) "
    "mineral pigments, ink-wash (水墨) accent strokes on white xuan-paper texture. "
    "No frame, no border, no text, no watermark. "
    "Wide horizontal panoramic composition, masterpiece brushwork quality. "
)

LAYERS = [
    (
        "far",
        STYLE +
        "Layer: extremely distant mountain range barely visible through morning mist. "
        "Pale jade-green and diluted azurite peaks overlap and fade into white sky. "
        "Soft gradients, mostly negative space (留白), upper silhouettes dissolve into "
        "cream-white mist. No water, no foreground details. Ethereal and minimal.",
    ),
    (
        "mid",
        STYLE +
        "Layer: vivid middle-ground mountain ridges. Saturated malachite-green (石綠) "
        "slopes with visible rock-face texture, small pine clusters dotting the ridgeline, "
        "a tiny ancient stone pavilion (亭) perched on one peak, thin waterfalls cascading "
        "between cliff faces. Rich detail in upper 65%, lower portion fades to white.",
    ),
    (
        "near",
        STYLE +
        "Layer: bold close foreground rocky peaks in deep azurite and green. Dense pine "
        "trees (松) with individual needle brushwork, dramatic cliff overhangs, large "
        "moss-covered boulders at lower edges, a lone scholar in flowing robes on a "
        "mountain path. Strong ink outlines. Lower 30% fades to white for water overlay.",
    ),
    (
        "bridge",
        STYLE +
        "Single element on white background: an ancient Chinese stone arch bridge (拱橋) "
        "spanning a calm river. Multiple arches reflected in still water below. A traveller "
        "with a staff and a donkey crossing the bridge. Willow trees draping over the banks. "
        "Ink-wash style, fine line work, centered composition. White/cream background.",
    ),
    (
        "bamboo",
        STYLE +
        "Single element on white background: bamboo stalks and leaves (竹) in traditional "
        "ink-wash (水墨) style. Two or three tall graceful stalks with segmented joints, "
        "elegant pointed leaves in varying ink tones from dark to pale gray. "
        "Tall vertical composition, pure white background, classical Chinese brushwork.",
    ),
]


def generate(name: str, prompt: str) -> None:
    path = os.path.join(OUT_DIR, f"{name}.webp")
    if not FORCE and os.path.exists(path) and os.path.getsize(path) > 5_000:
        print(f"[skip] {name}.webp already exists (use --force to regenerate)")
        return
    print(f"[gen]  {name}.webp ...")
    for attempt in range(4):
        try:
            resp = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-image-2",
                    "prompt": prompt,
                    "size": SIZE,
                    "n": 1,
                },
                timeout=360,
            )
            resp.raise_for_status()
            data = resp.json()
            if "error" in data:
                raise RuntimeError(data["error"].get("message", str(data["error"])))
            b64 = data["data"][0]["b64_json"]
            png_bytes = base64.b64decode(b64)
            img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
            img.save(path, "WEBP", quality=88)
            kb = os.path.getsize(path) // 1024
            print(f"[ok]   {name}.webp  ({kb} KB, {img.width}×{img.height})")
            return
        except Exception as e:
            detail_r = getattr(e, "response", None)
            detail = detail_r.text[:400] if detail_r is not None else str(e)[:300]
            wait = 2 ** (attempt + 1)
            print(f"[retry {attempt + 1}/4] {name}: {detail}  (waiting {wait}s)")
            time.sleep(wait)
    print(f"[FAIL] {name}")
    sys.exit(1)


if __name__ == "__main__":
    print(f"Output → {OUT_DIR}")
    print(f"Generating {len(LAYERS)} painting layers at {SIZE}...\n")
    for name, prompt in LAYERS:
        generate(name, prompt)
    files = [f for f in os.listdir(OUT_DIR) if f.endswith(".webp")]
    print(f"\n✓ Done: {len(files)} webp layers in {OUT_DIR}")
    print("  " + "  ".join(sorted(files)))

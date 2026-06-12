#!/usr/bin/env python3
"""
Generate ink-wash landscape layers for /chinese-painting with OpenAI gpt-image-2.

gpt-image-2 does not support transparent backgrounds, so every layer is
painted on a plain warm rice-paper background (#f6f2e9). The page composites
them with `mix-blend-mode: multiply`, which makes the paper white vanish
against the stage and keeps only the ink — no background removal needed.

Usage:
    OPENAI_API_KEY=sk-... python generate_painting_layers.py [--force]

Writes webp files into public/assets/painting/. The page falls back to the
built-in SVG layers for any file that is missing, so this can be run
layer-by-layer or not at all.
"""
import base64
import json
import os
import sys
import time
import urllib.request

API_KEY = os.environ["OPENAI_API_KEY"]
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "public", "assets", "painting")
FORCE = "--force" in sys.argv
os.makedirs(OUT_DIR, exist_ok=True)

STYLE = (
    "Traditional Chinese ink wash painting (shuimo shanshui), minimalist, "
    "large negative space, muted grey and grey-green ink tones only, "
    "painted on a plain uniform warm off-white rice paper background (hex #f6f2e9) "
    "that fills every area not covered by ink. The ink fades softly into the paper "
    "at the bottom edge like mist. No text, no calligraphy, no red seal, no border, "
    "no frame, full-bleed composition. "
)

# name -> (size, prompt)
LAYERS = {
    "far": ("2048x768", STYLE +
        "A very pale, distant mountain range emerging from haze, extremely light "
        "grey washes, barely-there silhouettes, wide horizontal panorama band, "
        "mountains occupy only the upper half, lower half is empty paper."),
    "mid": ("2048x768", STYLE +
        "A layered mountain ridge in medium grey-green ink washes with drifting "
        "mist between the ridges, wide horizontal panorama band, calm and poetic, "
        "mountains occupy the upper two thirds, lower third fades to empty paper."),
    "near": ("2048x768", STYLE +
        "A darker foreground mountain ridge in deep ink tones with a few pine "
        "trees and one tiny distant pavilion on the slope, wide horizontal "
        "panorama band, strong brush texture, base of the ridge fades to empty paper."),
    "bridge": ("1280x768", STYLE +
        "A single arched stone bridge in dark ink silhouette, seen from the side, "
        "with one tiny lone robed figure walking across it carrying a staff, "
        "centered composition, everything else is empty rice paper."),
    "bamboo": ("768x1536", STYLE +
        "A few tall bamboo stalks with scattered leaves in dark ink silhouette, "
        "rising from the bottom edge, leaning slightly to the right, vertical "
        "composition, elegant and sparse, everything else is empty rice paper."),
}

def generate(name, size, prompt):
    body = json.dumps({
        "model": "gpt-image-2",
        "prompt": prompt,
        "size": size,
        "quality": "high",
        "output_format": "webp",
        "output_compression": 88,
        "n": 1,
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.load(r)
    return base64.b64decode(data["data"][0]["b64_json"])

def main():
    for name, (size, prompt) in LAYERS.items():
        out = os.path.join(OUT_DIR, f"{name}.webp")
        if os.path.exists(out) and not FORCE:
            print(f"skip {name} (exists)")
            continue
        for attempt in range(3):
            try:
                print(f"generating {name} ({size}) ...")
                img = generate(name, size, prompt)
                with open(out, "wb") as f:
                    f.write(img)
                print(f"  -> {out} ({len(img)//1024} KB)")
                break
            except Exception as e:
                print(f"  attempt {attempt + 1} failed: {e}")
                if attempt == 2:
                    raise
                time.sleep(5 * (attempt + 1))

if __name__ == "__main__":
    main()

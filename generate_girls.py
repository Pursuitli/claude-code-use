#!/usr/bin/env python3
"""Generate 10 tasteful dating-app-style portrait photos via OpenAI Images API."""
import base64
import json
import os
import sys
import time
import urllib.request

API_KEY = os.environ["OPENAI_API_KEY"]
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "girls")
os.makedirs(OUT_DIR, exist_ok=True)

BASE = (
    "Photorealistic head-and-shoulders portrait of a beautiful young East Asian woman, "
    "facing the camera with a warm natural smile, elegant and tasteful styling like a "
    "professional dating-app profile photo, soft flattering light, shallow depth of field "
    "with a softly blurred background, high detail, portrait orientation. "
)

GIRLS = [
    ("mei",   "Long straight dark brown hair, beige blazer over a white blouse, cozy home office interior with warm bokeh lights."),
    ("yuna",  "Soft wavy shoulder-length hair, cream knit sweater, bright cafe interior background with bokeh."),
    ("sora",  "Chic short bob haircut, light blue summer dress, sunlit living room with plants in soft focus."),
    ("lin",   "High ponytail, smart-casual white shirt, modern studio backdrop in warm gray tones."),
    ("hana",  "Long wavy hair with side part, pastel pink cardigan over white top, soft window light, bookshelf bokeh."),
    ("aiko",  "Sleek long black hair, navy blazer with simple necklace, elegant hotel lobby bokeh background."),
    ("rin",   "Wavy bob with bangs, mustard yellow knit, cozy autumn cafe background, warm tones."),
    ("mika",  "Low loose ponytail over one shoulder, white linen summer dress, airy seaside-house interior in soft focus."),
    ("yui",   "Long straight hair with curtain bangs, light gray turtleneck, minimalist studio with soft cool light."),
    ("nana",  "Half-up half-down hairstyle, sage green blouse, botanical sunroom background with gentle bokeh."),
]


def generate(name: str, desc: str) -> None:
    path = os.path.join(OUT_DIR, f"{name}.png")
    if os.path.exists(path) and os.path.getsize(path) > 10000:
        print(f"[skip] {name} already exists")
        return
    body = json.dumps({
        "model": "gpt-image-2",
        "prompt": BASE + desc,
        "size": "1024x1536",
        "n": 1,
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    )
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                data = json.loads(resp.read())
            b64 = data["data"][0]["b64_json"]
            with open(path, "wb") as f:
                f.write(base64.b64decode(b64))
            print(f"[ok] {name} -> {path}")
            return
        except Exception as e:
            detail = getattr(e, "read", lambda: b"")()
            print(f"[retry {attempt + 1}] {name}: {e} {detail[:300]!r}")
            time.sleep(2 ** (attempt + 1))
    print(f"[FAIL] {name}")
    sys.exit(1)


if __name__ == "__main__":
    for n, d in GIRLS:
        generate(n, d)
    files = [f for f in os.listdir(OUT_DIR) if f.endswith(".png")]
    print(f"Done: {len(files)} portraits in {OUT_DIR}")
    assert len(files) >= 10, "missing portraits!"

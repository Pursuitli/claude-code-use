#!/usr/bin/env python3
"""Generate 10 tasteful dating-app-style portraits via OpenAI Images API (gpt-image-2).

Uses assets/reference/kiki.png as a reference image (via /v1/images/edits) so every
portrait keeps the same pretty East Asian look as the reference.

Usage:
    OPENAI_API_KEY=sk-... python3 generate_girls.py [--force]
"""
import base64
import os
import sys
import time

import requests

API_KEY = os.environ["OPENAI_API_KEY"]
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "public", "assets", "girls")
REF_IMG = os.path.join(ROOT, "public", "assets", "reference", "kiki.png")
FORCE = "--force" in sys.argv
os.makedirs(OUT_DIR, exist_ok=True)

BASE = (
    "The attached photo is ONLY a benchmark for photographic quality, lighting, skin retouching "
    "and East Asian beauty style. Do NOT copy or reuse the reference woman's face or identity. "
    "Create a brand-new, completely different person: a photorealistic head-and-shoulders portrait "
    "of a beautiful young East Asian woman with clearly East Asian facial features "
    "(NOT western, NOT latina). She faces the camera with a warm natural smile, elegant and "
    "tasteful styling like a professional dating-app profile photo, soft flattering light, shallow "
    "depth of field with softly blurred background, high detail, portrait orientation, matching "
    "the reference photo's overall quality. Her unique appearance: "
)

GIRLS = [
    ("mei",   "Oval face with delicate pointed chin, gentle monolid eyes, small refined nose. Long straight dark brown hair, beige blazer over a white blouse, cozy home office interior with warm bokeh lights."),
    ("yuna",  "Round soft face with full cheeks, big bright double-lid eyes, dimples when smiling. Soft wavy shoulder-length hair, cream knit sweater, bright cafe interior background with bokeh."),
    ("sora",  "Heart-shaped face, playful upturned cat-like eyes, slightly tanned skin. Chic short black bob haircut, light blue summer dress, sunlit living room with plants in soft focus."),
    ("lin",   "Sharp elegant face with defined cheekbones, almond eyes, confident sporty look. High ponytail, smart-casual white shirt, modern studio backdrop in warm gray tones."),
    ("hana",  "Sweet baby face, large round gentle eyes, fair porcelain skin, soft brows. Long wavy chestnut hair with side part, pastel pink cardigan over white top, soft window light, bookshelf bokeh."),
    ("aiko",  "Mature graceful face, narrow elegant eyes, beauty mark near lip, sophisticated aura. Sleek long black hair, navy blazer with simple necklace, elegant hotel lobby bokeh background."),
    ("rin",   "Cute mischievous face, slightly wide smile with visible teeth, freckle-light cheeks. Wavy bob with full bangs, mustard yellow knit, cozy autumn cafe background, warm tones."),
    ("mika",  "Slender face with soft jawline, dreamy gentle downturned eyes, natural look. Low loose ponytail over one shoulder, white linen summer dress, airy seaside-house interior in soft focus."),
    ("yui",   "Cool neutral face, straight brows, calm intelligent single-lid eyes, pale skin. Long straight black hair with curtain bangs, light gray turtleneck, minimalist studio with soft cool light."),
    ("nana",  "Warm friendly face, crescent smiling eyes, slightly rounder nose, healthy glow. Half-up half-down hairstyle, sage green blouse, botanical sunroom background with gentle bokeh."),
]


def generate(name: str, desc: str) -> None:
    path = os.path.join(OUT_DIR, f"{name}.png")
    if not FORCE and os.path.exists(path) and os.path.getsize(path) > 10000:
        print(f"[skip] {name} already exists (use --force to regenerate)")
        return
    for attempt in range(4):
        try:
            with open(REF_IMG, "rb") as ref:
                resp = requests.post(
                    "https://api.openai.com/v1/images/edits",
                    headers={"Authorization": f"Bearer {API_KEY}"},
                    files={"image[]": ("kiki.png", ref, "image/png")},
                    data={
                        "model": "gpt-image-2",
                        "prompt": BASE + desc,
                        "size": "1024x1536",
                        "n": 1,
                    },
                    timeout=300,
                )
            resp.raise_for_status()
            b64 = resp.json()["data"][0]["b64_json"]
            with open(path, "wb") as f:
                f.write(base64.b64decode(b64))
            print(f"[ok] {name} -> {path}")
            return
        except Exception as e:
            detail = getattr(e, "response", None)
            detail = detail.text[:300] if detail is not None else ""
            print(f"[retry {attempt + 1}] {name}: {e} {detail}")
            time.sleep(2 ** (attempt + 1))
    print(f"[FAIL] {name}")
    sys.exit(1)


if __name__ == "__main__":
    if not os.path.exists(REF_IMG):
        sys.exit(f"Reference image missing: {REF_IMG}")
    for n, d in GIRLS:
        generate(n, d)
    files = [f for f in os.listdir(OUT_DIR) if f.endswith(".png")]
    print(f"Done: {len(files)} portraits in {OUT_DIR}")
    assert len(files) >= 10, "missing portraits!"

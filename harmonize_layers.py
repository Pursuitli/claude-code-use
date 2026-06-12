#!/usr/bin/env python3
"""
Harmonize the raw gpt-image-2 layers (art-src/painting/) into the 入畫 page
palette and write them to public/assets/painting/.

The raw 青綠山水 generations are beautiful but too vivid for the page's muted
grey-green ink aesthetic (the reason an earlier revert removed them). This
desaturates each layer toward ink tones, feathers every edge into rice paper
(#f6f2e9) so the multiply composite never shows a rectangle seam, and crops
the bamboo to its subject.

Usage: python harmonize_layers.py
Re-tune the PARAMS table and re-run any time; raw sources are never modified.
"""
import os
import numpy as np
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "art-src", "painting")
OUT = os.path.join(ROOT, "public", "assets", "painting")
PAPER = np.array([246, 242, 233], dtype=float)

# name: (saturation, brightness, blend_to_paper, crop)
PARAMS = {
    "far":    (0.75, 1.02, 0.05, None),
    "mid":    (0.42, 1.04, 0.10, None),
    "near":   (0.40, 1.05, 0.08, None),
    "bridge": (0.55, 1.02, 0.05, None),
    "bamboo": (0.85, 1.00, 0.00, "subject"),   # 本就近墨色，僅裁切
}

EDGE = {"top": 0.10, "side": 0.05, "bottom": 0.07}


def crop_subject(img, thresh=18, pad=0.06):
    """Crop to the non-paper subject bounding box (for the bamboo)."""
    a = np.asarray(img, dtype=float)
    ink = np.abs(a - PAPER[None, None, :]).sum(axis=2) > thresh * 3
    ys, xs = np.where(ink)
    if len(xs) == 0:
        return img
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    pw, ph = int(img.width * pad), int(img.height * pad)
    return img.crop((max(0, x0 - pw), max(0, y0 - ph),
                     min(img.width, x1 + pw), min(img.height, y1 + ph)))


def feather_edges(img):
    """Blend every edge toward rice paper so multiply compositing is seamless."""
    a = np.asarray(img, dtype=float)
    h, w = a.shape[:2]
    yy = np.arange(h)[:, None] / h
    xx = np.arange(w)[None, :] / w
    t = np.clip(yy / EDGE["top"], 0, 1)
    b = np.clip((1 - yy) / EDGE["bottom"], 0, 1)
    l = np.clip(xx / EDGE["side"], 0, 1)
    r = np.clip((1 - xx) / EDGE["side"], 0, 1)
    keep = (np.minimum(np.minimum(t, b), np.minimum(l, r))) ** 1.5
    out = PAPER[None, None, :] * (1 - keep[..., None]) + a * keep[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def main():
    for name, (sat, bright, to_paper, crop) in PARAMS.items():
        img = Image.open(os.path.join(SRC, f"{name}.webp")).convert("RGB")
        if crop == "subject":
            img = crop_subject(img)
        img = ImageEnhance.Color(img).enhance(sat)
        img = ImageEnhance.Brightness(img).enhance(bright)
        if to_paper:
            a = np.asarray(img, dtype=float)
            a = a * (1 - to_paper) + PAPER[None, None, :] * to_paper
            img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
        img = feather_edges(img)
        path = os.path.join(OUT, f"{name}.webp")
        img.save(path, "WEBP", quality=86, method=6)
        img.save(os.path.join(OUT, f"_{name}.png"))       # 預覽用（gitignored）
        print(f"{name}: {img.size[0]}x{img.size[1]}, {os.path.getsize(path)//1024} KB")


if __name__ == "__main__":
    main()

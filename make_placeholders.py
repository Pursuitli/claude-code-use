#!/usr/bin/env python3
"""Fallback: draw cute illustrated portrait cards when the OpenAI API is unreachable.
Same filenames as generate_girls.py, so real photos can replace them later."""
import os
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "assets", "girls")
os.makedirs(OUT, exist_ok=True)
W, H = 1024, 1536

GIRLS = [
    ("mei",  (255, 214, 224), (74, 51, 38),  (222, 196, 158), "long"),
    ("yuna", (214, 235, 255), (43, 33, 24),  (245, 230, 210), "wavy"),
    ("sora", (224, 255, 230), (26, 26, 26),  (168, 216, 255), "bob"),
    ("lin",  (255, 240, 214), (61, 43, 31),  (255, 255, 255), "pony"),
    ("hana", (255, 224, 235), (88, 60, 40),  (255, 200, 215), "long"),
    ("aiko", (224, 228, 255), (20, 20, 25),  (40, 60, 110),   "long"),
    ("rin",  (255, 244, 214), (60, 45, 30),  (230, 180, 60),  "bob"),
    ("mika", (214, 244, 255), (50, 38, 28),  (250, 248, 240), "pony"),
    ("yui",  (235, 235, 245), (30, 25, 22),  (200, 205, 215), "long"),
    ("nana", (228, 245, 224), (70, 50, 35),  (170, 200, 160), "wavy"),
]

SKIN = (255, 224, 196)
SKIN_SHADOW = (240, 200, 170)


def portrait(name, bg, hair, outfit, style):
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    # soft bokeh background
    for i, (bx, by, br) in enumerate([(180, 300, 120), (840, 420, 150), (700, 1300, 180),
                                      (200, 1200, 130), (880, 900, 90), (140, 760, 80)]):
        c = tuple(min(255, v + 22) for v in bg)
        d.ellipse([bx - br, by - br, bx + br, by + br], fill=c)
    img = img.filter(ImageFilter.GaussianBlur(30))
    d = ImageDraw.Draw(img)

    cx, fy = W // 2, 640  # face center
    # shoulders / outfit
    d.ellipse([cx - 430, 1120, cx + 430, 1900], fill=outfit)
    d.polygon([(cx - 60, 1150), (cx + 60, 1150), (cx + 30, 1330), (cx - 30, 1330)], fill=(255, 255, 255))
    # neck
    d.rectangle([cx - 70, 980, cx + 70, 1190], fill=SKIN_SHADOW)
    # hair behind
    if style in ("long", "wavy"):
        d.ellipse([cx - 360, fy - 380, cx + 360, fy + 760], fill=hair)
    elif style == "bob":
        d.ellipse([cx - 330, fy - 370, cx + 330, fy + 380], fill=hair)
    else:  # pony
        d.ellipse([cx - 310, fy - 370, cx + 310, fy + 260], fill=hair)
        d.ellipse([cx + 180, fy - 100, cx + 360, fy + 600], fill=hair)
    # face
    d.ellipse([cx - 270, fy - 320, cx + 270, fy + 330], fill=SKIN)
    # ears
    d.ellipse([cx - 300, fy - 40, cx - 240, fy + 80], fill=SKIN)
    d.ellipse([cx + 240, fy - 40, cx + 300, fy + 80], fill=SKIN)
    # fringe
    d.pieslice([cx - 285, fy - 360, cx + 285, fy + 90], 180, 360, fill=hair)
    if style == "wavy":
        for sx in (-1, 1):
            d.ellipse([cx + sx * 270 - 60, fy - 80, cx + sx * 270 + 60, fy + 500], fill=hair)
    # eyes
    for sx in (-1, 1):
        ex = cx + sx * 110
        d.ellipse([ex - 42, fy - 30, ex + 42, fy + 50], fill=(255, 255, 255))
        d.ellipse([ex - 26, fy - 18, ex + 26, fy + 42], fill=(60, 42, 32))
        d.ellipse([ex - 12, fy - 10, ex + 6, fy + 10], fill=(255, 255, 255))
        d.arc([ex - 50, fy - 70, ex + 50, fy - 10], 200, 340, fill=hair, width=12)
    # blush
    for sx in (-1, 1):
        d.ellipse([cx + sx * 170 - 45, fy + 90, cx + sx * 170 + 45, fy + 150], fill=(255, 190, 190))
    # nose + warm smile
    d.arc([cx - 14, fy + 80, cx + 14, fy + 120], 20, 160, fill=SKIN_SHADOW, width=8)
    d.arc([cx - 70, fy + 120, cx + 70, fy + 230], 15, 165, fill=(200, 90, 90), width=14)
    d.pieslice([cx - 55, fy + 150, cx + 55, fy + 225], 0, 180, fill=(255, 255, 255))
    # necklace dot
    d.ellipse([cx - 12, 1290, cx + 12, 1314], fill=(240, 240, 250))

    img.save(os.path.join(OUT, f"{name}.png"))
    print("drew", name)


for g in GIRLS:
    portrait(*g)
print("done")

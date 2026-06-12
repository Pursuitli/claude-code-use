#!/usr/bin/env python3
"""Recreate the STABO 'S' mark with PIL (periwinkle swoosh + white capsule)."""
import os
from PIL import Image, ImageDraw

SS = 1024
PURPLE = (134, 120, 240, 255)
ROOT = os.path.dirname(os.path.abspath(__file__))


def make(color=PURPLE, bg=(0, 0, 0, 0), hole=(255, 255, 255, 255), punch_hole=False):
    img = Image.new("RGBA", (SS, SS), bg)
    d = ImageDraw.Draw(img)
    # ring pieces
    d.rounded_rectangle([176, 296, 460, 580], radius=142, fill=color)   # left wrap
    d.rectangle([300, 296, 560, 444], fill=color)                       # top band
    d.rounded_rectangle([564, 444, 848, 728], radius=142, fill=color)   # right wrap
    d.rectangle([464, 580, 724, 728], fill=color)                       # bottom band
    d.polygon([(540, 296), (952, 420), (728, 444), (540, 444)], fill=color)  # top wing
    d.polygon([(484, 728), (72, 604), (296, 580), (484, 580)], fill=color)   # bottom wing
    # white capsule slot
    d.rounded_rectangle([296, 444, 728, 580], radius=68,
                        fill=(0, 0, 0, 0) if punch_hole else hole)
    return img


icon = make().resize((512, 512), Image.LANCZOS)
icon.save(os.path.join(ROOT, "deck-assets", "stabo-icon.png"))
# white-on-transparent variant for dark surfaces
white = make(color=(255, 255, 255, 255), punch_hole=True).resize((256, 256), Image.LANCZOS)
white.save(os.path.join(ROOT, "deck-assets", "stabo-icon-white.png"))
# preview on website-indigo background
prev = Image.new("RGB", (512, 512), (39, 43, 80))
prev.paste(icon, (0, 0), icon)
prev.save(os.path.join(ROOT, "deck-assets", "icon-preview.png"))
print("done")

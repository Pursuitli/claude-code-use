#!/usr/bin/env python3
"""Retheme deck to STABO website design language (indigo + periwinkle, sans/mono)."""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(ROOT, "stabo-seed-deck-report.html")
html = open(PATH, encoding="utf-8").read()

# 1. palette remap (case-insensitive on hex digits)
HEXMAP = {
    "051C2C": "272B50", "0B2435": "303560", "1D3A8F": "5B4CCF",
    "2251FF": "7C6CF0", "0786C8": "8C7BF4", "00A9F4": "A99CF7",
    "99D9F0": "CFC9FB", "AAE6F0": "CFC9FB", "EAF3F9": "EFEEFB",
    "E6F2F8": "EFEEFB", "BFD9EA": "D9D5F6", "D9E0E7": "E2E2F2",
    "D8DEE4": "E2E2F2", "56677A": "5F6390", "5A6B7B": "5F6390",
    "8C9BAA": "9094BB", "7F8C99": "9094BB", "F4F7FA": "F6F6FC",
    "F7FAFC": "F9F9FE", "A9C3D6": "BCC0E0", "CBD9E4": "C5C8E8",
    "8FB3C9": "9CA1CC", "7E93A6": "8F94BE", "3E4A57": "1C1F3A",
    "E8F0FE": "ECE9FC", "C6D6F8": "D6D0F8",
}
for old, new in HEXMAP.items():
    html = re.sub("#" + old, "#" + new, html, flags=re.I)
html = html.replace("rgba(5,28,44", "rgba(31,34,64")

# 2. typography: sans display (website style) + mono kickers/eyebrows
html = html.replace("'Source Serif 4',Georgia,serif", "'Inter','Helvetica Neue',Arial,sans-serif")
html = html.replace(
    "family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&", "")
html = html.replace(
    "h1.headline{font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-weight:600;",
    "h1.headline{font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-weight:700;letter-spacing:-.018em;")
for cls in [".kicker{", ".eyebrow{", ".ex-label{"]:
    i = html.index(cls)
    html = html[:i + len(cls)] + "font-family:'IBM Plex Mono',monospace;" + html[i + len(cls):]

# 3. swap embedded images for repaletted renders (document order)
order = ["cover", "act1", "act2", "act3", "act4", "appendix"]
def b64(name, ext="jpeg"):
    fn = f"{name}.jpg" if ext == "jpeg" else f"{name}.png"
    with open(os.path.join(ROOT, "deck-assets", fn), "rb") as f:
        return f"data:image/{ext};base64," + base64.b64encode(f.read()).decode()
uris = iter(order)
html = re.sub(r'data:image/jpeg;base64,[^"]+', lambda m: b64(next(uris)), html)

# 4. STABO icon: kickers, cover, dividers
icon = b64("stabo-icon", "png")
html = html.replace("</style>",
    ".klogo{width:4.2mm;height:4.2mm;margin-right:2.2mm;vertical-align:-1.1mm}\n</style>")
n = html.count('<span class="sq"></span>')
html = html.replace('<span class="sq"></span>', f'<img class="klogo" src="{icon}" alt="">')
print(f"kicker logos: {n}")
cover_sq = '<div style="width:14mm;height:14mm;background:var(--blue);margin-bottom:8mm"></div>'
assert cover_sq in html
html = html.replace(cover_sq,
    f'<div style="display:flex;align-items:center;gap:5mm;margin-bottom:9mm">'
    f'<img src="{icon}" alt="STABO" style="width:17mm;height:17mm">'
    f'<div style="font-size:20pt;font-weight:800;letter-spacing:.30em;color:#fff">STABO</div></div>')
div_sq = '<div style="width:11mm;height:2mm;background:var(--blue);margin-bottom:5mm"></div>'
nd = html.count(div_sq)
html = html.replace(div_sq, f'<img src="{icon}" alt="" style="width:10mm;height:10mm;margin-bottom:5mm">')
print(f"divider logos: {nd}")

open(PATH, "w", encoding="utf-8").write(html)
print(f"written {len(html)//1024}KB")

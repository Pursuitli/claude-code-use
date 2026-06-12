#!/usr/bin/env python3
"""Procedurally render abstract brand images for the STABO deck (PIL).

OpenAI image API is blocked by network egress policy in this environment,
so these are rendered locally: additive-glow light streams on deep navy,
matching the deck palette (#051C2C / #2251FF / #00A9F4).
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

W, H = 1400, 720
SS = 2  # supersample
NAVY = (5, 28, 44)
BLUE = (34, 81, 255)
CYAN = (0, 169, 244)
SKY = (153, 217, 240)
WHITE = (230, 245, 255)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "deck-assets")
os.makedirs(OUT, exist_ok=True)


def canvas():
    img = Image.new("RGB", (W * SS, H * SS), NAVY)
    d = ImageDraw.Draw(img)
    # vertical gradient: slightly darker at bottom
    for y in range(H * SS):
        t = y / (H * SS)
        c = tuple(int(v * (1.0 - 0.45 * t)) for v in NAVY)
        d.line([(0, y), (W * SS, y)], fill=c)
    # faint grid
    g = Image.new("RGB", (W * SS, H * SS), (0, 0, 0))
    gd = ImageDraw.Draw(g)
    for x in range(0, W * SS, 70 * SS):
        gd.line([(x, 0), (x, H * SS)], fill=(10, 30, 46), width=SS)
    for y in range(0, H * SS, 70 * SS):
        gd.line([(0, y), (W * SS, y)], fill=(10, 30, 46), width=SS)
    return ImageChops.screen(img, g)


def bezier(pts, n=140):
    def be(t, p):
        while len(p) > 1:
            p = [(p[i][0] + (p[i + 1][0] - p[i][0]) * t,
                  p[i][1] + (p[i + 1][1] - p[i][1]) * t) for i in range(len(p) - 1)]
        return p[0]
    return [be(i / (n - 1), list(pts)) for i in range(n)]


def glow_lines(base, lines):
    """lines: list of (points, color, core_width, halo_width, halo_alpha)"""
    halo = Image.new("RGB", base.size, (0, 0, 0))
    hd = ImageDraw.Draw(halo)
    core = Image.new("RGB", base.size, (0, 0, 0))
    cd = ImageDraw.Draw(core)
    for pts, col, cw, hw, ha in lines:
        p = [(x * SS, y * SS) for x, y in pts]
        hd.line(p, fill=tuple(int(c * ha) for c in col), width=int(hw * SS), joint="curve")
        cd.line(p, fill=col, width=int(cw * SS), joint="curve")
    halo = halo.filter(ImageFilter.GaussianBlur(18 * SS))
    core = core.filter(ImageFilter.GaussianBlur(1.2 * SS))
    out = ImageChops.screen(base, halo)
    return ImageChops.screen(out, core)


def glow_dots(base, dots):
    halo = Image.new("RGB", base.size, (0, 0, 0))
    hd = ImageDraw.Draw(halo)
    for x, y, r, col, a in dots:
        x, y, r = x * SS, y * SS, r * SS
        hd.ellipse([x - r * 3, y - r * 3, x + r * 3, y + r * 3],
                   fill=tuple(int(c * a * 0.5) for c in col))
    halo = halo.filter(ImageFilter.GaussianBlur(6 * SS))
    core = Image.new("RGB", base.size, (0, 0, 0))
    cd = ImageDraw.Draw(core)
    for x, y, r, col, a in dots:
        x, y, r = x * SS, y * SS, r * SS
        cd.ellipse([x - r, y - r, x + r, y + r], fill=tuple(int(c * a) for c in col))
    core = core.filter(ImageFilter.GaussianBlur(0.8 * SS))
    return ImageChops.screen(ImageChops.screen(base, halo), core)


def glow_rects(base, rects):
    halo = Image.new("RGB", base.size, (0, 0, 0))
    hd = ImageDraw.Draw(halo)
    for x0, y0, x1, y1, col, a, w in rects:
        hd.rectangle([x0 * SS, y0 * SS, x1 * SS, y1 * SS],
                     outline=tuple(int(c * a) for c in col), width=int(w * SS))
    soft = halo.filter(ImageFilter.GaussianBlur(8 * SS))
    out = ImageChops.screen(base, soft)
    return ImageChops.screen(out, halo.filter(ImageFilter.GaussianBlur(0.8 * SS)))


def fill_rects(base, rects):
    lay = Image.new("RGB", base.size, (0, 0, 0))
    ld = ImageDraw.Draw(lay)
    for x0, y0, x1, y1, col, a in rects:
        ld.rectangle([x0 * SS, y0 * SS, x1 * SS, y1 * SS],
                     fill=tuple(int(c * a) for c in col))
    return ImageChops.screen(base, lay.filter(ImageFilter.GaussianBlur(1.5 * SS)))


def save(img, name):
    img = img.resize((W, H), Image.LANCZOS)
    path = os.path.join(OUT, f"{name}.jpg")
    img.save(path, "JPEG", quality=82, optimize=True)
    print(f"[ok] {name} {os.path.getsize(path)//1024}KB")


def mix(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


random.seed(7)

# ---------- cover: chaotic streams -> central layer -> orderly beams ----------
img = canvas()
lines = []
for i in range(16):
    y0 = random.uniform(40, H - 40)
    y1 = random.uniform(120, H - 120)
    col = mix(BLUE, CYAN, random.random())
    pts = bezier([(-(random.uniform(0, 120)), y0),
                  (W * .25, y0 + random.uniform(-160, 160)),
                  (W * .42, y1), (W * .5, H * .5 + (i - 8) * 13)])
    lines.append((pts, col, 1.6, 9, .35))
for i in range(16):
    y = H * .5 + (i - 8) * 13
    col = mix(CYAN, SKY, i / 15)
    lines.append(([(W * .5, y), (W + 60, y)], col, 1.4, 7, .3))
img = glow_lines(img, lines)
# central layer bar
img = fill_rects(img, [(W * .487, H * .18, W * .513, H * .82, BLUE, .9)])
img = glow_rects(img, [(W * .487, H * .18, W * .513, H * .82, SKY, .9, 2)])
img = glow_dots(img, [(random.uniform(0, W * .47), random.uniform(60, H - 60),
                       random.uniform(1.2, 2.6), mix(CYAN, WHITE, random.random()), .8)
                      for _ in range(70)])
save(img, "cover")

# ---------- act1: chaos stopped by wall, one gateway beam ----------
img = canvas()
lines = []
for i in range(22):
    x0, y0 = random.uniform(-60, W * .3), random.uniform(0, H)
    pts = bezier([(x0, y0),
                  (random.uniform(W * .1, W * .45), random.uniform(0, H)),
                  (random.uniform(W * .2, W * .52), random.uniform(0, H)),
                  (W * .54, random.uniform(40, H - 40))])
    lines.append((pts, mix(BLUE, CYAN, random.random()), 1.4, 8, .3))
img = glow_lines(img, lines)
# dark wall
wall = Image.new("RGB", img.size, (0, 0, 0))
wd = ImageDraw.Draw(wall)
wd.rectangle([int(W * .55) * SS, 0, int(W * .585) * SS, H * SS], fill=(2, 10, 18))
img = Image.composite(wall, img, wall.convert("L").point(lambda v: 255 if v > 0 else 0))
img = glow_rects(img, [(W * .55, 0, W * .585, H, (40, 90, 140), .5, 1.5)])
# gateway + clean beam
img = fill_rects(img, [(W * .55, H * .46, W * .585, H * .54, CYAN, .9)])
img = glow_lines(img, [([(W * .585, H * .5), (W + 60, H * .5)], SKY, 2.2, 12, .5)])
save(img, "act1")

# ---------- act2: three rivers merge ----------
img = canvas()
starts = [(-(40), H * .15, BLUE), (-(40), H * .5, CYAN), (-(40), H * .88, SKY)]
lines = []
for sx, sy, col in starts:
    for k in range(7):
        off = (k - 3) * 9
        pts = bezier([(sx, sy + off), (W * .3, sy + off * 1.2),
                      (W * .52, H * .5 + off * .6), (W * .72, H * .5 + off * .45),
                      (W + 60, H * .5 + off * .4)])
        lines.append((pts, col, 1.5, 8, .32))
img = glow_lines(img, lines)
img = glow_dots(img, [(random.uniform(W * .55, W), H * .5 + random.uniform(-40, 40),
                       random.uniform(1, 2.4), mix(SKY, WHITE, random.random()), .9)
                      for _ in range(45)])
save(img, "act2")

# ---------- act3: skyline + strata planes ----------
img = canvas()
# skyline silhouette with lit windows
sky = Image.new("RGB", img.size, (0, 0, 0))
sd = ImageDraw.Draw(sky)
x = 0
random.seed(21)
while x < W:
    bw = random.randint(40, 110)
    bh = random.randint(90, 300)
    sd.rectangle([x * SS, (H - bh) * SS, (x + bw - 8) * SS, H * SS], fill=(3, 14, 24))
    for _ in range(int(bw * bh / 700)):
        wx = random.uniform(x + 4, x + bw - 14)
        wy = random.uniform(H - bh + 6, H - 10)
        c = mix(CYAN, (255, 200, 120), random.random() * .35)
        sd.rectangle([wx * SS, wy * SS, (wx + 3) * SS, (wy + 2.2) * SS],
                     fill=tuple(int(v * random.uniform(.25, .8)) for v in c))
    x += bw
mask = sky.convert("L").point(lambda v: 255 if v > 6 else 0)
img = Image.composite(sky, img, mask)
img = ImageChops.screen(img, sky.filter(ImageFilter.GaussianBlur(4 * SS)).point(lambda v: v // 3))
# strata planes
planes = []
for i, yy in enumerate([H * .2, H * .31, H * .42]):
    a = .5 - i * .12
    planes.append((W * .08, yy, W * .92, yy + 3, mix(BLUE, CYAN, i / 2), a))
img = fill_rects(img, planes)
threads = []
for _ in range(16):
    tx = random.uniform(W * .12, W * .88)
    threads.append(([(tx, H * .44), (tx, H - random.uniform(90, 260))], CYAN, 1.0, 5, .28))
img = glow_lines(img, threads)
save(img, "act3")

# ---------- act4: ascending light steps ----------
img = canvas()
steps, n = [], 7
for i in range(n):
    x0 = 60 + i * (W - 160) / n
    x1 = x0 + (W - 160) / n - 18
    y1 = H - 70
    y0 = H - 110 - i * 64
    col = mix(BLUE, SKY, i / (n - 1))
    steps.append((x0, y0, x1, y1, col, .22))
    steps.append((x0, y0, x1, y0 + 7, col, .95))
img = fill_rects(img, steps)
random.seed(5)
img = glow_dots(img, [(60 + random.uniform(0, W - 160),
                       H - 130 - random.uniform(0, 360) * random.random(),
                       random.uniform(1, 2.2), mix(CYAN, WHITE, random.random()), .8)
                      for _ in range(60)])
img = glow_lines(img, [(bezier([(40, H - 90), (W * .4, H - 240), (W * .75, H - 420),
                                (W - 60, H - 520)]), CYAN, 1.6, 10, .35)])
save(img, "act4")

# ---------- appendix: ledger field ----------
img = canvas()
random.seed(11)
rects, outlines = [], []
for row in range(4):
    for colu in range(7):
        x0 = 60 + colu * 190 + random.uniform(-6, 6)
        y0 = 70 + row * 160 + random.uniform(-5, 5)
        a = random.uniform(.06, .16) * (1 - row * .12)
        rects.append((x0, y0, x0 + 150, y0 + 110, mix(BLUE, CYAN, random.random()), a))
        for li in range(4):
            ly = y0 + 24 + li * 20
            rects.append((x0 + 14, ly, x0 + 14 + random.uniform(60, 120), ly + 2.5,
                          SKY, a * 1.6))
img = fill_rects(img, rects)
# highlighted document
hx, hy = 60 + 3 * 190, 70 + 1 * 160
img = fill_rects(img, [(hx, hy, hx + 150, hy + 110, CYAN, .28)])
img = glow_rects(img, [(hx, hy, hx + 150, hy + 110, CYAN, .95, 2)])
save(img, "appendix")
print("all done")

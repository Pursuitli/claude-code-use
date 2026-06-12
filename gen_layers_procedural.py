#!/usr/bin/env python3
"""
Procedurally synthesize ink-wash layers for /chinese-painting (no network).

Same output contract as generate_painting_layers.py: opaque webp painted on
warm rice paper (#f6f2e9), composited by the page with mix-blend-mode:multiply.
Running generate_painting_layers.py --force later replaces these with
gpt-image-2 art, no code changes needed.
"""
import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "public", "assets", "painting")
os.makedirs(OUT, exist_ok=True)

PAPER = np.array([246, 242, 233], dtype=float)
rng = np.random.default_rng(20260612)


def fbm1d(n, octaves=6, persistence=0.55, base_freq=3):
    """Smooth 1-D fractal noise in [0,1]."""
    total, norm, amp, freq = np.zeros(n), 0.0, 1.0, base_freq
    for _ in range(octaves):
        pts = rng.random(freq + 1)
        x = np.linspace(0, freq, n)
        i = np.clip(np.floor(x).astype(int), 0, freq - 1)
        f = x - i
        f = (1 - np.cos(f * np.pi)) / 2
        total += amp * (pts[i] * (1 - f) + pts[i + 1] * f)
        norm += amp
        amp *= persistence
        freq *= 2
    return total / norm


def noise2d(h, w, octaves=4, base=8):
    """Smooth 2-D fractal noise in [0,1] (upscaled random grids)."""
    total, norm, amp, res = np.zeros((h, w)), 0.0, 1.0, base
    for _ in range(octaves):
        g = (rng.random((res, res)) * 255).astype(np.uint8)
        up = Image.fromarray(g).resize((w, h), Image.BICUBIC)
        total += amp * (np.asarray(up, dtype=float) / 255.0)
        norm += amp
        amp *= 0.5
        res *= 2
    return total / norm


def ridge_alpha(W, H, crest, amp, fade, octaves=6, base_freq=3):
    """Ink alpha for one ridge: dark crest washing downward into the paper."""
    line = crest + (fbm1d(W, octaves=octaves, base_freq=base_freq) - 0.5) * 2 * amp
    yy = np.arange(H)[:, None]
    d = yy - line[None, :]
    a = np.where(d >= 0, np.exp(-np.maximum(d, 0) / fade), 0.0)
    a += np.where((d >= 0) & (d < 14), 0.30, 0.0)        # 山脊筆鋒
    return np.clip(a, 0, 1), line


def to_image(alpha, color, blur=0):
    """Composite ink alpha over rice paper."""
    img = PAPER[None, None, :] * (1 - alpha[..., None]) + np.array(color, float)[None, None, :] * alpha[..., None]
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    if blur:
        out = out.filter(ImageFilter.GaussianBlur(blur))
    return out


def mist_band(H, W, y0, sigma, strength):
    yy = np.arange(H)[:, None]
    wob = (fbm1d(W, octaves=4, base_freq=4) - 0.5) * sigma * 1.6
    return strength * np.exp(-((yy - y0 - wob[None, :]) ** 2) / (2 * sigma ** 2))


def mountains(name, W, H, ridges, color, tex_amt, blur, mists=()):
    a = np.zeros((H, W))
    lines = []
    for crest, amp, fade, weight in ridges:
        ra, line = ridge_alpha(W, H, crest, amp, fade)
        a = 1 - (1 - a) * (1 - ra * weight)              # 多層罩染（screen 疊加）
        lines.append(line)
    a *= 0.78 + tex_amt * (noise2d(H, W) - 0.5) * 2      # 筆觸肌理
    for y0, sigma, strength in mists:
        a *= np.clip(1 - mist_band(H, W, y0, sigma, strength), 0, 1)
    a = np.clip(a, 0, 1)
    return to_image(a, color, blur), a, lines


def stamp_pines(a, lines, W, count=9, seed_line=-1):
    """Tiny pine silhouettes planted on a ridge line."""
    line = lines[seed_line]
    for _ in range(count):
        x = int(rng.uniform(0.06, 0.94) * W)
        y = int(line[x])
        h = int(rng.uniform(16, 30))
        for k in range(h):                               # 疊三角樹冠
            half = max(1, int((k / h) * h * 0.32 * (1 + 0.25 * np.sin(k * 1.7))))
            yy = y - h + k
            if 0 <= yy < a.shape[0]:
                a[yy, max(0, x - half):min(W, x + half)] = np.maximum(
                    a[yy, max(0, x - half):min(W, x + half)], 0.82)
        a[y - 4:y + 2, x - 1:x + 2] = np.maximum(a[y - 4:y + 2, x - 1:x + 2], 0.85)
    return a


def stamp_pavilion(a, lines, W):
    x = int(0.78 * W)
    y = int(lines[-1][x]) - 6
    H = a.shape[0]
    for k in range(10):                                  # 攢尖頂
        half = 2 + int(k * 1.6)
        yy = y - 14 + k
        if 0 <= yy < H:
            a[yy, x - half:x + half] = np.maximum(a[yy, x - half:x + half], 0.85)
    for dx in (-12, 12):                                 # 柱
        a[y - 4:y + 8, x + dx - 1:x + dx + 1] = np.maximum(a[y - 4:y + 8, x + dx - 1:x + dx + 1], 0.8)
    a[y + 7:y + 9, x - 15:x + 15] = np.maximum(a[y + 7:y + 9, x - 15:x + 15], 0.7)
    return a


def save(img, name, quality=88):
    path = os.path.join(OUT, f"{name}.webp")
    img.save(path, "WEBP", quality=quality, method=6)
    img.save(os.path.join(OUT, f"_{name}.png"))          # 預覽用
    print(f"{name}: {os.path.getsize(path)//1024} KB")


# ---------- 遠山：極淡、霧氣重、輪廓模糊 ----------
W, H = 2048, 768
img, a, lines = mountains(
    "far", W, H,
    ridges=[(int(H*.30), 95, 150, .26), (int(H*.42), 70, 120, .22)],
    color=(150, 163, 158), tex_amt=.10, blur=6,
    mists=[(int(H*.52), 70, .8), (int(H*.78), 90, .95)])
save(img, "far")

# ---------- 中山：兩重山脊、嵐氣穿行 ----------
img, a, lines = mountains(
    "mid", W, H,
    ridges=[(int(H*.26), 120, 180, .5), (int(H*.46), 95, 150, .55)],
    color=(96, 122, 112), tex_amt=.16, blur=2.2,
    mists=[(int(H*.40), 46, .65), (int(H*.74), 80, .9)])
save(img, "mid")

# ---------- 近山：深墨、松與小亭 ----------
ra1, l1 = ridge_alpha(W, H, int(H*.34), 130, 210)
ra2, l2 = ridge_alpha(W, H, int(H*.55), 100, 170)
a = 1 - (1 - ra1 * .72) * (1 - ra2 * .8)
a = stamp_pines(a, [l1, l2], W, count=10, seed_line=0)
a = stamp_pavilion(a, [l1], W)
a *= 0.8 + .2 * (noise2d(H, W) - 0.5) * 2
a *= np.clip(1 - mist_band(H, W, int(H*.80), 70, .9), 0, 1)
a = np.clip(a, 0, 1)
save(to_image(a, (44, 58, 54), blur=1.1), "near")

# ---------- 橋：平緩石拱、欄杆、孤行人 ----------
W2, H2 = 1280, 768
yy, xx = np.mgrid[0:H2, 0:W2]
cx = W2 / 2
deck_apex, hole_apex = H2 * .42, H2 * .56
deck_y = deck_apex + (xx - cx) ** 2 / (2 * 2400)            # 平緩橋面拋物線
hole_span = W2 * .30
hole_y = hole_apex + ((xx - cx) / hole_span) ** 2 * (H2 - hole_apex)  # 拱洞
a = np.zeros((H2, W2))
body = (yy >= deck_y) & (yy < hole_y)
a[body] = .80
deck_line = np.asarray(deck_apex + (np.arange(W2) - cx) ** 2 / (2 * 2400), float)
band = (yy >= deck_y) & (yy <= deck_y + 22)                 # 橋面厚邊
a[band] = .92
hole_edge = (yy >= hole_y - 10) & (yy < hole_y) & (yy >= deck_y)  # 拱洞描邊
a[hole_edge] = np.minimum(a[hole_edge] + .1, 1)
rail = (yy >= deck_y - 34) & (yy <= deck_y - 28)            # 扶手
a[rail] = np.maximum(a[rail], .82)
for px in np.linspace(W2 * .10, W2 * .90, 11):              # 欄杆柱
    x0 = int(px)
    ytop = int(deck_line[x0])
    a[ytop - 30:ytop + 2, x0 - 2:x0 + 3] = .85
# 行人（橋面偏左，戴笠扶杖）
fx = int(W2 * .40)
fy = int(deck_line[fx])
a[fy - 44:fy - 2, fx - 7:fx + 8] = 0                        # 清出人形背景
a[fy - 40:fy - 16, fx - 6:fx + 7] = .92                     # 蓑身
a[fy - 16:fy - 2, fx - 4:fx - 1] = .9                       # 腿
a[fy - 16:fy - 2, fx + 1:fx + 4] = .9
a[fy - 50:fy - 40, fx - 4:fx + 5] = .92                     # 頭
a[fy - 54:fy - 50, fx - 10:fx + 11] = .92                   # 斗笠
for k in range(46):                                         # 杖
    a[fy - 44 + k, fx + 10 + int(k * .22):fx + 12 + int(k * .22)] = .85
# 乾擦肌理 + 輕度飛白
a *= 0.78 + .22 * (noise2d(H2, W2) - 0.5) * 2
a *= 0.88 + .24 * (noise2d(H2, W2, octaves=3, base=5) - 0.5)
a *= np.clip((H2 - yy) / 90, 0, 1) ** .4                    # 底部沒入水霧
a = np.clip(a, 0, 1)
save(to_image(a, (40, 48, 46), blur=1.1), "bridge")

# ---------- 竹：三竿、節與葉 ----------
W3, H3 = 768, 1536
a = np.zeros((H3, W3))
def leaf(ax, ay, ang, length, width, dark):
    t = np.linspace(0, 1, length)
    lx = ax + np.cos(ang) * t * length
    ly = ay + np.sin(ang) * t * length
    wfn = width * np.sin(np.pi * np.clip(t*1.15, 0, 1))     # 兩頭尖
    for j in range(length):
        x0, y0, wj = int(lx[j]), int(ly[j]), max(1, int(wfn[j]))
        if 0 <= y0 < H3:
            a[y0, max(0, x0-wj):min(W3, x0+wj)] = np.maximum(
                a[y0, max(0, x0-wj):min(W3, x0+wj)], dark)
for sx, lean, thick in [(W3*.30, .00012, 13), (W3*.52, .00008, 9), (W3*.18, .00016, 7)]:
    ys = np.arange(H3)
    xs = sx + lean * (H3 - ys)**2 * .35
    for y in range(H3-1, int(H3*.10), -1):
        x0 = int(xs[y]); w = max(2, int(thick * (y/H3)**.3))
        if (H3 - y) % 150 < 5:                              # 竹節
            continue
        a[y, x0-w:x0+w] = np.maximum(a[y, x0-w:x0+w], .88)
    for cy_ in np.linspace(H3*.14, H3*.55, 4):              # 葉簇
        cx_ = xs[int(cy_)]
        for _ in range(rng.integers(4, 7)):
            ang = rng.uniform(-0.5, 1.1) + (0.6 if rng.random() > .5 else 2.2)
            leaf(cx_ + rng.uniform(-14, 14), cy_ + rng.uniform(-20, 20),
                 ang, int(rng.uniform(60, 120)), rng.uniform(5, 9), rng.uniform(.7, .9))
a *= 0.85 + .15 * (noise2d(H3, W3) - 0.5) * 2
a = np.clip(a, 0, 1)
save(to_image(a, (24, 32, 28), blur=1.0), "bamboo")

print("done ->", OUT)

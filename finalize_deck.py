#!/usr/bin/env python3
"""Finishing pass: strip meta footers, embed images, insert act dividers, renumber."""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(ROOT, "stabo-seed-deck-report.html")
html = open(PATH, encoding="utf-8").read()


def b64(name):
    with open(os.path.join(ROOT, "deck-assets", f"{name}.jpg"), "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()


# 1. strip all meta footers
html, n = re.subn(r'\n  <footer class="foot">.*?</footer>', "", html, flags=re.S)
print(f"stripped {n} footers")

# 2. kicker right-hand label
html = html.replace("STABO Seed Deck Storyline · v1.0", "STABO · Seed Round 2026")

# 3. cover band + background image
html = html.replace(
    "STABO &nbsp;·&nbsp; SEED FUNDRAISING DECK STORYLINE &nbsp;·&nbsp; OUTLINE v1.0",
    "STABO &nbsp;·&nbsp; SEED FUNDRAISING DECK &nbsp;·&nbsp; JUNE 2026")
cover_anchor = '<section class="slide" style="background:var(--navy);color:#fff;padding:16mm 18mm">'
cover_new = (cover_anchor +
    f'\n  <img src="{b64("cover")}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55">' +
    '\n  <div style="position:absolute;inset:0;background:linear-gradient(100deg,rgba(5,28,44,.94) 0%,rgba(5,28,44,.72) 52%,rgba(5,28,44,.30) 100%)"></div>')
assert cover_anchor in html
html = html.replace(cover_anchor, cover_new, 1)
# lift cover content above the absolutely-positioned background layers
for frag in [
    '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.18);padding-bottom:4mm">',
    '<div style="flex:1;display:flex;flex-direction:column;justify-content:center">',
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6mm;border-top:1px solid rgba(255,255,255,.18);padding-top:5mm">',
]:
    assert frag in html, frag
    html = html.replace(frag, frag.replace('style="', 'style="position:relative;'), 1)


# 4. act dividers
def divider(img, act, title, tagline):
    return f'''
<!-- ================= DIVIDER {act} ================= -->
<section class="slide" style="padding:0;background:#051C2C">
  <img src="{b64(img)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,28,44,.93) 0%,rgba(5,28,44,.55) 45%,rgba(5,28,44,.10) 100%)"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:18mm 20mm">
    <div style="width:11mm;height:2mm;background:var(--blue);margin-bottom:5mm"></div>
    <div style="font-size:9pt;letter-spacing:.28em;color:#99D9F0;font-weight:700;margin-bottom:3mm">{act}</div>
    <h1 style="font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:29pt;color:#fff;max-width:210mm;line-height:1.14">{title}</h1>
    <p style="color:#A9C3D6;font-size:11pt;margin-top:4mm;max-width:200mm">{tagline}</p>
  </div>
  <div class="pageno" style="color:rgba(255,255,255,.55)">00</div>
</section>
'''

inserts = [
    ("<!-- ================= SLIDE 1 ================= -->",
     divider("act1", "ACT I", "Problem &amp; answer",
             "Stablecoins move value in minutes — but a transfer is not a business&#8209;acceptable payment. STABO closes the acceptance gap.")),
    ("<!-- ================= SLIDE 5 ================= -->",
     divider("act2", "ACT II", "Traction &amp; go&#8209;to&#8209;market",
             "Live stablecoin&#8209;funded vendor payments since June 2026 — and three growth engines that share one operating layer.")),
    ("<!-- ================= SLIDE 13 ================= -->",
     divider("act3", "ACT III", "Infrastructure &amp; regulation",
             "A multi&#8209;jurisdiction licence stack that becomes a usable operating stack — banking, liquidity, compliance and continuity by design.")),
    ("<!-- ================= SLIDE 20 ================= -->",
     divider("act4", "ACTS IV &amp; V", "Commercial model &amp; the ask",
             "From operating evidence to TPV, revenue and margin — and a USD 3–5m seed that converts it into Series A proof.")),
    ("<!-- ================= APPENDIX DIVIDER + A ================= -->",
     divider("appendix", "APPENDIX", "The diligence layer",
             "Permission matrix, regulatory snapshot, banking and liquidity evidence, compliance checklist, replication methodology and milestone roadmap.")),
]
for anchor, div in inserts:
    assert anchor in html, anchor
    html = html.replace(anchor, div + "\n" + anchor, 1)

# 5. renumber pages
counter = [0]
def repage(m):
    counter[0] += 1
    return m.group(1) + f"{counter[0]:02d}" + "</div>"
html = re.sub(r'(<div class="pageno"[^>]*>)\d+</div>', repage, html)
print(f"renumbered {counter[0]} pages")

# 6. sanity
leftover = re.findall(r"\[fill[^\]]*\]", html)
meta = html.count("Investor&#8209;safe wording") + html.count("Investor-safe wording")
print("leftover fills:", leftover)
print("meta mentions:", meta)
if leftover or meta:
    sys.exit("FAIL: leftovers remain")

open(PATH, "w", encoding="utf-8").write(html)
print(f"written {len(html)//1024}KB, {html.count(chr(60)+'section')} sections")

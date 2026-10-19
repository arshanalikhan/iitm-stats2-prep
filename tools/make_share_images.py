"""Make the house logo files and the share images.

Usage:  python tools/make_share_images.py [ORIGINAL_LOGO.png]      (needs Pillow and segno: pip install pillow segno)

Given the original Saranda House logo (1689x1689, a gold-on-black disc with transparent corners; the same file
the house website uses), it first remakes the logo files the site uses:
  src/assets/saranda-logo.png     360x360 round logo, transparent corners (Home banner, About card, share images)
  src/assets/saranda-emblem.png   192x192 eagle only, on black (sidebar)
Then it always writes:
  src/assets/og.png          1200x630 link-preview image (WhatsApp, LinkedIn, Telegram, X)
  marketing/poster.png       1080x1350 poster with a QR code, for groups and stories
  marketing/qr.png           the QR code on its own
Fonts: Segoe UI and Consolas on Windows; falls back to Pillow's default font elsewhere."""
import io
import os
import random
import sys

import segno
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://arshanalikhan.github.io/iitm-stats2-prep/"
FONTS = "C:/Windows/Fonts/"


def font(name, size):
    try:
        return ImageFont.truetype(FONTS + name, size)
    except OSError:
        return ImageFont.load_default()


BOLD, SEMI, REG, MONO = "segoeuib.ttf", "seguisb.ttf", "segoeui.ttf", "consola.ttf"
ASSETS = os.path.join(ROOT, "src", "assets")
# the eagle alone, as fractions of the logo's side
EMBLEM_BOX = (0.1717, 0.0663, 0.8330, 0.7277)


def frac_crop(im, box):
    return im.crop(tuple(round(v * (im.width if i % 2 == 0 else im.height)) for i, v in enumerate(box)))


def make_logo_assets(src):
    im = Image.open(src).convert("RGBA")
    im.resize((360, 360), Image.LANCZOS).quantize(256, method=Image.FASTOCTREE).save(os.path.join(ASSETS, "saranda-logo.png"), optimize=True)
    black = Image.new("RGBA", im.size, (0, 0, 0, 255))
    black.alpha_composite(im)
    flat = black.convert("RGB")
    dim = flat.convert("L").point(lambda v: 255 if v < 45 else 0)   # drop the faint smoke in the background
    flat = Image.composite(Image.new("RGB", flat.size, (0, 0, 0)), flat, dim)
    frac_crop(flat, EMBLEM_BOX).resize((192, 192), Image.LANCZOS).quantize(256, method=Image.MEDIANCUT).save(os.path.join(ASSETS, "saranda-emblem.png"), optimize=True)


# House colours, after saranda.iitmbs.org: forest greens, cream text, a gold kicker
F_TOP, F_BOT = (13, 31, 18), (24, 52, 32)
CREAM, SAGE, GOLD, LEAF = (243, 241, 226), (163, 194, 170), (226, 185, 59), (152, 205, 164)
CHIP_BG, CHIP_LINE = (25, 52, 33), (56, 92, 64)
KICKER, TAGLINE = "A SARANDA HOUSE INITIATIVE", "THE HOUSE OF EXCELLENCE AND INNOVATION"


def pines(layer, w, base, hmin, hmax, wscale, gap, fill, seed):
    """A row of three-tier pine silhouettes standing on y = base."""
    rnd, d, x = random.Random(seed), ImageDraw.Draw(layer), -20
    while x < w + 20:
        h = rnd.uniform(hmin, hmax)
        tw = h * wscale
        for top, bottom, width in ((0.0, 0.42, 0.38), (0.25, 0.70, 0.62), (0.52, 1.0, 1.0)):
            yt, yb, hw = base - h + top * h, base - h + bottom * h * 0.9, tw * width / 2
            d.polygon([(x, yt), (x + hw, yb), (x - hw, yb)], fill=fill)
        d.rectangle([x - tw * 0.06, base - h * 0.12, x + tw * 0.06, base], fill=fill)
        x += tw * rnd.uniform(0.55, 0.9) + gap


def forest(w, h, tree_h):
    """Deep-green gradient with a soft fog glow at the top and two layers of pines along the bottom."""
    im = Image.composite(Image.new("RGB", (w, h), F_BOT), Image.new("RGB", (w, h), F_TOP), Image.linear_gradient("L").resize((w, h))).convert("RGBA")
    fog = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(fog).ellipse([w * 0.15, -h * 0.35, w * 0.85, h * 0.35], fill=LEAF + (34,))
    im.alpha_composite(fog.filter(ImageFilter.GaussianBlur(w // 8)))
    trees = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pines(trees, w, h, tree_h * 0.55, tree_h, 0.42, 6, LEAF + (22,), 7)
    pines(trees, w, h, tree_h * 0.3, tree_h * 0.65, 0.45, 18, LEAF + (40,), 11)
    im.alpha_composite(trees)
    return im


def disc(im, x, y, size):
    """The round house logo with a soft shadow, as the house website shows it."""
    shadow = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse([x + 4, y + 12, x + size + 4, y + size + 12], fill=(0, 0, 0, 150))
    im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14)))
    logo = Image.open(os.path.join(ASSETS, "saranda-logo.png")).convert("RGBA").resize((size, size), Image.LANCZOS)
    im.alpha_composite(logo, (x, y))


def chip(d, x, y, text, f, pad=16, h=46):
    w = d.textlength(text, font=f) + 2 * pad
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=CHIP_BG, outline=CHIP_LINE, width=2)
    d.text((x + pad, y + h / 2), text, font=f, fill=CREAM, anchor="lm")
    return x + w


def spaced(d, xy, text, f, fill, spacing, centre=False):
    """Letter-spaced caps (Pillow has no tracking option). Returns the line width."""
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + spacing * (len(text) - 1)
    x, y = xy
    if centre:
        x -= total / 2
    for c, cw in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += cw + spacing
    return total


def check(name, right, limit):
    if right > limit:
        raise SystemExit(f"{name} overlaps: ends at x={right:.0f}, limit {limit}")


def og():
    W, H = 1200, 630
    im = forest(W, H, 150)
    disc(im, 862, 70, 290)
    d = ImageDraw.Draw(im)
    spaced(d, (72, 62), KICKER, font(MONO, 22), GOLD, 3)
    check("og tagline", 72 + spaced(d, (72, 96), TAGLINE, font(BOLD, 18), SAGE, 2), 830)
    d.text((70, 128), "Stats 2 Quiz 1 Prep", font=font(BOLD, 76), fill=CREAM)
    check("og title", 70 + d.textlength("Stats 2 Quiz 1 Prep", font=font(BOLD, 76)), 830)
    sub = "BSMA1004  ·  Weeks 1–4  ·  Quiz on Sun 15 Nov 2026"
    d.text((72, 226), sub, font=font(REG, 28), fill=SAGE)
    check("og subtitle", 72 + d.textlength(sub, font=font(REG, 28)), 830)
    f = font(SEMI, 24)
    x = 72
    for t in ("13 past papers analysed", "117 practice questions"):
        x = chip(d, x, 290, t, f) + 12
    x = 72
    for t in ("21 number drills", "Timed mocks", "GA answers"):
        x = chip(d, x, 348, t, f) + 12
    check("og chips", x, 830)
    d.text((72, 560), "Built by Arshan Ali Khan, RC Lucknow Region", font=font(SEMI, 24), fill=CREAM, anchor="lm")
    d.text((W - 72, 560), "Free · arshanalikhan.github.io/iitm-stats2-prep", font=font(MONO, 20), fill=SAGE, anchor="rm")
    out = os.path.join(ROOT, "src", "assets", "og.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.convert("RGB").save(out, optimize=True)
    return out


def qr_image(size):
    buf = io.BytesIO()
    segno.make(URL, error="m").save(buf, kind="png", scale=12, border=2, dark="#0d1f12", light="#ffffff")
    buf.seek(0)
    return Image.open(buf).convert("RGB").resize((size, size), Image.NEAREST)


def poster():
    W, H = 1080, 1350
    im = forest(W, H, 260)
    disc(im, (W - 280) // 2, 52, 280)
    d = ImageDraw.Draw(im)
    spaced(d, (W / 2, 362), KICKER, font(MONO, 28), GOLD, 4, centre=True)
    check("poster tagline", W / 2 + spaced(d, (W / 2, 404), TAGLINE, font(BOLD, 24), SAGE, 3, centre=True) / 2, W - 60)
    d.text((W / 2, 452), "Stats 2 Quiz 1 Prep", font=font(BOLD, 92), fill=CREAM, anchor="ma")
    sub = "IIT Madras BS  ·  BSMA1004  ·  Weeks 1–4  ·  Quiz Sun 15 Nov"
    d.text((W / 2, 572), sub, font=font(REG, 30), fill=SAGE, anchor="ma")
    check("poster subtitle", W / 2 + d.textlength(sub, font=font(REG, 30)) / 2, W - 50)
    items = [("Every past Quiz 1 since 2022", "analysed by pattern, with a predicted paper"),
             ("117 practice questions", "with full explanations"),
             ("21 number drills", "fresh numbers every time, worked solutions"),
             ("Timed 40-mark mocks", "scored like the real quiz"),
             ("Weekly graded assignments", "answers and working after each deadline")]
    y, right = 660, 0
    for head, sub in items:
        d.ellipse([82, y + 11, 100, y + 29], fill=GOLD)
        d.text((122, y), head, font=font(SEMI, 32), fill=CREAM)
        d.text((122, y + 42), sub, font=font(REG, 23), fill=SAGE)
        right = max(right, 122 + d.textlength(head, font=font(SEMI, 32)), 122 + d.textlength(sub, font=font(REG, 23)))
        y += 86
    qs = 250
    qx, qy = W - 76 - qs, 690
    check("poster list", right, qx - 30)
    d.rounded_rectangle([qx - 14, qy - 14, qx + qs + 14, qy + qs + 14], radius=20, fill=(255, 255, 255))
    im.paste(qr_image(qs), (qx, qy))
    d.text((qx + qs / 2, qy + qs + 30), "Scan to open", font=font(SEMI, 24), fill=CREAM, anchor="ma")
    d.text((W / 2, 1176), "Built by Arshan Ali Khan, RC Lucknow Region", font=font(SEMI, 32), fill=CREAM, anchor="ma")
    d.text((W / 2, 1224), "Free  ·  arshanalikhan.github.io/iitm-stats2-prep", font=font(MONO, 24), fill=SAGE, anchor="ma")
    out = os.path.join(ROOT, "marketing", "poster.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.convert("RGB").save(out, optimize=True)
    qr_image(900).save(os.path.join(ROOT, "marketing", "qr.png"))
    return out


if __name__ == "__main__":
    if len(sys.argv) > 1:
        make_logo_assets(sys.argv[1])
    for p in (og(), poster()):
        print(p, os.path.getsize(p) // 1024, "KB")

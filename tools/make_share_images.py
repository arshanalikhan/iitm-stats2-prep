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
import math
import os
import sys

import segno
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://arshanalikhan.github.io/iitm-stats2-prep/"
BG, INK, MUTED, ACCENT, SOFT, LINE = (18, 16, 28), (240, 238, 248), (170, 164, 192), (180, 162, 255), (56, 46, 98), (52, 46, 76)
FONTS = "C:/Windows/Fonts/"


def font(name, size):
    try:
        return ImageFont.truetype(FONTS + name, size)
    except OSError:
        return ImageFont.load_default()


BOLD, SEMI, REG, MONO = "segoeuib.ttf", "seguisb.ttf", "segoeui.ttf", "consola.ttf"
ASSETS = os.path.join(ROOT, "src", "assets")
# regions of the logo as fractions of its side: the whole mark (eagle + wordmark) and the eagle alone
LOGO_BOX, EMBLEM_BOX = (0.0675, 0.07, 0.9366, 0.939), (0.1717, 0.0663, 0.8330, 0.7277)


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


def paste_logo(im, name, x, y, size, box=None):
    """Screen-blend the gold-on-black logo onto the dark background, so its black disappears."""
    logo = Image.open(os.path.join(ASSETS, name)).convert("RGBA")
    black = Image.new("RGBA", logo.size, (0, 0, 0, 255))
    black.alpha_composite(logo)
    logo = black.convert("RGB")
    logo = Image.composite(Image.new("RGB", logo.size, (0, 0, 0)), logo, logo.convert("L").point(lambda v: 255 if v < 45 else 0))
    if box:
        logo = frac_crop(logo, box)
    logo = logo.resize((size, size), Image.LANCZOS)
    region = im.crop((x, y, x + size, y + size))
    im.paste(ImageChops.screen(region, logo), (x, y))


def glow(w, h, cx, cy, r, colour, strength=110):
    g = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(g)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=tuple(int(BG[i] + (colour[i] - BG[i]) * strength / 255) for i in range(3)))
    return g.filter(ImageFilter.GaussianBlur(r // 2))


def bell(d, x0, y0, w, h, bins=13):
    """Histogram bars with a bell curve over them (the site's hero motif)."""
    mu, sd = bins / 2, bins / 6.2
    bw = w / bins
    for i in range(bins):
        v = math.exp(-((i + 0.5 - mu) ** 2) / (2 * sd * sd))
        bh = v * h * 0.86
        d.rounded_rectangle([x0 + i * bw + 3, y0 + h - bh, x0 + (i + 1) * bw - 3, y0 + h], radius=5, fill=SOFT)
    pts = [(x0 + t / 200 * w, y0 + h - math.exp(-((t / 200 * bins - mu) ** 2) / (2 * sd * sd)) * h * 0.86) for t in range(201)]
    d.line(pts, fill=ACCENT, width=5, joint="curve")
    d.line([(x0, y0 + h + 2), (x0 + w, y0 + h + 2)], fill=LINE, width=2)


def chip(d, x, y, text, f, pad=16, h=46):
    w = d.textlength(text, font=f) + 2 * pad
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2, fill=(30, 27, 46), outline=LINE, width=2)
    d.text((x + pad, y + h / 2), text, font=f, fill=INK, anchor="lm")
    return x + w


def og():
    W, H = 1200, 630
    im = glow(W, H, 1050, 60, 320, ACCENT, 70)
    d = ImageDraw.Draw(im)
    d.text((72, 70), "IIT MADRAS BS  ·  BSMA1004", font=font(MONO, 24), fill=ACCENT)
    d.text((70, 104), "Stats 2 Quiz 1 Prep", font=font(BOLD, 76), fill=INK)
    d.text((72, 200), "Weeks 1–4  ·  Quiz on Sun 15 Nov 2026", font=font(REG, 32), fill=MUTED)
    f = font(SEMI, 24)
    x = 72
    for t in ("13 past papers analysed", "117 practice questions"):
        x = chip(d, x, 276, t, f) + 12
    x = 72
    for t in ("21 number drills", "Timed mocks", "GA answers"):
        x = chip(d, x, 336, t, f) + 12
    paste_logo(im, "saranda-logo.png", 846, 96, 290, LOGO_BOX)
    d.line([(72, 500), (W - 72, 500)], fill=LINE, width=2)
    paste_logo(im, "saranda-emblem.png", 68, 522, 76)
    d.text((156, 545), "A Saranda House initiative", font=font(SEMI, 28), fill=INK, anchor="lm")
    d.text((156, 580), "Built by Arshan Ali Khan, RC Lucknow Region", font=font(REG, 22), fill=MUTED, anchor="lm")
    d.text((W - 72, 562), "Free · arshanalikhan.github.io/iitm-stats2-prep", font=font(MONO, 20), fill=MUTED, anchor="rm")
    out = os.path.join(ROOT, "src", "assets", "og.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, optimize=True)
    return out


def qr_image(size):
    buf = io.BytesIO()
    segno.make(URL, error="m").save(buf, kind="png", scale=12, border=2, dark="#120f1c", light="#ffffff")
    buf.seek(0)
    return Image.open(buf).convert("RGB").resize((size, size), Image.NEAREST)


def poster():
    W, H = 1080, 1350
    im = glow(W, H, 900, 120, 420, ACCENT, 70)
    d = ImageDraw.Draw(im)
    d.text((80, 90), "IIT MADRAS BS  ·  BSMA1004", font=font(MONO, 28), fill=ACCENT)
    d.text((76, 128), "Stats 2", font=font(BOLD, 120), fill=INK)
    d.text((76, 258), "Quiz 1 Prep", font=font(BOLD, 120), fill=INK)
    d.text((80, 410), "Weeks 1–4  ·  Quiz on Sun 15 Nov 2026", font=font(REG, 36), fill=MUTED)
    paste_logo(im, "saranda-logo.png", 800, 40, 230, LOGO_BOX)
    items = [("Every past Quiz 1 since 2022", "analysed by pattern, with a predicted paper"),
             ("117 practice questions", "with full explanations"),
             ("21 number drills", "fresh numbers every time, worked solutions"),
             ("Timed 40-mark mocks", "scored like the real quiz"),
             ("Weekly graded assignments", "answers and working after each deadline")]
    y = 496
    for head, sub in items:
        d.ellipse([84, y + 12, 104, y + 32], fill=ACCENT)
        d.text((126, y), head, font=font(SEMI, 36), fill=INK)
        d.text((126, y + 46), sub, font=font(REG, 26), fill=MUTED)
        y += 94
    qr = qr_image(300)
    qx, qy = W - 80 - 300, H - 80 - 300
    d.rounded_rectangle([qx - 16, qy - 16, qx + 316, qy + 316], radius=22, fill=(255, 255, 255))
    im.paste(qr, (qx, qy))
    bell(d, 80, 980, 520, 120, bins=11)
    paste_logo(im, "saranda-emblem.png", 74, 1156, 88)
    d.text((176, 1182), "A Saranda House initiative", font=font(SEMI, 34), fill=INK, anchor="lm")
    d.text((176, 1222), "Built by Arshan Ali Khan, RC Lucknow Region", font=font(REG, 23), fill=MUTED, anchor="lm")
    d.text((80, 1292), "Free  ·  scan or open arshanalikhan.github.io/iitm-stats2-prep", font=font(MONO, 22), fill=MUTED)
    out = os.path.join(ROOT, "marketing", "poster.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, optimize=True)
    qr_image(900).save(os.path.join(ROOT, "marketing", "qr.png"))
    return out


if __name__ == "__main__":
    if len(sys.argv) > 1:
        make_logo_assets(sys.argv[1])
    for p in (og(), poster()):
        print(p, os.path.getsize(p) // 1024, "KB")

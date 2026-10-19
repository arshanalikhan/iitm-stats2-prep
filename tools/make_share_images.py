"""Make the share images.

Usage:  python tools/make_share_images.py      (needs Pillow and segno: pip install pillow segno)

Writes:
  src/assets/og.png          1200x630 link-preview image (WhatsApp, LinkedIn, Telegram, X)
  marketing/poster.png       1080x1350 poster with a QR code, for groups and stories
  marketing/qr.png           the QR code on its own
Fonts: Segoe UI and Consolas on Windows; falls back to Pillow's default font elsewhere."""
import io
import math
import os

import segno
from PIL import Image, ImageDraw, ImageFilter, ImageFont

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


def monogram(d, cx, cy, r):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ACCENT)
    d.text((cx, cy + 1), "AK", font=font(BOLD, int(r * 0.9)), fill=BG, anchor="mm")


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
    for t in ("21 number drills", "Timed mock quizzes"):
        x = chip(d, x, 336, t, f) + 12
    bell(d, 770, 250, 360, 190)
    d.line([(72, 500), (W - 72, 500)], fill=LINE, width=2)
    monogram(d, 104, 560, 32)
    d.text((152, 545), "Arshan Ali Khan", font=font(SEMI, 28), fill=INK, anchor="lm")
    d.text((152, 580), "Regional Coordinator, Lucknow  ·  Saranda House", font=font(REG, 22), fill=MUTED, anchor="lm")
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
    items = [("Every past Quiz 1 since 2022", "analysed by pattern, with a predicted paper"),
             ("117 practice questions", "with full explanations"),
             ("21 number drills", "fresh numbers every time, worked solutions"),
             ("Timed 40-mark mocks", "scored like the real quiz")]
    y = 500
    for head, sub in items:
        d.ellipse([84, y + 12, 104, y + 32], fill=ACCENT)
        d.text((126, y), head, font=font(SEMI, 38), fill=INK)
        d.text((126, y + 50), sub, font=font(REG, 28), fill=MUTED)
        y += 110
    qr = qr_image(300)
    qx, qy = W - 80 - 300, H - 80 - 300
    d.rounded_rectangle([qx - 16, qy - 16, qx + 316, qy + 316], radius=22, fill=(255, 255, 255))
    im.paste(qr, (qx, qy))
    bell(d, 80, 980, 520, 120, bins=11)
    monogram(d, 116, 1200, 36)
    d.text((168, 1182), "Arshan Ali Khan", font=font(SEMI, 34), fill=INK, anchor="lm")
    d.text((168, 1222), "RC Lucknow · Saranda House", font=font(REG, 26), fill=MUTED, anchor="lm")
    d.text((80, 1292), "Free  ·  scan or open arshanalikhan.github.io/iitm-stats2-prep", font=font(MONO, 22), fill=MUTED)
    out = os.path.join(ROOT, "marketing", "poster.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, optimize=True)
    qr_image(900).save(os.path.join(ROOT, "marketing", "qr.png"))
    return out


if __name__ == "__main__":
    for p in (og(), poster()):
        print(p, os.path.getsize(p) // 1024, "KB")

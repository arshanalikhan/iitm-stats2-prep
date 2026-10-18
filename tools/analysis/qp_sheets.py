"""Build labelled contact sheets of past Quiz 1 questions for visual tagging.
Usage: python tools/analysis/qp_sheets.py
Reads raw/qp/stats2-quizpractice-q1.json + raw/qp/img/, writes raw/qp/items.json (one record per unique
marked question, with its comprehension setup) and raw/qp/sheets/*.png (stems only, about 2200 px tall each)."""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QP = os.path.join(ROOT, "raw", "qp")
d = json.load(open(os.path.join(QP, "stats2-quizpractice-q1.json"), encoding="utf-8"))

byid, items, seen = {}, [], set()
for p in d["papers"]:
    for q in p["questions"]:
        byid[q["id"]] = q
for p in sorted(d["papers"], key=lambda p: (p["date"], p["name"])):
    for q in sorted(p["questions"], key=lambda q: q["question_number"] or 0):
        if float(q["total_mark"] or 0) <= 0 or q["hash"] in seen:
            continue
        seen.add(q["hash"])
        if q["question_type"] == "SA":
            ans = q["value_start"] if not q["value_end"] else f'{q["value_start"]} to {q["value_end"]}'
        else:
            ans = ",".join("ABCDEFGH"[i] for i, o in enumerate(q["options"]) if o.get("is_correct"))
        par = byid.get(q["parent_question_id"])
        items.append({"k": len(items), "id": q["id"], "date": p["date"], "paper": p["name"], "type": q["question_type"],
                      "marks": float(q["total_mark"]), "ans": ans, "parent": q["parent_question_id"],
                      "text": " ".join(t for t in (q.get("question_texts") or []) if t) or (q.get("question_text_1") or ""),
                      "imgs": [os.path.basename(u) for u in (q.get("question_image_url") or [])],
                      "pimgs": [os.path.basename(u) for u in ((par or {}).get("question_image_url") or [])],
                      "ptext": " ".join(t for t in ((par or {}).get("question_texts") or []) if t),
                      "opts": [{"n": o.get("option_number"), "t": o.get("option_text"), "img": os.path.basename(o["option_image_url"]) if isinstance(o.get("option_image_url"), str) else None, "ok": bool(o.get("is_correct"))} for o in q["options"]]})
# Content de-duplication: the same question is often re-uploaded under new image names.
def fp(names):
    out = []
    for n in names:
        path = os.path.join(QP, "img", n)
        if os.path.exists(path) and os.path.getsize(path) > 0:
            im = Image.open(path).convert("L").resize((24, 12))
            px = list(im.getdata()); m = sum(px) / len(px)
            out.append("".join("1" if v > m else "0" for v in px))
    return out
def same_fp(a, b):
    return len(a) == len(b) and all(sum(x != y for x, y in zip(u, v)) <= 12 for u, v in zip(a, b))
reps = []
for it in items:
    f = (it["text"].strip().lower() + "|" + it["ptext"].strip().lower(), fp(it["imgs"]) + fp(it["pimgs"]))
    it["dup_of"] = None
    for r in reps:
        if r[1][0] == f[0] and same_fp(r[1][1], f[1]) and (f[0] or f[1]):
            it["dup_of"] = r[0]; break
    if it["dup_of"] is None:
        reps.append((it["k"], f))
print("distinct after content dedupe:", sum(1 for it in items if it["dup_of"] is None))
json.dump(items, open(os.path.join(QP, "items.json"), "w", encoding="utf-8"), indent=0)

W, MAXH = 1000, 2300
try:
    font = ImageFont.truetype("arial.ttf", 22)
except OSError:
    font = ImageFont.load_default()
os.makedirs(os.path.join(QP, "sheets"), exist_ok=True)
for f in os.listdir(os.path.join(QP, "sheets")):
    os.remove(os.path.join(QP, "sheets", f))


def load(name, maxw=W - 20):
    path = os.path.join(QP, "img", name)
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        return None
    im = Image.open(path).convert("RGB")
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)))
    if im.height > 700:
        im = im.crop((0, 0, im.width, 700))
    return im


import textwrap
def text_img(t, width=W - 20):
    if not t:
        return None
    lines = []
    for para in t.split(chr(10)):
        lines += textwrap.wrap(para, 88) or [""]
    lines = lines[:14]
    im = Image.new("RGB", (width, 26 * len(lines) + 6), (248, 248, 252))
    dr = ImageDraw.Draw(im)
    for i, ln in enumerate(lines):
        dr.text((4, 3 + 26 * i), ln, fill=(20, 20, 20), font=font)
    return im


blocks, last_parent = [], None
for it in items:
    if it["dup_of"] is not None:
        continue
    parts = []
    if it["parent"] and it["parent"] != last_parent:
        parts += [text_img(it["ptext"])] + [load(n) for n in it["pimgs"]]
    last_parent = it["parent"]
    parts += [text_img(it["text"])] + [load(n) for n in it["imgs"]]
    if it["type"] != "SA" and not any(o["img"] for o in it["opts"]):
        parts.append(text_img("  ".join("ABCDEFGH"[i] + ") " + (o["t"] or "")[:60] for i, o in enumerate(it["opts"]))))
    parts = [x for x in parts if x]
    label = f'#{it["k"]}  {it["date"]}  {it["type"]} {it["marks"]:g}m  ans={it["ans"]}'
    h = 30 + sum(x.height + 4 for x in parts) + 8
    blk = Image.new("RGB", (W, max(h, 40)), "white")
    dr = ImageDraw.Draw(blk)
    dr.rectangle([0, 0, W, 28], fill=(225, 220, 245))
    dr.text((8, 3), label, fill=(30, 20, 80), font=font)
    y = 30
    for x in parts:
        blk.paste(x, (10, y)); y += x.height + 4
    blocks.append((it, blk))

sheet, y, n, first = None, 0, 0, None
def flush():
    global sheet, n
    if sheet is not None:
        sheet.crop((0, 0, W, y)).save(os.path.join(QP, "sheets", f"s{n:03d}_{first}.png")); n += 1
for it, blk in blocks:
    if sheet is None or y + blk.height > MAXH:
        flush(); sheet, y, first = Image.new("RGB", (W, MAXH), "white"), 0, it["k"]
    sheet.paste(blk, (0, y)); y += blk.height + 6
flush()
print(len(items), "items,", n, "sheets")

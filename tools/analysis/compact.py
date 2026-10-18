"""Turn Seek assessment JSON into compact text (questions, options, answers)."""
import json, re, sys, html

IMG = []
def img(src):
    src = html.unescape(src)
    if src not in IMG: IMG.append(src)
    return f'[P{IMG.index(src)}]'

def tx(h):
    h = h or ''
    h = re.sub(r'<img[^>]*src="([^"]+)"[^>]*>', lambda m: img(m.group(1)), h, flags=re.I)
    h = re.sub(r'<gcb-math>([\s\S]*?)</gcb-math>', lambda m: '$' + re.sub(r'\[lL]arge', '', m.group(1)).strip() + '$', h)
    h = re.sub(r'<br\s*/?>|</p>|</div>|</li>|</tr>', '\n', h, flags=re.I)
    h = re.sub(r'</t[dh]>', ' | ', h, flags=re.I)
    h = re.sub(r'<[^>]+>', '', h)
    h = html.unescape(h).replace(' ', ' ')
    h = re.sub(r'[ \t]+', ' ', h)
    return re.sub(r'\n\s*\n+', '\n', h).strip()

def Q(q, n):
    kind = ('MSQ' if q.get('multiple_selections') else 'MCQ') if q.get('type') == 'mcq' else 'NUM'
    s = f'{n}. [{kind}] {tx(q.get("prompt"))}'
    for i, c in enumerate(q.get('choices') or []):
        s += f'\n  {"*" if c["score"] > 0 else "-"}{chr(97+i)}) {tx(c["text"])}'
    if q.get('graders'):
        s += '\n  ANS: ' + ' OR '.join(f'{g["matcher"]} {g["response"]}' for g in q['graders'])
    fb = tx(q.get('default_feedback'))
    if fb: s += '\n  SOL: ' + fb
    return s

def assessment(a, title):
    out = [f'\n\n### {title}\n']
    n = [0]
    def walk(node):
        if 'items' in node:
            if node.get('introduction'): out.append('\nCOMMON: ' + tx(node['introduction']) + '\n')
            for i in node['items']: walk(i)
        elif 'question' in node:
            n[0] += 1; out.append(Q(node['question'], n[0]) + '\n')
    for s in a['sections']: walk(s)
    return ''.join(out)

if __name__ == '__main__':
    d = json.load(open(sys.argv[1], encoding='utf-8'))
    titles = {}
    for ns, outline in d['courses'].items():
        for u in outline:
            for c in u.get('children') or []:
                titles[(ns, str(c['id']))] = u['title'] + ' | ' + c['title']
    out = ''
    for ns, items in d['assess'].items():
        for id_, a in items.items():
            out += assessment(a, f'{ns} | {id_} | {titles.get((ns, id_), "")}')
    open(sys.argv[2], 'w', encoding='utf-8').write(out)
    json.dump(IMG, open(sys.argv[2] + '.imgs.json', 'w'), indent=0)
    print(len(out), 'chars', len(IMG), 'images')

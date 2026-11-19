#!/usr/bin/env python3
"""Strata — downloads the photos listed in tools/immagini.py from Wikimedia Commons.

Only files with a free licence that allows reuse with attribution are accepted:
CC0, public domain, CC BY, CC BY-SA (any version). NC, ND, «fair use» and files
without an author are rejected. For every photo it stores author, licence and source
page in data/images.json and img/CREDITS.md; the app shows them under the photo.

Usage:  python tools/fetch_images.py            (needs internet; no extra packages)
It also runs on GitHub Actions (.github/workflows/images.yml) when tools/immagini.py changes.
"""
import json, os, re, sys, time, html, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.insert(0, HERE)
from immagini import Q, BLOCK

API = 'https://commons.wikimedia.org/w/api.php'
UA = 'StrataEducationalApp/1.0 (https://github.com/Simmonsstummer/strata)'
WIDTH = 1024
OK = re.compile(r'^(cc0|public domain|pd\b.*|cc[ -]by(-sa)?[ -]\d(\.\d)?.*)$', re.I)
BAD = re.compile(r'\b(nc|nd|non-?commercial|no ?deriv|fair use)\b', re.I)


def get(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for k in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except Exception as e:
            print('  retry', e); time.sleep(3 * (k + 1))
    raise SystemExit('Commons API not reachable')


def text(v):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', v or ''))).strip()


II = {'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': WIDTH,
      'iiextmetadatafilter': 'LicenseShortName|LicenseUrl|Artist|ImageDescription|Restrictions|DateTimeOriginal'}


def candidates(q):
    if q.startswith('File:'):
        pages = get({'action': 'query', 'titles': q, **II}).get('query', {}).get('pages', [])
    else:
        pages = get({'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrlimit': 20,
                     'gsrsearch': q + ' filetype:bitmap', **II}).get('query', {}).get('pages', [])
        pages.sort(key=lambda p: p.get('index', 99))
    return pages


def acceptable(p):
    if p['title'] in BLOCK or 'imageinfo' not in p:
        return None
    ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
    lic = text(m.get('LicenseShortName', {}).get('value'))
    author = text(m.get('Artist', {}).get('value'))
    if ii.get('mime') not in ('image/jpeg', 'image/png') or ii.get('width', 0) < 700:
        return None
    if not lic or not OK.match(lic) or BAD.search(lic) or not author:
        return None
    if text(m.get('Restrictions', {}).get('value')):
        return None
    return {'file': p['title'], 'a': author[:160], 'l': lic, 'lu': m.get('LicenseUrl', {}).get('value', ''),
            'p': ii['descriptionurl'], 'd': text(m.get('ImageDescription', {}).get('value'))[:300],
            'thumb': ii.get('thumburl') or ii['url'], 'w': ii.get('thumbwidth') or ii['width'], 'h': ii.get('thumbheight') or ii['height']}


def main():
    out_dir = os.path.join(ROOT, 'img'); os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(ROOT, 'data', 'images.json')
    old = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    res, missing = {}, []
    for key, queries in Q.items():
        prev = old.get(key)
        if prev and prev['file'] not in BLOCK and os.path.exists(os.path.join(out_dir, prev['f'])):
            res[key] = prev; continue
        pick = None
        for q in queries:
            for p in candidates(q):
                pick = acceptable(p)
                if pick: break
            if pick: break
            time.sleep(.3)
        if not pick:
            missing.append(key); print('—', key); continue
        fname = re.sub(r'[^a-z0-9]+', '-', key.lower()).strip('-') + '.jpg'
        req = urllib.request.Request(pick.pop('thumb'), headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=60) as r, open(os.path.join(out_dir, fname), 'wb') as f:
            f.write(r.read())
        pick['f'] = fname; res[key] = pick
        print('✓', key, '←', pick['file'], '|', pick['l'], '|', pick['a'][:50])
        time.sleep(.5)
    # remove photos no longer listed
    used = {v['f'] for v in res.values()}
    for f in os.listdir(out_dir):
        if f.endswith('.jpg') and f not in used:
            os.remove(os.path.join(out_dir, f))
    json.dump(res, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1, sort_keys=True)
    lines = ['# Photo credits / Crediti delle foto\n',
             'All photos come from Wikimedia Commons and keep their own licence. Resized to ' + str(WIDTH) + ' px wide, no other changes.\n',
             'Tutte le foto vengono da Wikimedia Commons e mantengono la propria licenza. Ridimensionate a ' + str(WIDTH) + ' px di larghezza, nessun\'altra modifica.\n',
             '| File | Used for / Usata per | Author / Autore | License / Licenza | Source / Fonte |', '|---|---|---|---|---|']
    for k, v in sorted(res.items()):
        lines.append(f"| `img/{v['f']}` | `{k}` | {v['a'].replace('|', '/')} | [{v['l']}]({v['lu']}) | [{v['file']}]({v['p']}) |")
    open(os.path.join(out_dir, 'CREDITS.md'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
    print(f'{len(res)} photos, {len(missing)} without a free photo: {", ".join(missing)}')


if __name__ == '__main__':
    main()

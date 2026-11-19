#!/usr/bin/env python3
"""Strata — builds data/strata.json from the ICS chart data and the project texts.

Usage:  python tools/build.py path/to/chart.ttl
The chart.ttl file comes from https://github.com/i-c-stratigraphy/chart (© ICS, CC BY 4.0).
Needs: pip install rdflib
"""
import json, sys, os
import rdflib
from rdflib.namespace import SKOS

sys.path.insert(0, os.path.dirname(__file__))
from testi_unita import U
from testi_piani import S
from eventi import E
from visite import V

GTS = rdflib.Namespace('http://resource.geosciml.org/ontology/timescale/gts#')
GTSD = rdflib.Namespace('https://data.stratigraphy.org/data/gts/')
TIME = rdflib.Namespace('http://www.w3.org/2006/time#')
SCH = rdflib.Namespace('https://schema.org/')
SH = rdflib.Namespace('http://www.w3.org/ns/shacl#')
OWL = rdflib.Namespace('http://www.w3.org/2002/07/owl#')
DCT = rdflib.Namespace('http://purl.org/dc/terms/')


# country of each GSSP (or candidate) with coordinates, for the map and the games
COUNTRY = {'it': ('Italia', 'Italy'), 'es': ('Spagna', 'Spain'), 'fr': ('Francia', 'France'), 'gb': ('Regno Unito', 'United Kingdom'),
           'cn': ('Cina', 'China'), 'us': ('Stati Uniti', 'United States'), 'ca': ('Canada', 'Canada'), 'cz': ('Repubblica Ceca', 'Czech Republic'),
           'se': ('Svezia', 'Sweden'), 'ru': ('Russia', 'Russia'), 'kz': ('Kazakistan', 'Kazakhstan'), 'de': ('Germania', 'Germany'),
           'pt': ('Portogallo', 'Portugal'), 'at': ('Austria', 'Austria'), 'ma': ('Marocco', 'Morocco'), 'tn': ('Tunisia', 'Tunisia'),
           'eg': ('Egitto', 'Egypt'), 'mt': ('Malta', 'Malta'), 'jp': ('Giappone', 'Japan'), 'gl': ('Groenlandia', 'Greenland'),
           'in': ('India', 'India'), 'uz': ('Uzbekistan', 'Uzbekistan'), 'au': ('Australia', 'Australia'), 'ro': ('Romania', 'Romania')}
CC = dict(Archean='ca', Ediacaran='au', Pridoli='cz', Fortunian='ca', Wuliuan='cn', Drumian='us', Guzhangian='cn', Paibian='cn',
          Jiangshanian='cn', Tremadocian='ca', Floian='se', Dapingian='cn', Darriwilian='cn', Sandbian='se', Katian='us', Hirnantian='cn',
          Rhuddanian='gb', Aeronian='cz', Telychian='es', Sheinwoodian='gb', Homerian='gb', Gorstian='gb', Ludfordian='gb', Lochkovian='cz',
          Pragian='cz', Emsian='uz', Eifelian='de', Givetian='ma', Frasnian='fr', Famennian='fr', Tournaisian='fr', Visean='cn', Bashkirian='us',
          Asselian='kz', Sakmarian='ru', Artinskian='ru', Roadian='us', Wordian='us', Capitanian='us', Wuchiapingian='cn', Changhsingian='cn',
          Induan='cn', Olenekian='in', Anisian='ro', Ladinian='it', Carnian='it', Hettangian='at', Sinemurian='gb', Pliensbachian='gb',
          Toarcian='pt', Aalenian='es', Bajocian='pt', Bathonian='fr', Kimmeridgian='gb', Valanginian='fr', Hauterivian='fr', Barremian='es',
          Albian='fr', Cenomanian='fr', Turonian='us', Coniacian='de', Santonian='es', Campanian='it', Maastrichtian='fr', Danian='tn',
          Selandian='es', Thanetian='es', Ypresian='eg', Lutetian='es', Priabonian='it', Rupelian='it', Chattian='it', Aquitanian='it',
          Langhian='it', Serravallian='mt', Tortonian='it', Messinian='ma', Zanclean='it', Piacenzian='it', Gelasian='it', Calabrian='it',
          Chibanian='jp', Greenlandian='gl', Northgrippian='gl', Meghalayan='in')

# two inconsistencies in chart.ttl v2026-06, fixed so that every unit fits exactly inside its parent:
#  - Ludlow ends where the Pridoli begins (422.7 Ma), not at the top of the Silurian (419.62 Ma);
#  - the Aquitanian begins at the base of the Miocene/Neogene and the top of the Chattian (23.04 Ma), not 23.03 Ma.
FIXES = {('Ludlow', 'b'): 422.7, ('Ludlow', 'be'): 1.6, ('Aquitanian', 'a'): 23.04}

# the old school division (Giovanni Arduino, 1759, and its later additions), shown on request next to the official one
SCHOOL = [
    {'id': 'sQ', 'a': 2.58, 'b': 0, 'c': '#F9F97F', 'u': ['Quaternary'],
     'n': {'it': 'Era Quaternaria', 'en': 'Quaternary era'},
     'txt': {'it': "È l'unico nome della vecchia serie rimasto ufficiale: oggi il Quaternario è un periodo del Cenozoico. A scuola a volte si chiama anche Era Neozoica.",
             'en': "It is the only name of the old series that is still official: today the Quaternary is a period of the Cenozoic. Some school books also call it the Neozoic."}},
    {'id': 'sT', 'a': 66.0, 'b': 2.58, 'c': '#FDD03E', 'u': ['Paleogene', 'Neogene'],
     'n': {'it': 'Era Terziaria', 'en': 'Tertiary era'},
     'txt': {'it': "Corrisponde al Paleogene più il Neogene. Il «Terziario» non è più un'unità ufficiale dal 2004, ma il nome si usa ancora molto. Insieme al Quaternario forma il Cenozoico.",
             'en': "It matches the Paleogene plus the Neogene. The «Tertiary» has not been an official unit since 2004, but the name is still widely used. Together with the Quaternary it makes up the Cenozoic."}},
    {'id': 'sS', 'a': 251.902, 'b': 66.0, 'c': '#67C5CA', 'u': ['Mesozoic'],
     'n': {'it': 'Era Secondaria', 'en': 'Secondary era'},
     'txt': {'it': "È il Mesozoico: Triassico, Giurassico e Cretacico, l'era dei dinosauri.",
             'en': "It is the Mesozoic: Triassic, Jurassic and Cretaceous, the age of dinosaurs."}},
    {'id': 'sP', 'a': 538.8, 'b': 251.902, 'c': '#99C08D', 'u': ['Paleozoic'],
     'n': {'it': 'Era Primaria', 'en': 'Primary era'},
     'txt': {'it': "È il Paleozoico, dal Cambriano al Permiano: trilobiti, primi pesci, prime piante e primi animali sulla terraferma.",
             'en': "It is the Paleozoic, from the Cambrian to the Permian: trilobites, the first fishes, the first plants and animals on land."}},
    {'id': 'sA', 'a': 4567.0, 'b': 538.8, 'c': '#F74370', 'u': ['Precambrian'],
     'n': {'it': 'Era Arcaica', 'en': 'Archaic era'},
     'txt': {'it': "Detta anche Archeozoica (e, per la parte più antica, Azoica, «senza vita»). È tutto il Precambriano, che oggi si divide in Adeano, Archeano e Proterozoico: quasi nove decimi della storia della Terra.",
             'en': "Also called Archeozoic (and, for its oldest part, Azoic, «without life»). It is the whole Precambrian, today split into Hadean, Archean and Proterozoic: almost nine tenths of Earth's history."}},
]

RANK = {'Super-Eon': 'S', 'Eon': 'E', 'Era': 'R', 'Period': 'P', 'Sub-Period': 'B', 'Epoch': 'C', 'Age': 'A'}
ORDER = 'SERPBCA'

# names the chart leaves blank (Lower/Middle/Upper series of periods, Upper Pleistocene stage)
POS = {'Lower': ('Inferiore', 'Lower', 'Primo', 'Early'), 'Middle': ('Medio', 'Middle', 'Medio', 'Middle'),
       'Upper': ('Superiore', 'Upper', 'Tardo', 'Late')}


def main(ttl, out):
    g = rdflib.Graph(); g.parse(ttl, format='turtle')
    version = None
    for s in g.subjects(OWL.versionInfo, None):
        version = str(g.value(s, OWL.versionInfo))
    units = {}
    for s in set(g.subjects(GTS.rank, None)):
        if not str(s).startswith(str(GTSD)):
            continue
        id = str(s).split('/')[-1]
        ranks = [str(r).split('/')[-1] for r in g.objects(s, GTS.rank)]
        rank = 'Epoch' if 'Epoch' in ranks else ranks[0]
        d = {'id': id, 'r': RANK[rank]}
        b = g.value(s, SKOS.broader)
        d['p'] = str(b).split('/')[-1] if b else None
        n = {}
        for l in g.objects(s, SKOS.prefLabel):
            if l.language in ('it', 'en'):
                n[l.language] = str(l)
        d['n'] = n
        apx = []
        for k, p in (('a', TIME.hasBeginning), ('b', TIME.hasEnd)):
            node = g.value(s, p)
            d[k] = float(g.value(node, GTSD.inMYA))
            e = g.value(node, SCH.marginOfError)
            if e is not None:
                d[k + 'e'] = float(e)
            if any(str(o) == 'uncertain' for o in g.objects(node, SKOS.note)):
                apx.append(k)
        if apx:
            d['apx'] = apx
        d['c'] = str(g.value(s, SCH.color))
        d['o'] = int(g.value(s, SH.order))
        d['code'] = str(g.value(s, SKOS.notation))
        gp, ga = g.value(s, GTS.ratifiedGSSP), g.value(s, GTS.ratifiedGSSA)
        d['base'] = 'gssp' if gp is not None and bool(gp) else 'gssa' if ga is not None and bool(ga) else None
        cn = [str(c) for c in g.objects(s, SKOS.changeNote)]
        if cn:
            d['chg'] = cn
        units[id] = d

    for (id, k), v in FIXES.items():
        units[id].setdefault("fix", []).append(f"{k}: {units[id].get(k)} -> {v}")
        units[id][k] = v
    # every unit must fit inside its parent, and siblings must touch
    kids = {}
    for d in units.values():
        if d['p']:
            kids.setdefault(d['p'], []).append(d)
    for pid, ks in kids.items():
        ks.sort(key=lambda x: x['b'])
        assert abs(ks[0]['b'] - units[pid]['b']) < 1e-9 and abs(ks[-1]['a'] - units[pid]['a']) < 1e-9, 'span ' + pid
        for x, y in zip(ks, ks[1:]):
            assert abs(x['a'] - y['b']) < 1e-9, f"gap {x['id']} {y['id']}"

    # fill blank names
    for d in units.values():
        if d['n'].get('it') and d['n'].get('en'):
            continue
        id = d['id']
        for k, (pi, pe, ti, te) in POS.items():
            if id.startswith(k):
                base = units[id[len(k):]]['n']
                d['n'] = {'it': f"{base['it']} {pi}", 'en': f"{pe} {base['en']}"}
                d['nt'] = {'it': f"{ti} {base['it']}", 'en': f"{te} {base['en']}"}
                break
        else:
            raise SystemExit('missing name: ' + id)

    # texts
    for id, t in U.items():
        if id not in units:
            raise SystemExit('unknown unit in testi_unita: ' + id)
        for k, v in t.items():
            units[id][k] = {'it': v[0], 'en': v[1]}
    for id, t in S.items():
        if id not in units:
            raise SystemExit('unknown unit in testi_piani: ' + id)
        d = units[id]
        if t.get('ety') and 'ety' not in d:
            d['ety'] = {'it': t['ety'][0], 'en': t['ety'][1]}
        if t.get('txt'):
            d['txt'] = {'it': t['txt'][0], 'en': t['txt'][1]}
        if t.get('g'):
            gg = {}
            for k, v in t['g'].items():
                gg[k] = {'it': v[0], 'en': v[1]} if isinstance(v, tuple) else v
            d['g'] = gg
    for id, (i, e) in V.items():
        units[id]['g']['vis'] = {'it': i, 'en': e}
    for d in units.values():
        g = d.get('g')
        if g and g.get('lat') is not None:
            if d['id'] not in CC:
                raise SystemExit('no country for ' + d['id'])
            g['cc'] = CC[d['id']]
    # Upper Pleistocene keeps its provisional name in both scales
    up = units['UpperPleistocene']
    up['nt'] = {'it': 'Tardo Pleistocene', 'en': 'Late Pleistocene'}

    missing = [d['id'] for d in units.values() if d['r'] == 'A' and 'g' not in d]
    if missing:
        raise SystemExit('stages without GSSP text: ' + ', '.join(missing))
    noety = [d['id'] for d in units.values() if 'ety' not in d and not d['id'].startswith(('Lower', 'Middle', 'Upper'))]
    if noety:
        raise SystemExit('units without the origin of the name: ' + ', '.join(noety))

    lst = sorted(units.values(), key=lambda d: (ORDER.index(d['r']), -d['a']))
    bi = lambda t: {'it': t[0], 'en': t[1]}
    ev = [{'id': x['id'], 'a': x['a'], 'e': x['e'], 'k': x['k'], 'n': bi(x['n']), 'txt': bi(x['txt']),
           'see': [{'n': bi((s[0], s[1])), 'u': s[2]} for s in x['see']], 'read': x['read'],
           'web': [{'l': w[0], 'u': w[1]} for w in x['web']], 'el': x['el']} for x in E]
    from immagini import Q, BLOCK, PIN, NONE
    for k in Q:
        kind, ref = k.split(':', 1)
        ok = ref in units if kind in 'gu' else any(x['id'] == ref for x in E)
        if not ok:
            raise SystemExit('immagini.py: unknown key ' + k)
    data = {'photos': {'q': {k: v for k, v in Q.items() if k not in NONE}, 'pin': PIN, 'block': sorted(BLOCK)}, 'school': SCHOOL, 'version': version, 'countries': {k: {'it': v[0], 'en': v[1]} for k, v in COUNTRY.items()}, 'source': 'https://github.com/i-c-stratigraphy/chart', 'units': lst, 'events': ev}
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    write_sources(lst, version, os.path.join(os.path.dirname(out), '..', 'SOURCES.md'))
    print(f'{len(lst)} units, {len(ev)} events, chart v{version} -> {out} ({os.path.getsize(out)//1024} KB)')


def write_sources(lst, version, path):
    """SOURCES.md: the general sources and, unit by unit, the reference of each golden spike."""
    v = version.replace('-', '/')
    L = [f"""# Sources / Fonti

This file is generated by `tools/build.py` from the same data the app uses.
Questo file è generato da `tools/build.py` a partire dagli stessi dati usati dall'app.

## Time scale / Scala dei tempi

- **International Commission on Stratigraphy (ICS)** — *International Chronostratigraphic Chart*, v{v}. Data: https://github.com/i-c-stratigraphy/chart (`chart.ttl`), chart: https://stratigraphy.org/chart — CC BY 4.0.
- Cohen, K.M., Harper, D., Gibbard, P., Car, N. (2025). The ICS International Chronostratigraphic Chart this decade. *Episodes* 48: 105–115. https://doi.org/10.18814/epiiugs/2025/025001
- Cohen, K.M., Finney, S.C., Gibbard, P.L., Fan, J.-X. (2013; updated). The ICS International Chronostratigraphic Chart. *Episodes* 36: 199–204. https://doi.org/10.18814/epiiugs/2013/v36i3/002
- Colours: Commission for the Geological Map of the World (CGMW), as encoded in the ICS chart data.

## Golden spikes / Chiodi d'oro

- ICS — *Global Boundary Stratotype Section and Points (GSSPs)*: https://stratigraphy.org/gssps/
- ICS subcommission pages, e.g. Cretaceous: https://cretaceous.stratigraphy.org/gssps/ ; Cambrian: https://cambrian.stratigraphy.org/gssps
- The publication of each GSSP (mostly in *Episodes*, https://www.episodes.org) is listed below. / La pubblicazione di ogni GSSP (quasi sempre su *Episodes*) è elencata qui sotto.

| Unit / Unità | Status / Stato | Section / Sezione | Year / Anno | Reference / Riferimento |
|---|---|---|---|---|
"""]
    ST = {'r': 'GSSP', 'c': 'candidate / candidato', 'n': 'not defined / non definito', 'a': 'GSSA'}
    for d in sorted(lst, key=lambda d: d['a']):
        g = d.get('g')
        if not g:
            continue
        L.append(f"| {d['n']['en']} / {d['n']['it']} | {ST[g['st']]} | {g['loc']['en']} | {g['yr']['en'] if isinstance(g.get('yr'), dict) else g.get('yr', '—')} | {g.get('ref', '—')} |\n")
    L.append('\n## Events: further reading and links / Eventi: letture e link\n\n')
    for x in sorted(E, key=lambda x: -x['a']):
        L.append(f"**{x['n'][1]}** ({x['a']} Ma)\n")
        for r in x['read']:
            L.append(f"- {r}\n")
        for w in x['web']:
            L.append(f"- [{w[0]}]({w[1]})\n")
        for p in x['see']:
            L.append(f"- {p[1]}: {p[2]}\n")
        L.append('\n')
    L.append("""
## Map / Mappa

- Natural Earth, 1:50m Cultural and Physical Vectors — public domain — https://www.naturalearthdata.com
- world-atlas 2 (Mike Bostock), ISC License — https://github.com/topojson/world-atlas

## Other facts in the texts / Altri dati nei testi

The texts in `tools/testi_unita.py`, `tools/testi_piani.py` and `tools/eventi.py` summarise well-established knowledge of Earth history; the ages of the events are rounded. Corrections are welcome: open an issue on https://github.com/Simmonsstummer/strata/issues.
I testi riassumono conoscenze consolidate sulla storia della Terra; le età degli eventi sono arrotondate. Le correzioni sono benvenute: apri una issue.
""")
    with open(path, 'w', encoding='utf-8') as f:
        f.write(''.join(L))


if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    main(sys.argv[1] if len(sys.argv) > 1 else 'chart.ttl', os.path.join(here, '..', 'data', 'strata.json'))

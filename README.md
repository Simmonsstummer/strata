# Strata

**The geologic time scale to explore, study and play with — in English and Italian.**
**La scala del tempo geologico da esplorare, studiare e con cui giocare — in italiano e in inglese.**

### ▶ [Open Strata / Apri Strata — simmonsstummer.github.io/strata](https://simmonsstummer.github.io/strata/)

Strata runs in the browser, on desktop and phone, with nothing to install and no server-side code: it is made of static files only. It is a sister project of [Elementa](https://github.com/Simmonsstummer/elementa), the interactive periodic table.

[English](#english) · [Italiano](#italiano)

![The stratigraphic column](docs/column.jpg)

| | |
|---|---|
| ![Card of the Jurassic](docs/card.jpg) | ![Golden spike of the Gelasian](docs/gssp.jpg) |
| **A card for every unit** / **Una scheda per ogni unità** | **Golden spike**: place, marker, rocks / **Chiodo d'oro**: luogo, segnale, rocce |
| ![True-time scale](docs/linear.jpg) | ![Map of the golden spikes](docs/map.jpg) |
| **True time**: the Precambrian at its real length / **Tempo reale**: il Precambriano nella sua vera lunghezza | **Map** of all golden spikes / **Mappa** di tutti i chiodi d'oro |

<p align="center">
  <img src="docs/games.jpg" alt="Where does it go? game" width="62%">
  &nbsp;
  <img src="docs/mobile.jpg" alt="Strata on a phone" width="26%">
</p>

---

## English

### What's inside

- **The column** – the International Chronostratigraphic Chart drawn as a rock face: the oldest units at the bottom (Hadean, Archean…), the youngest at the top (Quaternary). Eons, eras, periods, sub-periods, epochs and stages side by side, in the **official colours** (CGMW). Drag to move through time, zoom with the mouse wheel or by pinching; the closer you get, the more names appear. A breadcrumb at the top always tells you where you are.
- **Two scales** – *ICS chart* gives every stage the same height, like the official chart; *True time* is proportional to duration, all the way down to the 4,000-year stages of the Holocene. Switching animates between the two.
- **Two names** – *Rocks* uses the chronostratigraphic terms (System, Series, Stage; Lower/Upper Jurassic), *Time* the geochronologic ones (Period, Epoch, Age; Early/Late Jurassic).
- **Boundaries** – every boundary has its age and uncertainty; a golden nail marks the ones defined by a GSSP, a clock the ones defined by a standard age (GSSA).
- **Events** – 44 milestones of Earth's history (oldest zircon, Great Oxidation, Snowball Earth, the five mass extinctions, Messinian salinity crisis…) on a lane next to the column.
- **A card for every unit**
  - *Overview*: origin of the name, what was happening, why the unit starts where it does, where to see these rocks in Italy, events, subdivisions, neighbours, its date on the «Earth calendar» (4.567 billion years squeezed into one year), official colour and the changes of the latest chart version.
  - *Boundary and type section*: the golden spike at the base — section, coordinates on a small map, the boundary signal (first appearance of a fossil, magnetic reversal, isotope event…), **the rocks of the section**, year of ratification and reference. Stages still without a GSSP show the candidate sections; Precambrian boundaries explain the chronometric ages.
- **Golden-spike map** – all the GSSPs on a world map, filterable by era: 82 ratified in 23 countries, 13 of them in Italy.
- **Games** – *Where does it go?* (tap the column where an event belongs), *Strata quiz* (names, colours, places, dates; always different), *Stack the layers* (the law of superposition, three levels), *Golden-spike hunt* (find the GSSP on the map).
- **Two languages** – Italian and English, switchable at any time with the IT/EN button (the first choice follows the browser language). Light and dark theme.

### Run it or put it on your website

Copy all the files into any folder of a web server, for example `public_html/strata/`. No PHP, database or build step is needed.

The app loads `data/strata.json` with `fetch`, so **it does not work by double-clicking `index.html`** (`file://`). To try it locally, start a small server in the folder:

```
python -m http.server 8000
```

and open http://localhost:8000.

The public version runs on GitHub Pages from the `main` branch: every push to `main` updates https://simmonsstummer.github.io/strata/.

Direct links: `#jurassic` opens the Jurassic (any unit id works: `#gelasian`, `#calabrian`, `#hadean`…), `#map` and `#play` open those views.

### Updating the time scale

The ICS publishes the chart as data in https://github.com/i-c-stratigraphy/chart. When a new version comes out:

```
pip install -r tools/requirements.txt
python tools/build.py path/to/chart.ttl
```

`tools/build.py` reads the units, ages, uncertainties, names and colours from `chart.ttl`, adds the texts from `tools/testi_unita.py`, `tools/testi_piani.py` and `tools/eventi.py`, and writes `data/strata.json`. It stops with an error if a unit has no text, so new or renamed units are not missed.

### Files

| File | Contents |
|---|---|
| `index.html`, `style.css` | page and style (light/dark theme) |
| `i18n.js` | interface texts, Italian and English |
| `core.js` | data helpers, number and age formatting |
| `column.js` | the stratigraphic column: canvas drawing, scales, zoom, hit testing |
| `panel.js` | the card of each unit |
| `map.js`, `world.js` | the golden-spike map and the world outline |
| `games.js` | the four games |
| `main.js` | startup, views, search, language and theme |
| `data/strata.json` | the generated data |
| `tools/` | build scripts and the source texts |
| `SOURCES.md` | all sources, with the reference of every golden spike (generated) |
| `docs/` | screenshots and the social preview image |

### Sources

- **Time scale** – International Commission on Stratigraphy, *International Chronostratigraphic Chart* v2026/06: data from [i-c-stratigraphy/chart](https://github.com/i-c-stratigraphy/chart), chart at [stratigraphy.org/chart](https://stratigraphy.org/chart). Cohen, K.M., Harper, D., Gibbard, P., Car, N. (2025), *The ICS International Chronostratigraphic Chart this decade*, Episodes 48: 105–115, [doi:10.18814/epiiugs/2025/025001](https://doi.org/10.18814/epiiugs/2025/025001).
- **Colours** – Commission for the Geological Map of the World (CGMW), as encoded in the ICS data.
- **Golden spikes** – ICS GSSP table, [stratigraphy.org/gssps](https://stratigraphy.org/gssps/), and the pages of the ICS subcommissions; every card cites the paper that ratified its GSSP. The full list, unit by unit, is in [`SOURCES.md`](SOURCES.md).
- **Map** – [Natural Earth](https://www.naturalearthdata.com) 1:50m, via [world-atlas](https://github.com/topojson/world-atlas).

### Found a mistake?

Every card has a «Report it» link that opens a GitHub issue already filled with the unit and the chart version. Corrections with a source are very welcome.

### How to cite

See [`CITATION.cff`](CITATION.cff) (GitHub shows a «Cite this repository» button). Please cite the ICS chart too.

### Licenses

- **Code**: MIT (`LICENSE`).
- **Texts written for Strata** (both languages): CC BY 4.0 (`LICENSE-CONTENT.md`).
- **Time-scale data**: © International Commission on Stratigraphy, CC BY 4.0 — chart v2026/06.
- **World map**: Natural Earth, public domain.

Full details in [`CREDITS.md`](CREDITS.md).

---

## Italiano

### Cosa contiene

- **La colonna** – la Carta Cronostratigrafica Internazionale disegnata come una parete di roccia: le unità più antiche in basso (Adeano, Archeano…), le più recenti in alto (Quaternario). Eoni, ere, periodi, sottoperiodi, epoche e piani affiancati, nei **colori ufficiali** (CGMW). Trascina per muoverti nel tempo, ingrandisci con la rotella o pizzicando: più ti avvicini, più nomi compaiono. In alto un «filo di Arianna» dice sempre dove ti trovi.
- **Due scale** – *Carta ICS* dà a ogni piano la stessa altezza, come la carta ufficiale; *Tempo reale* è proporzionale alla durata, fino ai piani di 4000 anni dell'Olocene. Il passaggio tra le due è animato.
- **Due nomi** – *Rocce* usa i termini della cronostratigrafia (Sistema, Serie, Piano; Giurassico Inferiore/Superiore), *Tempo* quelli della geocronologia (Periodo, Epoca, Età; Primo/Tardo Giurassico).
- **Limiti** – ogni limite ha la sua età con l'incertezza; un chiodo d'oro indica quelli definiti da un GSSP, un orologio quelli definiti da un'età standard (GSSA).
- **Eventi** – 44 tappe della storia della Terra (lo zircone più antico, la Grande Ossidazione, la Terra a palla di neve, le cinque grandi estinzioni, la crisi di salinità del Messiniano…) in una corsia accanto alla colonna.
- **Una scheda per ogni unità**
  - *Panoramica*: origine del nome, cosa succedeva, perché l'unità inizia proprio lì, dove vedere queste rocce in Italia, eventi, suddivisioni, unità vicine, la sua data sul «calendario della Terra» (4,567 miliardi di anni compressi in un anno), colore ufficiale e modifiche dell'ultima versione della carta.
  - *Limite e strato tipo*: il chiodo d'oro alla base — sezione, coordinate su una piccola mappa, il segnale del limite (prima comparsa di un fossile, inversione magnetica, evento isotopico…), **le rocce della sezione**, anno di ratifica e riferimento. I piani ancora senza GSSP mostrano le sezioni candidate; i limiti del Precambriano spiegano le età cronometriche.
- **Mappa dei chiodi d'oro** – tutti i GSSP su una mappa del mondo, filtrabili per era: 82 ratificati in 23 paesi, 13 in Italia.
- **Giochi** – *Dove lo metti?* (tocca la colonna dove va un evento), *Quiz degli strati* (nomi, colori, luoghi, date; sempre diversi), *Impila gli strati* (il principio di sovrapposizione, tre livelli), *Caccia al chiodo d'oro* (trova il GSSP sulla mappa).
- **Due lingue** – italiano e inglese, si cambia in ogni momento con il pulsante IT/EN (la prima scelta segue la lingua del browser). Tema chiaro e scuro.

### Provarla o metterla sul tuo sito

Copia tutti i file in una cartella qualsiasi di un server web, ad esempio `public_html/strata/`. Non servono PHP, database o passaggi di compilazione.

L'app carica `data/strata.json` con `fetch`, quindi **non funziona aprendo `index.html` con un doppio clic** (`file://`). Per provarla in locale avvia un piccolo server nella cartella:

```
python -m http.server 8000
```

e apri http://localhost:8000.

La versione pubblica gira su GitHub Pages dal branch `main`: ogni push su `main` aggiorna https://simmonsstummer.github.io/strata/.

Link diretti: `#jurassic` apre il Giurassico (funziona con l'id inglese di ogni unità: `#gelasian`, `#calabrian`, `#hadean`…), `#mappa` e `#gioca` aprono quelle viste.

### Aggiornare la scala dei tempi

La ICS pubblica la carta come dati in https://github.com/i-c-stratigraphy/chart. Quando esce una nuova versione:

```
pip install -r tools/requirements.txt
python tools/build.py percorso/di/chart.ttl
```

`tools/build.py` legge unità, età, incertezze, nomi e colori da `chart.ttl`, aggiunge i testi di `tools/testi_unita.py`, `tools/testi_piani.py` e `tools/eventi.py` e scrive `data/strata.json`. Si ferma con un errore se un'unità non ha testi, così le unità nuove o rinominate non sfuggono.

### File

| File | Contenuto |
|---|---|
| `index.html`, `style.css` | pagina e stile (tema chiaro/scuro) |
| `i18n.js` | testi dell'interfaccia, italiano e inglese |
| `core.js` | funzioni sui dati, formattazione di numeri ed età |
| `column.js` | la colonna stratigrafica: disegno su canvas, scale, zoom, selezione |
| `panel.js` | la scheda di ogni unità |
| `map.js`, `world.js` | la mappa dei chiodi d'oro e il contorno del mondo |
| `games.js` | i quattro giochi |
| `main.js` | avvio, viste, ricerca, lingua e tema |
| `data/strata.json` | i dati generati |
| `tools/` | script di generazione e testi sorgente |
| `SOURCES.md` | tutte le fonti, con il riferimento di ogni chiodo d'oro (generato) |
| `docs/` | screenshot e immagine di anteprima per i social |

### Fonti

- **Scala dei tempi** – Commissione Internazionale di Stratigrafia, *Carta Cronostratigrafica Internazionale* v2026/06: dati da [i-c-stratigraphy/chart](https://github.com/i-c-stratigraphy/chart), carta su [stratigraphy.org/chart](https://stratigraphy.org/chart). Cohen, K.M., Harper, D., Gibbard, P., Car, N. (2025), *The ICS International Chronostratigraphic Chart this decade*, Episodes 48: 105–115, [doi:10.18814/epiiugs/2025/025001](https://doi.org/10.18814/epiiugs/2025/025001).
- **Colori** – Commissione per la Carta Geologica del Mondo (CGMW), come codificati nei dati ICS.
- **Chiodi d'oro** – tabella dei GSSP della ICS, [stratigraphy.org/gssps](https://stratigraphy.org/gssps/), e pagine delle sottocommissioni ICS; ogni scheda cita l'articolo che ha ratificato il suo GSSP. L'elenco completo, unità per unità, è in [`SOURCES.md`](SOURCES.md).
- **Mappa** – [Natural Earth](https://www.naturalearthdata.com) 1:50m, tramite [world-atlas](https://github.com/topojson/world-atlas).

### Hai trovato un errore?

Ogni scheda ha un link «Segnalalo» che apre una issue su GitHub già compilata con l'unità e la versione della carta. Le correzioni con una fonte sono benvenutissime.

### Come citare

Vedi [`CITATION.cff`](CITATION.cff) (GitHub mostra il pulsante «Cite this repository»). Cita anche la carta ICS.

### Licenze

- **Codice**: MIT (`LICENSE`).
- **Testi scritti per Strata** (in entrambe le lingue): CC BY 4.0 (`LICENSE-CONTENT.md`).
- **Dati della scala dei tempi**: © Commissione Internazionale di Stratigrafia, CC BY 4.0 — carta v2026/06.
- **Mappa del mondo**: Natural Earth, pubblico dominio.

Tutti i dettagli in [`CREDITS.md`](CREDITS.md).

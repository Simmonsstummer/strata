# Credits and third-party licenses / Crediti e licenze di terze parti

Strata's own code is MIT-licensed (`LICENSE`) and its own texts are CC BY 4.0 (`LICENSE-CONTENT.md`).
Everything listed here belongs to other people and keeps **its own license**: Strata does not relicense it.

Il codice di Strata è MIT (`LICENSE`) e i suoi testi sono CC BY 4.0 (`LICENSE-CONTENT.md`).
Tutto ciò che è elencato qui appartiene ad altri e mantiene **la propria licenza**: Strata non la cambia.

---

## 1. The time scale / La scala dei tempi (`data/strata.json`)

**International Chronostratigraphic Chart, version 2026/06** — © International Commission on Stratigraphy (ICS), 2026.
Source / Fonte: https://github.com/i-c-stratigraphy/chart (file `chart.ttl`, commit `967d9cb`), published at https://stratigraphy.org/chart.
License / Licenza: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

Suggested citation / Citazione suggerita dalla ICS:
Cohen, K.M., Harper, D., Gibbard, P., Car, N. (2025). *The ICS International Chronostratigraphic Chart this decade.* Episodes 48: 105–115. https://doi.org/10.18814/epiiugs/2025/025001

What Strata takes from it / Cosa usa Strata: the units and their hierarchy, the ages of the boundaries and their uncertainties, the official Italian and English names, the official colours (defined by the Commission for the Geological Map of the World, CGMW), the ratified GSSP/GSSA flags and the 2026/06 change notes.
Changes made / Modifiche: the data were converted from RDF to JSON by `tools/build.py`; the Italian and English names of the Lower/Middle/Upper series, which the chart leaves blank, were composed from the period names (e.g. «Giurassico Inferiore», «Lower Jurassic»). No colour was changed. Two ages that did not match between units in `chart.ttl` v2026/06 were aligned so that every unit fits exactly inside its parent: the top of the Ludlow is set at the base of the Pridoli (422.7 ± 1.6 Ma; the file gives 419.62 ± 1.36 Ma), and the base of the Aquitanian at the base of the Miocene and Neogene (23.04 Ma; the file gives 23.03 Ma).

## 2. Golden spikes / Chiodi d'oro

The facts about each GSSP — section, coordinates, boundary level, primary marker, year of ratification and reference — come from the **ICS GSSP table** (https://stratigraphy.org/gssps/, © ICS, CC BY 4.0) and from the pages of the ICS subcommissions (for example https://cretaceous.stratigraphy.org/gssps/valanginian for the Valanginian GSSP ratified in December 2024). The texts that describe them, including the descriptions of the rocks, are written for this project (see `LICENSE-CONTENT.md`); they summarise the published GSSP papers listed in each card.

I dati di ogni GSSP — sezione, coordinate, livello del limite, marcatore principale, anno di ratifica e riferimento — vengono dalla **tabella dei GSSP della ICS** e dalle pagine delle sue sottocommissioni. I testi che li descrivono, comprese le descrizioni delle rocce, sono scritti per questo progetto.

The reference of every golden spike, unit by unit, is listed in [`SOURCES.md`](SOURCES.md). / Il riferimento di ogni chiodo d'oro, unità per unità, è in [`SOURCES.md`](SOURCES.md).

## 3. World map / Mappa del mondo (`world.js`)

**Natural Earth** 1:50m land and country boundaries — public domain, https://www.naturalearthdata.com
Redistributed as TopoJSON by **world-atlas** 2 (© Mike Bostock, ISC License, https://github.com/topojson/world-atlas).
Changes made / Modifiche: simplified with topojson-simplify and projected to an equirectangular SVG path by `tools/mkmap.mjs`.

## 4. Photos / Foto

Photos are shown **directly from Wikimedia Commons** (they are not copied into this repository) and only with a free licence that allows reuse with attribution: **CC0, public domain, CC BY, CC BY-SA** (any version). The licence and the author are read live from the Commons API for every file; NC or ND files, «fair use» files and files without a named author are never shown. Every photo keeps **its own licence**, shown under the photo together with the author and links to the Commons page and to the licence text. Photos are displayed unmodified (Wikimedia's own thumbnails), so the share-alike clause of CC BY-SA photos does not extend to Strata's code or texts. If local copies are made with `tools/fetch_images.py`, their credits are listed in `img/CREDITS.md`.

Le foto sono mostrate **direttamente da Wikimedia Commons** (non sono copiate nel repository) e solo con una licenza libera che permette il riuso citando l'autore: **CC0, pubblico dominio, CC BY, CC BY-SA**. Licenza e autore vengono letti in tempo reale dall'API di Commons per ogni file; i file NC o ND, quelli «fair use» e quelli senza autore non vengono mai mostrati. Ogni foto mantiene **la propria licenza**, indicata sotto la foto insieme all'autore e ai link alla pagina di Commons e al testo della licenza.

## 5. Books and links in the event cards / Libri e link nelle schede degli eventi

Titles, authors and links are cited as references only; no text from them is reproduced. The full list is in [`SOURCES.md`](SOURCES.md).

## 6. Fonts / Caratteri

**Inter** (© The Inter Project Authors) and **JetBrains Mono** (© JetBrains), both under the [SIL Open Font License 1.1](https://openfontlicense.org), loaded from Google Fonts.

## 7. Emoji

The event icons are Unicode emoji drawn by the operating system's own font; no emoji images are shipped with Strata.

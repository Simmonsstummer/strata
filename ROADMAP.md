# Roadmap

What is planned or still to do. / Cosa è in programma o ancora da fare.

## Da fare subito / Next

- [ ] **Scaricare le foto** – lanciare `python tools/fetch_images.py` su un computer con internet (dalla sessione in cui è stata costruita Strata Wikimedia Commons non era raggiungibile), poi **controllare le foto una per una**: quelle sbagliate o brutte vanno in `BLOCK` in `tools/immagini.py` e si rilancia lo script. Facoltativo: un workflow di GitHub Actions che lo fa da solo a ogni modifica dell'elenco.
  *Download the photos with `python tools/fetch_images.py`, review them and block the wrong ones; optionally automate it with GitHub Actions.*
- [x] **Link da Elementa a Strata** – fatto: le schede di uranio, piombo, zirconio, iridio, ferro, ossigeno, carbonio, calcio, magnesio, sodio, cloro, zolfo, potassio e argon aprono la scheda corrispondente di Strata.
- [ ] **Revisione geologica dei testi** – soprattutto le descrizioni delle rocce delle sezioni (`tools/testi_piani.py`), i marcatori dei piani senza GSSP, le indicazioni «Andarci» (`tools/visite.py`) e i nuovi eventi tettonici (`tools/eventi.py`).
  *Expert review of the texts.*
- [ ] **Controllare due link esterni** non verificati automaticamente: `snowballearth.org` e `burgess-shale.rom.on.ca`. Tutti i link a Wikipedia sono stati controllati.
  *Check two external links that could not be verified automatically.*

## Idee / Ideas

- [ ] Link a Wikipedia **in italiano** per tutti gli eventi (oggi molti puntano a quella inglese).
- [ ] **Filtro degli eventi** per tipo: vita, clima, estinzioni, tettonica, umanità.
- [ ] **Mappe paleogeografiche**: la posizione dei continenti nel tempo accanto alla colonna (servono dati con licenza aperta, per esempio da GPlates).
- [ ] **Fossili guida** per periodo e piano, con foto libere e dati dal Paleobiology Database (CC BY).
- [ ] **Modalità bambini**: solo le ere della scuola, testi più semplici, giochi a livelli.
- [ ] **Poster** ad alta risoluzione con foto e didascalie, pensato per la stampa fine art.
- [ ] **Altre lingue**: i nomi ufficiali della carta ICS esistono già in 25 lingue nei dati sorgente.
- [ ] **Aggiornamento automatico** quando la ICS pubblica una nuova versione della carta.

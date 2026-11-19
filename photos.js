/* Strata — photos shown straight from Wikimedia Commons, only with free licences.
   For every subject (tools/immagini.py) the browser asks the Commons API for candidate files,
   reads each file's licence and author from Commons itself, and shows a photo only if it is
   CC0, public domain, CC BY or CC BY-SA with a named author. Nothing is copied into the repo.
   If Commons does not answer, or the file has moved, no photo (and no broken image) is shown. */
'use strict';
App.photos = (() => {
  const API = 'https://commons.wikimedia.org/w/api.php';
  const OK = /^(cc0|public domain|pd\b.*|cc[ -]by(-sa)?[ -]\d(\.\d)?.*)$/i, BAD = /\b(nc|nd|non-?commercial|no ?deriv|fair use)\b/i;
  const TTL = 7 * 864e5, mem = {};
  const text = v => { const d = document.createElement('div'); d.innerHTML = v || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); };
  const P = () => App.photoCfg || { q: {}, pin: {}, block: [] };

  async function api(params) {
    const u = API + '?' + new URLSearchParams({ origin: '*', format: 'json', formatversion: 2, ...params });
    const r = await fetch(u); if (!r.ok) throw new Error('commons ' + r.status); return r.json();
  }
  const II = { prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: 960, iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|ImageDescription|Restrictions' };
  function accept(p, q) {
    if (!p.imageinfo || P().block.includes(p.title)) return null;
    const ii = p.imageinfo[0], m = ii.extmetadata || {}, lic = text(m.LicenseShortName && m.LicenseShortName.value), a = text(m.Artist && m.Artist.value);
    if (!/image\/(jpeg|png)/.test(ii.mime) || ii.width < 700 || !lic || !OK.test(lic) || BAD.test(lic) || !a) return null;
    if (text(m.Restrictions && m.Restrictions.value)) return null;
    const d = text(m.ImageDescription && m.ImageDescription.value);
    if (q) {      // the file must really be about the subject: a word of the search in its title or description
      const hay = (p.title + ' ' + d).toLowerCase(), words = q.toLowerCase().split(/[\s,'’-]+/).filter(w => w.length > 3);
      if (words.length && !words.some(w => hay.includes(w))) return null;
    }
    return { file: p.title, src: ii.thumburl || ii.url, w: ii.thumbwidth || ii.width, h: ii.thumbheight || ii.height, a: a.slice(0, 140), l: lic,
      lu: (m.LicenseUrl && m.LicenseUrl.value) || '', page: ii.descriptionurl, d: d.slice(0, 220) };
  }
  async function candidates(q, n = 12) {
    const j = await api({ action: 'query', generator: 'search', gsrnamespace: 6, gsrlimit: n, gsrsearch: q + ' filetype:bitmap', ...II });
    return ((j.query && j.query.pages) || []).sort((a, b) => (a.index || 99) - (b.index || 99)).map(p => accept(p, q)).filter(Boolean);
  }
  async function byTitle(t) { const j = await api({ action: 'query', titles: t, ...II }); const p = j.query && j.query.pages && j.query.pages[0]; return p ? accept(p, null) : null; }

  /* the photo for a key, or null; cached for a week in this browser */
  function get(key) {
    if (mem[key]) return mem[key];
    return mem[key] = (async () => {
      const pin = P().pin[key], qs = P().q[key];
      if (!pin && !qs) return null;
      const ck = 'ph:' + key + ':' + (pin || ''), c = store.get(ck, null);
      if (c && Date.now() - c.t < TTL && (!c.p || !P().block.includes(c.p.file))) return c.p;
      let ph = null;
      try {
        if (pin) ph = await byTitle(pin);
        for (const q of qs || []) { if (ph) break; ph = (await candidates(q))[0] || null; }
      } catch (e) { return null; }
      store.set(ck, { t: Date.now(), p: ph }); return ph;
    })();
  }
  const fig = (p, extra = '') => `<img src="${esc(p.src)}" alt="${esc(p.d || p.file)}" width="${p.w}" height="${p.h}" loading="lazy" referrerpolicy="no-referrer">
    <figcaption><span class="lic">${esc(p.l)}</span> ${t('photo.by')} ${esc(p.a)} · <a href="${esc(p.page)}" target="_blank" rel="noopener">${t('photo.source')}</a>${p.lu ? ` · <a href="${esc(p.lu)}" target="_blank" rel="noopener">${t('photo.license')}</a>` : ''}${extra}</figcaption>`;

  /* panel: <figure class="photo" data-ph="key"> placeholders are filled in, or removed */
  function fill(root) {
    $$('figure[data-ph]', root).forEach(async el => {
      const key = el.dataset.ph, p = await get(key);
      if (!el.isConnected) return;
      if (!p) { el.remove(); return; }
      const rep = `https://github.com/Simmonsstummer/strata/issues/new?title=${encodeURIComponent('Foto: ' + key)}&body=${encodeURIComponent(p.file + '\n' + p.page)}`;
      el.innerHTML = fig(p, ` · <a href="${rep}" target="_blank" rel="noopener">${t('photo.wrong')}</a>`); el.classList.add('ready');
      const img = $('img', el); img.onerror = () => el.remove();
    });
  }

  /* review page (#foto): the candidates for every subject, to pin the right ones and block the wrong ones */
  async function review(root) {
    const cfg = P(), keys = Object.keys(cfg.q), pick = store.get('photo-pick', {});
    root.innerHTML = `<button class="back-link">← ${t('back')}</button><h1 style="margin:0 0 6px">${t('rev.title')}</h1><p class="muted" style="max-width:760px">${t('rev.sub')}</p>
      <div class="btns" style="margin-bottom:18px"><button class="btn primary" id="rev-copy">${t('rev.copy')}</button><span class="muted" id="rev-n" style="align-self:center"></span></div><div id="rev-list"></div>`;
    $('.back-link', root).onclick = () => App.game.hub();
    const list = $('#rev-list', root), count = () => { $('#rev-n', root).textContent = t('rev.n', Object.keys(pick).length, keys.length); };
    count();
    $('#rev-copy', root).onclick = () => {
      const pin = Object.entries(pick).filter(([, v]) => v !== '-').map(([k, v]) => `    '${k}': '${v.replace(/'/g, "\\'")}',`).join('\n');
      const none = Object.entries(pick).filter(([, v]) => v === '-').map(([k]) => `'${k}'`).join(', ');
      const txt = `PIN = {\n${pin}\n}\nNONE = {${none}}`;
      try { navigator.clipboard.writeText(txt).then(() => toast(t('rev.copied')), () => prompt('PIN', txt)); } catch (e) { prompt('PIN', txt); }
    };
    for (const k of keys) {
      const box = document.createElement('div'); box.className = 'rev'; list.appendChild(box);
      box.innerHTML = `<h3>${esc(k)} <small class="muted">${esc(cfg.q[k].join(' · '))}</small></h3><div class="rev-grid">…</div>`;
      let all = [];
      try { for (const q of cfg.q[k]) all.push(...await candidates(q, 10)); } catch (e) { $('.rev-grid', box).textContent = t('rev.err'); continue; }
      const seen = new Set(); all = all.filter(p => !seen.has(p.file) && seen.add(p.file)).slice(0, 8);
      const g = $('.rev-grid', box);
      g.innerHTML = all.map((p, i) => `<figure class="photo${pick[k] === p.file ? ' on' : ''}" data-i="${i}">${fig(p)}<button class="btn">${t('rev.pick')}</button></figure>`).join('')
        + `<button class="btn rev-none${pick[k] === '-' ? ' on' : ''}">${t('rev.none')}</button>`;
      if (!all.length) g.insertAdjacentHTML('afterbegin', `<p class="muted">${t('rev.empty')}</p>`);
      $$('figure', g).forEach(f => { $('button', f).onclick = () => { pick[k] = all[+f.dataset.i].file; store.set('photo-pick', pick); $$('figure,.rev-none', g).forEach(x => x.classList.remove('on')); f.classList.add('on'); count(); }; $('img', f).onerror = () => f.remove(); });
      $('.rev-none', g).onclick = e => { pick[k] = '-'; store.set('photo-pick', pick); $$('figure', g).forEach(x => x.classList.remove('on')); e.target.classList.add('on'); count(); };
    }
  }
  return { get, fill, review };
})();

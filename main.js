/* Strata — startup, views, search, theme, language */
'use strict';
(async function main() {
  const theme = store.get('theme', matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
  $('#theme-btn').onclick = () => { const th = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = th; store.set('theme', th); App.col.redraw(); };

  App.lang = store.get('lang', /^it\b/i.test(navigator.language || '') ? 'it' : 'en');
  App.names = store.get('names', 'rock'); App.showSchool = store.get('school', false); App.scale = store.get('scale', 'chart'); App.showEvents = store.get('events', true);
  applyStatic();

  let data;
  try { data = await (await fetch('data/strata.json')).json(); }
  catch (err) { document.body.insertAdjacentHTML('beforeend', `<p style="position:fixed;inset:45% 0 auto;text-align:center;padding:0 20px">${t('err.data')}</p>`); return; }
  indexData(data); App.countries = data.countries; App.school = data.school;
  App.img = {}; fetch('data/images.json').then(r => r.ok ? r.json() : {}).then(j => { App.img = j || {}; App.panel.rerender(); }).catch(() => { });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });

  App.view = 'column';
  App.setView = v => {
    $$('.view').forEach(s => s.classList.toggle('active', s.id === 'view-' + v));
    $$('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === v));
    App.view = v;
    if (v === 'map') App.map.show();
    if (v === 'column') App.col.layout();
  };
  $$('.view-btn').forEach(b => b.onclick = () => { App.game.stopAll(); App.setView(b.dataset.view); if (b.dataset.view === 'play') App.game.hub(); });

  /* select a unit: highlight it in the column and open its card */
  App.openEvent = e => { if (!e) return; App.panel.openEvent(e); try { history.replaceState(null, '', '#' + e.id); } catch (x) { } };
  App.openSchool = x => { App.col.select(x); App.panel.openSchool(x); };
  App.select = (u, fly, tab) => {
    if (!u) return;
    if (App.view === 'play') App.setView('column');
    App.col.select(u, fly && App.view === 'column');
    App.panel.open(u, tab || 'info');
    try { history.replaceState(null, '', '#' + u.id.toLowerCase()); } catch (e) { }
  };

  App.updateSide = () => App.col.setSide($('#panel').classList.contains('open') ? 460 : !$('#helper').hidden ? 400 : 0);
  App.col.init(); App.panel.init(); App.map.init(); App.game.hub();

  /* dock: scale, names, events, help */
  const segs = () => {
    $$('#scale-seg button').forEach(b => b.classList.toggle('active', b.dataset.scale === App.scale));
    $$('#names-seg button').forEach(b => b.classList.toggle('active', b.dataset.names === App.names));
    $('#events-btn').classList.toggle('on', App.showEvents);
    $('#school-btn').classList.toggle('on', App.showSchool);
  };
  $('#school-btn').onclick = () => { App.showSchool = !App.showSchool; store.set('school', App.showSchool); segs(); App.col.layout(); if (App.showSchool) toast(t('school.toast'), 3200); };
  $('#print-btn').onclick = e => App.print.menu(e.currentTarget);
  $$('#scale-seg button').forEach(b => b.onclick = () => { App.col.setScale(b.dataset.scale); store.set('scale', App.scale); segs(); toast(t('scale.toast.' + App.scale), 2600); });
  $$('#names-seg button').forEach(b => b.onclick = () => { App.names = b.dataset.names; store.set('names', App.names); segs(); App.col.redraw(); App.panel.rerender(); App.map.relang(); helper(); });
  $('#events-btn').onclick = () => { App.showEvents = !App.showEvents; store.set('events', App.showEvents); segs(); App.col.redraw(); };
  segs();
  let helpOn = store.get('help', true);
  function helper() {
    const el = $('#helper'); $('#help-btn').classList.toggle('on', helpOn); el.hidden = !helpOn; App.updateSide(); if (!helpOn) return;
    const R = t('rank.rock'), T = t('rank.time');
    el.innerHTML = `<div class="hp-head"><span class="hp-lab">${t('help.lab')}</span><button class="icon-btn small" id="hp-x">✕</button></div>
      <h3>${t('help.title')}</h3><p>${t('help.p1')}</p><p>${t('help.p2')}</p>
      <div class="hp-box"><b>${t('help.ranks')}</b><table class="ranks"><tr><td></td><td><b>${t('names.rock')}</b></td><td><b>${t('names.time')}</b></td></tr>${'ERPCA'.split('').map(r => `<tr><td>${'▮'.repeat('ERPCA'.indexOf(r) + 1)}</td><td>${R[r]}</td><td>${T[r]}</td></tr>`).join('')}</table><p class="note">${t('help.ranksNote')}</p></div>
      <div class="hp-box"><b>${t('help.spike')}</b><p>${t('help.spikeTxt')}</p></div>
      <div class="hp-box"><b>${t('help.scales')}</b><p>${t('help.scalesTxt')}</p></div>
      <div class="hp-box kid"><b>${t('help.kid')}</b><p>${t('help.kidTxt')}</p></div>
      <p class="note">${t('help.src', App.version.replace('-', '/'))}</p>`;
    $('#hp-x').onclick = () => { helpOn = false; store.set('help', false); helper(); };
  }
  $('#help-btn').onclick = () => { helpOn = !helpOn; store.set('help', helpOn); helper(); };
  if (innerWidth < 820 && store.get('help', null) === null) helpOn = false;
  helper();

  /* language */
  $('#lang-btn').onclick = () => {
    App.lang = App.lang === 'it' ? 'en' : 'it'; store.set('lang', App.lang);
    applyStatic(); App.col.redraw(); App.panel.rerender(); App.map.relang(); App.game.relang(); helper();
  };

  /* search (both languages, codes) */
  const inp = $('#search'), res = $('#search-results'); let hits = [], hi = 0;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function find(q) {
    q = norm(q.trim()); if (!q) return [];
    return App.U.map(u => {
      const names = [u.n.it, u.n.en, u.nt && u.nt.it, u.nt && u.nt.en].filter(Boolean).map(norm);
      let sc = 0;
      if (names.some(n => n === q)) sc = 100; else if (names.some(n => n.startsWith(q))) sc = 70; else if (names.some(n => n.split(/\s+/).some(w => w.startsWith(q)))) sc = 55;
      else if (names.some(n => n.includes(q))) sc = 40; else if (u.code.toLowerCase() === q) sc = 35;
      else if (u.g && u.g.loc && norm(tx(u.g.loc)).includes(q) && q.length > 2) sc = 25;
      return [sc - rankIdx(u.r) * .1, u];
    }).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 8).map(x => x[1]);
  }
  function renderHits() {
    res.innerHTML = hits.map((u, i) => `<div class="sr-item${i === hi ? ' hl' : ''}" data-id="${u.id}"><span class="sw" style="--c:${u.c}"></span><span>${esc(nm(u))}<br><span class="muted" style="font-size:12px">${esc(rankName(u))}${u.g && u.g.lat != null && u.g.st === 'r' ? ' · ▸ ' + esc(tx(u.g.loc)).slice(0, 34) : ''}</span></span><span class="sr-r">${fmtAge(u.a, true)}<br>Ma</span></div>`).join('');
    res.classList.toggle('open', hits.length > 0);
    $$('.sr-item', res).forEach(it => it.onpointerdown = ev => { ev.preventDefault(); go(App.by[it.dataset.id]); });
  }
  function go(u) {
    inp.value = ''; hits = []; renderHits(); inp.blur();
    if (App.view !== 'column') { App.game.stopAll(); App.setView('column'); }
    App.select(u, true);
  }
  inp.addEventListener('input', () => { hits = find(inp.value); hi = 0; renderHits(); });
  inp.addEventListener('keydown', ev => {
    if (ev.key === 'ArrowDown') { hi = Math.min(hits.length - 1, hi + 1); renderHits(); ev.preventDefault(); }
    if (ev.key === 'ArrowUp') { hi = Math.max(0, hi - 1); renderHits(); ev.preventDefault(); }
    if (ev.key === 'Enter' && hits[hi]) go(hits[hi]);
    if (ev.key === 'Escape') { inp.value = ''; hits = []; renderHits(); inp.blur(); }
  });
  inp.addEventListener('blur', () => setTimeout(() => res.classList.remove('open'), 150));
  addEventListener('keydown', ev => { if (ev.key === '/' && document.activeElement !== inp) { ev.preventDefault(); inp.focus(); } });

  /* direct links: #jurassic opens a unit (any id, case-insensitive); #map/#mappa, #play/#gioca open a view */
  const VIEWS = { colonna: 'column', column: 'column', mappa: 'map', map: 'map', gioca: 'play', play: 'play' };
  const byLower = {}; App.U.forEach(u => byLower[u.id.toLowerCase()] = u);
  const fromHash = () => {
    const s = decodeURIComponent(location.hash.slice(1)).toLowerCase(), u = byLower[s], ev = App.ev.find(e => e.id === s);
    if (ev && !u) { App.setView('column'); setTimeout(() => App.openEvent(ev), 60); }
    else if (u) { App.setView('column'); setTimeout(() => App.select(u, true), 60); }
    else if (VIEWS[s]) { App.setView(VIEWS[s]); if (VIEWS[s] === 'play') App.game.hub(); }
  };
  addEventListener('hashchange', fromHash); fromHash();
  if (matchMedia('(pointer: coarse)').matches && !store.get('hinted')) setTimeout(() => { if (App.view === 'column') { toast(t('hint.touch'), 3800); store.set('hinted', 1); } }, 900);

  function applyStatic() {
    document.documentElement.lang = App.lang;
    $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
    $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
    $('#lang-btn').textContent = App.lang === 'it' ? 'EN' : 'IT';
    const R = 'https://github.com/Simmonsstummer/strata', A = (u, x) => `<a href="${u}" target="_blank" rel="noopener">${x}</a>`;
    $('#foot').innerHTML = `<span class="long">Strata · ${t('foot.open')}</span><span class="sep long">·</span>`
      + `<span>${t('foot.code')} ${A(R + '/blob/main/LICENSE', 'MIT')}</span><span class="sep">·</span>`
      + `<span>${t('foot.texts')} ${A(R + '/blob/main/LICENSE-CONTENT.md', 'CC BY 4.0')}</span><span class="sep">·</span>`
      + `<span>${A('https://stratigraphy.org/chart', `<span class="long">${t('foot.data')}</span><span class="short">ICS</span>`)}</span><span class="sep">·</span>`
      + `<span>${A(R + '/blob/main/CREDITS.md', t('foot.credits'))}</span><span class="sep">·</span>`
      + `<a class="gh" href="${R}" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg><span class="long">${t('foot.repo')}</span><span class="short">GitHub</span></a>`;
    document.title = 'Strata — ' + t('subtitle');
  }
})();

/* Strata — detail panel: overview and boundary (golden spike) of a unit */
'use strict';
App.panel = (() => {
  const P = $('#panel'), body = $('#panel-body'), tabs = $('#panel-tabs');
  let cur = null, tab = 'info', mode = 'unit';

  function open(u, tb) {
    cur = u; mode = 'unit'; if (tb) tab = tb; if (tab === 'gssp' && !hasBoundary(u)) tab = 'info';
    P.classList.add('open'); P.setAttribute('aria-hidden', 'false'); render(); App.updateSide && App.updateSide();
  }
  function close() { P.classList.remove('open', 'full'); P.setAttribute('aria-hidden', 'true'); cur = null; App.updateSide && App.updateSide(); }
  const hasBoundary = u => !!(baseDef(u) || u.base);
  function rerender() { if (cur) render(); }

  function openEvent(e) { cur = e; mode = 'ev'; P.classList.add('open'); P.setAttribute('aria-hidden', 'false'); render(); body.scrollTop = 0; App.updateSide && App.updateSide(); }
  function openSchool(x) { cur = x; mode = 'school'; P.classList.add('open'); P.setAttribute('aria-hidden', 'false'); render(); body.scrollTop = 0; App.updateSide && App.updateSide(); }
  function render() {
    if (mode === 'ev') return renderEvent(cur);
    if (mode === 'school') return renderSchool(cur);
    const u = cur, ch = chain(u).slice(0, -1).filter(x => x.r !== 'S');
    $('#panel-title').innerHTML = ch.length ? `<span class="crumbline">${ch.map(x => `<span class="crumb" data-id="${x.id}" style="--c:${x.c}"><i></i>${esc(nm(x))}</span>`).join('')}</span>` : esc(rankName(u));
    $$('#panel-title .crumb').forEach(c => c.onclick = () => App.select(App.by[c.dataset.id], true));
    const T = [['info', t('tab.info')]];
    if (hasBoundary(u)) T.push(['gssp', `<span class="spk">▸</span> ${t('tab.gssp')}`]);
    tabs.innerHTML = T.map(([k, l]) => `<button class="ptab${k === tab ? ' active' : ''}" data-t="${k}">${l}</button>`).join('');
    $$('.ptab', tabs).forEach(b => b.onclick = () => { tab = b.dataset.t; render(); body.scrollTop = 0; });
    (tab === 'gssp' ? renderGssp : renderInfo)(u);
    links();
  }
  function links() {
    $$('[data-go]', body).forEach(b => b.onclick = () => App.select(App.by[b.dataset.go], true));
    $$('[data-ev]', body).forEach(b => b.onclick = () => App.openEvent(App.ev.find(e => e.id === b.dataset.ev)));
  }

  function photo(key) {
    const p = App.img && App.img[key]; if (!p) return '';
    return `<figure class="photo"><img src="img/${p.f}" loading="lazy" alt="${esc(p.d || '')}" width="${p.w}" height="${p.h}"><figcaption>${t('photo.by')} ${esc(p.a)} · <a href="${esc(p.lu)}" target="_blank" rel="noopener">${esc(p.l)}</a> · <a href="${esc(p.p)}" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption></figure>`;
  }
  const yrOf = g => typeof g.yr === 'object' ? tx(g.yr) : g.yr;
  const kidBtn = (x, extra = '') => `<button class="kid" data-go="${x.id}" style="--c:${x.c}"><i></i><span>${esc(nm(x))}</span><small>${extra || fmtAge(x.a, true) + ' – ' + fmtAge(x.b, true)}</small></button>`;
  const card = (title, html, cls = '') => html ? `<div class="card ${cls}"><h3>${title}</h3><p>${html}</p></div>` : '';

  function renderInfo(u) {
    const other = nmOther(u), alt2 = u.nt ? (App.names === 'time' ? u.n : u.nt)[App.lang] : null;
    const par = App.by[u.p];
    let h = `<div class="hero"><div class="hero-sw" style="--c:${u.c};--ink:${ink(u.c)}"><b>${esc(u.code.toUpperCase())}</b><span>${u.c}</span></div>
      <div><h1>${esc(nm(u))}</h1><div class="alt">${esc(other)}${alt2 ? ' · ' + esc(alt2) : ''}</div>
      <div class="chips"><span class="chip">${esc(rankName(u))}</span>${u.base === 'gssp' ? `<span class="chip gold">▸ ${t('chip.gssp')}</span>` : u.base === 'gssa' ? `<span class="chip">◷ ${t('chip.gssa')}</span>` : ''}</div></div></div>`;
    h += photo('u:' + u.id);
    h += `<div class="kv">
      <div><span>${t('k.start')}</span><b>${fmtAgeU(u, 'a')}</b></div>
      <div><span>${t('k.end')}</span><b>${u.b ? fmtAgeU(u, 'b') : t('present')}</b></div>
      <div><span>${t('k.dur')}</span><b>${fmtDur(u.a - u.b)}</b></div>
      <div><span>${t('k.cal')}</span><b style="font-size:13px">${calendar(u.a)}</b><small>${t('k.calNote')}</small></div></div>`;
    if (par) {
      const L = par.a - par.b, l = (par.a - u.a) / L * 100, w = (u.a - u.b) / L * 100;
      h += `<div class="sec-title">${t('in.parent', esc(nm(par)))}</div><div class="dur-bar" style="--c:${u.c}"><i style="left:${l}%;width:${w}%"></i></div>
        <div class="dur-lab"><span>${fmtAge(par.a)}</span><span>${par.b ? fmtAge(par.b) : t('present')}</span></div>`;
    }
    const tt = u.txt ? tx(u.txt) : '';
    h += card(t('c.ety'), esc(tx(u.ety)));
    h += card(t('c.txt'), esc(tt), 'fun');
    h += card(t('c.why'), esc(tx(u.why)));
    h += card(t('c.ita'), esc(tx(u.ita)), 'ita');
    const d = baseDef(u);
    if (d && !u.why) {
      const g = d.g, st = { r: t('st.r', yrOf(g)), c: t('st.c'), n: t('st.n'), a: t('st.a', yrOf(g)) }[g.st];
      h += `<div class="card"><h3>${t('c.base')}</h3><p>${st}${g.loc && g.st !== 'n' ? ' — ' + esc(tx(g.loc)) : ''}. <button class="link" data-tab="gssp">${t('more')} →</button></p></div>`;
    }
    const evs = App.ev.filter(e => e.a <= u.a && e.a >= u.b);
    if (evs.length) h += `<div class="card"><h3>${t('c.events')}</h3><ul class="evlist">${evs.map(e => `<li data-ev="${e.id}"><em>${e.e}</em><span>${esc(tx(e.n))}</span><small>${fmtAge(e.a)}</small></li>`).join('')}</ul></div>`;
    if (u.kids.length) h += `<div class="sec-title">${t('kids', esc(rankName(u.kids[0])), u.kids.length)}</div><div class="kids">${u.kids.map(x => kidBtn(x)).join('')}</div>`;
    const same = App.U.filter(x => x.r === u.r), up = same.find(x => x.a === u.b), down = same.find(x => x.b === u.a);
    if (up || down) h += `<div class="sec-title">${t('neigh')}</div><div class="nb">${up ? kidBtn(up, '↑ ' + t('younger')) : '<span></span>'}${down ? kidBtn(down, '↓ ' + t('older')) : '<span></span>'}</div>`;
    h += `<p class="note">${t('colorNote', u.c)}${u.chg ? '<br>' + u.chg.map(c => esc(c.replace(/^(\d{4})-(\d\d):/, (m, y, mo) => t('changed', y + '/' + mo)))).join('<br>') : ''}</p>`;
    body.innerHTML = h + report(u);
    const lk = $('[data-tab]', body); if (lk) lk.onclick = () => { tab = 'gssp'; render(); body.scrollTop = 0; };
  }

  function miniMap(lat, lon) {
    const x = lon + 180, y = 90 - lat, w = 64, hh = 30;
    return `<svg class="minimap" viewBox="${x - w / 2} ${y - hh / 2} ${w} ${hh}" preserveAspectRatio="xMidYMid slice">
      <use href="#wl-land" class="land"/><use href="#wl-brd" class="brd"/>
      <circle cx="${x}" cy="${y}" r="1.6" fill="${'var(--gold)'}" fill-opacity=".25"/><circle cx="${x}" cy="${y}" r=".75" fill="var(--gold)" stroke="#000" stroke-width=".18"/></svg>`;
  }
  function renderGssp(u) {
    const d = baseDef(u);
    let h = '';
    if (!d) {         // chronometric boundary without its own text
      h += `<div class="card"><h3>${t('c.boundary')}</h3><p><span class="status a">◷ ${t('st.a', '1990')}</span></p><p style="margin-top:10px">${t('gssa.chrono', fmtAge(u.a))}</p></div>`;
      body.innerHTML = h + explain(); return;
    }
    const g = d.g, cls = g.st === 'a' ? 'a' : g.st;
    if (d !== u) h += `<p class="note" style="margin:0 0 10px">${t('sameBase', esc(nm(u)), `<button class="link" data-go="${d.id}">${esc(nm(d))}</button>`, esc(rankName(d).toLowerCase()))}</p>`;
    const icon = { r: '▸', c: '◌', n: '…', a: '◷' }[g.st];
    h += `<div class="card"><h3>${t('c.boundaryOf', esc(nm(d)))} · ${fmtAgeU(d, 'a')}</h3>
      <p><span class="status ${cls}">${icon} ${{ r: t('st.r', yrOf(g)), c: t('st.c'), n: t('st.n'), a: t('st.a', yrOf(g)) }[g.st]}</span></p>
      <p style="margin-top:10px;font-weight:600">${esc(tx(g.loc))}</p>`;
    if (g.lat != null) {
      h += miniMap(g.lat, g.lon) + `<p class="note mono">${fmtN(Math.abs(g.lat), 4)}° ${g.lat >= 0 ? 'N' : 'S'}, ${fmtN(Math.abs(g.lon), 4)}° ${g.lon >= 0 ? 'E' : 'W'}</p>
        <div class="btns"><button class="btn" id="g-map">🗺 ${t('g.showMap')}</button><a class="btn" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${g.lat}&mlon=${g.lon}#map=13/${g.lat}/${g.lon}">OpenStreetMap ↗</a></div>`;
    }
    h += `</div>`;
    h += photo('g:' + d.id);
    h += card(g.st === 'r' || g.st === 'a' ? t('c.marker') : t('c.markerProp'), esc(tx(g.mk)));
    if (tx(g.rk) && tx(g.rk) !== '—') h += card(t('c.rocks'), esc(tx(g.rk)), 'fun');
    h += card(t('c.note'), esc(tx(g.note)));
    if (g.vis) h += `<div class="card ita"><h3>${t('c.visit')}</h3><p>${esc(tx(g.vis))}</p><p class="note">${t('visit.note')}</p></div>`;
    if (g.ref && g.ref !== '—') h += `<p class="note">${t('ref')}: ${esc(g.ref)} · <a href="https://stratigraphy.org/gssps/" target="_blank" rel="noopener">stratigraphy.org/gssps</a></p>`;
    body.innerHTML = h + explain() + report(u);
    const b = $('#g-map'); if (b) b.onclick = () => { App.setView('map'); App.map.focus(d); };
  }
  const report = u => { const q = encodeURIComponent; return `<p class="note" style="margin-top:18px"><a href="https://github.com/Simmonsstummer/strata/issues/new?title=${q(u.n.en + ': ')}&body=${q(t('report.body', u.n.en + ' (' + u.id + ')', App.version))}" target="_blank" rel="noopener">⚑ ${t('report')}</a></p>`; };
  const explain = () => `<div class="card"><h3>${t('what.gssp')}</h3><p style="font-size:13.5px">${t('what.gsspTxt')}</p></div>`;

  function renderEvent(e) {
    $('#panel-title').innerHTML = `<span class="crumbline">${pathAt(e.a).filter(x => x.r !== 'S').map(x => `<span class="crumb" data-id="${x.id}" style="--c:${x.c}"><i></i>${esc(nm(x))}</span>`).join('')}</span>`;
    $$('#panel-title .crumb').forEach(c => c.onclick = () => App.select(App.by[c.dataset.id], true));
    tabs.innerHTML = `<button class="ptab active">${t('tab.event')}</button>`;
    const i = App.ev.indexOf(e), older = App.ev[i - 1], younger = App.ev[i + 1];
    let h = `<div class="hero"><div class="hero-ev">${e.e}</div><div><h1>${esc(tx(e.n))}</h1><div class="alt">${fmtYearsAgo(e.a)}</div>
      <div class="chips"><span class="chip">${t('kind.' + e.k)}</span><span class="chip">${t('k.cal')}: ${calendar(e.a)}</span></div></div></div>`;
    h += photo('e:' + e.id);
    h += card(t('c.story'), esc(tx(e.txt)), 'fun');
    if (e.see.length) h += `<div class="card ita"><h3>${t('c.see')}</h3><ul class="res">${e.see.map(x => `<li><a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(tx(x.n))}</a></li>`).join('')}</ul></div>`;
    if (e.read.length) h += `<div class="card"><h3>${t('c.read')}</h3><ul class="res">${e.read.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    if (e.web.length) h += `<div class="card"><h3>${t('c.web')}</h3><ul class="res">${e.web.map(x => `<li><a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.l)}</a></li>`).join('')}</ul></div>`;
    if (e.el.length) h += `<div class="card"><h3>${t('c.elementa')}</h3><p style="font-size:13.5px">${t('elementa.txt')}</p><div class="chips" style="margin-top:8px">${e.el.map(s => `<a class="el-chip" href="https://simmonsstummer.github.io/elementa/#${s}" target="_blank" rel="noopener">${s[0].toUpperCase() + s.slice(1)}</a>`).join('')}</div></div>`;
    h += `<div class="btns"><button class="btn" id="ev-show">↧ ${t('ev.show')}</button></div>`;
    h += `<div class="sec-title">${t('neigh')}</div><div class="nb">${younger ? `<button class="kid" data-ev="${younger.id}"><span style="font-size:16px">${younger.e}</span><span>${esc(tx(younger.n))}</span><small>↑</small></button>` : '<span></span>'}${older ? `<button class="kid" data-ev="${older.id}"><span style="font-size:16px">${older.e}</span><span>${esc(tx(older.n))}</span><small>↓</small></button>` : '<span></span>'}</div>`;
    h += `<p class="note" style="margin-top:14px">${t('ev.note')}</p>`;
    body.innerHTML = h; links();
    $('#ev-show').onclick = () => { if (App.view !== 'column') App.setView('column'); App.col.flyToAge(e.a, Math.max(e.a * .5, .004)); App.col.setMarks([{ age: e.a, color: '#2fae66', label: `${e.e} ${fmtAge(e.a)}` }]); setTimeout(() => App.col.setMarks([]), 4000); };
  }
  function renderSchool(x) {
    $('#panel-title').textContent = t('school.title');
    tabs.innerHTML = `<button class="ptab active">${t('school.tab')}</button>`;
    let h = `<div class="hero"><div class="hero-sw" style="--c:${x.c};--ink:#1a1a1a;opacity:.85"><b>🎒</b></div><div><h1>${esc(tx(x.n))}</h1><div class="alt">${fmtAge(x.a)} – ${x.b ? fmtAge(x.b) : t('present')}</div>
      <div class="chips"><span class="chip">${t('school.chip')}</span></div></div></div>`;
    h += `<div class="kv"><div><span>${t('k.dur')}</span><b>${fmtDur(x.a - x.b)}</b></div><div><span>${t('k.cal')}</span><b style="font-size:13px">${calendar(x.a)}</b></div></div>`;
    h += card(t('school.now'), esc(tx(x.txt)), 'fun');
    h += `<div class="sec-title">${t('school.match')}</div><div class="kids">${x.u.map(id => kidBtn(App.by[id])).join('')}</div>`;
    h += `<div class="card"><h3>${t('school.why')}</h3><p style="font-size:13.5px">${t('school.whyTxt')}</p></div>`;
    body.innerHTML = h; links();
  }

  function initGrip() {
    const g = $('#panel-grip'); let y0 = null;
    g.addEventListener('pointerdown', e => { y0 = e.clientY; g.setPointerCapture(e.pointerId); });
    g.addEventListener('pointerup', e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null;
      if (dy < -30) P.classList.add('full'); else if (dy > 50) { P.classList.contains('full') ? P.classList.remove('full') : closeAll(); } else P.classList.toggle('full'); });
  }
  const closeAll = () => { close(); App.col.select(null); };
  function init() { $('#panel-close').onclick = closeAll; initGrip(); addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); }); }
  return { init, open, openEvent, openSchool, close, rerender, get cur() { return cur; } };
})();

/* Strata — world map of the golden spikes (GSSP) */
'use strict';
App.map = (() => {
  const vp = $('#map-vp'), svg = $('#map-svg'), NS = 'http://www.w3.org/2000/svg';
  let W = 0, H = 0, v = { x: 180, y: 75, w: 360 }, pins = [], gPins, filt = new Set(), hl = null, anim = null;
  const ERAS = ['Cenozoic', 'Mesozoic', 'Paleozoic', 'Precambrian'];
  const P = (lat, lon) => [lon + 180, 90 - lat];
  const eraOf = u => chain(u).find(x => ERAS.includes(x.id)) || App.by.Precambrian;

  function build() {
    // shared shapes, also used by the mini maps in the panel
    document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <path id="wl-land" d="${WORLD.land}"/><path id="wl-brd" d="${WORLD.borders}"/></defs></svg>`);
    let grat = '';
    for (let x = 0; x <= 360; x += 30) grat += `M${x},0V180`;
    for (let y = 0; y <= 180; y += 30) grat += `M0,${y}H360`;
    svg.innerHTML = `<path class="grat" d="${grat}"/><use href="#wl-land" class="land"/><use href="#wl-brd" class="brd"/><g id="map-extra"></g><g id="map-pins"></g>`;
    gPins = $('#map-pins', svg);
    // group stages sharing (almost) the same place
    const withG = App.U.filter(u => u.g && u.g.lat != null).sort((a, b) => a.a - b.a);
    for (const u of withG) {
      const p = pins.find(q => Math.abs(q.lat - u.g.lat) < .02 && Math.abs(q.lon - u.g.lon) < .02);
      if (p) p.units.push(u); else pins.push({ lat: u.g.lat, lon: u.g.lon, units: [u] });
    }
    pins.forEach(p => {
      const [x, y] = P(p.lat, p.lon), u = p.units[0], cand = p.units.every(q => q.g.st !== 'r' && q.g.st !== 'a');
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'pin'); p.el = g; p.x = x; p.y = y; p.era = eraOf(u).id;
      g.innerHTML = `<circle cx="${x}" cy="${y}" fill="${u.c}" ${cand ? 'stroke-dasharray="2 2"' : ''}/><text x="${x}" y="${y}"></text>`;
      g.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') tip(p, e); });
      g.addEventListener('pointerleave', () => $('#map-tip').hidden = true);
      g.addEventListener('click', e => { e.stopPropagation(); if (App.map.onPick) return; App.select(p.units[0], false, 'gssp'); highlight(p); });
      gPins.appendChild(g);
    });
    legend();
  }
  function legend() {
    $('#map-legend').innerHTML = ERAS.map(id => `<button class="lg-chip${filt.size && !filt.has(id) ? ' off' : filt.has(id) ? ' on' : ''}" data-e="${id}" style="--c:${App.by[id].c}"><i></i>${esc(nm(App.by[id]))}</button>`).join('');
    $$('#map-legend .lg-chip').forEach(b => b.onclick = () => { const e = b.dataset.e; filt.has(e) ? filt.delete(e) : filt.add(e); legend(); render(); });
    const rat = App.U.filter(u => u.g && u.g.st === 'r' && u.g.lat != null), cc = new Set(rat.map(u => u.g.cc)), it = rat.filter(u => u.g.cc === 'it').length;
    $('#map-stat').innerHTML = t('map.stat', rat.length, cc.size, it);
  }
  function tip(p, e) {
    const el = $('#map-tip'), r = vp.getBoundingClientRect();
    el.innerHTML = p.units.map(u => `<div class="row"><span class="sw" style="--c:${u.c};width:14px;height:14px;border-radius:4px"></span><b>${esc(nm(u))}</b><span class="muted mono" style="font-size:11px">${fmtAgeU(u, 'a')}</span></div>`).join('')
      + `<div class="muted">${esc(tx(p.units[0].g.loc))}</div>`;
    el.hidden = false;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.left = Math.min(x + 14, W - 300) + 'px'; el.style.top = Math.min(y + 14, H - el.offsetHeight - 10) + 'px';
  }
  function highlight(p) { if (hl) hl.el.classList.remove('hl'); hl = p; if (p) p.el.classList.add('hl'); }

  /* ---------- view ---------- */
  const hh = () => v.w * H / W;
  function clampV() { v.w = clamp(v.w, 4, 400); v.x = clamp(v.x, 0, 360); v.y = clamp(v.y, 0, 180); }
  function render() {
    if (!W) return;
    const h = hh(); svg.setAttribute('viewBox', `${v.x - v.w / 2} ${v.y - h / 2} ${v.w} ${h}`);
    const s = v.w / W, r = 6.5 * s, showLab = v.w < 140, placed = [], x0 = v.x - v.w / 2, y0 = v.y - h / 2;
    $$('use', svg).forEach(el => el.style.strokeWidth = (el.classList.contains('brd') ? .7 : .4) * s);
    pins.forEach(p => {
      const vis = !filt.size || filt.has(p.era);
      p.el.style.display = vis ? '' : 'none';
      const c = p.el.firstChild, tx_ = p.el.lastChild;
      c.setAttribute('r', (p === hl ? 1.5 : 1) * r * (p.units.length > 1 ? 1.15 : 1)); c.setAttribute('stroke-width', 2.2);
      let lab = '';
      if (showLab && vis) {
        lab = p.units.map(u => nm(u)).join(' · ');
        const sx = (p.x - x0) / s, syy = (p.y - y0) / s, rc = [sx + 9, syy - 8, sx + 13 + lab.length * 6.6, syy + 8];
        if (placed.some(q => rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1])) lab = ''; else placed.push(rc);
      }
      if (lab) { tx_.setAttribute('x', p.x + r * 1.5); tx_.setAttribute('y', p.y + r * .55); tx_.setAttribute('font-size', 12 * s); tx_.setAttribute('stroke-width', 3 * s); }
      tx_.textContent = lab;
    });
    extra();
  }
  function size() { const r = vp.getBoundingClientRect(); W = r.width; H = r.height; render(); }
  function fit() { goTo({ x: 180, y: 75, w: Math.max(360, 150 * W / H) }); }
  function goTo(t, ms = 650) {
    const from = { ...v }, t0 = performance.now(); cancelAnimationFrame(anim);
    const step = now => { const p = clamp((now - t0) / ms, 0, 1), e = ease(p);
      v.x = lerp(from.x, t.x, e); v.y = lerp(from.y, t.y, e); v.w = Math.exp(lerp(Math.log(from.w), Math.log(t.w), e)); render();
      if (p < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  function focus(u) {
    const g = u.g; if (!g || g.lat == null) return;
    const [x, y] = P(g.lat, g.lon); requestAnimationFrame(() => { size(); goTo({ x, y, w: 24 }); highlight(pins.find(p => p.units.includes(u))); });
  }
  const toMap = (cx, cy) => [v.x - v.w / 2 + cx / W * v.w, v.y - hh() / 2 + cy / H * hh()];

  function initInput() {
    const pts = new Map(); let st = null, moved = false, pinch = null;
    vp.addEventListener('pointerdown', e => {
      if (e.target.closest('.pin') && !App.map.onPick) return;
      vp.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.offsetX, e.offsetY]); cancelAnimationFrame(anim);
      if (pts.size === 1) { st = { x: e.offsetX, y: e.offsetY, vx: v.x, vy: v.y }; moved = false; }
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), w: v.w }; moved = true; }
    });
    vp.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.offsetX, e.offsetY]);
      if (pinch && pts.size >= 2) { const [a, b] = [...pts.values()]; v.w = pinch.w * pinch.d / Math.hypot(a[0] - b[0], a[1] - b[1]); clampV(); render(); return; }
      if (!st) return; const dx = e.offsetX - st.x, dy = e.offsetY - st.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) { moved = true; vp.classList.add('dragging'); $('#map-tip').hidden = true; }
      if (moved) { v.x = st.vx - dx / W * v.w; v.y = st.vy - dy / H * hh(); clampV(); render(); }
    });
    const up = e => {
      if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId); vp.classList.remove('dragging');
      if (pts.size < 2) pinch = null;
      if (!pts.size && st && !moved && App.map.onPick) { const [x, y] = toMap(e.offsetX, e.offsetY); App.map.onPick(90 - y, x - 180); }
      if (!pts.size) st = null;
    };
    vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up);
    vp.addEventListener('wheel', e => {
      e.preventDefault(); cancelAnimationFrame(anim);
      const [mx, my] = toMap(e.offsetX, e.offsetY), f = Math.exp(e.deltaY * .0018);
      const nw = clamp(v.w * f, 4, 400), k = nw / v.w; v.x = mx + (v.x - mx) * k; v.y = my + (v.y - my) * k; v.w = nw; clampV(); render();
    }, { passive: false });
    $$('[data-mzoom]').forEach(b => b.onclick = () => { const z = b.dataset.mzoom; if (z === 'fit') fit(); else goTo({ x: v.x, y: v.y, w: clamp(v.w * (z === 'in' ? .5 : 2), 4, 400) }, 300); });
    new ResizeObserver(size).observe(vp);
  }
  /* extra drawing for the map game: guess, answer and line between them */
  let guess = null;
  function drawGuess(g, a) { guess = g ? [g, a] : null; extra(); }
  function extra() {
    const ex = $('#map-extra'); if (!guess) { ex.innerHTML = ''; return; }
    const [g, a] = guess, [gx, gy] = P(g[0], g[1]), s = v.w / W; let h = `<circle class="guess" cx="${gx}" cy="${gy}" r="${5 * s}"/>`;
    if (a) { const [ax, ay] = P(a[0], a[1]); h = `<path class="line" d="M${gx},${gy}L${ax},${ay}"/>` + h; }
    ex.innerHTML = h;
  }
  function init() { build(); initInput(); size(); v.w = Math.max(360, 150 * W / (H || 1)); render(); }
  return {
    init, focus, fit, goTo, drawGuess, highlight, show() { size(); }, relang() { legend(); render(); },
    pins: () => pins, P, onPick: null, onRender: null,
  };
})();

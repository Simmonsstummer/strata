/* Strata — the stratigraphic column: canvas drawing, zoom/pan, hit testing */
'use strict';
App.col = (() => {
  const vp = $('#col-vp'), cv = $('#col-canvas');
  let ctx, W = 0, H = 0, dpr = 1, dirty = true;
  const PAD_T = 46, PAD_B = 74;                      // room for the breadcrumb and the dock
  const COLW = [.45, .7, .9, 2, .55, 2, 2.6];        // S E R P B C A
  let colX = [], colR = 0, tickX = 0, evX = 0, evW = 0;
  let sel = null, hover = null, marks = [], flash = null;
  const view = { chart: null, linear: null };
  let anim = null, trans = null;               // fly animation, scale transition

  /* ---------- scales: age (Ma) -> world Y ---------- */
  const S = { chart: { ages: [0], ys: [0] }, linear: {} };
  function buildScales() {
    const L = App.leaves; let y = 0;
    L.forEach(u => { y += u.a > 538.8 ? 1.6 : 1; S.chart.ages.push(u.a); S.chart.ys.push(y); });
  }
  function Y(age, sc = App.scale) {
    if (sc === 'linear') return age;
    const A = S.chart.ages, Ys = S.chart.ys;
    if (age <= 0) return 0; if (age >= A[A.length - 1]) return Ys[Ys.length - 1];
    let lo = 0, hi = A.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (A[m] <= age) lo = m; else hi = m; }
    return lerp(Ys[lo], Ys[hi], (age - A[lo]) / (A[hi] - A[lo]));
  }
  function ageOfY(y, sc = App.scale) {
    if (sc === 'linear') return y;
    const A = S.chart.ages, Ys = S.chart.ys;
    if (y <= 0) return 0; if (y >= Ys[Ys.length - 1]) return A[A.length - 1];
    let lo = 0, hi = Ys.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (Ys[m] <= y) lo = m; else hi = m; }
    return lerp(A[lo], A[hi], (y - Ys[lo]) / (Ys[hi] - Ys[lo]));
  }
  const Ymax = sc => Y(4567, sc);
  const viewH = () => H - PAD_T - PAD_B;
  function fitView(sc = App.scale) { const k = viewH() / Ymax(sc); return { y0: 0, k }; }
  function kLimits(sc = App.scale) {
    const f = viewH() / Ymax(sc);
    return [f * .8, sc === 'linear' ? viewH() * .9 / 0.0042 : viewH() * .9];
  }
  const V = () => view[App.scale];
  function syWith(v, sc) { return age => PAD_T + (Y(age, sc) - v.y0) * v.k; }
  function sy(age) {
    if (trans) { const t = ease(trans.t); return lerp(trans.f0(age), trans.f1(age), t); }
    return PAD_T + (Y(age) - V().y0) * V().k;
  }
  const ageAtScreen = y => ageOfY(V().y0 + (y - PAD_T) / V().k);
  function clampView(v, sc = App.scale) {
    const [k0, k1] = kLimits(sc); v.k = clamp(v.k, k0, k1);
    const h = viewH() / v.k, m = Ymax(sc);
    v.y0 = clamp(v.y0, -h * .35, Math.max(-h * .35, m - h * .65));
    return v;
  }

  /* ---------- layout ---------- */
  function layout() {
    const r = vp.getBoundingClientRect(); W = r.width; H = r.height; dpr = devicePixelRatio || 1;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const narrow = W < 560, tickW = narrow ? 56 : 74, avail = W >= 1100 ? W - 460 : W;   // keep room for the side panel
    evW = narrow ? 30 : clamp(avail - 24 - tickW - 700, 0, 250);
    if (!narrow && evW < 150) evW = Math.min(150, Math.max(0, avail - 24 - tickW - 380));
    const wc = Math.min(700, avail - 16 - tickW - evW - 8);
    const sum = COLW.reduce((a, b) => a + b, 0); let x = narrow ? 8 : 12; colX = [];
    COLW.forEach(w => { colX.push(x); x += wc * w / sum; }); colX.push(x); colR = x;
    tickX = colR; evX = colR + tickW;
    ['chart', 'linear'].forEach(sc => { if (!view[sc]) view[sc] = fitView(sc); else clampView(view[sc], sc); });
    dirty = true;
  }
  function span(u) {
    const c0 = u.p ? rankIdx(u.r) : 0, c1 = u.kids.length ? rankIdx(u.kids[0].r) : 7;
    return [colX[c0], colX[c1]];
  }

  /* ---------- drawing ---------- */
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const FONT = { S: [12, 700], E: [12.5, 700], R: [12.5, 700], P: [14, 700], B: [11.5, 600], C: [12.5, 600], A: [12, 500] };
  function draw() {
    dirty = false; if (!W) return;
    ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const C = { text: css('--text'), muted: css('--muted'), faint: css('--faint'), line: css('--line2'), gold: css('--gold'), accent: css('--accent'), bg: css('--bg') };
    // units
    for (const u of App.U) {
      const top = sy(u.b), bot = sy(u.a);
      if (bot < -2 || top > H + 2) continue;
      const [x0, x1] = span(u);
      ctx.fillStyle = u.c; ctx.fillRect(x0, top, x1 - x0, Math.max(bot - top, .7));
    }
    // boundary lines
    ctx.strokeStyle = 'rgba(0,0,0,.38)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const u of App.U) {
      const top = sy(u.b), bot = sy(u.a); if (bot < -2 || top > H + 2 || bot - top < 2.5) continue;
      const [x0, x1] = span(u);
      ctx.moveTo(x0, Math.round(bot) + .5); ctx.lineTo(x1, Math.round(bot) + .5);
      ctx.moveTo(Math.round(x0) + .5, top); ctx.lineTo(Math.round(x0) + .5, bot);
    }
    ctx.moveTo(Math.round(colR) - .5, sy(0)); ctx.lineTo(Math.round(colR) - .5, sy(4567));
    ctx.stroke();
    // labels
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const u of App.U) {
      const top = sy(u.b), bot = sy(u.a); if (bot < 0 || top > H || bot - top < 9) continue;
      const [x0, x1] = span(u); label(u, x0, x1, top, bot);
    }
    // marks (games)
    for (const m of marks) {
      const y = sy(m.age); if (y < -10 || y > H + 10) continue;
      ctx.strokeStyle = m.color; ctx.lineWidth = 3; ctx.setLineDash(m.dash ? [6, 4] : []);
      ctx.beginPath(); ctx.moveTo(colX[0] - 4, y); ctx.lineTo(colR + 4, y); ctx.stroke(); ctx.setLineDash([]);
      if (m.label) { ctx.font = `700 12px ${css('--sans')}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; badge(m.label, colX[0] + 6, y, m.color); }
    }
    // hover / selection
    const outline = (u, col, w) => { if (!u) return; const top = sy(u.b), bot = sy(u.a), [x0, x1] = span(u); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.strokeRect(x0 + w / 2, top + w / 2, x1 - x0 - w, Math.max(bot - top - w, 1)); };
    if (hover && hover !== sel) outline(hover, C.text, 1.5);
    if (sel) { ctx.save(); ctx.shadowColor = C.accent; ctx.shadowBlur = 12; outline(sel, C.accent, 3); ctx.restore(); }
    if (flash) { const a = 1 - (performance.now() - flash.t0) / 900; if (a > 0) { ctx.globalAlpha = a; outline(flash.u, C.accent, 4); ctx.globalAlpha = 1; dirty = true; } else flash = null; }
    ticks(C);
    if (App.showEvents && evW > 0) events(C);
    App.col.onDraw && App.col.onDraw();
  }
  function badge(txt, x, y, col) {
    const w = ctx.measureText(txt).width + 14;
    ctx.fillStyle = col; roundRect(x, y - 11, w, 22, 11); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x + 7, y + .5);
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function label(u, x0, x1, top, bot) {
    const w = x1 - x0, h = bot - top, name = nm(u), sans = css('--sans');
    let [fs, fw] = FONT[u.r];
    const visTop = Math.max(top, PAD_T - 6), visBot = Math.min(bot, H - (x0 < 460 ? PAD_B - 8 : 8));
    if (visBot - visTop < 9) return;
    ctx.fillStyle = ink(u.c);
    for (const f of [1, .86]) {
      const s = fs * f; ctx.font = `${fw} ${s}px ${sans}`; const tw = ctx.measureText(name).width;
      if (tw + 10 <= w && visBot - visTop >= s + 4) {
        const sub = h > 64 && w > 96 && visBot - visTop > 50;
        let yc = clamp((top + bot) / 2, visTop + s, visBot - s - (sub ? 12 : 0));
        if (sub) yc -= 7;
        ctx.globalAlpha = .92; ctx.fillText(name, (x0 + x1) / 2, yc);
        if (sub) { ctx.font = `10.5px ${css('--mono')}`; ctx.globalAlpha = .62; ctx.fillText(`${fmtAge(u.a, true)} – ${fmtAge(u.b, true)}`, (x0 + x1) / 2, yc + 15); }
        ctx.globalAlpha = 1; return;
      }
      if (tw + 12 <= visBot - visTop && w >= s + 3) {
        const yc = clamp((top + bot) / 2, visTop + tw / 2 + 6, visBot - tw / 2 - 6);
        ctx.save(); ctx.translate((x0 + x1) / 2, yc); ctx.rotate(-Math.PI / 2); ctx.globalAlpha = .92; ctx.fillText(name, 0, 0); ctx.restore(); return;
      }
    }
    // last resort: truncated
    const s = fs * .86; ctx.font = `${fw} ${s}px ${sans}`;
    if (w >= 34 && visBot - visTop >= s + 2) {
      let n = name; if (ctx.measureText(n).width + 8 > w) { while (n.length > 2 && ctx.measureText(n + '…').width + 8 > w) n = n.slice(0, -1); n += '…'; }
      ctx.globalAlpha = .9; ctx.fillText(n, (x0 + x1) / 2, clamp((top + bot) / 2, visTop + s / 2 + 1, visBot - s / 2 - 1)); ctx.globalAlpha = 1;
    }
  }
  function spike(x, y, col) {        // a golden nail pointing at the boundary
    ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + 9, y - 2); ctx.lineTo(x + 9, y + 2); ctx.closePath(); ctx.fill();
    ctx.fillRect(x + 9, y - 4.5, 2.6, 9);
  }
  function clock(x, y) {
    ctx.strokeStyle = '#7fb7ff'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x + 6, y, 4.5, 0, 6.283); ctx.moveTo(x + 6, y); ctx.lineTo(x + 6, y - 3); ctx.moveTo(x + 6, y); ctx.lineTo(x + 8.5, y); ctx.stroke();
  }
  function ticks(C) {
    if (!App._bounds) {
      const m = new Map();
      for (const u of App.U) { const k = u.a, p = rankIdx(u.r), cur = m.get(k); if (!cur || p < cur.p) m.set(k, { age: k, p, u, base: u.base }); }
      m.set(0, { age: 0, p: 0, u: null });
      App._bounds = [...m.values()].sort((a, b) => a.p - b.p || b.age - a.age);
    }
    const placed = [], mono = css('--mono');
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (const b of App._bounds) {
      const y = sy(b.age); if (y < PAD_T - 14 || y > H - 4) continue;
      if (placed.some(p => Math.abs(p - y) < 13)) continue;
      placed.push(y);
      ctx.strokeStyle = C.faint; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tickX, y); ctx.lineTo(tickX + 4, y); ctx.stroke();
      if (b.base === 'gssp') spike(tickX + 3, y, C.gold); else if (b.base === 'gssa') clock(tickX + 2, y);
      const u = b.u, apx = u && u.apx && u.apx.includes('a');
      const s = b.age === 0 ? t('present') : (apx ? '~' : '') + fmtAge(b.age, true).replace(' ka', 'k');
      ctx.font = `${b.p <= 3 ? 600 : 400} 11px ${mono}`; ctx.fillStyle = b.p <= 3 ? C.text : C.muted;
      ctx.fillText(s, tickX + 17, y);
      if (u && u.ae && evW >= 120) { const w = ctx.measureText(s).width; ctx.font = `9.5px ${mono}`; ctx.fillStyle = C.faint; ctx.fillText('±' + fmtN(u.ae, 3), tickX + 19 + w, y + 1); }
    }
  }
  function events(C) {
    const placed = [], sans = css('--sans'), small = evW < 100;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    App._evHits = [];
    for (const e of App.ev) {
      const y = sy(e.a); if (y < PAD_T - 6 || y > H - 6) continue;
      if (placed.some(p => Math.abs(p - y) < (small ? 18 : 17))) continue;
      placed.push(y);
      ctx.strokeStyle = C.faint; ctx.globalAlpha = .55; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(colR - 10, y); ctx.lineTo(evX + 2, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.font = `14px ${sans}`; ctx.fillText(e.e, evX + 4, y + 1);
      let w = 22;
      if (!small) {
        ctx.font = `500 12px ${sans}`; ctx.fillStyle = C.text; let s = tx(e.n);
        while (s.length > 4 && ctx.measureText(s).width > evW - 30) s = s.slice(0, -2).trimEnd() + '…';
        ctx.fillText(s, evX + 26, y); w += ctx.measureText(s).width + 6;
      }
      App._evHits.push({ e, x: evX, y, w });
    }
  }

  /* ---------- crumbs (where am I) ---------- */
  let lastCrumb = '';
  function crumbs() {
    const age = clamp(ageAtScreen(PAD_T + viewH() / 2), 0, 4567), path = pathAt(age);
    const key = App.lang + App.names + path.map(u => u.id).join('/') + '|' + fmtAge(age, true);
    if (key === lastCrumb) return; lastCrumb = key;
    const el = $('#crumbs');
    el.innerHTML = path.filter(u => u.r !== 'S').map(u => `<span class="crumb" data-id="${u.id}" style="--c:${u.c}"><i></i>${esc(nm(u))}</span>`).join('')
      + `<span class="crumb age">${age < .1 ? fmtAge(age) : '≈ ' + fmtAge(age < 10 ? Math.round(age * 100) / 100 : Math.round(age))}</span>`;
    $$('.crumb[data-id]', el).forEach(c => c.onclick = () => App.select(App.by[c.dataset.id], true));
  }

  /* ---------- loop ---------- */
  function frame(now) {
    if (anim) {
      const p = clamp((now - anim.t0) / anim.ms, 0, 1), e = ease(p), v = view[anim.sc];
      v.k = Math.exp(lerp(Math.log(anim.k0), Math.log(anim.k1), e));
      const yc = lerp(anim.c0, anim.c1, e); v.y0 = yc - viewH() / 2 / v.k;
      if (p >= 1) anim = null; dirty = true;
    }
    if (trans) { trans.t = clamp((now - trans.t0) / 700, 0, 1); if (trans.t >= 1) trans = null; dirty = true; }
    if (dirty) { draw(); crumbs(); }
    requestAnimationFrame(frame);
  }
  function flyTo(u, opt = {}) {
    const sc = App.scale, v = V(), [k0, k1] = kLimits();
    const ya = Y(u.a), yb = Y(u.b), k = clamp(viewH() * (opt.fill || .62) / Math.max(ya - yb, 1e-6), k0, k1);
    const target = clampView({ k, y0: (ya + yb) / 2 - viewH() / 2 / k });
    anim = { sc, t0: performance.now(), ms: opt.ms || 700, k0: v.k, k1: target.k, c0: v.y0 + viewH() / 2 / v.k, c1: target.y0 + viewH() / 2 / target.k };
  }
  function flyToAge(age, spanMa) {
    const v = V(), [k0, k1] = kLimits(), ya = Y(age + spanMa / 2), yb = Y(Math.max(0, age - spanMa / 2));
    const k = clamp(viewH() * .7 / Math.max(ya - yb, 1e-6), k0, k1), target = clampView({ k, y0: Y(age) - viewH() / 2 / k });
    anim = { sc: App.scale, t0: performance.now(), ms: 700, k0: v.k, k1: target.k, c0: v.y0 + viewH() / 2 / v.k, c1: target.y0 + viewH() / 2 / target.k };
  }
  function zoomBy(f, cy = PAD_T + viewH() / 2) {
    const v = V(), yw = v.y0 + (cy - PAD_T) / v.k; v.k *= f; clampView(v); v.y0 = yw - (cy - PAD_T) / v.k; clampView(v); dirty = true;
  }
  function fit() { const v = V(), f = fitView(); anim = { sc: App.scale, t0: performance.now(), ms: 550, k0: v.k, k1: f.k, c0: v.y0 + viewH() / 2 / v.k, c1: f.y0 + viewH() / 2 / f.k }; }
  function setScale(sc) {
    if (sc === App.scale) return;
    const old = App.scale, vo = view[old];
    const a1 = clamp(ageOfY(vo.y0, old), 0, 4567), a2 = clamp(ageOfY(vo.y0 + viewH() / vo.k, old), 0, 4567);
    const ya = Y(a2, sc), yb = Y(a1, sc), k = (viewH()) / Math.max(ya - yb, 1e-6);
    view[sc] = clampView({ k, y0: yb }, sc);
    trans = { t: 0, t0: performance.now(), f0: syWith({ ...vo }, old), f1: syWith(view[sc], sc) };
    App.scale = sc; anim = null; dirty = true;
  }

  /* ---------- hit testing ---------- */
  function hit(x, y) {
    if (x < colX[0] || x > colR) return null;
    const age = ageAtScreen(y); if (age < 0 || age > 4567) return null;
    let c = 0; while (c < 7 && x >= colX[c + 1]) c++;
    let best = null;
    for (const u of App.U) {
      const [x0, x1] = span(u); if (x < x0 || x >= x1) continue;
      if (age <= u.a && age >= u.b) { if (!best || rankIdx(u.r) > rankIdx(best.r)) best = u; }
    }
    return best;
  }
  function hitEvent(x, y) { return (App._evHits || []).find(h => x >= h.x - 4 && x <= h.x + h.w && Math.abs(y - h.y) < 10); }

  /* ---------- input ---------- */
  function initInput() {
    const pts = new Map(); let start = null, moved = false, pinch = null;
    vp.addEventListener('pointerdown', e => {
      vp.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.offsetX, e.offsetY]);
      if (pts.size === 1) { start = { x: e.offsetX, y: e.offsetY, y0: V().y0 }; moved = false; anim = null; }
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k: V().k, cy: (a[1] + b[1]) / 2, yw: V().y0 + ((a[1] + b[1]) / 2 - PAD_T) / V().k }; moved = true; }
    });
    vp.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) {
        if (e.pointerType === 'mouse') { const u = hit(e.offsetX, e.offsetY), ev = hitEvent(e.offsetX, e.offsetY); vp.style.cursor = u || ev ? 'pointer' : ''; if (u !== hover) { hover = u; dirty = true; } }
        return;
      }
      pts.set(e.pointerId, [e.offsetX, e.offsetY]);
      if (pinch && pts.size >= 2) {
        const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), v = V();
        v.k = pinch.k * d / pinch.d; clampView(v); v.y0 = pinch.yw - (pinch.cy - PAD_T) / v.k; clampView(v); dirty = true; return;
      }
      if (!start) return;
      const dy = e.offsetY - start.y; if (Math.abs(dy) > 5 || Math.abs(e.offsetX - start.x) > 5) { moved = true; vp.classList.add('dragging'); }
      if (moved) { const v = V(); v.y0 = start.y0 - dy / v.k; clampView(v); dirty = true; }
    });
    const up = e => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId); vp.classList.remove('dragging');
      if (pts.size < 2) pinch = null;
      if (pts.size === 0 && start && !moved) click(e.offsetX, e.offsetY);
      if (pts.size === 0) start = null;
    };
    vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up);
    vp.addEventListener('pointerleave', () => { if (hover) { hover = null; dirty = true; } });
    vp.addEventListener('wheel', e => { e.preventDefault(); anim = null; if (e.ctrlKey || Math.abs(e.deltaY) > 0) zoomBy(Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0018)), e.offsetY); }, { passive: false });
    $$('[data-zoom]').forEach(b => b.onclick = () => { const z = b.dataset.zoom; if (z === 'fit') fit(); else zoomBy(z === 'in' ? 1.8 : 1 / 1.8); });
    addEventListener('keydown', e => {
      if (App.view !== 'column' || /input|select/i.test(document.activeElement.tagName)) return;
      if (e.key === '+' || e.key === '=') zoomBy(1.5); if (e.key === '-') zoomBy(1 / 1.5); if (e.key === '0') fit();
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { const v = V(); v.y0 += (e.key === 'ArrowUp' ? -1 : 1) * viewH() * .15 / v.k; clampView(v); dirty = true; e.preventDefault(); }
    });
    new ResizeObserver(layout).observe(vp);
  }
  function click(x, y) {
    const ev = hitEvent(x, y);
    if (ev && !App.col.onPick) { toast(`${ev.e.e}  ${tx(ev.e.n)} · ${fmtYearsAgo(ev.e.a)}`, 3200); return; }
    if (App.col.onPick) { const age = ageAtScreen(y); if (x >= colX[0] && x <= colR && age >= 0 && age <= 4567) App.col.onPick(age, hit(x, y)); return; }
    const u = hit(x, y); if (!u) return;
    App.select(u, true);
  }

  function init() { buildScales(); layout(); initInput(); requestAnimationFrame(frame); }
  return {
    init, flyTo, flyToAge, fit, setScale, layout,
    redraw() { dirty = true; lastCrumb = ''; },
    select(u, fly) { sel = u; if (u) { flash = { u, t0: performance.now() }; if (fly) flyTo(u); } dirty = true; },
    setMarks(m) { marks = m; dirty = true; },
    onPick: null, onDraw: null,
  };
})();

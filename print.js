/* Strata — printable chart (vector SVG, A3/A4 landscape) and printable card */
'use strict';
App.print = (() => {
  const mc = document.createElement('canvas').getContext('2d');
  const tw = (s, fs, fw = 600) => { mc.font = `${fw} 100px Inter, system-ui, sans-serif`; return mc.measureText(s).width * fs / 100; };
  const PANELS = [['Cenozoic', 0, 66], ['Mesozoic', 66, 251.902], ['Paleozoic', 251.902, 538.8], ['Precambrian', 538.8, 4567]];
  const WR = { S: .55, E: .6, R: .75, P: 1.25, B: .45, C: 1.15, A: 1.45 };
  const FS = { S: 3, E: 2.8, R: 2.8, P: 3.1, B: 2.1, C: 2.4, A: 2.3 };

  function panel(lo, hi, x0, y0, w, h) {
    const inR = u => u.b < hi && u.a > lo;
    const units = App.U.filter(u => inR(u) && (u.a <= 538.8 || lo >= 538.8 || u.r !== 'S'));
    const ranks = RANKS.split('').filter(r => units.some(u => u.r === r));
    const leaves = units.filter(u => !u.kids.some(inR)).sort((a, b) => a.b - b.b);
    const ages = [lo], ys = [0]; leaves.forEach((u, i) => { ages.push(Math.min(u.a, hi)); ys.push(i + 1); });
    const Y = a => { let k = 0; while (k < ages.length - 2 && ages[k + 1] < a) k++; return y0 + h * (ys[k] + (a - ages[k]) / (ages[k + 1] - ages[k]) * (ys[k + 1] - ys[k])) / leaves.length; };
    const ageW = 15, sum = ranks.reduce((s, r) => s + WR[r], 0), cx = []; let x = x0;
    ranks.forEach(r => { cx.push(x); x += (w - ageW) * WR[r] / sum; }); cx.push(x);
    const col = r => cx[ranks.indexOf(r)];
    let out = '';
    for (const u of units) {
      const kid = u.kids.find(inR), xa = u.p && ranks.includes(u.r) ? col(u.r) : cx[0], xb = kid ? col(kid.r) : cx[cx.length - 1];
      const ya = Y(Math.max(u.b, lo)), yb = Y(Math.min(u.a, hi)), bh = yb - ya, bw = xb - xa;
      out += `<rect x="${xa.toFixed(2)}" y="${ya.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" fill="${u.c}" stroke="#000" stroke-opacity=".45" stroke-width=".18"/>`;
      const name = nm(u); let fs = FS[u.r];
      for (const f of [1, .85, .72]) {
        const s = fs * f, l = tw(name, s);
        if (l + 1.6 <= bw && s * 1.15 <= bh) { out += `<text x="${(xa + bw / 2).toFixed(2)}" y="${(ya + bh / 2).toFixed(2)}" font-size="${s.toFixed(2)}" fill="${ink(u.c)}" text-anchor="middle" dominant-baseline="central" font-weight="${u.r === 'A' ? 500 : 700}">${esc(name)}</text>`; break; }
        if (l + 1.6 <= bh && s * 1.15 <= bw) { const cx_ = xa + bw / 2, cy = ya + bh / 2; out += `<text transform="translate(${cx_.toFixed(2)} ${cy.toFixed(2)}) rotate(-90)" font-size="${s.toFixed(2)}" fill="${ink(u.c)}" text-anchor="middle" dominant-baseline="central" font-weight="700">${esc(name)}</text>`; break; }
      }
    }
    // boundary ages
    const seen = new Set();
    for (const u of [...units].sort((a, b) => rankIdx(a.r) - rankIdx(b.r))) {
      for (const a of [u.a, u.b]) {
        if (a < lo || a > hi || seen.has(a)) continue; seen.add(a);
        const y = Y(a), owner = App.U.find(v => v.a === a && v.base), apx = owner && owner.apx && owner.apx.includes('a');
        const err = owner && owner.ae ? ` ±${fmtN(owner.ae, 3)}` : '';
        const lab = a === 0 ? t('present') : (apx ? '~' : '') + fmtAge(a, true).replace(' ka', ' ka') + err;
        if (owner && owner.base === 'gssp') out += `<path d="M${(x + .6).toFixed(2)} ${y.toFixed(2)}l2.4 -.7v1.4z" fill="#c99412"/><rect x="${(x + 3).toFixed(2)}" y="${(y - 1.2).toFixed(2)}" width=".7" height="2.4" fill="#c99412"/>`;
        else if (owner && owner.base === 'gssa') out += `<circle cx="${(x + 2).toFixed(2)}" cy="${y.toFixed(2)}" r="1.1" fill="none" stroke="#3f7fd0" stroke-width=".3"/>`;
        out += `<text x="${(x + 4.4).toFixed(2)}" y="${y.toFixed(2)}" font-size="1.9" fill="#222" dominant-baseline="central" font-family="JetBrains Mono, monospace">${lab}</text>`;
      }
    }
    return out;
  }

  function svg(fmt = 'A3') {
    const [W, H] = fmt === 'A4' ? [297, 210] : [420, 297], m = 10, gap = 5, top = 22, bottom = 14;
    const pw = (W - 2 * m - 3 * gap) / 4, ph = H - top - bottom;
    let body = '';
    PANELS.forEach(([id, lo, hi], i) => {
      const x = m + i * (pw + gap);
      body += `<text x="${x}" y="${top - 3}" font-size="3.2" font-weight="700" fill="#111">${esc(nm(App.by[id]))}</text>`;
      body += panel(lo, hi, x, top, pw, ph);
    });
    const ttl = t('print.title'), sub = t('print.sub', App.version.replace('-', '/'));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm" font-family="Inter, system-ui, sans-serif">
<rect width="${W}" height="${H}" fill="#fff"/>
<text x="${m}" y="11" font-size="6" font-weight="800" fill="#111">${esc(ttl)}</text>
<text x="${W - m}" y="11" font-size="2.4" fill="#555" text-anchor="end">${esc(t('print.legend'))}</text>
${body}
<text x="${m}" y="${H - 6}" font-size="2.1" fill="#555">${esc(sub)}</text>
<text x="${W - m}" y="${H - 6}" font-size="2.1" fill="#555" text-anchor="end">Strata · simmonsstummer.github.io/strata · ${esc(t('names.' + App.names))}</text>
</svg>`;
  }

  function printChart(fmt) {
    let root = $('#print-root'); if (!root) { root = document.createElement('div'); root.id = 'print-root'; document.body.appendChild(root); }
    root.innerHTML = svg(fmt);
    let st = $('#print-page'); if (!st) { st = document.createElement('style'); st.id = 'print-page'; document.head.appendChild(st); }
    st.textContent = `@page{size:${fmt} landscape;margin:0}`;
    document.body.classList.add('printing-chart');
    setTimeout(() => { try { window.print(); } catch (e) { toast(t('print.fail')); } }, 120);
  }
  function printCard() {
    let st = $('#print-page'); if (!st) { st = document.createElement('style'); st.id = 'print-page'; document.head.appendChild(st); }
    st.textContent = '@page{size:A4 portrait;margin:14mm}';
    document.body.classList.add('printing-card');
    setTimeout(() => { try { window.print(); } catch (e) { toast(t('print.fail')); } }, 120);
  }
  function download(fmt) {
    const blob = new Blob([svg(fmt)], { type: 'image/svg+xml' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `strata-${App.lang}-${fmt}.svg`; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  addEventListener('afterprint', () => document.body.classList.remove('printing-chart', 'printing-card'));

  function menu(btn) {
    let m = $('#print-menu');
    if (m) { m.remove(); return; }
    m = document.createElement('div'); m.id = 'print-menu'; m.className = 'pop';
    const card = $('#panel').classList.contains('open');
    m.innerHTML = `<b>${t('print.menu')}</b>
      <button data-p="A3">🖨 ${t('print.chart')} A3</button><button data-p="A4">🖨 ${t('print.chart')} A4</button>
      <button data-p="svg">⬇ ${t('print.svg')}</button>${card ? `<button data-p="card">🖨 ${t('print.card')}</button>` : ''}
      <small>${t('print.note')}</small>`;
    document.body.appendChild(m);
    const r = btn.getBoundingClientRect(); m.style.left = Math.max(8, r.left - 10) + 'px'; m.style.bottom = (innerHeight - r.top + 8) + 'px';
    $$('button', m).forEach(b => b.onclick = () => { const p = b.dataset.p; m.remove(); if (p === 'svg') download('A3'); else if (p === 'card') printCard(); else printChart(p); });
    setTimeout(() => addEventListener('pointerdown', function off(e) { if (!m.contains(e.target) && e.target !== btn) { m.remove(); removeEventListener('pointerdown', off); } }), 0);
  }
  return { svg, printChart, printCard, download, menu };
})();

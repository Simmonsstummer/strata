/* Strata — games: where does it go?, quiz, stack the layers, golden-spike hunt */
'use strict';
App.game = (() => {
  const root = $('#play-root');
  let cur = null;           // running game state
  const best = (k, v) => { const b = store.get('best', {}); if (v != null && (b[k] == null || v > b[k])) { b[k] = v; store.set('best', b); } return b[k]; };

  function hub() {
    stopAll();
    const G = [
      ['place', '📍', t('g.place'), t('g.placeD')],
      ['quiz', '❓', t('g.quiz'), t('g.quizD')],
      ['stack', '🧱', t('g.stack'), t('g.stackD')],
      ['hunt', '🌍', t('g.hunt'), t('g.huntD')],
    ];
    root.innerHTML = `<div class="play-hero"><h1>${t('play.title')}</h1><p>${t('play.sub')}</p></div><div class="games">${G.map(([k, i, n, d]) => {
      const b = best(k);
      return `<div class="game-card" data-g="${k}"><div class="gi">${i}</div><h2>${n}</h2><p>${d}</p>${k === 'stack' ? `<div class="levels">${['P', 'C', 'A'].map(l => `<button class="btn" data-lv="${l}">${t('lv.' + l)}</button>`).join('')}</div>` : ''}${b != null ? `<div class="best">${t('best')}: ${b}${k === 'stack' ? '★' : ''}</div>` : ''}</div>`;
    }).join('')}</div>`;
    $$('.game-card', root).forEach(c => c.onclick = e => {
      const g = c.dataset.g, lv = e.target.dataset.lv;
      if (g === 'place') place(); if (g === 'quiz') quiz(); if (g === 'stack') stack(lv || 'P'); if (g === 'hunt') hunt();
    });
  }
  function stopAll() {
    cur = null; App.col.onPick = null; App.col.setMarks([]); $('#game-bar').hidden = true;
    App.map.onPick = null; App.map.drawGuess(null); $('#map-game-bar').hidden = true;
  }
  function result(score, max, key, again) {
    stopAll(); App.setView('play');
    const pct = score / max, stars = pct >= .85 ? 3 : pct >= .55 ? 2 : pct >= .25 ? 1 : 0;
    best(key, score);
    root.innerHTML = `<button class="back-link">← ${t('back')}</button><div class="result"><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <h2>${t('res.score', score, max)}</h2><p class="muted">${t('res.msg')[stars]}</p><div class="btns" style="justify-content:center"><button class="btn primary" id="again">${t('again')}</button><button class="btn" id="tohub">${t('other')}</button></div></div>`;
    $('.back-link', root).onclick = hub; $('#tohub').onclick = hub; $('#again').onclick = again;
  }
  const levelUnit = age => { const p = pathAt(age); return age <= 538.8 ? p.find(u => u.r === 'P') : p.filter(u => u.r === 'E' || u.r === 'R').pop(); };

  /* ---------- 1. where does it go? (tap the column) ---------- */
  function place() {
    stopAll(); App.panel.close(); App.setView('column'); App.col.fit();
    const evs = shuffle(App.ev).slice(0, 10);
    cur = { k: 'place', i: 0, score: 0, evs, done: false };
    const bar = $('#game-bar');
    const ask = () => {
      const e = cur.evs[cur.i]; cur.done = false; App.col.setMarks([]);
      bar.hidden = false;
      bar.innerHTML = `<div class="gb-q">${t('place.q')}<b>${e.e} ${esc(tx(e.n))}</b><span class="clue">${t('place.clue')}</span></div><div class="gb-score"><b>${cur.score}</b>${cur.i + 1}/${cur.evs.length}</div><button class="icon-btn small" id="gb-x">✕</button>`;
      $('#gb-x').onclick = () => { stopAll(); App.setView('play'); hub(); };
    };
    App.col.onPick = age => {
      if (cur.done) return; cur.done = true;
      const e = cur.evs[cur.i], T = levelUnit(e.a), G = levelUnit(age), ok = T && G && e.a <= G.a && e.a >= G.b;
      const sameEra = !ok && T && G && pathAt(e.a).find(u => u.r === 'R') === pathAt(age).find(u => u.r === 'R');
      const pts = ok ? 3 : sameEra ? 1 : 0; cur.score += pts;
      App.col.setMarks([{ age, color: ok ? '#2fae66' : '#e5484d', dash: true }, { age: e.a, color: '#2fae66', label: `${e.e} ${fmtAge(e.a)}` }]);
      App.col.flyToAge(e.a, Math.max(e.a * .6, 2));
      const msg = ok ? t('place.ok') : sameEra ? t('place.near') : t('place.no');
      bar.innerHTML = `<div class="gb-q">${msg} <b>${e.e} ${esc(tx(e.n))}</b><span class="clue">${t('place.ans', fmtYearsAgo(e.a), esc(nm(T)))}${pts ? ` · +${pts}` : ''}</span></div><div class="gb-score"><b>${cur.score}</b>${cur.i + 1}/${cur.evs.length}</div><button class="btn primary" id="gb-next">${cur.i + 1 < cur.evs.length ? t('next') : t('finish')} →</button>`;
      $('#gb-next').onclick = () => { cur.i++; if (cur.i >= cur.evs.length) return result(cur.score, cur.evs.length * 3, 'place', place); App.col.fit(); ask(); };
    };
    ask();
  }

  /* ---------- 2. quiz ---------- */
  function makeQuestion(used) {
    const U = App.U, stagesG = U.filter(u => u.r === 'A' && u.g && u.g.st === 'r' && u.g.cc);
    const per = U.filter(u => u.r === 'P'), phPer = per.filter(u => u.a <= 538.8 + 1);
    const types = ['ety', 'older', 'color', 'parent', 'where', 'when', 'event'];
    for (let tries = 0; tries < 50; tries++) {
      const ty = pick(types);
      if (ty === 'ety') {
        const pool = U.filter(u => u.ety && (u.r === 'A' || u.r === 'P') && !/^Piano|^Stage|Upper|Lower|Middle/.test(u.id + u.n.en));
        const u = pick(pool); if (used.has(u.id)) continue;
        const e = tx(u.ety), n = nm(u); if (e.toLowerCase().includes(n.toLowerCase().slice(0, 5))) continue;
        const opts = shuffle([u, ...shuffle(pool.filter(x => x !== u && x.r === u.r)).slice(0, 3)]);
        return { id: u.id, q: t('q.ety'), clue: e, opts: opts.map(x => ({ l: nm(x), ok: x === u, c: x.c })), ex: `${nm(u)}: ${e}`, u };
      }
      if (ty === 'older') {
        const r = pick(['P', 'C', 'A']), pool = U.filter(x => x.r === r && x.a <= 540), a = pick(pool), b = pick(pool.filter(x => x !== a && Math.abs(x.a - a.a) > 3));
        if (!b) continue; const o = a.a > b.a ? a : b;
        return { id: a.id + b.id, q: t('q.older'), opts: shuffle([a, b]).map(x => ({ l: nm(x), ok: x === o, c: x.c })), ex: t('q.olderEx', nm(o), fmtAge(o.a), nm(o === a ? b : a), fmtAge((o === a ? b : a).a)), u: o };
      }
      if (ty === 'color') {
        const u = pick(phPer); if (used.has('c' + u.id)) continue;
        const opts = shuffle([u, ...shuffle(per.filter(x => x !== u && x.c !== u.c)).slice(0, 3)]);
        return { id: 'c' + u.id, q: t('q.color', nm(u)), color: true, opts: opts.map(x => ({ l: '', ok: x === u, c: x.c })), ex: t('q.colorEx', nm(u), u.c), u };
      }
      if (ty === 'parent') {
        const u = pick(U.filter(x => x.r === 'A')); if (used.has('p' + u.id)) continue;
        const P = chain(u).find(x => x.r === 'P'), opts = shuffle([P, ...shuffle(phPer.filter(x => x !== P)).slice(0, 3)]);
        return { id: 'p' + u.id, q: t('q.parent', nm(u)), opts: opts.map(x => ({ l: nm(x), ok: x === P, c: x.c })), ex: t('q.parentEx', nm(u), nm(P), fmtAge(u.a), fmtAge(u.b)), u };
      }
      if (ty === 'where') {
        const u = pick(stagesG); if (used.has('w' + u.id)) continue;
        const C = App.countries, cs = shuffle(Object.keys(C).filter(k => k !== u.g.cc)).slice(0, 3);
        return { id: 'w' + u.id, q: t('q.where', nm(u)), opts: shuffle([u.g.cc, ...cs]).map(k => ({ l: tx(C[k]), ok: k === u.g.cc })), ex: `${tx(u.g.loc)}.`, u };
      }
      if (ty === 'when') {
        const pool = U.filter(x => x.r === 'P' || x.r === 'R'), u = pick(pool); if (used.has('t' + u.id)) continue;
        const others = shuffle(pool.filter(x => x !== u && Math.abs(x.a - u.a) / u.a > .15)).slice(0, 3);
        return { id: 't' + u.id, q: t('q.when', nm(u)), opts: shuffle([u, ...others]).map(x => ({ l: fmtYearsAgo(x.a), ok: x === u })), ex: t('q.whenEx', nm(u), fmtYearsAgo(u.a)), u };
      }
      if (ty === 'event') {
        const e = pick(App.ev); if (used.has('e' + e.a)) continue;
        const T = levelUnit(e.a); if (!T) continue;
        const pool = U.filter(x => x.r === T.r && x !== T && (T.r !== 'P' || x.a <= 540));
        return { id: 'e' + e.a, q: t('q.event'), clue: `${e.e} ${tx(e.n)}`, opts: shuffle([T, ...shuffle(pool).slice(0, 3)]).map(x => ({ l: nm(x), ok: x === T, c: x.c })), ex: t('q.eventEx', tx(e.n), fmtYearsAgo(e.a), nm(T)), u: T };
      }
    }
  }
  function quiz() {
    stopAll(); App.setView('play');
    const used = new Set(), qs = [];
    while (qs.length < 10) { const q = makeQuestion(used); if (q && !used.has(q.id)) { used.add(q.id); qs.push(q); } }
    cur = { k: 'quiz', i: 0, score: 0, qs };
    const show = () => {
      const q = cur.qs[cur.i];
      root.innerHTML = `<button class="back-link">← ${t('back')}</button><div class="quiz"><div class="quiz-top"><span class="muted">${cur.i + 1} / ${cur.qs.length}</span><span class="mono" style="color:var(--accent)">${cur.score} ✓</span></div>
        <div class="progress"><i style="width:${cur.i / cur.qs.length * 100}%"></i></div><p class="q-text">${esc(q.q)}</p>${q.clue ? `<div class="q-clue">${esc(q.clue)}</div>` : ''}
        <div class="opts">${q.opts.map((o, k) => `<button class="opt${q.color ? ' color' : ''}" data-k="${k}">${o.c ? `<span class="sw" style="--c:${o.c}"></span>` : ''}${esc(o.l)}</button>`).join('')}</div>
        <div class="q-expl" id="q-expl"></div></div>`;
      $('.back-link', root).onclick = hub;
      $$('.opt', root).forEach(b => b.onclick = () => {
        const o = q.opts[+b.dataset.k]; $$('.opt', root).forEach((x, k) => { x.disabled = true; if (q.opts[k].ok) x.classList.add('ok'); });
        if (o.ok) cur.score++; else b.classList.add('no');
        $('#q-expl').innerHTML = `${o.ok ? '✅' : '❌'} ${esc(q.ex)} <div class="btns"><button class="btn primary" id="q-next">${cur.i + 1 < cur.qs.length ? t('next') : t('finish')} →</button>${q.u ? `<button class="btn" id="q-see">${t('see')}</button>` : ''}</div>`;
        $('#q-next').onclick = () => { cur.i++; cur.i < cur.qs.length ? show() : result(cur.score, cur.qs.length, 'quiz', quiz); };
        const s = $('#q-see'); if (s) s.onclick = () => App.select(q.u, false);
      });
    };
    show();
  }

  /* ---------- 3. stack the layers (law of superposition) ---------- */
  function stack(lv) {
    stopAll(); App.setView('play');
    let pool;
    if (lv === 'A') { const era = pick(['Cenozoic', 'Mesozoic', 'Paleozoic']), E = App.by[era]; pool = shuffle(App.U.filter(u => u.r === 'A' && u.a <= E.a && u.b >= E.b)).slice(0, 6); }
    else pool = shuffle(App.U.filter(u => u.r === lv && u.a <= 540)).slice(0, lv === 'P' ? 5 : 6);
    const order = [...pool].sort((a, b) => b.a - a.a);
    cur = { k: 'stack', placed: [], miss: 0 };
    const draw = () => {
      const left = pool.filter(u => !cur.placed.includes(u));
      root.innerHTML = `<button class="back-link">← ${t('back')}</button><div class="quiz" style="max-width:820px"><p class="q-text">${t('stack.q')}</p><p class="muted" style="margin-top:-8px">${t('stack.hint')}</p>
        <div class="stack-wrap"><div class="stack-pool">${left.map(u => `<button class="opt" data-id="${u.id}"><span class="sw" style="--c:${u.c}"></span>${esc(nm(u))}</button>`).join('') || `<div class="card fun"><p>${t('stack.done', cur.miss)}</p><div class="btns"><button class="btn primary" id="st-again">${t('again')}</button><button class="btn" id="st-hub">${t('other')}</button></div></div>`}</div>
        <div class="stack"><span class="lab-new">↑ ${t('younger')}</span>${cur.placed.map(u => `<div class="layer" style="--c:${u.c};--ink:${ink(u.c)}"><span>${esc(nm(u))}</span><small>${fmtAge(u.a)}</small></div>`).join('')}<span class="lab-old">↓ ${t('older')}</span></div></div>
        <div class="q-expl" id="q-expl"></div></div>`;
      $('.back-link', root).onclick = hub;
      $$('.stack-pool .opt', root).forEach(b => b.onclick = () => {
        const u = App.by[b.dataset.id], want = order[cur.placed.length];
        if (u === want) { cur.placed.push(u); draw(); if (cur.placed.length === order.length) { const stars = cur.miss === 0 ? 3 : cur.miss <= 2 ? 2 : 1; best('stack', stars); } }
        else { cur.miss++; b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 500); $('#q-expl').textContent = t('stack.wrong', nm(u), fmtAge(u.a), nm(want)); }
      });
      const a = $('#st-again'); if (a) { a.onclick = () => stack(lv); $('#st-hub').onclick = hub; }
    };
    draw();
  }

  /* ---------- 4. golden-spike hunt (tap the map) ---------- */
  function hunt() {
    stopAll(); App.panel.close(); App.setView('map'); App.map.fit();
    const pool = shuffle(App.U.filter(u => u.g && u.g.st === 'r' && u.g.lat != null)).slice(0, 8);
    cur = { k: 'hunt', i: 0, score: 0, pool, done: false };
    const bar = $('#map-game-bar');
    const ask = () => {
      const u = cur.pool[cur.i], P = chain(u).find(x => x.r === 'P') || u; cur.done = false; App.map.drawGuess(null); App.map.highlight(null);
      bar.hidden = false;
      bar.innerHTML = `<div class="gb-q">${t('hunt.q')}<b><span class="sw" style="--c:${u.c};width:16px;height:16px;border-radius:4px;vertical-align:-2px"></span> ${esc(nm(u))}</b><span class="clue">${esc(rankName(u))} · ${esc(nm(P))} · ${fmtAge(u.a)}</span></div><div class="gb-score"><b>${cur.score}</b>${cur.i + 1}/${cur.pool.length}</div><button class="icon-btn small" id="gb-x">✕</button>`;
      $('#gb-x').onclick = () => { stopAll(); App.setView('play'); hub(); };
    };
    App.map.onPick = (lat, lon) => {
      if (cur.done) return; cur.done = true;
      const u = cur.pool[cur.i], g = u.g, d = haversine([lat, lon], [g.lat, g.lon]), pts = Math.round(d < 150 ? 100 : 100 * Math.exp(-(d - 150) / 1500));
      cur.score += pts; App.map.drawGuess([lat, lon], [g.lat, g.lon]);
      const [gx, gy] = App.map.P(lat, lon), [ax, ay] = App.map.P(g.lat, g.lon);
      App.map.goTo({ x: (gx + ax) / 2, y: (gy + ay) / 2, w: clamp(Math.max(Math.abs(gx - ax), Math.abs(gy - ay)) * 2.2, 18, 360) });
      App.map.highlight(App.map.pins().find(p => p.units.includes(u)));
      bar.innerHTML = `<div class="gb-q">${d < 150 ? t('hunt.great') : d < 1000 ? t('hunt.good') : t('hunt.far')}<b>${Math.round(d).toLocaleString(LOC())} km</b><span class="clue">${esc(tx(g.loc))} · +${pts}</span></div><div class="gb-score"><b>${cur.score}</b>${cur.i + 1}/${cur.pool.length}</div><button class="btn primary" id="gb-next">${cur.i + 1 < cur.pool.length ? t('next') : t('finish')} →</button>`;
      $('#gb-next').onclick = () => { cur.i++; if (cur.i >= cur.pool.length) return result(cur.score, cur.pool.length * 100, 'hunt', hunt); App.map.fit(); ask(); };
    };
    ask();
  }

  return { hub, stopAll, relang() { if (!cur) hub(); } };
})();

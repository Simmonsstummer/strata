/* Strata — core: data, helpers, formatting */
'use strict';
const App = { U: [], by: {}, ev: [], lang: 'it', names: 'rock', scale: 'chart', showEvents: true };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const store = {
  get(k, d) { try { const v = localStorage.getItem('strata:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('strata:' + k, JSON.stringify(v)); } catch (e) { } }
};
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const LOC = () => App.lang === 'it' ? 'it-IT' : 'en-GB';
let toastT;
function toast(msg, ms = 2200) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms); }

/* ---------- data ---------- */
const RANKS = 'SERPBCA';                    // super-eon, eon, era, period, sub-period, epoch, age
const rankIdx = r => RANKS.indexOf(r);
function indexData(data) {
  App.U = data.units; App.ev = data.events; App.version = data.version;
  App.U.forEach(u => { App.by[u.id] = u; u.kids = []; });
  App.U.forEach(u => { if (u.p) App.by[u.p].kids.push(u); });
  App.U.forEach(u => u.kids.sort((a, b) => a.a - b.a));            // youngest first
  App.leaves = App.U.filter(u => !u.kids.length).sort((a, b) => a.b - b.b);
  App.roots = App.U.filter(u => !u.p);
}
const tx = o => o ? (o[App.lang] ?? o.en) : '';
const nm = u => (App.names === 'time' && u.nt ? u.nt : u.n)[App.lang];
const nmOther = u => (App.names === 'time' && u.nt ? u.nt : u.n)[App.lang === 'it' ? 'en' : 'it'];
const rankName = u => t('rank.' + App.names)[u.r];
function chain(u) { const c = []; for (let x = u; x; x = App.by[x.p]) c.unshift(x); return c; }
/* the unit of a given rank that contains an age (searching the tree) */
function unitAt(age, rank) {
  let best = null;
  for (const u of App.U) if (u.r === rank && age <= u.a && age >= u.b) { if (!best || age > u.b || best.b !== age) best = u; }
  return best;
}
/* deepest units containing an age, from the root down */
function pathAt(age) {
  const out = []; let list = App.roots;
  while (list && list.length) {
    const u = list.find(x => age <= x.a && age > x.b) || list.find(x => age <= x.a && age >= x.b);
    if (!u) break; out.push(u); list = u.kids;
  }
  return out;
}
/* the unit whose GSSP/GSSA defines the base of u (u itself or its oldest descendant) */
function baseDef(u) {
  let x = u; while (!x.g && x.kids.length) x = x.kids[x.kids.length - 1];
  if (x.g) return x;
  for (let p = App.by[u.p]; p && p.a === u.a; p = App.by[p.p]) if (p.g) return p;
  return null;
}
const ink = hex => { const n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) > 140 ? '#1a1a1a' : '#ffffff'; };

/* ---------- numbers ---------- */
function fmtN(v, d = 3) { return v.toLocaleString(LOC(), { maximumFractionDigits: d }); }
/* an age in Ma, as on the ICS chart; very young ages in ka */
function fmtAge(ma, short) {
  if (ma === 0) return short ? '0' : t('present');
  if (ma < 0.1) return fmtN(ma * 1000, 2) + ' ka';
  return fmtN(ma, 3) + (short ? '' : ' Ma');
}
function fmtAgeU(u, which = 'a') {   // with uncertainty and «~»
  const v = u[which], e = u[which + 'e'], apx = u.apx && u.apx.includes(which);
  return (apx ? '~' : '') + fmtAge(v, true) + (e ? ' ± ' + fmtN(e, 3) : '') + (v >= 0.1 ? ' Ma' : '');
}
function fmtDur(ma) {
  const U = t('dur');
  if (ma >= 1000) return fmtN(ma / 1000, 2) + ' ' + U.gy;
  if (ma >= 1) return fmtN(ma, ma < 10 ? 2 : 1) + ' ' + U.my;
  const y = ma * 1e6;
  return Math.round(y).toLocaleString(LOC()) + ' ' + U.y;
}
function fmtYearsAgo(ma) {
  if (ma >= 1000) return t('ago.gy', fmtN(ma / 1000, 2));
  if (ma >= 1) return t('ago.my', fmtN(ma, ma < 10 ? 2 : 1));
  return t('ago.y', Math.round(ma * 1e6).toLocaleString(LOC()));
}
/* Earth's history squeezed into one calendar year */
function calendar(ma) {
  const f = 1 - ma / 4567, ms = f * 365 * 86400000;
  const d = new Date(Date.UTC(2025, 0, 1) + ms);
  const day = d.toLocaleDateString(LOC(), { day: 'numeric', month: 'long', timeZone: 'UTC' });
  if (ma > 50) return day;
  const tm = d.toLocaleTimeString(LOC(), { hour: '2-digit', minute: '2-digit', second: ma < 1 ? '2-digit' : undefined, timeZone: 'UTC' });
  return `${day}, ${tm}`;
}
function haversine(a, b) {
  const R = 6371, r = Math.PI / 180, dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

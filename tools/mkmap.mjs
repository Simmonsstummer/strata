// Strata — builds world.js from Natural Earth 1:50m (public domain) via the world-atlas npm package.
// Usage: npm i world-atlas@2 topojson-client topojson-simplify d3-geo && node tools/mkmap.mjs 0.006
import fs from 'fs';
import * as topo from 'topojson-client';
import * as simp from 'topojson-simplify';
import { geoPath, geoEquirectangular } from 'd3-geo';
const q=+process.argv[2]||0.006;
let land = JSON.parse(fs.readFileSync(`node_modules/world-atlas/land-50m.json`));
let ctry = JSON.parse(fs.readFileSync(`node_modules/world-atlas/countries-50m.json`));
land = simp.simplify(simp.presimplify(land), q);
ctry = simp.simplify(simp.presimplify(ctry), q*2);
land = simp.filter(land, simp.filterWeight(land, q*30));
const proj = geoEquirectangular().scale(180/Math.PI).translate([180,90]).precision(0.05);
const p = geoPath(proj).digits(2);
const L = p(topo.feature(land, land.objects.land));
const B = p(topo.mesh(ctry, ctry.objects.countries, (a,b)=>a!==b));
fs.writeFileSync(`world.js`, `/* Strata — world map: Natural Earth 1:50m (public domain) via world-atlas 2 (ISC), simplified with topojson-simplify. Equirectangular, viewBox 0 0 360 180 */\nconst WORLD={land:${JSON.stringify(L)},borders:${JSON.stringify(B)}};\n`);
console.log(q, L.length, B.length);

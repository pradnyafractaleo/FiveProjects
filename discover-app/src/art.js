// Code-generated SVG card art. No image files or services: each card gets a unique
// hand-drawn illustration from its title (seed) in its category's style.
// Uses Rough.js (MIT, https://roughjs.com) for the sketchy look and
// blobs (MIT, https://blobs.dev) for organic blob shapes. Both are bundled, nothing is fetched.
import rough from "roughjs";
import * as blobs2 from "blobs/v2";

export const ART_STYLES = { surprise: "Surprise me (mix)", blobs: "Blobs", confetti: "Confetti", waves: "Waves", garden: "Garden", stars: "Stars", stripes: "Stripes",
  mountains: "Mountains", sunburst: "Sunburst", rainbow: "Rainbow", squiggles: "Squiggles", dots: "Polka dots", memphis: "Memphis shapes", bubbles: "Bubbles" };

function seedRand(str) {
  let h = 1779033703; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 3432918353) >>> 0;
  return () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

const gen = rough.generator();

// Curated pastel palettes (5 colors each), in the spirit of the pastel collections on
// Color Hunt (https://colorhunt.co/palettes/pastel) and Coolors (https://coolors.co/palettes/popular/pastel).
const PASTELS = [
  ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"],
  ["#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc", "#caffbf"],
  ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"],
  ["#f7d9c4", "#faedcb", "#c9e4de", "#c6def1", "#dbcdf0"],
  ["#ffb5e8", "#b28dff", "#aff8db", "#fff5ba", "#c4faf8"],
  ["#e4c1f9", "#f694c1", "#ede7b1", "#a9def9", "#d3f8e2"],
  ["#fbf8cc", "#fde4cf", "#ffcfd2", "#f1c0e8", "#cfbaf0"],
  ["#90dbf4", "#8eecf5", "#98f5e1", "#b9fbc0", "#a3c4f3"],
  ["#b8e0d2", "#d6eadf", "#eac4d5", "#95b8d1", "#809bce"],
  ["#ffe5ec", "#ffc2d1", "#ffb3c6", "#ff8fab", "#fbe7c6"],
  ["#d8f3dc", "#b7e4c7", "#95d5b2", "#fff1e6", "#fde2e4"],
  ["#fec5bb", "#fcd5ce", "#e8e8e4", "#d8e2dc", "#ece4db"],
];
// A deeper shade of a color, for outlines that stay visible on pastel backgrounds
const shade = (hex, k = .3) => "#" + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - k)).toString(16).padStart(2, "0")).join("");
const FILLS = ["hachure", "solid", "zigzag", "cross-hatch", "solid"];
const cache = new Map();

export function makeArt(seed, style) {
  const key = seed + "|" + style;
  if (cache.has(key)) return cache.get(key);
  const R = seedRand(seed + style), r = (a, b) => a + R() * (b - a), pick = a => a[Math.floor(R() * a.length)];
  const W = 440, H = 260; let s = "";
  if (style === "surprise") style = pick(Object.keys(ART_STYLES).slice(1));

  // Every card uses one predefined pastel palette so its colors always go together.
  // The card background is one palette color and the shapes use the others, outlined in a deeper shade.
  const pal = [...pick(PASTELS)].sort(() => R() - .5), BG = pal[0], P = pal.slice(1);
  const fillStyle = pick(FILLS), roughness = r(1, 2.4);

  // Turn a Rough.js drawable into SVG path elements
  const draw = (d, opacity = 1) => gen.toPaths(d).map(p =>
    `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill || "none"}" opacity="${opacity}" stroke-linecap="round"/>`).join("");
  const o = (fill, extra = {}) => ({ seed: Math.floor(r(1, 1e6)), roughness, fill, fillStyle, fillWeight: 2, hachureGap: r(5, 9), hachureAngle: r(-60, 60), stroke: shade(fill), strokeWidth: 2, ...extra });
  const line = (c, w = 3) => ({ seed: Math.floor(r(1, 1e6)), roughness, stroke: c, strokeWidth: w });
  // Organic blob from the blobs library, placed at x,y
  const blob = (x, y, size, fill, opacity = 1) =>
    `<path d="${blobs2.svgPath({ seed: Math.floor(r(1, 1e6)), extraPoints: Math.floor(r(2, 6)), randomness: Math.floor(r(4, 9)), size })}" transform="translate(${x - size / 2} ${y - size / 2})" fill="${fill}" opacity="${opacity}"/>`;

  if (style === "blobs") for (let i = 0; i < 6; i++) s += blob(r(0, W), r(0, H), r(70, 200), pick(P), r(.55, .9));
  if (style === "bubbles") for (let i = 0; i < 12; i++) { const x = r(0, W), y = r(0, H), z = r(16, 80);
    s += blob(x, y, z, pick(P), .55) + draw(gen.circle(x - z / 6, y - z / 6, z / 4, o("#fff", { fillStyle: "solid", stroke: "#fff" }))); }
  if (style === "confetti") for (let i = 0; i < 26; i++) { const x = r(0, W), y = r(0, H), c = pick(P);
    s += R() < .5 ? draw(gen.rectangle(x, y, r(10, 22), r(6, 14), o(c, { fillStyle: "solid" }))) : draw(gen.circle(x, y, r(8, 16), o(c, { fillStyle: "solid" }))); }
  if (style === "waves") for (let i = 0; i < 5; i++) { const y = 40 + i * 50 + r(-10, 10), a = r(15, 35), k = r(60, 120);
    s += draw(gen.path(`M0 ${y} ${Array.from({ length: 8 }, (_, j) => `Q ${j * k + k / 2} ${y + (j % 2 ? a : -a)} ${(j + 1) * k} ${y}`).join(" ")} V${H} H0Z`, o(P[(i + 2) % 4])), .7); }
  if (style === "garden") for (let i = 0; i < 8; i++) { const x = r(20, W - 20), hgt = r(70, 170), top = H - hgt, c = pick(P);
    s += draw(gen.path(`M${x} ${H} Q${x + r(-25, 25)} ${H - hgt / 2} ${x} ${top}`, line(shade(pick(P), .45), 4)));
    s += blob(x + 14, H - hgt / 2, 26, pick(P), .9);
    for (let p = 0; p < 6; p++) { const a = p * Math.PI / 3; s += draw(gen.ellipse(x + 13 * Math.cos(a), top + 13 * Math.sin(a), 16, 24, o(c, { fillStyle: "solid" }))); }
    s += draw(gen.circle(x, top, 12, o("#fff3b0", { fillStyle: "solid" }))); }
  if (style === "stars") for (let i = 0; i < 12; i++) { const x = r(0, W), y = r(0, H), out = r(10, 24), inn = out * .45;
    s += draw(gen.polygon(Array.from({ length: 10 }, (_, j) => { const a = Math.PI / 5 * j - Math.PI / 2, d = j % 2 ? inn : out; return [x + d * Math.cos(a), y + d * Math.sin(a)]; }), o(pick(P)))); }
  if (style === "stripes") { const w = r(22, 38), ang = r(-40, 40); let g = "";
    for (let x = -W / 2; x < W * 1.5; x += w * 2) g += draw(gen.rectangle(x, -H, w, H * 3, o(pick(P))), .75);
    s += `<g transform="rotate(${ang} ${W / 2} ${H / 2})">${g}</g>`; }
  if (style === "mountains") { s += draw(gen.circle(r(40, W - 40), r(35, 75), r(40, 70), o("#fff3b0", { fillStyle: "solid" })));
    for (let i = 0; i < 3; i++) { const pts = [[0, H]]; for (let x = 0; x <= W; x += r(60, 120)) pts.push([x, H * (.4 + i * .15) + r(-40, 30)]); pts.push([W, H]);
      s += draw(gen.polygon(pts, o(P[i % 4])), .9); } }
  if (style === "sunburst") { const cx = r(0, W), cy = r(0, H), n = 2 * Math.floor(r(5, 11));
    for (let i = 0; i < n; i += 2) { const a1 = i / n * Math.PI * 2, a2 = (i + 1) / n * Math.PI * 2;
      s += draw(gen.polygon([[cx, cy], [cx + 600 * Math.cos(a1), cy + 600 * Math.sin(a1)], [cx + 600 * Math.cos(a2), cy + 600 * Math.sin(a2)]], o(pick(P))), .6); }
    s += draw(gen.circle(cx, cy, r(50, 100), o(pick(P), { fillStyle: "solid" }))); }
  if (style === "rainbow") { const cx = r(W * .2, W * .8), cy = H + r(0, 40);
    P.concat(P).forEach((c, i) => s += draw(gen.arc(cx, cy, 440 - i * 46, 440 - i * 46, Math.PI, Math.PI * 2, true, o(c, { fillStyle: "solid" })))); }
  if (style === "squiggles") for (let i = 0; i < 8; i++) { const x = r(-20, W), y = r(0, H); let d = `M${x} ${y}`;
    for (let j = 0; j < 6; j++) d += ` q 15 ${j % 2 ? 18 : -18} 30 0`;
    s += `<g transform="rotate(${r(-30, 30)} ${x} ${y})">${draw(gen.path(d, line(pick(P), r(4, 8))))}</g>`; }
  if (style === "dots") { const gp = r(34, 50), rr = r(14, 22);
    for (let x = gp / 2; x < W; x += gp) for (let y = gp / 2; y < H; y += gp)
      s += draw(gen.circle(x + (Math.round(y / gp) % 2 ? gp / 2 : 0), y, rr, o(P[(Math.round(x / gp) + Math.round(y / gp)) % 4], { fillStyle: "solid", roughness: 1 })), .8); }
  if (style === "memphis") for (let i = 0; i < 12; i++) { const x = r(0, W), y = r(0, H), c = pick(P), z = r(16, 34);
    s += [draw(gen.polygon([[x, y - z], [x + z, y + z], [x - z, y + z]], o(c))),
      draw(gen.circle(x, y, z * 1.4, { ...line(c, 5) })),
      draw(gen.rectangle(x, y, z, z, o(c))),
      draw(gen.linearPath([[x, y], [x + z, y - z / 2], [x + 2 * z, y], [x + 3 * z, y - z / 2]], line(c, 5))),
      blob(x, y, z * 2, c)][Math.floor(r(0, 5))]; }

  // A few hand-drawn sparkles on some cards for extra variety
  if (R() < .4) for (let i = 0; i < 5; i++) { const x = r(0, W), y = r(0, H), z = r(5, 10);
    s += draw(gen.linearPath([[x - z, y], [x + z, y]], line(shade(BG, .25), 2))) + draw(gen.linearPath([[x, y - z], [x, y + z]], line(shade(BG, .25), 2))); }

  const bg = `<rect width="${W}" height="${H}" fill="${BG}"/>`;
  const url = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${bg}${s}</svg>`);
  cache.set(key, url);
  return url;
}

// Code-generated SVG card art. No image files or services: each card gets a unique
// illustration from its title (seed) in its category's style.
const ART_STYLES = { blobs: "Blobs", confetti: "Confetti", waves: "Waves", garden: "Garden", stars: "Stars", stripes: "Stripes" };
const PALETTES = [
  ["#ff6b9d","#ffb347","#ffe66d","#4ecdc4"], ["#7b6cff","#4ecdc4","#a8e6cf","#ffd3b6"],
  ["#ff8a5c","#ffd166","#06d6a0","#118ab2"], ["#f78fb3","#c3aed6","#8fd3fe","#fff3b0"],
  ["#2ec4b6","#cbf3f0","#ffbf69","#ff9f1c"], ["#9b5de5","#f15bb5","#fee440","#00bbf9"]];
function seedRand(str) {
  let h = 1779033703; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 3432918353) >>> 0;
  return () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function makeArt(seed, style, emoji) {
  const R = seedRand(seed + style), r = (a, b) => a + R() * (b - a), pick = a => a[Math.floor(R() * a.length)];
  const P = pick(PALETTES), W = 440, H = 260; let s = "";
  const bg = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P[0]}"/><stop offset="1" stop-color="${P[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`;
  if (style === "blobs") for (let i = 0; i < 6; i++) s += `<circle cx="${r(0,W)}" cy="${r(0,H)}" r="${r(30,110)}" fill="${pick(P)}" opacity="${r(.35,.7)}"/>`;
  if (style === "confetti") for (let i = 0; i < 40; i++) { const x = r(0,W), y = r(0,H), c = pick(P);
    s += R() < .5 ? `<rect x="${x}" y="${y}" width="${r(6,16)}" height="${r(4,10)}" rx="2" fill="${c}" transform="rotate(${r(0,180)} ${x} ${y})"/>` : `<circle cx="${x}" cy="${y}" r="${r(3,8)}" fill="${c}"/>`; }
  if (style === "waves") for (let i = 0; i < 5; i++) { const y = 40 + i * 50 + r(-10,10), a = r(15,35), k = r(60,120);
    s += `<path d="M0 ${y} ${Array.from({length: 8}, (_, j) => `Q ${j*k + k/2} ${y + (j%2 ? a : -a)} ${(j+1)*k} ${y}`).join(" ")} V${H} H0Z" fill="${P[(i+2)%4]}" opacity=".45"/>`; }
  if (style === "garden") { for (let i = 0; i < 9; i++) { const x = r(10,W-10), y = r(H*.45,H), h = r(40,110);
      s += `<path d="M${x} ${H} Q${x + r(-20,20)} ${y} ${x} ${y - h}" stroke="#2d6a4f" stroke-width="4" fill="none"/>`;
      const c = pick(P); for (let p = 0; p < 6; p++) s += `<ellipse cx="${x}" cy="${y-h-12}" rx="7" ry="14" fill="${c}" transform="rotate(${p*60} ${x} ${y-h})"/>`;
      s += `<circle cx="${x}" cy="${y-h}" r="6" fill="#fff3b0"/>`; } }
  if (style === "stars") for (let i = 0; i < 18; i++) { const x = r(0,W), y = r(0,H), o = r(5,16), n = o * .45;
    const pts = Array.from({length: 10}, (_, j) => { const a = Math.PI/5*j - Math.PI/2, d = j%2 ? n : o; return `${x + d*Math.cos(a)},${y + d*Math.sin(a)}`; }).join(" ");
    s += `<polygon points="${pts}" fill="${pick(P)}" opacity="${r(.6,1)}"/>`; }
  if (style === "stripes") { const w = r(18,34), ang = r(-40,40);
    s += `<g transform="rotate(${ang} ${W/2} ${H/2})">`; for (let x = -W; x < W*2; x += w*2) s += `<rect x="${x}" y="${-H}" width="${w}" height="${H*3}" fill="${pick(P)}" opacity=".5"/>`; s += `</g>`; }
  const cx = r(W*.35, W*.65), cy = r(H*.35, H*.6);
  s += `<circle cx="${cx}" cy="${cy}" r="44" fill="#fff" opacity=".85"/><text x="${cx}" y="${cy}" font-size="48" text-anchor="middle" dominant-baseline="central">${emoji.replace(/[<&]/g, "")}</text>`;
  return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${bg}${s}</svg>`);
}

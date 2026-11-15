// Code-generated SVG card art. No image files or services: each card gets a unique
// illustration from its title (seed) in its category's style.
const ART_STYLES = { surprise: "Surprise me (mix)", blobs: "Blobs", confetti: "Confetti", waves: "Waves", garden: "Garden", stars: "Stars", stripes: "Stripes",
  mountains: "Mountains", sunburst: "Sunburst", rainbow: "Rainbow", squiggles: "Squiggles", dots: "Polka dots", memphis: "Memphis shapes", bubbles: "Bubbles" };
function seedRand(str) {
  let h = 1779033703; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 3432918353) >>> 0;
  return () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function makeArt(seed, style, emoji) {
  const R = seedRand(seed + style), r = (a, b) => a + R() * (b - a), pick = a => a[Math.floor(R() * a.length)];
  // Solid background in a seed-picked hue; pattern colors are spread around the color wheel so they always stand out
  const h = Math.floor(r(0,360)), hsl = (d, sat, l) => `hsl(${(h + d) % 360},${sat}%,${l}%)`;
  const P = [hsl(r(40,80),85,72), hsl(r(150,210),75,55), hsl(r(230,280),90,80), hsl(r(290,330),70,45)].sort(() => R() - .5), W = 440, H = 260; let s = "";
  if (style === "surprise") style = pick(Object.keys(ART_STYLES).slice(1));
  const bg = `<rect width="${W}" height="${H}" fill="${hsl(0, Math.floor(r(65,90)), Math.floor(r(55,68)))}"/>`;
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
  if (style === "mountains") { for (let i = 0; i < 3; i++) s += `<circle cx="${r(40,W-40)}" cy="${r(30,80)}" r="${i ? 0 : r(22,36)}" fill="#fff3b0"/>`;
    for (let i = 0; i < 4; i++) { let d = `M0 ${H}`; for (let x = 0; x <= W; x += r(50,110)) d += ` L${x} ${H*(.35 + i*.13) + r(-40,30)}`; s += `<path d="${d} L${W} ${H}Z" fill="${P[i%4]}" opacity="${.55 + i*.12}"/>`; } }
  if (style === "sunburst") { const cx = r(0,W), cy = r(0,H), n = Math.floor(r(10,22));
    for (let i = 0; i < n; i += 2) { const a1 = i/n*Math.PI*2, a2 = (i+1)/n*Math.PI*2;
      s += `<path d="M${cx} ${cy} L${cx + 900*Math.cos(a1)} ${cy + 900*Math.sin(a1)} L${cx + 900*Math.cos(a2)} ${cy + 900*Math.sin(a2)}Z" fill="${pick(P)}" opacity=".45"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="${r(25,55)}" fill="${pick(P)}"/>`; }
  if (style === "rainbow") { const cx = r(W*.2,W*.8), cy = H + r(0,40);
    P.concat(P).forEach((c, i) => s += `<circle cx="${cx}" cy="${cy}" r="${220 - i*24}" fill="${c}"/>`); }
  if (style === "squiggles") for (let i = 0; i < 9; i++) { let x = r(-20,W), y = r(0,H), d = `M${x} ${y}`;
    for (let j = 0; j < 6; j++) d += ` q 15 ${j%2 ? 18 : -18} 30 0`;
    s += `<path d="${d}" stroke="${pick(P)}" stroke-width="${r(4,9)}" fill="none" stroke-linecap="round" transform="rotate(${r(-30,30)} ${x} ${y})"/>`; }
  if (style === "dots") { const g = r(26,44), rr = r(5,11);
    for (let x = g/2; x < W; x += g) for (let y = g/2; y < H; y += g) s += `<circle cx="${x + (Math.round(y/g)%2 ? g/2 : 0)}" cy="${y}" r="${rr}" fill="${P[(Math.round(x/g)+Math.round(y/g))%4]}" opacity=".7"/>`; }
  if (style === "memphis") for (let i = 0; i < 14; i++) { const x = r(0,W), y = r(0,H), c = pick(P), k = Math.floor(r(0,4)), z = r(14,34);
    s += [`<polygon points="${x},${y-z} ${x+z},${y+z} ${x-z},${y+z}" fill="${c}"/>`, `<circle cx="${x}" cy="${y}" r="${z/1.5}" fill="none" stroke="${c}" stroke-width="6"/>`,
      `<rect x="${x}" y="${y}" width="${z}" height="${z}" fill="${c}" transform="rotate(${r(0,90)} ${x} ${y})"/>`, `<path d="M${x} ${y} l${z} ${-z/2} l${z} ${z/2}" stroke="${c}" stroke-width="6" fill="none"/>`][k]; }
  if (style === "bubbles") for (let i = 0; i < 16; i++) { const x = r(0,W), y = r(0,H), z = r(8,45);
    s += `<circle cx="${x}" cy="${y}" r="${z}" fill="${pick(P)}" opacity=".35" stroke="#fff" stroke-width="2"/><circle cx="${x - z/3}" cy="${y - z/3}" r="${z/5}" fill="#fff" opacity=".7"/>`; }
  // sprinkle a little sparkle on some cards for extra variety
  if (R() < .4) for (let i = 0; i < 6; i++) { const x = r(0,W), y = r(0,H), z = r(4,9); s += `<path d="M${x} ${y-z} L${x+z/3} ${y-z/3} L${x+z} ${y} L${x+z/3} ${y+z/3} L${x} ${y+z} L${x-z/3} ${y+z/3} L${x-z} ${y} L${x-z/3} ${y-z/3}Z" fill="#fff" opacity=".85"/>`; }
  return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${bg}${s}</svg>`);
}

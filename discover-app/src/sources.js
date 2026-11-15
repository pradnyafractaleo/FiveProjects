// Content comes from Wikipedia's free search API (no key needed).
// Each category's search words find up to 8 articles; each becomes a card.

const LICENSE = ["CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"];

// Keep summaries short (55 words or fewer), ending at a full sentence where possible
export function shorten(t, max = 55) {
  const sents = (t || "").match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [];
  let out = "", n = 0;
  for (const s of sents) { const w = s.trim().split(/\s+/).length; if (n + w > max) break; out += s; n += w; }
  if (!out.trim() && t) out = t.split(/\s+/).slice(0, max).join(" ") + "…";
  return out.trim();
}

// Returns [{ title, summary, url, source, license }] for a category, or [] if Wikipedia can't be reached
export async function fetchCategory(cat) {
  const q = encodeURIComponent(cat.query || cat.name);
  try {
    const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=8&prop=extracts|info&exintro=1&explaintext=1&exsentences=5&inprop=url&format=json&origin=*`);
    if (!r.ok) return [];
    const d = await r.json();
    return Object.values(d.query?.pages || {})
      .sort((a, b) => a.index - b.index) // keep Wikipedia's ranking so cached and fresh rows match
      .map(p => ({ title: p.title, summary: shorten(p.extract), url: p.fullurl, source: "Wikipedia", license: LICENSE }));
  } catch { return []; }
}

// Settings: this device's saved copy wins, else the published config.json
export async function loadConfig() {
  try {
    const local = JSON.parse(localStorage.getItem("nuggetConfig"));
    if (local && !(local.localUntil && Date.now() > local.localUntil)) return local;
  } catch {}
  return (await fetch("config.json?" + Date.now())).json();
}

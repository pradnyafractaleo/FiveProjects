// Free, keyless sources (Wikipedia only for now). Each returns [{title,image,summary,url,source}]
const strip = s => (s || "").replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
const get = async u => { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return r.json(); };

const SOURCES = {
  wikipedia: async (c) => {
    const q = encodeURIComponent(c.query || c.name);
    const d = await get(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=8&prop=pageimages|extracts|info&exintro=1&explaintext=1&exsentences=5&piprop=thumbnail&pithumbsize=500&inprop=url&format=json&origin=*`);
    return Object.values(d.query?.pages || {}).map(p => ({ title: p.title, image: p.thumbnail?.source, summary: p.extract, url: p.fullurl, source: "Wikipedia", license: ["CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"] }));
  },
};
const SOURCE_NAMES = { wikipedia: "Wikipedia" };

async function fetchCategory(c) {
  const lists = await Promise.allSettled((c.sources || Object.keys(SOURCES)).map(s => SOURCES[s] ? SOURCES[s](c) : []));
  const all = lists.flatMap(l => l.status === "fulfilled" ? l.value : []);
  // interleave sources a bit by shuffling
  return all.sort(() => Math.random() - 0.5).slice(0, 16);
}

// Config: this device's saved copy wins, else the published config.json
async function loadConfig() {
  try { const local = localStorage.getItem("nuggetConfig"); if (local) return JSON.parse(local); } catch {}
  return (await fetch("config.json?" + Date.now())).json();
}

// Smithsonian Open Access images (CC0 only). Needs a free api.data.gov key set in Admin.
// Results (including misses) are cached in this browser so each title is looked up once.
async function siSearch(q, key) {
  const u = `https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(`${q} AND online_media_type:"Images"`)}&rows=10&api_key=${encodeURIComponent(key)}`;
  const d = await get(u);
  for (const r of d.response?.rows || []) {
    const c = r.content || {};
    const m = (c.descriptiveNonRepeating?.online_media?.media || []).find(x => x.type === "Images" && x.usage?.access === "CC0");
    if (m) return { url: m.thumbnail || m.content, title: r.title, link: c.descriptiveNonRepeating?.record_link || `https://collections.si.edu/search/detail/${r.id}` };
  }
  return null;
}
async function siImage(title, fallback, key) {
  if (!key) return null;
  const ck = "si:" + title;
  try { const hit = localStorage.getItem(ck); if (hit) return JSON.parse(hit); } catch {}
  let res = null;
  try { res = await siSearch(title, key) || (fallback ? await siSearch(fallback, key) : null); } catch { return null; }
  try { localStorage.setItem(ck, JSON.stringify(res)); } catch {}
  return res;
}

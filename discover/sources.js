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

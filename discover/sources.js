// Free, keyless sources. Each returns [{title,image,summary,url,source}]
const strip = s => (s || "").replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
const get = async u => { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return r.json(); };

const SOURCES = {
  wikipedia: async (c) => {
    const q = encodeURIComponent(c.query || c.name);
    const d = await get(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=8&prop=pageimages|extracts|info&exintro=1&explaintext=1&exsentences=5&piprop=thumbnail&pithumbsize=500&inprop=url&format=json&origin=*`);
    return Object.values(d.query?.pages || {}).map(p => ({ title: p.title, image: p.thumbnail?.source, summary: p.extract, url: p.fullurl, source: "Wikipedia", license: ["CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0/"] }));
  },
  reddit: async (c) => {
    const u = c.subreddit ? `https://www.reddit.com/r/${c.subreddit}/top.json?t=week&limit=10`
      : `https://www.reddit.com/search.json?q=${encodeURIComponent(c.query || c.name)}&sort=top&t=week&limit=10`;
    const d = await get(u);
    return d.data.children.map(x => x.data).filter(p => !p.over_18).map(p => ({
      title: p.title,
      // Title + link only: we don't copy Reddit users' posts or images
      summary: `A popular post on r/${p.subreddit} (${p.ups} upvotes). Open it on Reddit to read the full post and comments.`,
      url: "https://www.reddit.com" + p.permalink, source: "Reddit" }));
  },
  devto: async (c) => {
    const tag = (c.tag || c.name).toLowerCase().replace(/[^a-z0-9]/g, "");
    const d = await get(`https://dev.to/api/articles?tag=${tag}&top=7&per_page=8`);
    return d.map(a => ({ title: a.title, image: a.cover_image || a.social_image, summary: a.description, url: a.url, source: "Dev.to", author: a.user?.name }));
  },
  hn: async (c) => {
    const d = await get(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(c.query || c.name)}&tags=story&hitsPerPage=8`);
    return d.hits.filter(h => h.url || h.story_text).map(h => ({ title: h.title, image: "", author: h.author, summary: `${h.points} points · ${h.num_comments} comments on Hacker News`, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, source: "Hacker News" }));
  },
};
const SOURCE_NAMES = { wikipedia: "Wikipedia", reddit: "Reddit", devto: "Dev.to", hn: "Hacker News" };

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

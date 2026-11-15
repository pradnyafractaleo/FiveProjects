import { useEffect, useRef, useState } from "react";
import { fetchCategory, loadConfig } from "./sources.js";
import { ART_STYLES, makeArt, titleColors } from "./art.js";

const styleOf = (c, i) => c.style || Object.keys(ART_STYLES)[i % 14];
const Art = ({ n, style, seed = "", className = "thumb" }) => (
  <div className={className} style={{ backgroundImage: `url("${makeArt(seed + n.title, style)}")` }} />
);

function Row({ cat, idx, onOpen }) {
  // Show the last saved cards instantly, then refresh them in the background
  const key = "row:" + (cat.query || cat.name);
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } });
  useEffect(() => {
    let live = true;
    fetchCategory(cat).then(x => {
      if (!live) return;
      if (x.length || !items) setItems(x);
      if (x.length) try { localStorage.setItem(key, JSON.stringify(x)); } catch {}
    });
    return () => { live = false; };
  }, [cat]);
  const style = styleOf(cat, idx);
  // The whole section (title and cards) appears together once its cards are ready
  if (!items) return null;
  return (
    <section className="row">
      <h2 className="cat-title" style={titleColors(cat.name)}>{cat.name}</h2>
      <div className="cards">
        {!items.length && <p className="empty">Nothing found right now. Try different search words in Admin.</p>}
        {items.map(n => (
          <div className="card" key={n.url} onClick={() => onOpen(n, style, cat.name)}>
            <Art n={n} style={style} seed={cat.name} />
            <div className="body">
              <h3>{n.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NuggetDialog({ open, onClose }) {
  const ref = useRef();
  useEffect(() => { if (open) { ref.current.showModal(); ref.current.focus(); } else if (ref.current.open) ref.current.close(); }, [open]);
  const n = open?.n;
  return (
    <dialog ref={ref} tabIndex={-1} onClose={onClose} onClick={e => e.target === ref.current && onClose()}>
      {n && <>
        <Art n={n} style={open.style} seed={open.seed} />
        <div className="inner">
          <h3>{n.title}</h3>
          <p>{n.summary || "No summary available. Tap Visit site to read more."}</p>
          <small className="note credit">Text: {n.source} · <a href={n.license[1]} target="_blank" rel="noopener">{n.license[0]}</a></small>
          <div className="actions">
            <button className="btn ghost" onClick={onClose}>Close</button>
            <a className="btn" href={n.url} target="_blank" rel="noopener">Visit site ↗</a>
          </div>
        </div>
      </>}
    </dialog>
  );
}

// Pull down at the top of the page to check for the newest version and reload (handy in the installed app)
function usePullToRefresh() {
  const [pull, setPull] = useState(0);
  useEffect(() => {
    let startY = null, startX = 0, dist = 0;
    const down = e => { startY = window.scrollY <= 0 ? e.touches[0].clientY : null; startX = e.touches[0].clientX; dist = 0; };
    const move = e => { if (startY === null) return; dist = Math.max(0, e.touches[0].clientY - startY);
      // ignore sideways swipes through the cards
      if (Math.abs(e.touches[0].clientX - startX) > dist) { startY = null; dist = 0; setPull(0); return; } setPull(Math.min(dist, 110)); };
    const up = async () => {
      if (startY !== null && dist > 80) {
        setPull(-1);
        try { const reg = await navigator.serviceWorker?.getRegistration(); await reg?.update(); } catch {}
        location.reload();
      } else setPull(0);
      startY = null;
    };
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("touchstart", down); window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
  }, []);
  return pull;
}

export default function Feed() {
  const pull = usePullToRefresh();
  const [cfg, setCfg] = useState(null), [q, setQ] = useState(""), [search, setSearch] = useState(null), [open, setOpen] = useState(null);
  useEffect(() => { loadConfig().then(c => { setCfg(c); document.title = c.title || "NuggetBox"; }); }, []);
  const cats = cfg ? [...(search ? [{ name: `Results for “${search}”`, query: search, style: "surprise" }] : []), ...cfg.categories] : [];
  return (
    <>
      {pull !== 0 && (
        <div className="ptr" style={{ height: pull < 0 ? 50 : pull / 1.6 }}>
          {pull < 0 ? "Refreshing…" : pull > 80 ? "↻ Release to refresh" : "↓ Pull to refresh"}
        </div>
      )}
      <header>
        <h1>{cfg?.title || "NuggetBox"}</h1>
        <a className="icon-btn" href="admin.html" aria-label="Admin settings" title="Admin">⚙️</a>
        <form className="search" onSubmit={e => { e.preventDefault(); setSearch(q.trim() || null); }}>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything… 🔍" />
          <button className="btn">Go</button>
        </form>
      </header>
      <main>{cats.map((c, i) => <Row key={c.name + i} cat={c} idx={i} onOpen={(n, style, seed) => setOpen({ n, style, seed })} />)}</main>
      <footer className="note" style={{ textAlign: "center", padding: "0 16px 24px" }}>
        Summaries and links belong to their original sources. <a href="about.html">About &amp; credits</a>
      </footer>
      <NuggetDialog open={open} onClose={() => setOpen(null)} />
    </>
  );
}

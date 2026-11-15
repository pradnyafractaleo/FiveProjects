import { useEffect, useRef, useState } from "react";
import { fetchCategory, loadConfig } from "./sources.js";
import { ART_STYLES, makeArt } from "./art.js";

const host = u => { try { return new URL(u).hostname.replace("www.", ""); } catch { return ""; } };
const styleOf = (c, i) => c.style || Object.keys(ART_STYLES)[i % 14];
const Art = ({ n, style, seed = "", className = "thumb" }) => (
  <div className={className} style={{ backgroundImage: `url("${makeArt(seed + n.title, style, "")}")` }} />
);

function Row({ cat, idx, onOpen }) {
  const [items, setItems] = useState(null);
  useEffect(() => { let live = true; fetchCategory(cat).then(x => live && setItems(x)); return () => { live = false; }; }, [cat]);
  const style = styleOf(cat, idx);
  return (
    <section className="row">
      <h2>{cat.emoji} {cat.name}</h2>
      <div className="cards">
        {!items && <p className="empty">Finding nuggets…</p>}
        {items && !items.length && <p className="empty">Nothing found right now. Try different search words in Admin.</p>}
        {items?.map(n => (
          <div className="card" key={n.url} onClick={() => onOpen(n, style, cat.name)}>
            <Art n={n} style={style} seed={cat.name} />
            <div className="body">
              <h3>{n.title}</h3>
              <div className="src">
                <span className="pill">{n.source}</span>
                <a href={n.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>{host(n.url)} ↗</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NuggetDialog({ open, onClose }) {
  const ref = useRef();
  useEffect(() => { open ? ref.current.showModal() : ref.current.open && ref.current.close(); }, [open]);
  const n = open?.n;
  return (
    <dialog ref={ref} onClose={onClose}>
      {n && <>
        <Art n={n} style={open.style} seed={open.seed} />
        <div className="inner">
          <h3>{n.title}</h3>
          <p>{n.summary || "No summary available. Tap Visit site to read more."}</p>
          <small className="note">Text: {n.source}, <a href={n.license[1]} target="_blank" rel="noopener">{n.license[0]}</a>. Art: drawn by this site.</small>
          <div className="actions">
            <button className="btn ghost" onClick={onClose}>Close</button>
            <a className="btn" href={n.url} target="_blank" rel="noopener">Visit site ↗</a>
          </div>
        </div>
      </>}
    </dialog>
  );
}

export default function Feed() {
  const [cfg, setCfg] = useState(null), [q, setQ] = useState(""), [search, setSearch] = useState(null), [open, setOpen] = useState(null);
  useEffect(() => { loadConfig().then(c => { setCfg(c); document.title = c.title || "NuggetBox"; }); }, []);
  const cats = cfg ? [...(search ? [{ name: `Results for “${search}”`, emoji: "🔎", query: search, style: "surprise", sources: ["wikipedia"] }] : []), ...cfg.categories] : [];
  return (
    <>
      <header>
        <h1>{cfg?.title || "NuggetBox"}</h1>
        <form className="search" onSubmit={e => { e.preventDefault(); setSearch(q.trim() || null); }}>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything… 🔍" />
          <button className="btn">Go</button>
        </form>
        <a className="btn ghost" href="admin.html">⚙️ Admin</a>
      </header>
      <main>{cats.map((c, i) => <Row key={c.name + i} cat={c} idx={i} onOpen={(n, style, seed) => setOpen({ n, style, seed })} />)}</main>
      <footer className="note" style={{ textAlign: "center", padding: "0 16px 24px" }}>
        Summaries and links belong to their original sources. <a href="about.html">About &amp; credits</a>
      </footer>
      <NuggetDialog open={open} onClose={() => setOpen(null)} />
    </>
  );
}

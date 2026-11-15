import { useState } from "react";
import { loadConfig } from "./sources.js";
import { ART_STYLES, makeArt } from "./art.js";

const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const ls = { get: k => { try { return localStorage.getItem(k) || ""; } catch { return ""; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

function CategoryEditor({ c, i, total, update, move, remove }) {
  const field = (k, label, cls = "") => (
    <div className={cls}><label>{label}</label><input type="text" value={c[k] || ""} onChange={e => update({ [k]: e.target.value })} /></div>
  );
  return (
    <div className="cat">
      {field("name", "Category name", "full")}
      <div className="full">
        <label>Card art style</label>{" "}
        <select value={c.style || "surprise"} onChange={e => update({ style: e.target.value })}>
          {Object.entries(ART_STYLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>{" "}
        <img alt="" src={makeArt(c.name || "x", c.style || "surprise", "")} style={{ height: 40, borderRadius: 8, verticalAlign: "middle" }} />
      </div>
      {field("query", "Search words (what to look up on Wikipedia)", "full")}
      <div className="full actions">
        <button className="btn ghost" disabled={i === 0} onClick={() => move(-1)}>↑</button>
        <button className="btn ghost" disabled={i === total - 1} onClick={() => move(1)}>↓</button>
        <button className="btn danger" onClick={() => confirm(`Delete ${c.name}?`) && remove()}>Delete</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [cfg, setCfg] = useState(null), [pass, setPass] = useState(""), [err, setErr] = useState(""), [status, setStatus] = useState("");
  const [gh, setGh] = useState({ repo: ls.get("ghRepo") || "pradnyafractaleo/FiveProjects", branch: ls.get("ghBranch") || "main", token: ls.get("ghToken"), newPass: "" });

  const unlock = async e => {
    e.preventDefault();
    const c = await loadConfig();
    if (await sha(pass) !== c.passcodeHash) return setErr("Wrong passcode 🙈");
    setCfg(c);
  };
  const setCats = f => setCfg(c => ({ ...c, categories: f([...c.categories]) }));

  const publish = async () => {
    const out = { ...cfg, ...(gh.newPass ? { passcodeHash: await sha(gh.newPass) } : {}) };
    ls.set("ghRepo", gh.repo); ls.set("ghBranch", gh.branch); ls.set("ghToken", gh.token);
    const api = `https://api.github.com/repos/${gh.repo}/contents/discover/config.json`;
    const h = { Authorization: `Bearer ${gh.token}`, Accept: "application/vnd.github+json" };
    setStatus("Publishing…");
    try {
      const cur = await fetch(`${api}?ref=${gh.branch}`, { headers: h }).then(r => r.ok ? r.json() : {});
      const body = JSON.stringify(out, null, 2);
      const r = await fetch(api, { method: "PUT", headers: h, body: JSON.stringify({ message: "Update feed categories", branch: gh.branch, sha: cur.sha,
        content: btoa(String.fromCharCode(...new TextEncoder().encode(body))) }) });
      if (!r.ok) throw new Error((await r.json()).message);
      try { localStorage.removeItem("nuggetConfig"); } catch {}
      setCfg(out); setStatus("Published 🎉 All devices update in about a minute.");
    } catch (x) { setStatus("Publish failed: " + x.message); }
  };

  return (
    <>
      <header><h1>⚙️ Admin</h1><a className="btn ghost" href="index.html">← Back to feed</a></header>
      {!cfg ? (
        <div className="panel">
          <p>Enter your passcode.</p>
          <form className="search" onSubmit={unlock}>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Passcode" />
            <button className="btn">Unlock</button>
          </form>
          <p className="note">{err}</p>
        </div>
      ) : (
        <div className="panel">
          <label className="note">Site title</label>
          <input type="text" value={cfg.title || ""} onChange={e => setCfg({ ...cfg, title: e.target.value })} />
          {cfg.categories.map((c, i) => (
            <CategoryEditor key={i} c={c} i={i} total={cfg.categories.length}
              update={p => setCats(L => { L[i] = { ...L[i], ...p }; return L; })}
              move={d => setCats(L => { [L[i], L[i + d]] = [L[i + d], L[i]]; return L; })}
              remove={() => setCats(L => { L.splice(i, 1); return L; })} />
          ))}
          <div className="actions">
            <button className="btn alt" onClick={() => setCats(L => [...L, { name: "New category", emoji: "✨", query: "", style: "surprise", sources: ["wikipedia"] }])}>➕ Add category</button>
            <button className="btn" onClick={() => { ls.set("nuggetConfig", JSON.stringify(cfg)); setStatus("Saved on this device ✅"); }}>💾 Save on this device</button>
          </div>
          <h2>Sync to all devices</h2>
          <p className="note">Publishing writes config.json to GitHub so your PC, Mac and iPhone all see the same categories. Needs a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained GitHub token</a> with "Contents: read and write" on this repo only. It is stored only in this browser.</p>
          {[["repo", "owner/repo", "text"], ["branch", "branch e.g. main", "text"], ["token", "GitHub token", "password"], ["newPass", "New passcode (optional)", "text"]].map(([k, ph, t]) => (
            <input key={k} type={t} placeholder={ph} value={gh[k]} onChange={e => setGh({ ...gh, [k]: e.target.value })} style={{ marginTop: 8 }} />
          ))}
          <div className="actions" style={{ marginTop: 8 }}><button className="btn danger" onClick={publish}>🚀 Publish to all devices</button></div>
          <p className="note">{status}</p>
        </div>
      )}
    </>
  );
}

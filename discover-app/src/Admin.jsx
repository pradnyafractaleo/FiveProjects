import { useState } from "react";
import { loadConfig } from "./sources.js";
import { ART_STYLES, makeArt } from "./art.js";

const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const REPO = "pradnyafractaleo/FiveProjects", BRANCH = "main";
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
        <img alt="" src={makeArt(c.name || "x", c.style || "surprise")} style={{ height: 40, borderRadius: 8, verticalAlign: "middle" }} />
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
  const [token, setToken] = useState(ls.get("ghToken")), [newPass, setNewPass] = useState(""), [setupOpen, setSetupOpen] = useState(false);

  const unlock = async e => {
    e.preventDefault();
    const c = await loadConfig();
    if (await sha(pass) !== c.passcodeHash) return setErr("Wrong passcode 🙈");
    setCfg(c);
  };
  const setCats = f => setCfg(c => ({ ...c, categories: f([...c.categories]) }));

  // One Save: shows the change on this device right away, and publishes it to all devices when the one-time setup is done
  const save = async () => {
    const out = { ...cfg, ...(newPass ? { passcodeHash: await sha(newPass) } : {}) };
    if (!token) {
      ls.set("nuggetConfig", JSON.stringify(out));
      setSetupOpen(true);
      return setStatus("Saved on this device. To update all your devices, finish the one-time setup below.");
    }
    ls.set("ghToken", token);
    const api = `https://api.github.com/repos/${REPO}/contents/discover/config.json`;
    const h = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };
    setStatus("Saving…");
    try {
      const cur = await fetch(`${api}?ref=${BRANCH}`, { headers: h }).then(r => r.ok ? r.json() : {});
      const r = await fetch(api, { method: "PUT", headers: h, body: JSON.stringify({ message: "Update NuggetBox settings", branch: BRANCH, sha: cur.sha,
        content: btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(out, null, 2)))) }) });
      if (!r.ok) throw new Error((await r.json()).message);
      // Show it here at once; the published copy takes over after the site updates (about a minute)
      ls.set("nuggetConfig", JSON.stringify({ ...out, localUntil: Date.now() + 5 * 60 * 1000 }));
      setCfg(out); setNewPass(""); setStatus("Saved ✅ All your devices will show it in about a minute.");
    } catch (x) { setSetupOpen(true); setStatus("Saved on this device, but couldn't update other devices: " + x.message); ls.set("nuggetConfig", JSON.stringify(out)); }
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
            <button className="btn alt" onClick={() => setCats(L => [...L, { name: "New category", query: "", style: "surprise" }])}>➕ Add category</button>
            <button className="btn" onClick={save}>💾 Save</button>
          </div>
          <p className="note">{status}</p>
          <details className="setup" open={setupOpen} onToggle={e => setSetupOpen(e.target.open)}>
            <summary>One-time setup{token ? " ✓" : ""}</summary>
            <p className="note">So Save updates your phone and computers together, paste a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">GitHub token</a> once on each device (give it "Contents: read and write" on the FiveProjects repo only). It stays on this device.</p>
            <input type="password" placeholder="GitHub token" value={token} onChange={e => { setToken(e.target.value); ls.set("ghToken", e.target.value); }} />
            <p className="note">Change admin passcode (optional, applies on Save)</p>
            <input type="text" placeholder="New passcode" value={newPass} onChange={e => setNewPass(e.target.value)} />
          </details>
        </div>
      )}
    </>
  );
}

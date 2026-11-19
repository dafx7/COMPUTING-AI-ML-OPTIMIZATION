"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [nick, setNick] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function join(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, nick }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      try { localStorage.setItem("tl-player", JSON.stringify(j)); } catch {}
      window.location.href = "/play";
    } catch (e2) { setErr(e2.message || "Could not join."); setBusy(false); }
  }

  return (
    <main className="wrap">
      <h1>Turun Lembah</h1>
      <p className="lede">Six valleys, one ball, one learning rate. You get <b>one attempt per level</b>, so guessing does not work. Think about the slope, then commit.</p>
      <form onSubmit={join} className="panel">
        <div className="knob"><label htmlFor="code">Session code</label><br />
          <input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="GD1234" autoComplete="off" required /></div>
        <div className="knob"><label htmlFor="nick">Nickname</label><br />
          <input id="nick" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} placeholder="2 to 20 characters" autoComplete="off" required /></div>
        <p className="small">Use a nickname, not your real name. Session data is deleted after class.</p>
        <button type="submit" disabled={busy}>Join</button>
        {err && <p className="bad" role="alert">{err}</p>}
      </form>
      <p className="small">No session code? Try the levels on your own in <a href="/practice">Practice</a>.</p>
    </main>
  );
}

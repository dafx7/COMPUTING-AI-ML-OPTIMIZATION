"use client";
import { useCallback, useEffect, useState } from "react";
import LevelPanel from "@/components/LevelPanel";

export default function Play() {
  const [me, setMe] = useState(null);
  const [st, setSt] = useState(null);
  const [result, setResult] = useState(null);
  const [fog, setFog] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    try { const p = JSON.parse(localStorage.getItem("tl-player") || "null"); if (p) setMe(p); else window.location.href = "/"; }
    catch { window.location.href = "/"; }
  }, []);

  const poll = useCallback(async () => {
    if (!me) return;
    try {
      const r = await fetch(`/api/state?code=${encodeURIComponent(me.code)}&pid=${me.pid}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) { setErr(j.error); if (r.status === 401 || r.status === 404) { localStorage.removeItem("tl-player"); } return; }
      setErr("");
      setSt((old) => {
        if (!old || old.level !== j.level) { setResult(null); setFog(null); }
        return j;
      });
      if (j.fog) setFog((f) => (!f || (j.fog.etas.length > f.etas.length) ? j.fog : f));
      if (j.mine) setResult((r0) => r0 || j.mine);
    } catch { setErr("Connection problem. Retrying…"); }
  }, [me]);

  useEffect(() => { poll(); const t = setInterval(poll, 2000); return () => clearInterval(t); }, [poll]);

  async function onCommit(choice) {
    const r = await fetch("/api/commit", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: me.code, pid: me.pid, level: st.level, choice }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    setResult(j);
  }

  async function onFogStep(eta) {
    const r = await fetch("/api/fog", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: me.code, pid: me.pid, eta }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    setFog({ etas: j.etas, view: j.view });
    if (j.finished) setResult({ ...j.finished, path: j.view });
  }

  if (!me) return <main className="wrap"><p>Loading…</p></main>;
  const res = result;
  return (
    <main className="wrap">
      <p className="small">Session <b className="num">{me.code}</b> · playing as <b>{me.nick}</b>{st ? <> · total <b className="num">{st.total}</b></> : null}</p>
      {err && <p className="notice" role="status">{err}</p>}
      {!st && <p>Connecting…</p>}
      {st && st.phase === "lobby" && <div className="panel"><h2>You are in.</h2><p>Wait for your mentor to open level 1. Keep this page open.</p></div>}
      {st && st.phase === "done" && <div className="panel"><h2>Finished</h2><p>Your total: <b className="num">{st.total}</b> out of 600. Look at the projector for the ranking.</p></div>}
      {st && (st.phase === "open" || st.phase === "reveal") && st.current && (
        <>
          <LevelPanel level={st.current} result={res}
            fog={st.current.id === 6 ? (fog || { etas: [], view: [] }) : null}
            onCommit={onCommit} onFogStep={onFogStep} />
          {st.phase === "reveal" && <p className="notice">This level is closed. Look at the projector.</p>}
          {st.phase === "open" && (res || st.mine) && <p className="small">Locked in. Wait for the next level.</p>}
        </>
      )}
    </main>
  );
}

"use client";
// Projector view for mentors: create a session, open and reveal levels, show the class's answers.
import { useCallback, useEffect, useState } from "react";

const AXES = {
  1: { label: "η × 2c   (1 = perfect step, 2 or more = flies off)", min: 0, max: 3, zones: [[0, 0.5, "slow"], [0.5, 1.5, "good"], [1.5, 2, "zig-zag"], [2, 3, "flies off"]] },
  2: { label: "η × 2c   (1 = perfect step, 2 or more = flies off)", min: 0, max: 3, zones: [[0, 0.5, "slow"], [0.5, 1.5, "good"], [1.5, 2, "zig-zag"], [2, 3, "flies off"]] },
  3: { label: "η × 2c   (exactly 1 lands on the bottom in one step)", min: 0, max: 3, zones: [[0, 0.8, "too short"], [0.8, 1.2, "on target"], [1.2, 2, "too far"], [2, 3, "flies off"]] },
  4: { label: "η × 2·c(steep direction)   (2 or more = flies off in the steep direction)", min: 0, max: 3, zones: [[0, 0.6, "too careful"], [0.6, 2, "workable"], [2, 3, "flies off"]] },
  5: { label: "start position   (right of 0 = on the side of the deeper valley)", min: -3, max: 3, zones: [[-3, 0, "shallow side"], [0, 3, "deep side"]] },
  6: { label: "final score in the fog", min: 0, max: 100, zones: [[0, 50, ""], [50, 90, ""], [90, 100, "found the bottom"]] },
};

function Strip({ level, answers }) {
  const ax = AXES[level];
  if (!ax) return null;
  const W = 900, H = 230, P = 40;
  const X = (v) => P + (Math.max(ax.min, Math.min(ax.max, v)) - ax.min) / (ax.max - ax.min) * (W - 2 * P);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="valley" role="img" aria-label={"Class answers for level " + level}>
      {ax.zones.map(([a, b, t], i) => (
        <g key={i}>
          <rect x={X(a)} y={20} width={X(b) - X(a)} height={H - 70} fill={i % 2 ? "#efe9dc" : "#f8f5ee"} />
          <text x={(X(a) + X(b)) / 2} y={38} fontSize="15" textAnchor="middle" fill="#5d5b54">{t}</text>
        </g>
      ))}
      <line x1={P} y1={H - 50} x2={W - P} y2={H - 50} stroke="#1e1d1a" />
      {[ax.min, (ax.min + ax.max) / 2, ax.max].map((t) => <text key={t} x={X(t)} y={H - 30} fontSize="14" textAnchor="middle">{t}</text>)}
      <text x={W / 2} y={H - 8} fontSize="14" textAnchor="middle" fill="#5d5b54">{ax.label}</text>
      {answers.map((a, i) => (
        <circle key={i} cx={X(a.x)} cy={60 + ((i * 37) % (H - 130))} r="8"
          fill={a.blown ? "#9b2c22" : a.score >= 90 ? "#2f6b2f" : a.score >= 50 ? "#d48806" : "#8a8577"} opacity="0.85">
          <title>{`${a.nick}: ${a.score}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function Stage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [host, setHost] = useState("");

  useEffect(() => { setHost(window.location.host); }, []);
  useEffect(() => { try { const k = sessionStorage.getItem("tl-key"); const c = sessionStorage.getItem("tl-code"); if (k) { setKey(k); setAuthed(true); } if (c) setCode(c); } catch {} }, []);

  const api = useCallback(async (action, extra = {}) => {
    const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json", "x-mentor-key": key }, body: JSON.stringify({ action, code, ...extra }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    return j;
  }, [key, code]);

  async function login(e) {
    e.preventDefault(); setErr("");
    try { await api("check"); setAuthed(true); try { sessionStorage.setItem("tl-key", key); } catch {} } catch (e2) { setErr(e2.message); }
  }
  async function create() {
    try { const j = await api("create"); setCode(j.code); try { sessionStorage.setItem("tl-code", j.code); } catch {} } catch (e) { setErr(e.message); }
  }
  async function phase(level, ph) { try { await api("phase", { level, phase: ph }); poll(); } catch (e) { setErr(e.message); } }
  async function wipe() {
    if (!window.confirm(`Delete all data of session ${code}? This cannot be undone.`)) return;
    try { await api("delete"); setData(null); setCode(""); try { sessionStorage.removeItem("tl-code"); } catch {} } catch (e) { setErr(e.message); }
  }

  const poll = useCallback(async () => {
    if (!authed || !code) return;
    try {
      const r = await fetch(`/api/results?code=${code}`, { headers: { "x-mentor-key": key }, cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setData(j); setErr("");
    } catch (e) { setErr(e.message); }
  }, [authed, code, key]);
  useEffect(() => { poll(); const t = setInterval(poll, 2000); return () => clearInterval(t); }, [poll]);

  if (!authed) return (
    <main className="wrap">
      <h1>Stage</h1>
      <form onSubmit={login} className="panel">
        <label htmlFor="k">Mentor key</label><br />
        <input id="k" type="password" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
        <button type="submit" style={{ marginLeft: 8 }}>Enter</button>
        {err && <p className="bad">{err}</p>}
        <p className="small">The key is set as MENTOR_KEY in the Vercel project settings. It is kept only in this browser tab.</p>
      </form>
    </main>
  );

  const s = data?.session;
  const lv = s?.level ?? 0;
  return (
    <main className="wrap wide">
      {err && <p className="notice">{err}</p>}
      {!code && <div className="panel"><button onClick={create}>Create a new session</button>
        <span className="small" style={{ marginLeft: 12 }}>or reconnect: </span>
        <input aria-label="Existing session code" placeholder="GD1234" onKeyDown={(e) => { if (e.key === "Enter") { setCode(e.currentTarget.value.toUpperCase()); try { sessionStorage.setItem("tl-code", e.currentTarget.value.toUpperCase()); } catch {} } }} /></div>}
      {code && (
        <div className="stage-grid">
          <section>
            <p className="small">Join at <b>{host}</b> with code</p>
            <p className="code">{code}</p>
            <p>Joined: <b className="num">{data?.joined ?? 0}</b>{lv > 0 && <> · answered level {lv}: <b className="num">{data?.answers.length ?? 0}</b></>}</p>
            <div className="row">
              {lv === 0 && <button onClick={() => phase(1, "open")}>Open level 1</button>}
              {lv > 0 && s.phase === "open" && <button onClick={() => phase(lv, "reveal")}>Close and reveal level {lv}</button>}
              {lv > 0 && lv < 6 && s.phase === "reveal" && <button onClick={() => phase(lv + 1, "open")}>Open level {lv + 1}</button>}
              {lv === 6 && s.phase === "reveal" && <button onClick={() => phase(6, "done")}>Finish game</button>}
              <button className="danger" onClick={wipe}>Delete session data</button>
            </div>
            {lv > 0 && s.phase !== "open" && data && <><h2>Level {lv}: the class</h2><Strip level={lv} answers={data.answers} />
              <p className="small">Dots: green 90+, orange 50 to 90, grey below 50, red flew off.</p></>}
            {lv > 0 && s.phase === "open" && <p className="notice">Level {lv} is open. Answers stay hidden until you reveal.</p>}
          </section>
          <section>
            <h2>Ranking</h2>
            <table><thead><tr><th>#</th><th>Nickname</th><th className="r">Total</th></tr></thead>
              <tbody>{(data?.ranking || []).slice(0, 15).map((r, i) => <tr key={r.nick}><td>{i + 1}</td><td>{r.nick}</td><td className="r num">{r.total}</td></tr>)}</tbody></table>
          </section>
        </div>
      )}
    </main>
  );
}

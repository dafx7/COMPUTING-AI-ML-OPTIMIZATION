"use client";
// One level: the brief, the controls, one commit, then the animated result.
import { useEffect, useState } from "react";
import Valley from "./Valley";

const STEP_MS = 650;

function Knob({ id, label, value, setValue, min, max, step, disabled, hint }) {
  return (
    <div className="knob">
      <div className="knob-head"><label htmlFor={id}>{label}</label><output htmlFor={id}>{value.toFixed(step < 0.1 ? 2 : 1)}</output></div>
      {hint && <div className="small">{hint}</div>}
      <div className="knob-row">
        <input type="range" id={id} min={min} max={max} step={step} value={value} disabled={disabled}
          onChange={(e) => setValue(Number(e.target.value))} />
        <input type="number" aria-label={label + " (exact)"} min={min} max={max} step={step} value={value} disabled={disabled}
          onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) setValue(Math.min(max, Math.max(min, v))); }} />
      </div>
    </div>
  );
}

export default function LevelPanel({ level, result, onCommit, fog, onFogStep, practice }) {
  const [eta, setEta] = useState(0.1);
  const [start, setStart] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [shown, setShown] = useState(0);
  const path = result?.path || (fog ? fog.view : null) || [{ w: level.id === 5 ? start : level.start ?? 0, a: 0, f: NaN }];

  // animate the steps of a committed result
  useEffect(() => {
    if (!result?.path) { setShown(fog ? Math.max(0, (fog.view?.length || 1) - 1) : 0); return; }
    setShown(0);
    let k = 0;
    const t = setInterval(() => { k += 1; setShown(k); if (k >= result.path.length - 1) clearInterval(t); }, STEP_MS);
    return () => clearInterval(t);
  }, [result, fog?.view?.length]);

  useEffect(() => { setErr(""); setEta(0.1); setStart(0); }, [level.id]);

  const preview = level.id === 5 && !result
    ? [{ w: start, f: ((start * start - 4) ** 2) / 4 + level.t * start }]
    : level.dims === 2 && !result ? [{ w: 0, a: 0, f: 0 }]
    : !result && !fog && level.c != null ? [{ w: level.start, f: level.c * (level.start - level.m) ** 2 }]
    : path;

  async function lockIn() {
    const msg = practice ? null : "One attempt only. Lock in this choice?";
    if (msg && !window.confirm(msg)) return;
    setBusy(true); setErr("");
    try { await onCommit(level.id === 5 ? { start, eta } : { eta }); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function fogGo() {
    setBusy(true); setErr("");
    try { await onFogStep(eta); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  const locked = Boolean(result);
  const fogDone = level.id === 6 && (fog?.etas?.length || 0) >= level.steps;
  return (
    <section className="panel" aria-labelledby={"lv" + level.id}>
      <p className="small">Level {level.id} of 6</p>
      <h2 id={"lv" + level.id} style={{ marginTop: 0 }}>{level.name}</h2>
      <p className="formula">{level.brief}</p>
      <Valley level={level} path={result ? result.path : fog ? fog.view : preview} shown={result ? shown : (fog ? Math.max(0, fog.view.length - 1) : 0)} />

      {level.id === 6 && fog && (
        <table className="steps" style={{ marginTop: 10 }}>
          <thead><tr><th>Step</th><th className="r">w</th><th className="r">height f(w)</th><th className="r">slope f′(w)</th><th className="r">your η</th></tr></thead>
          <tbody>{fog.view.map((p, i) => (
            <tr key={i}><td>{i}</td><td className="r">{p.w}</td><td className="r">{p.f}</td><td className="r">{p.g}</td><td className="r">{fog.etas[i] ?? ""}</td></tr>
          ))}</tbody>
        </table>
      )}

      {!locked && level.id !== 6 && (
        <div>
          {level.id === 5 && <Knob id="start" label="Start w" value={start} setValue={setStart} min={level.startMin} max={level.startMax} step={0.1} disabled={busy} />}
          <Knob id="eta" label="Learning rate η" value={eta} setValue={setEta} min={0} max={level.etaMax} step={0.01} disabled={busy}
            hint={`Each step: w ← w − η · f′(w). Allowed: 0 to ${level.etaMax}.`} />
          <button onClick={lockIn} disabled={busy}>{practice ? "Run" : "Lock in"}</button>
        </div>
      )}

      {level.id === 6 && !locked && !fogDone && (
        <div>
          <Knob id="eta" label={`η for step ${(fog?.etas?.length || 0) + 1} of ${level.steps}`} value={eta} setValue={setEta} min={0} max={level.etaMax} step={0.01} disabled={busy}
            hint="Each step is final once sent. Read the slope before you choose." />
          <button onClick={fogGo} disabled={busy}>Take this step</button>
        </div>
      )}

      {err && <p className="bad" role="alert">{err}</p>}

      {locked && (
        <div aria-live="polite">
          {shown >= (result.path.length - 1) || !result.path ? (
            result.blown
              ? <><p className="score bad">0</p><p>The ball flew off the valley. η was too large for this slope.</p></>
              : <><p className="score num">{result.score}</p><p className="small">points out of 100</p></>
          ) : <p className="small">Rolling… step {shown} of {result.path.length - 1}</p>}
        </div>
      )}
    </section>
  );
}

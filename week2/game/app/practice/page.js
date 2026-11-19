"use client";
// Practice at home: same levels, random numbers, retries allowed, no server.
import { useEffect, useMemo, useState } from "react";
import LevelPanel from "@/components/LevelPanel";
import { makeLevels, play, publicLevel, validateChoice, fogView } from "@/lib/engine.mjs";

const TIPS = {
  1: "For f(w) = c(w − m)², the slope is 2c(w − m). One step of size η = 1/(2c) lands exactly on m.",
  2: "A steeper valley (larger c) needs a smaller η. Above η = 1/c the ball overshoots further every step.",
  3: "One perfect step: η = 1/(2c).",
  4: "One η for both directions. The steep direction (larger c) limits how large η can be; the flat direction then moves slowly. A good compromise is about 1/(c1 + c2).",
  5: "Gradient descent goes downhill from where it starts. Start on the side of the deeper valley.",
  6: "Take a small first step. The change in slope divided by the change in w tells you how steep the valley is (2c). Then η = 1/(2c) jumps to the bottom.",
};

export default function Practice() {
  // the seed is chosen in the browser only, so the server render and the browser agree
  const [seed, setSeed] = useState("");
  useEffect(() => { setSeed(String(Math.random()).slice(2, 8)); }, []);
  const levels = useMemo(() => makeLevels("practice:" + seed), [seed]);
  const [i, setI] = useState(0);
  const [result, setResult] = useState(null);
  const [fog, setFog] = useState({ etas: [], view: [] });
  const lv = levels[i];

  function reset(k = i) { setI(k); setResult(null); const l = levels[k]; setFog({ etas: [], view: l.id === 6 ? fogView(l, []) : [] }); }

  async function onCommit(choice) {
    const c = validateChoice(lv, choice);
    if (!c) throw new Error("That choice is outside the allowed range.");
    setResult(null);
    setTimeout(() => setResult(play(lv, c)), 0);
  }
  async function onFogStep(eta) {
    const etas = [...fog.etas, eta];
    const view = fogView(lv, etas);
    const r = play(lv, { etas });
    setFog({ etas, view });
    if (etas.length === lv.steps || r.blown) setResult({ ...r, path: view });
  }

  if (!seed) return <main className="wrap"><h1>Practice</h1><p>Loading…</p></main>;
  return (
    <main className="wrap">
      <h1>Practice</h1>
      <p className="lede">Same six levels with your own random numbers. Retries are allowed here; in class they are not.</p>
      <div className="row">
        {levels.map((l, k) => <button key={l.id} className={k === i ? "" : "ghost"} onClick={() => reset(k)}>{l.id}</button>)}
        <button className="ghost" onClick={() => { setSeed(String(Math.random()).slice(2, 8)); setI(0); setResult(null); setFog({ etas: [], view: [] }); }}>New numbers</button>
      </div>
      <LevelPanel key={seed + ":" + i} level={publicLevel(lv)} result={result}
        fog={lv.id === 6 ? (fog.view.length ? fog : { etas: [], view: fogView(lv, []) }) : null}
        onCommit={onCommit} onFogStep={onFogStep} practice />
      {result && (
        <div className="panel">
          <p><b>Why:</b> {TIPS[lv.id]}</p>
          <div className="row"><button className="ghost" onClick={() => reset()}>Try again</button>{i < 5 && <button onClick={() => reset(i + 1)}>Next level</button>}</div>
        </div>
      )}
    </main>
  );
}

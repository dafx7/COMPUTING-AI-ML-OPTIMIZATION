// Turun Lembah: gradient descent levels, simulation and scoring.
// Shared by the browser (to animate) and the server (to score).
// Deterministic: the same seed and the same choice always give the same result.

export const LEVEL_COUNT = 6;
export const BLOW_UP = 60; // |w| beyond this counts as flying off the curve

// ------------------------------------------------------------------ randomness
export function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }

// ------------------------------------------------------------------ functions
// A bowl: f(w) = c (w - m)^2
function bowl(c, m) {
  return { kind: "bowl", c, m, f: (w) => c * (w - m) * (w - m), df: (w) => 2 * c * (w - m), fmin: 0, wmin: m };
}

// Two valleys: f(w) = (w^2 - 4)^2 / 4 + t w   (t tilts one valley deeper)
function twoValleys(t) {
  const f = (w) => ((w * w - 4) * (w * w - 4)) / 4 + t * w;
  const df = (w) => w * (w * w - 4) + t;
  // global minimum by a fine scan (only used for scoring)
  let wmin = -3, fmin = Infinity;
  for (let k = 0; k <= 6000; k++) {
    const w = -3 + k * 0.001, v = f(w);
    if (v < fmin) { fmin = v; wmin = w; }
  }
  return { kind: "two", t, f, df, fmin, wmin };
}

// ------------------------------------------------------------------ levels
// Each player gets slightly different numbers from their seed, so copying a
// neighbour's answer does not help. Understanding their reasoning does.
export function makeLevels(seed) {
  const rnd = mulberry32(hashString(String(seed)));
  const L = [];

  // 1. Gentle bowl
  {
    const m = pick(rnd, [2, 2.5, 3, 3.5, 4, 4.5, 5]);
    L.push({
      id: 1, name: "Gentle valley", dims: 1, steps: 3, start: 0, visible: true,
      fn: bowl(1, m), c: 1, m,
      choose: ["eta"], etaMax: 1.2,
      brief: `f(w) = (w − ${fmt(m)})². Start at w = 0. You get 3 steps.`,
    });
  }
  // 2. Steep bowl
  {
    const c = pick(rnd, [3, 4, 5]);
    const m = pick(rnd, [2, 2.5, 3, 3.5, 4]);
    L.push({
      id: 2, name: "Steep valley", dims: 1, steps: 5, start: 0, visible: true,
      fn: bowl(c, m), c, m,
      choose: ["eta"], etaMax: 1.2,
      brief: `f(w) = ${c}(w − ${fmt(m)})². Start at w = 0. You get 5 steps.`,
    });
  }
  // 3. One step
  {
    const c = pick(rnd, [1.25, 2, 2.5, 4, 5]);
    const m = pick(rnd, [2, 3, 4, 5]);
    L.push({
      id: 3, name: "One step", dims: 1, steps: 1, start: 0, visible: true,
      fn: bowl(c, m), c, m,
      choose: ["eta"], etaMax: 1.2,
      brief: `f(w) = ${fmt(c)}(w − ${m})². Start at w = 0. You get exactly 1 step. Land in the bottom.`,
    });
  }
  // 4. Long valley in two parameters
  {
    const c1 = pick(rnd, [0.5, 1]);
    const c2 = pick(rnd, [4, 5]);
    const m1 = pick(rnd, [6, 7]);
    const m2 = pick(rnd, [-2, 2]);
    L.push({
      id: 4, name: "Long valley", dims: 2, steps: 8, start: [0, 0], visible: true,
      c1, c2, m1, m2,
      choose: ["eta"], etaMax: 0.6,
      brief: `f(w, a) = ${fmt(c1)}(w − ${m1})² + ${c2}(a ${m2 < 0 ? "+" : "−"} ${Math.abs(m2)})². Start at (0, 0). One η for both. You get 8 steps.`,
    });
  }
  // 5. Two valleys: choose where to start and the step size
  {
    const t = pick(rnd, [-0.9, -0.7, 0.7, 0.9]);
    L.push({
      id: 5, name: "Two valleys", dims: 1, steps: 25, visible: true,
      fn: twoValleys(t), t,
      choose: ["start", "eta"], etaMax: 0.5, startMin: -3, startMax: 3,
      brief: `f(w) = (w² − 4)²/4 ${t < 0 ? "−" : "+"} ${fmt(Math.abs(t))}w. Choose your start (−3 to 3) and η. You get 25 steps. Only the deeper valley scores full points.`,
    });
  }
  // 6. Fog: the curve is hidden, choose each step as you go
  {
    const c = pick(rnd, [0.5, 1, 1.5, 2, 3]);
    const m = pick(rnd, [-4, -3, -2, 2, 3, 4]);
    L.push({
      id: 6, name: "Fog", dims: 1, steps: 4, start: 0, visible: false,
      fn: bowl(c, m), c, m,
      choose: ["etas"], etaMax: 1.5,
      brief: "The valley is hidden. At each step you only see your height and the slope under your feet. Choose η one step at a time. You get 4 steps.",
    });
  }
  return L;
}

function fmt(x) { return Number.isInteger(x) ? String(x) : String(x).replace(/\.?0+$/, ""); }

// ------------------------------------------------------------------ choices
// Round to two decimals so every device sends exactly the same numbers.
export function cleanEta(x, max) {
  const v = Math.round(Number(x) * 100) / 100;
  if (!Number.isFinite(v) || v < 0 || v > max) return null;
  return v;
}

export function validateChoice(level, choice) {
  if (!choice || typeof choice !== "object") return null;
  if (level.id === 6) {
    if (!Array.isArray(choice.etas) || choice.etas.length < 1 || choice.etas.length > level.steps) return null;
    const etas = choice.etas.map((e) => cleanEta(e, level.etaMax));
    if (etas.some((e) => e === null)) return null;
    return { etas };
  }
  const eta = cleanEta(choice.eta, level.etaMax);
  if (eta === null) return null;
  if (level.id === 5) {
    const s = Math.round(Number(choice.start) * 10) / 10;
    if (!Number.isFinite(s) || s < level.startMin || s > level.startMax) return null;
    return { eta, start: s };
  }
  return { eta };
}

// ------------------------------------------------------------------ simulation
// Returns the path (positions after each step) and a score from 0 to 100.
export function play(level, choice) {
  if (level.dims === 2) return play2d(level, choice);
  const fn = level.fn;
  let w = level.id === 5 ? choice.start : level.start;
  const etas = level.id === 6 ? choice.etas : Array(level.steps).fill(choice.eta);
  const path = [{ w, f: fn.f(w), g: fn.df(w) }];
  let blown = false;
  for (const eta of etas) {
    w = w - eta * fn.df(w);
    if (!Number.isFinite(w) || Math.abs(w) > BLOW_UP) { blown = true; break; }
    path.push({ w, f: fn.f(w), g: fn.df(w) });
  }
  const last = path[path.length - 1];
  let score = 0;
  if (!blown) {
    // reference height: where a 1D level starts (level 5: the top of the hill at w = 0)
    const ref = level.id === 5 ? fn.f(0) - fn.fmin : fn.f(level.start) - fn.fmin;
    score = 100 * (1 - (last.f - fn.fmin) / ref);
    // ending higher than the start means the steps were growing: the ball is flying off
    if (level.id !== 5 && last.f > path[0].f) blown = true;
  }
  return { path, blown, score: clampScore(score), final: last };
}

function play2d(level, choice) {
  const { c1, c2, m1, m2 } = level;
  const f = (w, a) => c1 * (w - m1) ** 2 + c2 * (a - m2) ** 2;
  let [w, a] = level.start;
  const f0 = f(w, a);
  const path = [{ w, a, f: f0 }];
  let blown = false;
  for (let k = 0; k < level.steps; k++) {
    const gw = 2 * c1 * (w - m1), ga = 2 * c2 * (a - m2);
    w -= choice.eta * gw; a -= choice.eta * ga;
    if (!Number.isFinite(w + a) || Math.abs(w) > BLOW_UP || Math.abs(a) > BLOW_UP) { blown = true; break; }
    path.push({ w, a, f: f(w, a) });
  }
  const last = path[path.length - 1];
  if (!blown && last.f > f0) blown = true;
  const score = blown ? 0 : 100 * (1 - last.f / f0);
  return { path, blown, score: clampScore(score), final: last };
}

function clampScore(s) {
  if (!Number.isFinite(s)) return 0;
  return Math.max(0, Math.min(100, Math.round(s * 10) / 10));
}

// For the fog level: what the player sees after each step (no formula).
export function fogView(level, etas) {
  const r = play(level, { etas });
  return r.path.map((p) => ({ w: round(p.w, 3), f: round(p.f, 3), g: round(p.g, 3) }));
}

function round(x, d) { const k = 10 ** d; return Math.round(x * k) / k; }

// Public description of a level (safe to send to the browser; fog hides c and m).
export function publicLevel(level) {
  const base = { id: level.id, name: level.name, brief: level.brief, steps: level.steps, dims: level.dims,
    choose: level.choose, etaMax: level.etaMax, visible: level.visible };
  if (level.id === 5) Object.assign(base, { startMin: level.startMin, startMax: level.startMax, t: level.t });
  if (level.dims === 2) Object.assign(base, { c1: level.c1, c2: level.c2, m1: level.m1, m2: level.m2, start: level.start });
  else if (level.visible && level.id !== 5) Object.assign(base, { c: level.c, m: level.m, start: level.start });
  else Object.assign(base, { start: level.start });
  return base;
}

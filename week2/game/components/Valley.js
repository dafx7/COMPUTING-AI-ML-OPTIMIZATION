"use client";
// Draws a 1D valley (curve + steps) or a 2D valley (contours + path) as SVG.

const W = 640, H = 360, P = 36;

export function fnFor(level) {
  if (level.id === 5) { const t = level.t; return (w) => ((w * w - 4) * (w * w - 4)) / 4 + t * w; }
  if (level.dims === 2) return null;
  if (level.c == null) return null; // fog: hidden
  return (w) => level.c * (w - level.m) * (w - level.m);
}

function range1d(level, path) {
  if (level.id === 5) return [-3.2, 3.2];
  const xs = [level.start ?? 0, ...(path || []).map((p) => p.w)];
  if (level.m != null) xs.push(level.m);
  let lo = Math.min(...xs), hi = Math.max(...xs);
  const pad = Math.max(1.5, (hi - lo) * 0.25);
  lo -= pad; hi += pad;
  return [Math.max(lo, -40), Math.min(hi, 40)];
}

export default function Valley({ level, path = [], shown = 0 }) {
  if (level.dims === 2) return <Valley2D level={level} path={path} shown={shown} />;
  const f = fnFor(level);
  const [x0, x1] = range1d(level, path);
  const pts = [];
  if (f) for (let i = 0; i <= 200; i++) { const w = x0 + (x1 - x0) * i / 200; pts.push([w, f(w)]); }
  const visPath = path.slice(0, shown + 1);
  const ys = [...pts.map((p) => p[1]), ...visPath.map((p) => p.f)].filter(Number.isFinite);
  let y0 = Math.min(0, ...ys), y1 = Math.max(1, ...ys);
  if (f) y1 = Math.min(y1, Math.max(...pts.map((p) => p[1])) * 1.05);
  const X = (w) => P + (w - x0) / (x1 - x0) * (W - 2 * P);
  const Y = (v) => H - P - (Math.min(v, y1) - y0) / (y1 - y0 || 1) * (H - 2 * P);
  const d = pts.map(([w, v], i) => `${i ? "L" : "M"}${X(w).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  return (
    <svg className="valley" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Valley for level ${level.id} with ${visPath.length} positions`}>
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#bdb6a6" />
      <text x={W - P} y={H - 10} fontSize="13" textAnchor="end" fill="#5d5b54">w</text>
      {[x0, (x0 + x1) / 2, x1].map((t) => <text key={t} x={X(t)} y={H - 18} fontSize="12" textAnchor="middle" fill="#5d5b54">{t.toFixed(1)}</text>)}
      {f && <path d={d} fill="none" stroke="var(--curve)" strokeWidth="2.5" />}
      {!f && <text x={W / 2} y={P + 10} fontSize="15" textAnchor="middle" fill="#5d5b54">The valley is hidden in fog</text>}
      {visPath.map((p, i) => {
        if (i === 0) return null;
        const q = visPath[i - 1];
        return <line key={"s" + i} x1={X(q.w)} y1={Y(q.f)} x2={X(p.w)} y2={Y(p.f)} stroke="var(--path)" strokeWidth="2" strokeDasharray="5 4" />;
      })}
      {!f && visPath.map((p, i) => {
        // fog: show the slope under the feet as a short tangent
        const dx = (x1 - x0) * 0.06, g = p.g ?? 0;
        return <line key={"t" + i} x1={X(p.w - dx)} y1={Y(p.f - g * dx)} x2={X(p.w + dx)} y2={Y(p.f + g * dx)} stroke="#5d5b54" strokeWidth="2" />;
      })}
      {visPath.map((p, i) => (
        <circle key={"p" + i} cx={X(Math.max(x0, Math.min(x1, p.w)))} cy={Y(p.f)} r={i === visPath.length - 1 ? 9 : 5}
          fill={i === visPath.length - 1 ? "var(--path)" : "#fff"} stroke="var(--path)" strokeWidth="2" />
      ))}
    </svg>
  );
}

function Valley2D({ level, path, shown }) {
  const { c1, c2, m1, m2 } = level;
  const f = (w, a) => c1 * (w - m1) ** 2 + c2 * (a - m2) ** 2;
  const vis = path.slice(0, shown + 1);
  const ws = [0, m1, ...vis.map((p) => p.w)], as = [0, m2, ...vis.map((p) => p.a)];
  const xr = [Math.max(-20, Math.min(...ws) - 1.5), Math.min(20, Math.max(...ws) + 1.5)];
  const yr = [Math.max(-20, Math.min(...as) - 1.5), Math.min(20, Math.max(...as) + 1.5)];
  const X = (w) => P + (w - xr[0]) / (xr[1] - xr[0]) * (W - 2 * P);
  const Y = (a) => H - P - (a - yr[0]) / (yr[1] - yr[0]) * (H - 2 * P);
  const f0 = f(0, 0);
  const levels = [0.02, 0.08, 0.2, 0.45, 0.8, 1.3].map((k) => k * f0);
  return (
    <svg className="valley" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Contour map of the long valley with the path of the steps">
      {levels.map((v, i) => {
        const rw = Math.sqrt(v / c1), ra = Math.sqrt(v / c2);
        return <ellipse key={i} cx={X(m1)} cy={Y(m2)} rx={Math.abs(X(m1 + rw) - X(m1))} ry={Math.abs(Y(m2 + ra) - Y(m2))} fill="none" stroke="#bdb6a6" />;
      })}
      <circle cx={X(m1)} cy={Y(m2)} r="4" fill="#1e1d1a" />
      <text x={W - P} y={H - 10} fontSize="13" textAnchor="end" fill="#5d5b54">w</text>
      <text x={14} y={P} fontSize="13" fill="#5d5b54">a</text>
      <polyline points={vis.map((p) => `${X(p.w)},${Y(p.a)}`).join(" ")} fill="none" stroke="var(--path)" strokeWidth="2" />
      {vis.map((p, i) => <circle key={i} cx={X(p.w)} cy={Y(p.a)} r={i === vis.length - 1 ? 8 : 4} fill={i === vis.length - 1 ? "var(--path)" : "#fff"} stroke="var(--path)" strokeWidth="2" />)}
    </svg>
  );
}

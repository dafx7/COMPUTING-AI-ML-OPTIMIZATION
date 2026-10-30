/* Drawing helpers shared by the three pages. Drawing is not part of the
   deterministic simulation, so trig and alpha are fine here. */
(function (root) {
  'use strict';
  var C = root.FK.C;
  var COL = {
    sky: '#efe9dc', hill: '#e4dccb', pipe: '#8aa27a', pipeEdge: '#2c3527',
    ink: '#1e1d1a', body: '#5f6d43', belly: '#cdb983', accent: '#a8431f', faint: '#c9c1ae'
  };

  // Size the backing store to the element and map the 400 x 600 world onto it.
  function fit(canvas) {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(w / C.W, 0, 0, h / C.H, 0, 0);
    return ctx;
  }

  function world(ctx, course, t) {
    ctx.fillStyle = COL.sky;
    ctx.fillRect(0, 0, C.W, C.H);
    // slow background dunes for a sense of motion
    ctx.fillStyle = COL.hill;
    var off = (t * C.SPEED * 0.3) % 200;
    ctx.beginPath();
    ctx.moveTo(0, C.H);
    for (var x = -off; x <= C.W + 200; x += 200) {
      ctx.quadraticCurveTo(x + 100, C.H - 70, x + 200, C.H - 20);
    }
    ctx.lineTo(C.W, C.H);
    ctx.closePath();
    ctx.fill();

    var first = Math.max(0, course.nextIndex(t) - 1);
    for (var i = first; i < first + 4; i++) {
      var px = course.pipeX(i, t);
      if (px > C.W || px + C.PIPE_W < 0) { continue; }
      var g = course.gap(i), top = g - C.GAP / 2, bot = g + C.GAP / 2;
      ctx.fillStyle = COL.pipe;
      ctx.strokeStyle = COL.pipeEdge;
      ctx.lineWidth = 2;
      ctx.fillRect(px, -2, C.PIPE_W, top + 2);
      ctx.strokeRect(px, -2, C.PIPE_W, top + 2);
      ctx.fillRect(px, bot, C.PIPE_W, C.H - bot + 2);
      ctx.strokeRect(px, bot, C.PIPE_W, C.H - bot + 2);
      // lips
      ctx.fillRect(px - 4, top - 14, C.PIPE_W + 8, 14);
      ctx.strokeRect(px - 4, top - 14, C.PIPE_W + 8, 14);
      ctx.fillRect(px - 4, bot, C.PIPE_W + 8, 14);
      ctx.strokeRect(px - 4, bot, C.PIPE_W + 8, 14);
    }
  }

  // style: 'solo' (full colour), 'ghost' (faint, for crowds), 'lead' (accent outline)
  function komodo(ctx, y, vy, style) {
    var a = vy * 0.055;
    if (a < -0.5) { a = -0.5; }
    if (a > 0.7) { a = 0.7; }
    ctx.save();
    ctx.translate(C.BIRD_X, y);
    ctx.rotate(a);
    ctx.globalAlpha = style === 'ghost' ? 0.35 : 1;
    ctx.lineWidth = style === 'lead' ? 3 : 1.5;
    ctx.strokeStyle = style === 'lead' ? COL.accent : COL.ink;
    ctx.fillStyle = COL.body;
    // tail
    ctx.beginPath();
    ctx.moveTo(-10, -4); ctx.quadraticCurveTo(-22, -2, -27, 6); ctx.quadraticCurveTo(-18, 5, -9, 6);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // legs
    ctx.fillRect(-7, 6, 4, 6); ctx.fillRect(5, 6, 4, 6);
    // body
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // head
    ctx.beginPath(); ctx.ellipse(14, -3, 8, 5.5, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // belly stripe
    ctx.fillStyle = COL.belly;
    ctx.beginPath(); ctx.ellipse(1, 4, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
    if (style !== 'ghost') {
      ctx.fillStyle = COL.ink;
      ctx.beginPath(); ctx.arc(17, -5, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = COL.accent; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(22, -1); ctx.lineTo(27, 0); ctx.moveTo(27, 0); ctx.lineTo(30, -2); ctx.moveTo(27, 0); ctx.lineTo(30, 2); ctx.stroke();
    }
    ctx.restore();
  }

  function bigNumber(ctx, n) {
    ctx.font = '600 52px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = COL.sky;
    ctx.strokeText(String(n), C.W / 2, 70);
    ctx.fillStyle = COL.ink;
    ctx.fillText(String(n), C.W / 2, 70);
  }

  /* Line chart of best pipes per generation.
     opts: { series: [{data, color, width}], yMax, xMax, lines: [{y, color, dash}] } */
  function chart(canvas, opts) {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    var W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var L = 34, R = 10, T = 10, B = 26, pw = W - L - R, ph = H - T - B;
    var xMax = Math.max(opts.xMax || 10, 2), yMax = opts.yMax || C.TARGET;
    function X(i) { return L + (i - 1) / (xMax - 1) * pw; }
    function Y(v) { return T + ph - Math.min(v, yMax) / yMax * ph; }
    ctx.font = '12px ui-monospace, Menlo, Consolas, monospace';
    ctx.fillStyle = '#5d5b54';
    ctx.strokeStyle = '#d8d2c4';
    ctx.lineWidth = 1;
    ctx.textAlign = 'right';
    [0, yMax / 2, yMax].forEach(function (v) {
      ctx.beginPath(); ctx.moveTo(L, Y(v) + 0.5); ctx.lineTo(L + pw, Y(v) + 0.5); ctx.stroke();
      ctx.fillText(String(Math.round(v)), L - 6, Y(v) + 4);
    });
    ctx.textAlign = 'center';
    ctx.fillText('1', X(1), H - 8);
    ctx.fillText(String(xMax), X(xMax), H - 8);
    ctx.fillText('generation', L + pw / 2, H - 8);
    (opts.lines || []).forEach(function (ln) {
      ctx.save();
      ctx.strokeStyle = ln.color; ctx.lineWidth = 2;
      if (ln.dash) { ctx.setLineDash([6, 5]); }
      ctx.beginPath(); ctx.moveTo(L, Y(ln.y)); ctx.lineTo(L + pw, Y(ln.y)); ctx.stroke();
      ctx.restore();
    });
    (opts.series || []).forEach(function (s) {
      if (!s.data.length) { return; }
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width || 2.5; ctx.lineJoin = 'round';
      ctx.beginPath();
      s.data.forEach(function (v, k) { if (k === 0) { ctx.moveTo(X(1), Y(v)); } else { ctx.lineTo(X(k + 1), Y(v)); } });
      if (s.data.length === 1) { ctx.lineTo(X(1) + 3, Y(s.data[0])); }
      ctx.stroke();
      var last = s.data.length;
      ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(X(last), Y(s.data[last - 1]), 3.5, 0, Math.PI * 2); ctx.fill();
    });
  }

  // Fly one brain along the course, one tick per call. Used for "watch the champion".
  function Pilot(brain, hidden) {
    this.brain = brain; this.hidden = hidden;
    this.course = new root.FK.Course(C.COURSE_SEED);
    this.bird = new root.FK.Bird(); this.t = 0;
  }
  Pilot.prototype.step = function () {
    var b = this.bird;
    if (!b.alive || b.pipes >= C.TARGET) { return false; }
    var flap = root.FK.think(this.brain, this.hidden, root.FK.inputs(b, this.course, this.t));
    root.FK.stepBird(b, this.course, this.t, flap);
    this.t += 1;
    return b.alive && b.pipes < C.TARGET;
  };

  function store(key, val) {
    try {
      if (arguments.length > 1) { root.localStorage.setItem(key, JSON.stringify(val)); return val; }
      var s = root.localStorage.getItem(key);
      return s === null ? null : JSON.parse(s);
    } catch (e) { return null; }
  }

  root.FKR = { COL: COL, fit: fit, world: world, komodo: komodo, bigNumber: bigNumber, chart: chart, Pilot: Pilot, store: store };
})(window);

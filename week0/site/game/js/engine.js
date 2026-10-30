/* Flappy Komodo engine: physics, course, tiny neural networks, genetic algorithm.
   Deterministic across browsers: only + - * / and comparisons on floats, integer
   PRNG (mulberry32). No Math.exp, Math.log, Math.sin or Math.pow in the simulation. */
(function (root) {
  'use strict';

  var C = {
    W: 400, H: 600,
    BIRD_X: 100, R: 13,
    GRAVITY: 0.42, FLAP: -7.4, VMAX: 9.5,
    PIPE_W: 64, GAP: 150, SPEED: 2.6, SPACING: 230,
    GAP_MIN: 130, GAP_MAX: 470, GAP_STEP: 220,
    FIRST_X: 460,
    COURSE_SEED: 2026,
    TARGET: 50,
    MAX_GEN: 60,
    INPUTS: 5
  };

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // A course is an endless, seeded list of gap centres.
  function Course(seed) {
    this.rnd = mulberry32(seed >>> 0);
    this.gaps = [];
  }
  Course.prototype.gap = function (i) {
    while (this.gaps.length <= i) {
      var prev = this.gaps.length ? this.gaps[this.gaps.length - 1] : (C.H / 2);
      var c = prev + (this.rnd() - 0.5) * 2 * C.GAP_STEP;
      if (c < C.GAP_MIN) { c = C.GAP_MIN; }
      if (c > C.GAP_MAX) { c = C.GAP_MAX; }
      this.gaps.push(c);
    }
    return this.gaps[i];
  };
  Course.prototype.pipeX = function (i, t) { return C.FIRST_X + i * C.SPACING - C.SPEED * t; };
  // Index of the first pipe whose right edge is still ahead of the komodo's back.
  Course.prototype.nextIndex = function (t) {
    var i = Math.floor((C.SPEED * t + C.BIRD_X - C.R - C.FIRST_X - C.PIPE_W) / C.SPACING) + 1;
    return i < 0 ? 0 : i;
  };

  function Bird() { this.y = C.H / 2; this.vy = 0; this.alive = true; this.pipes = 0; this.ticks = 0; this.deathDy = 0; }

  // Advance one bird by one tick. Returns false if it died this tick.
  function stepBird(b, course, t, flap) {
    if (!b.alive) { return false; }
    if (flap) { b.vy = C.FLAP; }
    b.vy += C.GRAVITY;
    if (b.vy > C.VMAX) { b.vy = C.VMAX; }
    b.y += b.vy;
    b.ticks = t + 1;
    var i = course.nextIndex(t);
    var px = course.pipeX(i, t);
    var g = course.gap(i);
    b.pipes = i;
    var top = g - C.GAP / 2, bot = g + C.GAP / 2;
    var hitPipe = (C.BIRD_X + C.R > px) && (C.BIRD_X - C.R < px + C.PIPE_W) && (b.y - C.R < top || b.y + C.R > bot);
    if (hitPipe || b.y + C.R > C.H || b.y - C.R < 0) {
      b.alive = false;
      b.deathDy = b.y - g;
      return false;
    }
    return true;
  }

  // ---------------------------------------------------------------- brains
  function softsign(x) { return x / (1 + (x < 0 ? -x : x)); }

  function brainSize(h) { return C.INPUTS * h + h + 1; }

  function randomBrain(h, rnd) {
    var n = brainSize(h), w = new Array(n);
    for (var k = 0; k < n; k++) { w[k] = rnd() * 2 - 1; }
    return w;
  }

  function inputs(b, course, t) {
    var i = course.nextIndex(t);
    var px = course.pipeX(i, t);
    var g = course.gap(i);
    return [b.y / C.H, b.vy / 10, (px + C.PIPE_W - C.BIRD_X) / C.W, (g - b.y) / C.H * 2, 1];
  }

  function think(w, h, inp) {
    var k = 0, out = 0;
    for (var j = 0; j < h; j++) {
      var s = 0;
      for (var q = 0; q < C.INPUTS; q++) { s += w[k++] * inp[q]; }
      out += softsign(s) * w[C.INPUTS * h + j];
    }
    out += w[C.INPUTS * h + h];
    return out > 0;
  }

  function gauss(rnd) { // Irwin-Hall approximation, std about 1, arithmetic only
    return (rnd() + rnd() + rnd() + rnd() - 2) * 1.7320508;
  }

  // ---------------------------------------------------------------- evolution
  function Evolution(opts) {
    this.pop = opts.pop; this.mut = opts.mut; this.hidden = opts.hidden;
    this.seed = opts.seed >>> 0;
    this.target = opts.target || C.TARGET;
    this.maxGen = opts.maxGen || C.MAX_GEN;
    this.rnd = mulberry32((this.seed ^ 0x9E3779B9) >>> 0);
    this.course = new Course(opts.courseSeed || C.COURSE_SEED);
    this.brains = [];
    for (var k = 0; k < this.pop; k++) { this.brains.push(randomBrain(this.hidden, this.rnd)); }
    this.gen = 0; this.komodos = 0; this.history = []; this.done = false; this.success = false;
    this.champion = null;
    this.beginGen();
  }

  Evolution.prototype.beginGen = function () {
    this.gen += 1;
    this.komodos += this.pop;
    this.t = 0;
    this.birds = [];
    for (var k = 0; k < this.pop; k++) { this.birds.push(new Bird()); }
    this.alive = this.pop;
    this.tickCap = Math.ceil((C.FIRST_X + (this.target + 1) * C.SPACING) / C.SPEED);
  };

  // One tick for the whole generation. Returns true while the generation is running.
  Evolution.prototype.tick = function () {
    var alive = 0, best = 0;
    for (var k = 0; k < this.pop; k++) {
      var b = this.birds[k];
      if (!b.alive) { continue; }
      var flap = think(this.brains[k], this.hidden, inputs(b, this.course, this.t));
      if (stepBird(b, this.course, this.t, flap)) { alive++; }
      if (b.pipes > best) { best = b.pipes; }
    }
    this.t += 1;
    this.alive = alive;
    if (best >= this.target) { return false; }
    return alive > 0 && this.t < this.tickCap;
  };

  Evolution.prototype.fitness = function (b) {
    var dy = b.deathDy < 0 ? -b.deathDy : b.deathDy;
    return b.ticks + b.pipes * 100 - dy * 0.5;
  };

  // Close the generation: record stats, then breed the next one (unless finished).
  Evolution.prototype.endGen = function () {
    var order = [], k;
    for (k = 0; k < this.pop; k++) { order.push(k); }
    var self = this;
    var fit = this.birds.map(function (b) { return self.fitness(b); });
    order.sort(function (a, b) { return fit[b] - fit[a] || a - b; });
    var bestBird = this.birds[order[0]];
    this.history.push(bestBird.pipes);
    this.champion = this.brains[order[0]].slice();
    if (bestBird.pipes >= this.target) { this.done = true; this.success = true; return; }
    if (this.gen >= this.maxGen) { this.done = true; return; }
    var rnd = this.rnd, pop = this.pop;
    function tour() {
      var bi = order[Math.floor(rnd() * pop)];
      for (var r = 0; r < 2; r++) { var c = order[Math.floor(rnd() * pop)]; if (fit[c] > fit[bi]) { bi = c; } }
      return bi;
    }
    var next = [this.brains[order[0]].slice()];
    if (pop > 1) { next.push(this.brains[order[1]].slice()); }
    while (next.length < pop) {
      var a = this.brains[tour()], b2 = this.brains[tour()];
      var child = new Array(a.length);
      for (var q = 0; q < a.length; q++) {
        child[q] = rnd() < 0.5 ? a[q] : b2[q];
        if (rnd() < this.mut) { child[q] += gauss(rnd) * 0.5; }
      }
      next.push(child);
    }
    this.brains = next;
    this.beginGen();
  };

  // Run a whole generation without drawing.
  Evolution.prototype.runGen = function () {
    while (this.tick()) { /* run */ }
    this.endGen();
  };

  // ---------------------------------------------------------------- codes (Act 3)
  var POPS = [10, 20, 50, 100, 150], MUTS = [0.01, 0.05, 0.1, 0.2, 0.4], HIDS = [2, 4, 6, 10];

  function encode(o) {
    return String(o.pop) + '-' + Math.round(o.mut * 100) + '-' + o.hidden + '-' + o.seed;
  }
  function decode(code) {
    var m = String(code).trim().toUpperCase().replace(/\s+/g, '').match(/^(\d+)-(\d+)-(\d+)-(\d+)$/);
    if (!m) { return null; }
    var o = { pop: +m[1], mut: +m[2] / 100, hidden: +m[3], seed: +m[4] };
    if (POPS.indexOf(o.pop) < 0 || MUTS.indexOf(o.mut) < 0 || HIDS.indexOf(o.hidden) < 0 || o.seed < 1 || o.seed > 9999) { return null; }
    return o;
  }

  var api = { C: C, mulberry32: mulberry32, Course: Course, Bird: Bird, stepBird: stepBird,
    Evolution: Evolution, think: think, inputs: inputs, encode: encode, decode: decode,
    POPS: POPS, MUTS: MUTS, HIDS: HIDS };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; } else { root.FK = api; }
})(this);

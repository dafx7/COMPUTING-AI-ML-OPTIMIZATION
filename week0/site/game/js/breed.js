/* Act 3: students tune population, mutation and brain size, then race on komodos used. */
(function () {
  'use strict';
  var FK = window.FK, R = window.FKR, C = FK.C;
  var $ = function (id) { return document.getElementById(id); };

  function seg(id, name, values, label, def) {
    var box = $(id);
    values.forEach(function (v, k) {
      var inp = document.createElement('input');
      inp.type = 'radio'; inp.name = name; inp.id = name + k; inp.value = String(v);
      if (v === def) { inp.checked = true; }
      var lab = document.createElement('label');
      lab.htmlFor = inp.id; lab.textContent = label(v);
      box.appendChild(inp); box.appendChild(lab);
    });
  }
  seg('seg-pop', 'pop', FK.POPS, String, 50);
  seg('seg-mut', 'mut', FK.MUTS, function (v) { return Math.round(v * 100) + '%'; }, 0.1);
  seg('seg-hid', 'hid', FK.HIDS, String, 6);

  var form = $('knobs'), seedEl = $('seed');
  seedEl.value = String(1 + Math.floor(Math.random() * 9999));
  $('shuffle').addEventListener('click', function () { seedEl.value = String(1 + Math.floor(Math.random() * 9999)); });

  function pick(name) { return +form.querySelector('input[name="' + name + '"]:checked').value; }
  function lock(on) {
    form.querySelectorAll('input, button[type=submit], #shuffle').forEach(function (el) { el.disabled = on; });
    $('stop').hidden = !on;
  }

  var runs = R.store('fk-runs') || [];
  function drawRuns() {
    var tb = $('runs').querySelector('tbody');
    tb.textContent = '';
    $('empty').hidden = runs.length > 0;
    $('runs').hidden = runs.length === 0;
    runs.slice().sort(function (a, b) { return (b.ok - a.ok) || (a.komodos - b.komodos); }).forEach(function (r) {
      var tr = document.createElement('tr');
      var c1 = document.createElement('td'); c1.className = 'num'; c1.textContent = r.code;
      var c2 = document.createElement('td');
      c2.textContent = r.ok ? 'Solved, gen ' + r.gens : 'Not solved';
      c2.className = r.ok ? 'ok' : 'bad';
      var c3 = document.createElement('td'); c3.className = 'r num'; c3.textContent = r.ok ? r.komodos : '-';
      tr.appendChild(c1); tr.appendChild(c2); tr.appendChild(c3); tb.appendChild(tr);
    });
  }
  drawRuns();

  var ev = null, cancel = false, opts = null;
  function chart() {
    R.chart($('chart'), { xMax: Math.max(ev.history.length, 10), series: [{ data: ev.history, color: '#1e1d1a' }] });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var seed = Math.round(+seedEl.value);
    if (!(seed >= 1 && seed <= 9999)) { seedEl.focus(); seedEl.setCustomValidity('Seed must be 1 to 9999'); seedEl.reportValidity(); return; }
    seedEl.setCustomValidity('');
    opts = { pop: pick('pop'), mut: pick('mut'), hidden: pick('hid'), seed: seed };
    ev = new FK.Evolution(opts);
    cancel = false;
    lock(true);
    $('live').hidden = false; $('result').hidden = true; $('replay-box').hidden = true;
    stopReplay();
    $('status').textContent = 'Generation 1';
    loop();
  });
  $('stop').addEventListener('click', function () { cancel = true; });

  function loop() {
    var t0 = performance.now();
    // run whole generations for ~30 ms, then yield so the page stays responsive
    while (!ev.done && !cancel && performance.now() - t0 < 30) { ev.runGen(); }
    var best = ev.history.length ? Math.max.apply(null, ev.history) : 0;
    $('status').textContent = 'Generation ' + ev.history.length + ' · Komodos used ' + ev.komodos + ' · Best ' + best + ' pipes';
    chart();
    if (cancel) { lock(false); $('status').textContent += ' · stopped'; return; }
    if (!ev.done) { setTimeout(loop, 0); return; }
    finish();
  }

  function finish() {
    lock(false);
    var code = FK.encode(opts);
    $('result').hidden = false;
    $('code').textContent = code;
    var v = $('verdict');
    if (ev.success) {
      v.className = 'ok';
      v.textContent = 'Solved in generation ' + ev.gen + '. Komodos used: ' + ev.komodos + '.';
    } else {
      v.className = 'bad';
      v.textContent = 'Not solved after ' + C.MAX_GEN + ' generations. Try different knobs or another seed.';
    }
    runs = runs.filter(function (r) { return r.code !== code; });
    runs.push({ code: code, ok: ev.success ? 1 : 0, gens: ev.gen, komodos: ev.komodos });
    if (runs.length > 30) { runs.shift(); }
    R.store('fk-runs', runs);
    drawRuns();
  }

  $('copy').addEventListener('click', function () {
    var code = $('code').textContent, btn = this;
    function done() { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy code'; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done, function () { selectCode(); });
    } else { selectCode(); }
  });
  function selectCode() {
    var r = document.createRange(); r.selectNodeContents($('code'));
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  var raf = 0;
  function stopReplay() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  $('watch').addEventListener('click', function () {
    stopReplay();
    $('replay-box').hidden = false;
    var p = new R.Pilot(ev.champion, opts.hidden), cv = $('replay'), going = true, acc = 0, last = performance.now();
    function frame(now) {
      acc += Math.min(now - last, 100); last = now;
      while (going && acc >= 1000 / 60) { acc -= 1000 / 60; going = p.step(); }
      var ctx = R.fit(cv);
      R.world(ctx, p.course, p.t);
      R.komodo(ctx, p.bird.y, p.bird.vy, 'solo');
      R.bigNumber(ctx, p.bird.pipes);
      raf = going ? requestAnimationFrame(frame) : 0;
    }
    raf = requestAnimationFrame(frame);
    $('replay-box').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  window.addEventListener('resize', function () { if (ev) { chart(); } });
})();

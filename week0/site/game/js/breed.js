/* Act 3: students tune population, mutation and brain size. Same komodo budget for everyone,
   narrowing course, ranked by how far the best komodo flies. */
(function () {
  'use strict';
  var FK = window.FK, R = window.FKR;
  var $ = function (id) { return document.getElementById(id); };

  var knobs = { pop: $('k-pop'), mut: $('k-mut'), hid: $('k-hid') };
  function show() {
    var pop = +knobs.pop.value;
    $('o-pop').textContent = pop;
    $('o-mut').textContent = knobs.mut.value + '%';
    $('o-hid').textContent = knobs.hid.value;
    $('h-pop').textContent = 'Komodos per generation. ' + pop + ' komodos per generation buys ' +
      Math.floor(FK.C.RACE_BUDGET / pop) + ' generations.';
  }
  Object.keys(knobs).forEach(function (k) { knobs[k].addEventListener('input', show); });
  document.querySelectorAll('.step').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = $(b.getAttribute('data-for'));
      if (+b.getAttribute('data-d') > 0) { el.stepUp(); } else { el.stepDown(); }
      show();
    });
  });
  show();

  var form = $('knobs'), seedEl = $('seed');
  seedEl.value = String(1 + Math.floor(Math.random() * 9999));
  $('shuffle').addEventListener('click', function () { seedEl.value = String(1 + Math.floor(Math.random() * 9999)); });

  function lock(on) {
    form.querySelectorAll('input, button:not(#stop)').forEach(function (el) { el.disabled = on; });
    $('stop').hidden = !on;
  }

  var runs = R.store('fk-race-runs') || [];
  function drawRuns() {
    var tb = $('runs').querySelector('tbody');
    tb.textContent = '';
    $('empty').hidden = runs.length > 0;
    $('runs').hidden = runs.length === 0;
    runs.slice().sort(function (a, b) { return (b.pipes - a.pipes) || (b.ticks - a.ticks); }).forEach(function (r) {
      var tr = document.createElement('tr');
      var c1 = document.createElement('td'); c1.className = 'num'; c1.textContent = r.code;
      var c2 = document.createElement('td'); c2.className = 'r num'; c2.textContent = r.pipes;
      tr.appendChild(c1); tr.appendChild(c2); tb.appendChild(tr);
    });
  }
  drawRuns();

  var ev = null, cancel = false, opts = null;
  function chart() {
    var top = Math.max(20, Math.ceil(ev.best / 10) * 10);
    R.chart($('chart'), { xMax: Math.max(ev.maxGen, 2), yMax: top, series: [{ data: ev.history, color: '#1e1d1a' }] });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var seed = Math.round(+seedEl.value);
    if (!(seed >= 1 && seed <= 9999)) { seedEl.focus(); seedEl.setCustomValidity('Seed must be 1 to 9999'); seedEl.reportValidity(); return; }
    seedEl.setCustomValidity('');
    opts = { pop: +knobs.pop.value, mut: +knobs.mut.value / 100, hidden: +knobs.hid.value, seed: seed };
    ev = new FK.Evolution({ pop: opts.pop, mut: opts.mut, hidden: opts.hidden, seed: opts.seed, race: true });
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
    $('status').textContent = 'Generation ' + ev.history.length + ' of ' + ev.maxGen + ' · Best ' + ev.best + ' pipes';
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
    v.className = '';
    v.textContent = 'Your best komodo passed ' + ev.best + ' pipes after ' + ev.gen + ' generations (' + ev.komodos + ' komodos).';
    runs = runs.filter(function (r) { return r.code !== code; });
    runs.push({ code: code, pipes: ev.best, ticks: ev.bestTicks });
    if (runs.length > 30) { runs.shift(); }
    R.store('fk-race-runs', runs);
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
    var p = new R.Pilot(ev.champion, opts.hidden, true), cv = $('replay'), going = true, acc = 0, last = performance.now();
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

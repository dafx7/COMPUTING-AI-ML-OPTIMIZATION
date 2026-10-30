/* Projector view. Act 2: animated evolution. Acts 1 and 3: leaderboards,
   kept in this browser only (localStorage) so a page refresh does not lose them. */
(function () {
  'use strict';
  var FK = window.FK, R = window.FKR, C = FK.C;
  var $ = function (id) { return document.getElementById(id); };

  // ------------------------------------------------------------ tabs
  var tabs = ['evo', 'h', 'b'];
  tabs.forEach(function (k) {
    $('tab-' + k).addEventListener('click', function () {
      tabs.forEach(function (j) {
        $('tab-' + j).setAttribute('aria-selected', String(j === k));
        $('p-' + j).hidden = j !== k;
      });
      if (k === 'evo') { drawChart(); }
    });
  });

  // ------------------------------------------------------------ Act 2
  var ev, opts, running = false, pauseUntil = 0, record = 0, beatHuman = false;
  var cv = $('cv'), banner = $('banner'), goBtn = $('go');

  function human() { var v = Math.round(+$('human').value); return v > 0 ? v : 0; }

  function reset() {
    var o = FK.decode($('code').value);
    if (!o) { $('code').setCustomValidity('Use a code like 50-10-6-43'); $('code').reportValidity(); return false; }
    $('code').setCustomValidity('');
    opts = o;
    ev = new FK.Evolution(o);
    running = false; record = 0; beatHuman = false; pauseUntil = 0;
    banner.hidden = true;
    goBtn.textContent = 'Start'; goBtn.disabled = false; $('skip').disabled = false;
    drawChart();
    return true;
  }

  function show(msg) { banner.textContent = msg; banner.hidden = false; }

  function aliveBest() {
    var m = 0;
    ev.birds.forEach(function (b) { if (b.alive && b.pipes > m) { m = b.pipes; } });
    return m;
  }

  function checkHuman(now) {
    var h = human();
    if (!beatHuman && h > 0 && now > h) {
      beatHuman = true;
      show('Generation ' + ev.gen + ' just passed the best human (' + h + ' pipes).');
    }
  }

  function genEnd() {
    var g = ev.gen;
    ev.endGen();
    record = Math.max(record, ev.history[ev.history.length - 1]);
    checkHuman(record);
    drawChart();
    if (ev.done) {
      running = false;
      goBtn.disabled = true; $('skip').disabled = true;
      show(ev.success
        ? 'Reached ' + C.TARGET + ' pipes in generation ' + g + '. Komodos used: ' + ev.komodos + '.'
        : 'Not solved after ' + C.MAX_GEN + ' generations.');
    } else {
      pauseUntil = performance.now() + 700 / Math.sqrt(+$('speed').value);
    }
  }

  function drawChart() {
    if (!ev) { return; }
    var lines = human() > 0 ? [{ y: human(), color: '#a8431f', dash: true }] : [];
    R.chart($('chart'), { xMax: Math.max(ev.history.length + 1, 15), series: [{ data: ev.history, color: '#1e1d1a', width: 3 }], lines: lines });
  }

  function frame(now) {
    if (running && now >= pauseUntil && !ev.done) {
      var n = +$('speed').value;
      for (var s = 0; s < n; s++) {
        if (!ev.tick()) { genEnd(); break; }
      }
      if (!ev.done && pauseUntil <= now) { checkHuman(aliveBest()); }
    }
    if (now >= pauseUntil || !running) {
      var ctx = R.fit(cv);
      R.world(ctx, ev.course, ev.t);
      var lead = null;
      ev.birds.forEach(function (b, k) {
        if (!b.alive) { return; }
        // highlight last generation's champion (copied unchanged), or the winner once done
        if (ev.done ? b.pipes >= C.TARGET && !lead : k === 0 && ev.gen > 1) { lead = b; return; }
        R.komodo(ctx, b.y, b.vy, 'ghost');
      });
      if (lead) { R.komodo(ctx, lead.y, lead.vy, 'lead'); }
      R.bigNumber(ctx, aliveBest());
    }
    $('s-gen').textContent = ev.gen;
    $('s-alive').textContent = ev.alive + '/' + ev.pop;
    $('s-now').textContent = aliveBest();
    $('s-rec').textContent = Math.max(record, ev.done ? 0 : aliveBest());
    $('s-kom').textContent = ev.komodos;
    requestAnimationFrame(frame);
  }

  goBtn.addEventListener('click', function () {
    if (!ev || ev.done) { return; }
    running = !running;
    goBtn.textContent = running ? 'Pause' : 'Resume';
  });
  $('skip').addEventListener('click', function () {
    if (!ev || ev.done) { return; }
    while (ev.tick()) { /* finish this generation */ }
    genEnd();
    pauseUntil = 0;
  });
  $('reset').addEventListener('click', reset);
  $('human').addEventListener('input', drawChart);
  $('use-top').addEventListener('click', function () {
    var top = humans.reduce(function (m, h) { return Math.max(m, h.score); }, 0);
    $('human').value = String(top);
    beatHuman = false;
    drawChart();
  });
  window.addEventListener('resize', drawChart);

  // ------------------------------------------------------------ leaderboards
  var humans = R.store('fk-stage-humans') || [];
  var breeders = R.store('fk-stage-race') || [];
  function save() { R.store('fk-stage-humans', humans); R.store('fk-stage-race', breeders); }

  function cell(tr, text, cls) { var td = document.createElement('td'); td.textContent = text; if (cls) { td.className = cls; } tr.appendChild(td); return td; }
  function removeBtn(td, onClick) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ghost'; b.textContent = 'Remove';
    b.addEventListener('click', onClick); td.appendChild(b);
  }

  function drawHumans() {
    var tb = $('t-h').querySelector('tbody'); tb.textContent = '';
    humans.slice().sort(function (a, b) { return b.score - a.score; }).forEach(function (h, i) {
      var tr = document.createElement('tr');
      cell(tr, String(i + 1), 'num'); cell(tr, h.name); cell(tr, String(h.score), 'r num');
      removeBtn(cell(tr, ''), function () { humans.splice(humans.indexOf(h), 1); save(); drawHumans(); });
      tb.appendChild(tr);
    });
  }

  $('f-h').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('h-name').value.trim(), score = Math.round(+$('h-score').value);
    if (!name || !(score >= 0) || $('h-score').value === '') { $('h-name').focus(); return; }
    humans.push({ name: name, score: score });
    save(); drawHumans();
    $('h-name').value = ''; $('h-score').value = ''; $('h-name').focus();
  });

  function rankBreeders(a, b) { return (b.pipes - a.pipes) || (b.ticks - a.ticks) || (a.at - b.at); }

  function drawBreeders() {
    var tb = $('t-b').querySelector('tbody'); tb.textContent = '';
    breeders.slice().sort(rankBreeders).forEach(function (r, i) {
      var tr = document.createElement('tr');
      cell(tr, String(i + 1), 'num');
      cell(tr, r.name);
      cell(tr, r.code, 'num');
      cell(tr, String(r.pipes), 'r num');
      var rob = cell(tr, '');
      if (r.robust) {
        rob.textContent = 'avg ' + r.robust.avg + ', worst ' + r.robust.worst;
      } else {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'ghost'; b.textContent = 'Check';
        b.addEventListener('click', function () { b.disabled = true; b.textContent = 'Running'; robust(r); });
        rob.appendChild(b);
      }
      removeBtn(cell(tr, ''), function () { breeders.splice(breeders.indexOf(r), 1); save(); drawBreeders(); });
      tb.appendChild(tr);
    });
  }

  // Run an evolution to the end without freezing the page.
  function runAsync(o, done) {
    var e = new FK.Evolution({ pop: o.pop, mut: o.mut, hidden: o.hidden, seed: o.seed, race: true });
    (function step() {
      var t0 = performance.now();
      while (!e.done && performance.now() - t0 < 25) { e.runGen(); }
      if (e.done) { done(e); } else { setTimeout(step, 0); }
    })();
  }

  var busy = false;
  $('f-b').addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) { return; }
    var name = $('b-name').value.trim(), raw = $('b-code').value, o = FK.decode(raw), msg = $('b-msg');
    if (!name) { $('b-name').focus(); return; }
    if (!o) { msg.textContent = 'That code is not valid. Expected population-mutation%-neurons-seed, for example 50-10-6-1234.'; return; }
    var code = FK.encode(o);
    var dup = breeders.filter(function (r) { return r.code === code; })[0];
    if (dup) { msg.textContent = 'Code ' + code + ' was already submitted by ' + dup.name + '.'; return; }
    busy = true;
    msg.textContent = 'Re-running ' + code + '...';
    runAsync(o, function (ev2) {
      busy = false;
      var r = { name: name, code: code, pipes: ev2.best, ticks: ev2.bestTicks, at: Date.now(), robust: null };
      breeders.push(r); save(); drawBreeders();
      msg.textContent = name + ': verified, ' + r.pipes + ' pipes.';
      $('b-name').value = ''; $('b-code').value = ''; $('b-name').focus();
    });
  });

  function robust(r) {
    var o = FK.decode(r.code), k = 0, worst = Infinity, total = 0;
    (function next() {
      if (k === 5) {
        r.robust = { avg: Math.round(total / 5), worst: worst };
        save(); drawBreeders(); return;
      }
      k += 1;
      var s = ((o.seed - 1 + k) % 9999) + 1;
      runAsync({ pop: o.pop, mut: o.mut, hidden: o.hidden, seed: s }, function (e) {
        total += e.best; if (e.best < worst) { worst = e.best; }
        next();
      });
    })();
  }

  $('clear').addEventListener('click', function () {
    if (!window.confirm('Clear both leaderboards on this computer?')) { return; }
    humans = []; breeders = []; save(); drawHumans(); drawBreeders();
  });

  drawHumans(); drawBreeders();
  reset();
  requestAnimationFrame(frame);
})();

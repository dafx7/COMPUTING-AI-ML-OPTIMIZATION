/* Act 1: a human flies the seeded course. Fixed 60 Hz timestep so the
   physics matches what the machine sees. */
(function () {
  'use strict';
  var FK = window.FK, R = window.FKR, C = FK.C;
  var box = document.getElementById('box'), cv = document.getElementById('cv');
  var ready = document.getElementById('ready'), over = document.getElementById('over');
  var elBest = document.getElementById('best'), elTries = document.getElementById('tries');
  var elFinal = document.getElementById('final'), elNote = document.getElementById('note');

  var best = R.store('fk-best') || 0, tries = R.store('fk-tries') || 0;
  var state = 'ready', course, bird, t, flapQueued, acc, last, deadAt = 0, ctx;
  elBest.textContent = best; elTries.textContent = tries;

  function reset() {
    course = new FK.Course(C.COURSE_SEED);
    bird = new FK.Bird();
    t = 0; flapQueued = false; acc = 0;
  }

  function start() {
    reset();
    state = 'play';
    ready.hidden = true; over.hidden = true;
    tries += 1; R.store('fk-tries', tries); elTries.textContent = tries;
    flapQueued = true;
    last = performance.now();
    box.focus({ preventScroll: true });
  }

  function die() {
    state = 'over';
    deadAt = performance.now();
    var score = bird.pipes;
    elFinal.textContent = score;
    if (score > best) {
      best = score; R.store('fk-best', best); elBest.textContent = best;
      elNote.textContent = score > 0 ? 'New personal best.' : '';
    } else {
      elNote.textContent = 'Your best is ' + best + '.';
    }
    if (score >= C.TARGET) { elNote.textContent = 'You reached ' + C.TARGET + ' pipes. That is the finish line.'; }
    over.hidden = false;
  }

  function flap() {
    if (state === 'play') { flapQueued = true; return; }
    // short lock after a crash so a late tap does not restart instantly
    if (state === 'over' && performance.now() - deadAt < 500) { return; }
    start();
  }

  box.addEventListener('pointerdown', function (e) {
    if (e.target.tagName === 'BUTTON') { return; }
    e.preventDefault();
    flap();
  });
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
      if (e.target.tagName === 'BUTTON') { return; }
      e.preventDefault();
      flap();
    }
  });
  document.getElementById('start').addEventListener('click', start);
  document.getElementById('again').addEventListener('click', start);

  var STEP = 1000 / 60;
  function frame(now) {
    ctx = R.fit(cv);
    if (state === 'play') {
      acc += Math.min(now - last, 100);
      last = now;
      while (acc >= STEP && state === 'play') {
        acc -= STEP;
        var alive = FK.stepBird(bird, course, t, flapQueued);
        flapQueued = false;
        t += 1;
        if (!alive || bird.pipes >= C.TARGET) { die(); }
      }
    }
    if (!course) { reset(); }
    R.world(ctx, course, t);
    R.komodo(ctx, bird.y, bird.vy, 'solo');
    if (state !== 'ready') { R.bigNumber(ctx, bird.pipes); }
    requestAnimationFrame(frame);
  }
  reset();
  requestAnimationFrame(frame);
})();

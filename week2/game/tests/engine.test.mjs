import { test } from "node:test";
import assert from "node:assert/strict";
import { makeLevels, play, validateChoice, fogView, publicLevel } from "../lib/engine.mjs";

test("same seed gives the same levels and the same scores", () => {
  const a = makeLevels("s1"), b = makeLevels("s1");
  for (let i = 0; i < 6; i++) assert.equal(a[i].brief, b[i].brief);
  assert.deepEqual(play(a[1], { eta: 0.07 }), play(b[1], { eta: 0.07 }));
});

test("the perfect step 1/(2c) scores 100 on the one-step level", () => {
  for (let s = 0; s < 50; s++) {
    const lv = makeLevels("p" + s)[2];
    const eta = Math.round(100 / (2 * lv.c)) / 100;
    assert.ok(play(lv, { eta }).score >= 99, `seed ${s}: ${lv.c} ${eta}`);
  }
});

test("too large a step flies off and scores 0", () => {
  const lv = makeLevels("x")[1]; // steep bowl, c >= 3
  const r = play(lv, { eta: 1.2 });
  assert.equal(r.score, 0);
});

test("choices are validated and rounded", () => {
  const L = makeLevels("v");
  assert.equal(validateChoice(L[0], { eta: 5 }), null);
  assert.equal(validateChoice(L[0], { eta: -0.1 }), null);
  assert.deepEqual(validateChoice(L[0], { eta: 0.123456 }), { eta: 0.12 });
  assert.equal(validateChoice(L[4], { eta: 0.1, start: 9 }), null);
  assert.deepEqual(validateChoice(L[4], { eta: 0.1, start: 1.26 }), { eta: 0.1, start: 1.3 });
  assert.equal(validateChoice(L[5], { etas: [0.1, 0.1, 0.1, 0.1, 0.1] }), null);
});

test("fog level hides the valley but shows height and slope", () => {
  const lv = makeLevels("f")[5];
  const pub = publicLevel(lv);
  assert.equal(pub.c, undefined);
  assert.equal(pub.m, undefined);
  const v = fogView(lv, [0.1]);
  assert.equal(v.length, 2);
  assert.ok("g" in v[1] && "f" in v[1]);
});

test("reasoning beats guessing on average", () => {
  let guess = 0, smart = 0;
  const r2 = (x) => Math.round(x * 100) / 100;
  for (let s = 0; s < 200; s++) {
    const L = makeLevels("g" + s);
    for (const lv of L.slice(0, 3)) {
      guess += play(lv, { eta: r2(((s * 37) % 120) / 100) }).score;
      smart += play(lv, { eta: r2(1 / (2 * lv.c)) }).score;
    }
  }
  assert.ok(smart > guess * 1.8, `${smart} vs ${guess}`);
});

test("growing overshoot counts as flying off", () => {
  const lv = makeLevels("x")[0]; // gentle bowl, c = 1
  const r = play(lv, { eta: 1.1 });
  assert.equal(r.blown, true);
  assert.equal(r.score, 0);
});

test("level 4 brief has a clean sign", () => {
  for (let s = 0; s < 30; s++) assert.ok(!makeLevels("b" + s)[3].brief.includes("(-") && !makeLevels("b" + s)[3].brief.includes("− ("));
});

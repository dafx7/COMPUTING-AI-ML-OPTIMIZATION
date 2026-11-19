import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.KV_REST_API_URL;
process.env.MENTOR_KEY = "test-key";
const S = await import("../lib/session.mjs");

let code;
beforeEach(async () => { code = (await S.createSession()).code; });

test("mentor key is required", () => {
  assert.throws(() => S.checkMentor("nope"), /Wrong mentor key/);
  S.checkMentor("test-key");
});

test("join, then only the first answer counts", async () => {
  const p = await S.join(code, "Rina");
  await assert.rejects(S.commit(code, p.pid, 1, { eta: 0.3 }), /not open/);
  await S.setPhase(code, 1, "open");
  const a = await S.commit(code, p.pid, 1, { eta: 0.3 });
  const b = await S.commit(code, p.pid, 1, { eta: 0.5 });
  assert.equal(a.already, false);
  assert.equal(b.already, true);
  assert.deepEqual(b.choice, { eta: 0.3 });
  const st = await S.state(code, p.pid);
  assert.equal(st.mine.choice.eta, 0.3);
  assert.ok(Array.isArray(st.mine.path));
});

test("closed levels reject answers and nicknames are unique", async () => {
  const p = await S.join(code, "Budi");
  await assert.rejects(S.join(code, "budi"), /taken/);
  await S.setPhase(code, 2, "reveal");
  await assert.rejects(S.commit(code, p.pid, 2, { eta: 0.1 }), /not open/);
});

test("fog steps are final and finish after 4", async () => {
  const p = await S.join(code, "Sari");
  await S.setPhase(code, 6, "open");
  let r;
  for (let i = 0; i < 4; i++) r = await S.fogStep(code, p.pid, 0.1);
  assert.ok(r.finished);
  await assert.rejects(S.fogStep(code, p.pid, 0.1), /already finished|No steps left/);
});

test("results rank players and delete wipes the session", async () => {
  const a = await S.join(code, "Ana"), b = await S.join(code, "Bob");
  await S.setPhase(code, 3, "open");
  const la = (await S.state(code, a.pid)).current, lb = (await S.state(code, b.pid)).current;
  await S.commit(code, a.pid, 3, { eta: Math.round(100 / (2 * la.c)) / 100 });
  await S.commit(code, b.pid, 3, { eta: 1.2 });
  const r = await S.results(code, 3);
  assert.equal(r.ranking[0].nick, "Ana");
  assert.equal(r.answers.length, 2);
  await S.deleteSession(code);
  await assert.rejects(S.state(code, a.pid), /Session not found/);
});

test("bad input is rejected", async () => {
  await assert.rejects(S.join("??", "x1"), /not valid/);
  await assert.rejects(S.join(code, "x"), /at least 2/);
  const p = await S.join(code, "Dodi");
  await S.setPhase(code, 1, "open");
  await assert.rejects(S.commit(code, p.pid, 1, { eta: 99 }), /outside/);
  await assert.rejects(S.state(code, "deadbeef"), /Unknown player/);
});

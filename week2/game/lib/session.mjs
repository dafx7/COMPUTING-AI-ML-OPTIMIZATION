// Server-side game logic. The browser never decides a score: it sends a choice,
// the server checks it is the player's first answer for an open level, and scores it.
import { randomBytes, timingSafeEqual } from "node:crypto";
import { store } from "./store.mjs";
import { LEVEL_COUNT, makeLevels, play, publicLevel, validateChoice, fogView, cleanEta } from "./engine.mjs";

const K = {
  session: (c) => `tl:${c}`,
  players: (c) => `tl:${c}:players`,
  commits: (c, l) => `tl:${c}:commits:${l}`,
  fog: (c) => `tl:${c}:fog`,
};

const CODE_RE = /^[A-Z0-9]{4,8}$/;
const PID_RE = /^[a-f0-9]{32}$/;

export class GameError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const parse = (v) => (v == null ? null : typeof v === "string" ? JSON.parse(v) : v);

function cleanCode(code) {
  const c = String(code || "").trim().toUpperCase();
  if (!CODE_RE.test(c)) throw new GameError(400, "That session code is not valid.");
  return c;
}

function cleanNick(nick) {
  const n = String(nick || "").replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 20);
  if (n.length < 2) throw new GameError(400, "Choose a nickname of at least 2 characters.");
  return n;
}

async function getSession(code) {
  const s = await store().hgetall(K.session(code));
  if (!s || !s.level) throw new GameError(404, "Session not found. Check the code with your mentor.");
  return { level: Number(s.level), phase: s.phase, created: Number(s.created) };
}

async function getPlayer(code, pid) {
  if (!PID_RE.test(String(pid || ""))) throw new GameError(401, "Unknown player. Join again.");
  const p = parse(await store().hget(K.players(code), pid));
  if (!p) throw new GameError(401, "Unknown player. Join again.");
  return p;
}

const seedFor = (code, pid) => `${code}:${pid}`;

// ---------------------------------------------------------------- mentor
export function checkMentor(key) {
  const expected = process.env.MENTOR_KEY || "";
  if (!expected) throw new GameError(503, "MENTOR_KEY is not set on the server.");
  const a = Buffer.from(String(key || "")), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new GameError(403, "Wrong mentor key.");
}

export async function createSession() {
  const code = "GD" + String(Math.floor(1000 + Math.random() * 9000));
  const st = store();
  await st.hset(K.session(code), "level", "0");
  await st.hset(K.session(code), "phase", "lobby");
  await st.hset(K.session(code), "created", String(Date.now()));
  return { code };
}

export async function setPhase(codeRaw, level, phase) {
  const code = cleanCode(codeRaw);
  await getSession(code);
  const lv = Number(level);
  if (!Number.isInteger(lv) || lv < 0 || lv > LEVEL_COUNT) throw new GameError(400, "Bad level.");
  if (!["lobby", "open", "reveal", "done"].includes(phase)) throw new GameError(400, "Bad phase.");
  await store().hset(K.session(code), "level", String(lv));
  await store().hset(K.session(code), "phase", phase);
  return { code, level: lv, phase };
}

export async function deleteSession(codeRaw) {
  const code = cleanCode(codeRaw);
  const keys = [K.session(code), K.players(code), K.fog(code)];
  for (let l = 1; l <= LEVEL_COUNT; l++) keys.push(K.commits(code, l));
  await store().del(...keys);
  return { deleted: code };
}

// Projector view: who joined, the class's choices for one level, and the ranking.
export async function results(codeRaw, levelRaw) {
  const code = cleanCode(codeRaw);
  const s = await getSession(code);
  const level = Number(levelRaw || s.level);
  const players = await store().hgetall(K.players(code));
  const nick = {};
  for (const [pid, v] of Object.entries(players)) nick[pid] = parse(v).nick;
  const totals = Object.fromEntries(Object.keys(nick).map((p) => [p, 0]));
  let current = [];
  for (let l = 1; l <= LEVEL_COUNT; l++) {
    const commits = await store().hgetall(K.commits(code, l));
    for (const [pid, v] of Object.entries(commits)) {
      const c = parse(v);
      if (pid in totals) totals[pid] += c.score;
      if (l === level) current.push({ nick: nick[pid] || "?", score: c.score, blown: c.blown, x: classX(makeLevels(seedFor(code, pid))[l - 1], c) });
    }
  }
  const ranking = Object.entries(totals).map(([pid, t]) => ({ nick: nick[pid], total: Math.round(t * 10) / 10 }))
    .sort((a, b) => b.total - a.total || a.nick.localeCompare(b.nick));
  return { code, session: s, level, joined: Object.keys(nick).length, answers: current, ranking };
}

// Where an answer sits on a scale shared by the whole class (players have different valleys).
function classX(lv, c) {
  const ch = c.choice;
  if (lv.id <= 3) return Math.round(ch.eta * 2 * lv.c * 100) / 100;          // 1 = perfect step, 2+ = blows up
  if (lv.id === 4) return Math.round(ch.eta * 2 * lv.c2 * 100) / 100;        // steep direction: 2+ blows up
  if (lv.id === 5) return Math.round(ch.start * (lv.t > 0 ? -1 : 1) * 10) / 10; // > 0: started on the deeper side
  return c.score;                                                           // fog: final score
}

// ---------------------------------------------------------------- players
export async function join(codeRaw, nickRaw) {
  const code = cleanCode(codeRaw);
  const nick = cleanNick(nickRaw);
  await getSession(code);
  const players = await store().hgetall(K.players(code));
  const taken = Object.values(players).some((v) => parse(v).nick.toLowerCase() === nick.toLowerCase());
  if (taken) throw new GameError(409, "That nickname is taken in this session. Pick another.");
  const pid = randomBytes(16).toString("hex");
  await store().hset(K.players(code), pid, JSON.stringify({ nick, at: Date.now() }));
  return { code, pid, nick };
}

export async function state(codeRaw, pid) {
  const code = cleanCode(codeRaw);
  const s = await getSession(code);
  const me = await getPlayer(code, pid);
  const levels = makeLevels(seedFor(code, pid));
  let total = 0;
  const done = {};
  for (let l = 1; l <= LEVEL_COUNT; l++) {
    const c = parse(await store().hget(K.commits(code, l), pid));
    if (c) { total += c.score; done[l] = c; }
  }
  const out = { code, nick: me.nick, phase: s.phase, level: s.level, total: Math.round(total * 10) / 10 };
  if (s.level >= 1 && s.level <= LEVEL_COUNT) {
    const lv = levels[s.level - 1];
    out.current = publicLevel(lv);
    const mine = done[s.level] || null;
    // include the path so a reloaded page can show the locked result again
    out.mine = mine ? { ...mine, path: lv.id === 6 ? fogView(lv, mine.choice.etas) : play(lv, mine.choice).path } : null;
    if (lv.id === 6) {
      const etas = parse(await store().hget(K.fog(code), pid)) || [];
      out.fog = { etas, view: fogView(lv, etas.length ? etas : []) };
    }
  }
  return out;
}

export async function commit(codeRaw, pid, levelRaw, choiceRaw) {
  const code = cleanCode(codeRaw);
  const s = await getSession(code);
  await getPlayer(code, pid);
  const level = Number(levelRaw);
  if (s.phase !== "open" || s.level !== level) throw new GameError(409, "This level is not open right now.");
  if (level === 6) throw new GameError(400, "Use the fog steps for level 6.");
  const lv = makeLevels(seedFor(code, pid))[level - 1];
  const choice = validateChoice(lv, choiceRaw);
  if (!choice) throw new GameError(400, "That choice is outside the allowed range.");
  const r = play(lv, choice);
  const rec = { choice, score: r.score, blown: r.blown, at: Date.now() };
  const first = await store().hsetnx(K.commits(code, level), pid, JSON.stringify(rec));
  if (!first) {
    const prev = parse(await store().hget(K.commits(code, level), pid));
    return { already: true, ...prev, path: play(lv, prev.choice).path };
  }
  return { already: false, ...rec, path: r.path };
}

// Fog level: one step at a time. Each step is final once sent.
export async function fogStep(codeRaw, pid, etaRaw) {
  const code = cleanCode(codeRaw);
  const s = await getSession(code);
  await getPlayer(code, pid);
  if (s.phase !== "open" || s.level !== 6) throw new GameError(409, "The fog level is not open right now.");
  const lv = makeLevels(seedFor(code, pid))[5];
  if (await store().hget(K.commits(code, 6), pid)) throw new GameError(409, "You already finished the fog level.");
  const eta = cleanEta(etaRaw, lv.etaMax);
  if (eta === null) throw new GameError(400, "That η is outside the allowed range.");
  const etas = parse(await store().hget(K.fog(code), pid)) || [];
  if (etas.length >= lv.steps) throw new GameError(409, "No steps left.");
  etas.push(eta);
  await store().hset(K.fog(code), pid, JSON.stringify(etas));
  const r = play(lv, { etas });
  const view = fogView(lv, etas);
  let finished = null;
  if (etas.length === lv.steps || r.blown) {
    finished = { choice: { etas }, score: r.score, blown: r.blown, at: Date.now() };
    await store().hsetnx(K.commits(code, 6), pid, JSON.stringify(finished));
  }
  return { etas, view, blown: r.blown, finished };
}

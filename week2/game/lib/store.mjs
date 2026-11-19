// Storage: Upstash Redis on Vercel, plain memory locally and in tests.
// Every key expires after 24 hours, so session data deletes itself.
import { Redis } from "@upstash/redis";

export const TTL_SECONDS = 24 * 60 * 60;

function redisFromEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token, automaticDeserialization: false });
}

function memoryStore() {
  const g = globalThis;
  if (!g.__turunLembahMem) g.__turunLembahMem = new Map();
  const m = g.__turunLembahMem;
  const now = () => Date.now();
  const live = (k) => { const e = m.get(k); if (!e) return null; if (e.exp < now()) { m.delete(k); return null; } return e; };
  return {
    kind: "memory",
    async hget(k, f) { const e = live(k); return e && f in e.v ? e.v[f] : null; },
    async hset(k, f, v) { const e = live(k) || { v: {}, exp: now() + TTL_SECONDS * 1000 }; e.v[f] = v; m.set(k, e); },
    async hsetnx(k, f, v) { const e = live(k) || { v: {}, exp: now() + TTL_SECONDS * 1000 }; if (f in e.v) return false; e.v[f] = v; m.set(k, e); return true; },
    async hgetall(k) { const e = live(k); return e ? { ...e.v } : {}; },
    async del(...ks) { ks.forEach((k) => m.delete(k)); },
    async expire(k) { const e = live(k); if (e) e.exp = now() + TTL_SECONDS * 1000; },
  };
}

function upstashStore(r) {
  return {
    kind: "upstash",
    hget: (k, f) => r.hget(k, f),
    async hset(k, f, v) { await r.hset(k, { [f]: v }); await r.expire(k, TTL_SECONDS); },
    async hsetnx(k, f, v) { const ok = await r.hsetnx(k, f, v); await r.expire(k, TTL_SECONDS); return ok === 1 || ok === true; },
    async hgetall(k) { return (await r.hgetall(k)) || {}; },
    async del(...ks) { if (ks.length) await r.del(...ks); },
    async expire(k) { await r.expire(k, TTL_SECONDS); },
  };
}

let cached;
export function store() {
  if (!cached) {
    const r = redisFromEnv();
    // On Vercel each function instance has its own memory, so the memory store would lose answers.
    if (!r && process.env.VERCEL) throw new Error("No Redis configured: add the Upstash Redis integration in Vercel.");
    cached = r ? upstashStore(r) : memoryStore();
  }
  return cached;
}

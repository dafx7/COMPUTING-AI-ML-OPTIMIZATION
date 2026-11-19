# Turun Lembah: a gradient descent game (Pertemuan 2)

Students commit **one learning rate per level** (no retries), so understanding beats guessing. Six levels: gentle bowl, steep bowl, one perfect step, a long 2D valley, two valleys, and fog (hidden valley, slope only). The projector shows where the whole class's answers fall on one shared scale (for example `η × 2c`, where 1 is the perfect step and 2 or more flies off), then a ranking.

In simulations over 400 random players: random guessing averages about 254 of 600 points, "always η = 0.25" about 380, "always cautious" about 415, knowing `η = 1/(2c)` but nothing else about 430, full understanding 599.

## Pages
| Path | Who | What |
|---|---|---|
| `/` | students | join with the session code and a nickname |
| `/play` | students | the levels; a locked answer survives a page reload |
| `/stage` | mentors (projector) | mentor key, create session, open and reveal levels, class chart, ranking, delete data |
| `/practice` | anyone | the same levels offline, retries allowed, with an explanation after each run |

## How it works
- Game logic is in `lib/engine.mjs`, shared by the browser (animation) and the server (scoring). Every player gets slightly different numbers from their own seed, so copying an answer does not help.
- The server scores every answer itself and keeps only the **first** answer per level (`hsetnx`). The fog level stores each step as it is sent.
- Storage: Upstash Redis (via the Vercel Marketplace). Locally and in tests: memory. **Every key expires after 24 hours**, and the stage page has a "Delete session data" button.
- Privacy: nicknames only, no accounts, no names or student IDs, nothing kept after 24 hours.

## Run locally
```bash
npm install
MENTOR_KEY=choose-a-key npm run dev
```
Open `/stage` with that key, then join from `/` in another window. Tests: `npm test`.

## Deploy on Vercel (done by the coordinator; no tokens pass through Claude)
1. Merge this branch into `main` (or deploy the branch directly).
2. In Vercel: **Add New → Project → Import** `dafx7/COMPUTING-AI-ML-OPTIMIZATION`. Set **Root Directory** to `week2/game`. Framework: Next.js (detected).
3. **Storage → Marketplace → Upstash Redis**, create a free database and connect it to this project. This adds the Redis environment variables automatically (`UPSTASH_REDIS_REST_URL`/`_TOKEN` or `KV_REST_API_URL`/`_TOKEN`; both are supported).
4. **Settings → Environment Variables:** add `MENTOR_KEY` with a key only mentors know.
5. Deploy. Open `/stage`, enter the key, create a test session, join from a phone, play one level, then delete the session.

The Vercel Hobby plan is for non-commercial use. Check Upstash's current free-tier limits; one class session uses roughly 25,000 commands.

## Before class
- Test the full flow once on the real deployment with two phones.
- If campus Wi-Fi fails during class, students can still play `/practice` (offline, no ranking).

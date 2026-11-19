import { NextResponse } from "next/server";
import { GameError } from "./session.mjs";

export async function handle(fn) {
  try {
    return NextResponse.json(await fn(), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const status = e instanceof GameError ? e.status : 500;
    const message = e instanceof GameError ? e.message : "Server error. Try again.";
    if (!(e instanceof GameError)) console.error(e);
    return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
  }
}

export async function body(req) {
  try { return await req.json(); } catch { throw new GameError(400, "Bad request."); }
}

import { handle, body } from "@/lib/http.mjs";
import { commit } from "@/lib/session.mjs";
export const dynamic = "force-dynamic";
export async function POST(req) { return handle(async () => { const b = await body(req); return commit(b.code, b.pid, b.level, b.choice); }); }

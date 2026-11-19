import { handle, body } from "@/lib/http.mjs";
import { join } from "@/lib/session.mjs";
export const dynamic = "force-dynamic";
export async function POST(req) { return handle(async () => { const b = await body(req); return join(b.code, b.nick); }); }

import { handle, body } from "@/lib/http.mjs";
import { fogStep } from "@/lib/session.mjs";
export const dynamic = "force-dynamic";
export async function POST(req) { return handle(async () => { const b = await body(req); return fogStep(b.code, b.pid, b.eta); }); }

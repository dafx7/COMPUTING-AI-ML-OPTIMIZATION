import { handle } from "@/lib/http.mjs";
import { state } from "@/lib/session.mjs";
export const dynamic = "force-dynamic";
export async function GET(req) { return handle(() => { const u = new URL(req.url); return state(u.searchParams.get("code"), u.searchParams.get("pid")); }); }

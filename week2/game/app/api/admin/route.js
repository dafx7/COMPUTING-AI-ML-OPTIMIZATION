import { handle, body } from "@/lib/http.mjs";
import { checkMentor, createSession, setPhase, deleteSession, GameError } from "@/lib/session.mjs";
export const dynamic = "force-dynamic";
export async function POST(req) {
  return handle(async () => {
    checkMentor(req.headers.get("x-mentor-key"));
    const b = await body(req);
    if (b.action === "check") return { ok: true };
    if (b.action === "create") return createSession();
    if (b.action === "phase") return setPhase(b.code, b.level, b.phase);
    if (b.action === "delete") return deleteSession(b.code);
    throw new GameError(400, "Unknown action.");
  });
}

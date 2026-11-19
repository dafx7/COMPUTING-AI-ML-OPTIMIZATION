import { handle } from "@/lib/http.mjs";
import { checkMentor, results } from "@/lib/session.mjs";
export const dynamic = "force-dynamic";
export async function GET(req) {
  return handle(() => {
    checkMentor(req.headers.get("x-mentor-key"));
    const u = new URL(req.url);
    return results(u.searchParams.get("code"), u.searchParams.get("level"));
  });
}

import { commit, handle, loadState, readJson, requireSession } from "@/server/http";
import { bookConsultation, getConsultation } from "@/server/store";
import { parseConsultationInput } from "@/server/validation";

export async function POST(request: Request) {
  return handle(async () => {
    await requireSession();
    const input = parseConsultationInput(await readJson(request));
    const context = await loadState();
    const nextState = bookConsultation(context.state, input, context.now);
    return commit(context, nextState, {
      ok: true,
      consultation: getConsultation(nextState),
    });
  });
}

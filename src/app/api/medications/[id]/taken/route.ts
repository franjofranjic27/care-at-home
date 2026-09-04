import { commit, handle, loadState, readJson, requireSession } from "@/server/http";
import { setMedicationTaken } from "@/server/store";
import { parseTakenInput } from "@/server/validation";

interface Context {
  readonly params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Context) {
  return handle(async () => {
    await requireSession();
    const { id } = await params;
    const { taken } = parseTakenInput(await readJson(request));
    const context = await loadState();
    return commit(context, setMedicationTaken(context.state, id, taken), { ok: true });
  });
}

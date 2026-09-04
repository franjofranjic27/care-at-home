import { commit, handle, loadState, requireSession } from "@/server/http";
import { cancelAppointment } from "@/server/store";

interface Context {
  readonly params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: Context) {
  return handle(async () => {
    await requireSession();
    const { id } = await params;
    const context = await loadState();
    const nextState = cancelAppointment(context.state, id, context.now);
    return commit(context, nextState, { ok: true });
  });
}

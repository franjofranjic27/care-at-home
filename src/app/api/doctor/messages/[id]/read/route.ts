import { commit, handle, loadState, requireSession } from "@/server/http";
import { markMessageRead } from "@/server/store";

interface Context {
  readonly params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Context) {
  return handle(async () => {
    await requireSession();
    const { id } = await params;
    const context = await loadState();
    const nextState = markMessageRead(context.state, id, context.now);
    return commit(context, nextState, { ok: true });
  });
}

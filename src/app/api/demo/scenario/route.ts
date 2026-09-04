import { commit, handle, loadState, readJson } from "@/server/http";
import { applyScenario } from "@/server/store";
import { parseScenarioInput } from "@/server/validation";

/**
 * Demo-Steuerung: setzt den Arzt-Status bzw. fügt eine neue Nachricht ein.
 * Bewusst ohne Session, damit `/demo` schon vor dem Login nutzbar ist.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const { scenario } = parseScenarioInput(await readJson(request));
    const context = await loadState();
    return commit(context, applyScenario(context.state, scenario, context.now), { ok: true });
  });
}

import { NextResponse } from "next/server";
import { commit, handle, loadState, readJson, requireSession } from "@/server/http";
import { bookAppointment, getAppointments } from "@/server/store";
import { parseBookAppointmentInput } from "@/server/validation";

export async function GET() {
  return handle(async () => {
    await requireSession();
    const { state, now } = await loadState();
    return NextResponse.json({ appointments: getAppointments(state, now) });
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    await requireSession();
    const input = parseBookAppointmentInput(await readJson(request));
    const context = await loadState();
    const result = bookAppointment(context.state, input, context.now);
    return commit(context, result.state, { appointment: result.appointment });
  });
}

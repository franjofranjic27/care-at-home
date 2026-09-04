import { NextResponse } from "next/server";
import { handle, loadState, requireSession } from "@/server/http";
import { getConsultationSlotsView } from "@/server/store";

export async function GET() {
  return handle(async () => {
    await requireSession();
    const { state, now } = await loadState();
    return NextResponse.json(getConsultationSlotsView(state, now));
  });
}

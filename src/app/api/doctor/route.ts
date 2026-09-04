import { NextResponse } from "next/server";
import { handle, loadState, requireSession } from "@/server/http";
import { getDoctorView } from "@/server/store";

export async function GET() {
  return handle(async () => {
    await requireSession();
    const { state, now } = await loadState();
    return NextResponse.json(getDoctorView(state, now));
  });
}

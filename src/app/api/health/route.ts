import { NextResponse } from "next/server";
import { handle, loadState, requireSession } from "@/server/http";
import { getHealth } from "@/server/store";

export async function GET() {
  return handle(async () => {
    await requireSession();
    const { state, now } = await loadState();
    return NextResponse.json(getHealth(state, now));
  });
}

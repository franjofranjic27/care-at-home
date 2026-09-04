import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { handle } from "@/server/http";

export async function POST() {
  return handle(async () => {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    return NextResponse.json({ ok: true });
  });
}

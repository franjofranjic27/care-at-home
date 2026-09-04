import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { handle } from "@/server/http";
import { clearState } from "@/server/state";

/**
 * Setzt den Demo-Zustand auf die Seed-Daten zurück (löscht das State-Cookie).
 * Bewusst ohne Session, damit `/demo` schon vor dem Login nutzbar ist.
 */
export async function POST() {
  return handle(async () => {
    clearState(await cookies());
    return NextResponse.json({ ok: true });
  });
}

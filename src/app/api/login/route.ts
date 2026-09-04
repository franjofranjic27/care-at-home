import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encodeSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { UnauthorizedError } from "@/server/errors";
import { handle, readJson } from "@/server/http";
import { DEMO_PIN, getPatient } from "@/server/seed";
import { parseLoginInput } from "@/server/validation";

/** Demo-Anmeldung: jede AHV-Nummer, PIN 1234. */
export async function POST(request: Request) {
  return handle(async () => {
    const input = parseLoginInput(await readJson(request));
    if (input.pin !== DEMO_PIN) {
      throw new UnauthorizedError("Die PIN ist nicht richtig. Bitte versuchen Sie es noch einmal.");
    }
    const patient = getPatient();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, encodeSession({ patientId: patient.id }), sessionCookieOptions());
    return NextResponse.json({ ok: true, patient });
  });
}

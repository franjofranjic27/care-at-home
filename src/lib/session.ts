/**
 * Demo-Session: ein httpOnly-Cookie mit der Patienten-ID. Ohne Backend gibt
 * es keine serverseitige Prüfung – das ist für den Prototyp beabsichtigt.
 */
import { cookies } from "next/headers";
import { cookieOptions } from "@/server/cookies";
import { getPatient } from "@/server/seed";

export const SESSION_COOKIE = "cah_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export interface Session {
  readonly patientId: string;
}

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

/** Nur die bekannte Demo-Patientin ergibt eine Session; alles andere wird verworfen. */
export function decodeSession(raw: string | undefined): Session | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (typeof parsed !== "object" || parsed === null || !("patientId" in parsed)) {
      return null;
    }
    const { patientId } = parsed as { patientId: unknown };
    return patientId === getPatient().id ? { patientId } : null;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return cookieOptions(SESSION_MAX_AGE_SECONDS);
}

/** Liest die Session in Server Components und Route Handlers. */
export async function readSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

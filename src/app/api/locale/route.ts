import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE_SECONDS } from "@/i18n/config";
import { cookieOptions } from "@/server/cookies";
import { handle, readJson } from "@/server/http";
import { parseLocaleInput } from "@/server/validation";

/**
 * Speichert die gewählte Sprache im Cookie `cah_locale`.
 * Bewusst ohne Session, damit der Sprachumschalter schon vor dem Login funktioniert.
 */
export async function POST(request: Request) {
  return handle(async () => {
    const { locale } = parseLocaleInput(await readJson(request));
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE, locale, cookieOptions(LOCALE_COOKIE_MAX_AGE_SECONDS));
    return NextResponse.json({ ok: true, locale });
  });
}

/**
 * next-intl ohne i18n-Routing: Die Sprache wird pro Anfrage bestimmt –
 * Cookie `cah_locale` → `Accept-Language` → Standard – und die passenden
 * Messages werden geladen.
 */
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, TIME_ZONE, type Locale } from "./config";
import { negotiateLocale } from "./negotiate";

async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) {
    return fromCookie;
  }
  const headerStore = await headers();
  return negotiateLocale(headerStore.get("accept-language")) ?? DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: TIME_ZONE,
  };
});

/**
 * Sprachkonfiguration. Die Sprache steckt nicht in der URL, sondern wird aus
 * Cookie und `Accept-Language` bestimmt (siehe `request.ts`).
 */
export const LOCALES = ["de", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie mit der gewählten Sprache; wird über `POST /api/locale` gesetzt. */
export const LOCALE_COOKIE = "cah_locale";
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export const TIME_ZONE = "Europe/Zurich";

/**
 * BCP-47-Tag für `Intl`-Formatierung je Sprache. Die App-Sprache ist bewusst
 * nur «de» / «en» (Cookie, `<html lang>`), formatiert wird aber regional.
 */
const INTL_LOCALES: Readonly<Record<Locale, string>> = {
  de: "de-CH",
  en: "en-GB",
};

export function intlLocale(locale: Locale): string {
  return INTL_LOCALES[locale];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Die nächste Sprache in `LOCALES` – bei zwei Sprachen die jeweils andere. */
export function nextLocale(locale: Locale): Locale {
  const index = LOCALES.indexOf(locale);
  return LOCALES[(index + 1) % LOCALES.length];
}

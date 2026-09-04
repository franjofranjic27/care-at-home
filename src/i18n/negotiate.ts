import { isLocale, type Locale } from "./config";

interface LanguageRange {
  readonly tag: string;
  readonly quality: number;
}

/** Ein Eintrag wie "de-CH;q=0.8" → { tag: "de-CH", quality: 0.8 }. */
function parseLanguageRange(entry: string): LanguageRange | null {
  const [rawTag, ...params] = entry.trim().split(";");
  const tag = rawTag.trim();
  if (tag.length === 0) {
    return null;
  }
  const qParam = params.map((p) => p.trim().toLowerCase()).find((p) => p.startsWith("q="));
  const quality = qParam === undefined ? 1 : Number(qParam.slice(2));
  return Number.isFinite(quality) ? { tag, quality } : null;
}

function primarySubtag(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

/**
 * Bestimmt aus dem `Accept-Language`-Header die bevorzugte unterstützte
 * Sprache: Einträge nach Gewicht sortiert, der erste mit unterstützter
 * Hauptsprache gewinnt («de-CH» → «de»). Nicht unterstützte Sprachen werden
 * übersprungen; ohne Treffer gibt es `null`.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale | null {
  if (!acceptLanguage) {
    return null;
  }
  const ranked = acceptLanguage
    .split(",")
    .map(parseLanguageRange)
    .filter((range): range is LanguageRange => range !== null && range.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const range of ranked) {
    const candidate = primarySubtag(range.tag);
    if (isLocale(candidate)) {
      return candidate;
    }
  }
  return null;
}

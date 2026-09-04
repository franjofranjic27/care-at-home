import { intlLocale, type Locale } from "@/i18n/config";

/** Zahl regional formatiert, z. B. 68.2 → "68.2" (de-CH) bzw. "68.2" (en-GB). */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 2 }).format(value);
}

/**
 * Typisierung für next-intl: Übersetzungsschlüssel und ICU-Argumente werden
 * gegen `messages/en.json` geprüft, `getLocale()`/`useLocale()` liefern `Locale`.
 */
import type messages from "../../messages/en.json";
import type { Locale } from "./config";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}

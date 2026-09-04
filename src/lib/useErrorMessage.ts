"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { describeError } from "./api";

/**
 * Liefert eine Funktion, die einen API-Fehler in eine anzeigbare Meldung
 * übersetzt: die Server-Meldung (bereits in der Sprache der Anfrage) oder
 * der generische Ersatztext in der aktuellen Sprache.
 */
export function useErrorMessage(): (error: unknown) => string {
  const t = useTranslations("common");
  return useCallback((error: unknown) => describeError(error, t("genericError")), [t]);
}

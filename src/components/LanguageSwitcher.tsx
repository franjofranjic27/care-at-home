"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { nextLocale } from "@/i18n/config";
import { api } from "@/lib/api";
import { cx } from "@/lib/cx";

export type LanguageSwitcherVariant = "hero" | "text";

const BASE =
  "inline-flex min-h-15 items-center justify-center font-bold whitespace-nowrap transition-colors " +
  "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] disabled:cursor-wait";

const VARIANTS: Readonly<Record<LanguageSwitcherVariant, string>> = {
  /** Weiss auf Blau im Kopf der Anmeldeseite. */
  hero: "rounded-control border-2 border-white px-4 text-body text-white hover:bg-white/10 focus-visible:outline-white disabled:opacity-70",
  /** Kompakter Text-Knopf neben «Abmelden» in der Übersicht. */
  text: "px-2 text-small text-brand hover:text-brand-dark focus-visible:outline-ink disabled:text-faint",
};

/**
 * Ein Knopf, der die jeweils andere Sprache anzeigt («English» auf Deutsch,
 * «Deutsch» auf Englisch). Speichert die Wahl im Cookie und lädt die Seite neu.
 */
export function LanguageSwitcher({ variant }: { readonly variant: LanguageSwitcherVariant }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("common");
  const [pending, setPending] = useState(false);

  const target = nextLocale(locale);
  const targetName = t(`languages.${target}`);

  async function switchLanguage() {
    setPending(true);
    try {
      await api.setLocale(target);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      lang={target}
      aria-label={t("switchLanguage", { language: targetName })}
      onClick={switchLanguage}
      disabled={pending}
      className={cx(BASE, VARIANTS[variant])}
    >
      {targetName}
    </button>
  );
}

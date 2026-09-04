"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Screen } from "@/components/layout/Screen";
import { Button, ErrorNote, LinkButton } from "@/components/ui";
import { api } from "@/lib/api";
import { useErrorMessage } from "@/lib/useErrorMessage";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/**
 * Fehlerseite des geschützten Bereichs. Der häufigste Grund für einen Fehler
 * ist ein unbrauchbarer Demo-Zustand; deshalb gibt es hier einen Knopf, der
 * den Zustand zurücksetzt und die Seite neu lädt.
 */
export default function AppError({ error, reset }: ErrorPageProps) {
  const router = useRouter();
  const t = useTranslations("error");
  const tCommon = useTranslations("common");
  const describeError = useErrorMessage();
  const [pending, setPending] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    console.error(error);
  }, [error]);

  async function resetDemo() {
    setPending(true);
    setResetError(null);
    try {
      await api.resetDemo();
      router.refresh();
      reset();
    } catch (cause) {
      setResetError(describeError(cause));
      setPending(false);
    }
  }

  return (
    <Screen>
      <h1>{t("title")}</h1>
      <p>{t("body")}</p>

      <ErrorNote message={resetError} />

      <Button onClick={resetDemo} disabled={pending}>
        {pending ? t("resetting") : t("resetDemo")}
      </Button>
      <Button variant="secondary" onClick={reset} disabled={pending}>
        {t("retry")}
      </Button>

      <div className="grow" />

      <LinkButton href="/login" variant="text">
        {tCommon("toLogin")}
      </LinkButton>
    </Screen>
  );
}

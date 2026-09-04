"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Screen } from "@/components/layout/Screen";
import { Button, ErrorNote, LinkButton } from "@/components/ui";
import { api, describeError } from "@/lib/api";

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
      <h1>Etwas hat nicht geklappt</h1>
      <p>
        Die Seite konnte nicht geladen werden. Sie können die Demo-Daten zurücksetzen oder es noch einmal
        versuchen.
      </p>

      <ErrorNote message={resetError} />

      <Button onClick={resetDemo} disabled={pending}>
        {pending ? "Wird zurückgesetzt …" : "Demo-Daten zurücksetzen"}
      </Button>
      <Button variant="secondary" onClick={reset} disabled={pending}>
        Noch einmal versuchen
      </Button>

      <div className="grow" />

      <LinkButton href="/login" variant="text">
        Zur Anmeldung
      </LinkButton>
    </Screen>
  );
}

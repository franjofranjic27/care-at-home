"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, ErrorNote } from "@/components/ui";
import { api } from "@/lib/api";
import { useErrorMessage } from "@/lib/useErrorMessage";
import { SCENARIOS } from "@/server/domain";

export function DemoControls() {
  const router = useRouter();
  const t = useTranslations("demo");
  const describeError = useErrorMessage();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<unknown>, done: string) {
    setPending(true);
    setError(null);
    setStatus(null);
    try {
      await action();
      setStatus(done);
      router.refresh();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {SCENARIOS.map((scenario) => (
        <Button
          key={scenario}
          variant="secondary"
          disabled={pending}
          onClick={() => run(() => api.setScenario(scenario), t(`scenario.${scenario}.done`))}
        >
          {t(`scenario.${scenario}.label`)}
        </Button>
      ))}
      <Button variant="danger-outline" disabled={pending} onClick={() => run(() => api.resetDemo(), t("resetDone"))}>
        {t("reset")}
      </Button>
      <p role="status" aria-live="polite" className="min-h-6 text-center font-bold text-ok-text">
        {status}
      </p>
      <ErrorNote message={error} />
    </div>
  );
}

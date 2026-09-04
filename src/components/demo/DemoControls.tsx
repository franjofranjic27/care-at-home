"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ErrorNote } from "@/components/ui";
import { api, describeError } from "@/lib/api";
import type { Scenario } from "@/server/domain";

interface ScenarioOption {
  readonly scenario: Scenario;
  readonly label: string;
  readonly done: string;
}

const SCENARIOS: readonly ScenarioOption[] = [
  { scenario: "reviewing", label: "Arzt prüft gerade", done: "Die Ärztin prüft jetzt die Werte (blau)." },
  { scenario: "good", label: "Werte sind gut", done: "Neue grüne Nachricht eingefügt." },
  { scenario: "consultation", label: "Besprechung nötig", done: "Neue gelbe Nachricht eingefügt." },
];

export function DemoControls() {
  const router = useRouter();
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
      {SCENARIOS.map((option) => (
        <Button
          key={option.scenario}
          variant="secondary"
          disabled={pending}
          onClick={() => run(() => api.setScenario(option.scenario), option.done)}
        >
          {option.label}
        </Button>
      ))}
      <Button
        variant="danger-outline"
        disabled={pending}
        onClick={() => run(() => api.resetDemo(), "Alle Daten wurden zurückgesetzt.")}
      >
        Daten zurücksetzen
      </Button>
      <p role="status" aria-live="polite" className="min-h-6 text-center font-bold text-ok-text">
        {status}
      </p>
      <ErrorNote message={error} />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Card, ErrorNote } from "@/components/ui";
import { api, describeError } from "@/lib/api";
import { cx } from "@/lib/cx";
import { TIME_OF_DAY_LABELS } from "@/lib/labels";
import type { Medication } from "@/server/domain";

/** Medikamente von heute – die ganze Zeile ist der Klickbereich zum Abhaken. */
export function MedicationList({ medications }: { readonly medications: readonly Medication[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(medication: Medication) {
    setPendingId(medication.id);
    setError(null);
    try {
      await api.setMedicationTaken(medication.id, !medication.taken);
      router.refresh();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Card padding="none" className="gap-0 divide-y-2 divide-line">
        {medications.map((medication) => (
          <button
            key={medication.id}
            type="button"
            aria-pressed={medication.taken}
            disabled={pendingId !== null}
            onClick={() => toggle(medication)}
            className="flex min-h-17 w-full items-center gap-3.5 px-4.5 py-3 text-left transition-colors first:rounded-t-[14px] last:rounded-b-[14px] hover:bg-page focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-ink disabled:cursor-wait"
          >
            <span
              className={cx(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                medication.taken ? "bg-ok text-white" : "border-2 border-muted",
              )}
            >
              {medication.taken && <CheckIcon size={22} />}
            </span>
            <span className="flex grow flex-col gap-0.5">
              <span className="font-bold">
                {medication.name} {medication.dose}
              </span>
              <span className="text-small text-muted">
                {TIME_OF_DAY_LABELS[medication.timeOfDay]} · {medication.taken ? "genommen" : "noch offen"}
              </span>
            </span>
          </button>
        ))}
      </Card>
      <ErrorNote message={error} />
    </div>
  );
}

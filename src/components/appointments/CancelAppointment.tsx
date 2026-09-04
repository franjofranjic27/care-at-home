"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, Card, ErrorNote } from "@/components/ui";
import { api, describeError } from "@/lib/api";

interface CancelConfirmationProps {
  readonly appointmentId: string;
  readonly onKeep: () => void;
}

/** Inline-Bestätigung; beim Einblenden wandert der Fokus auf die Frage. */
function CancelConfirmation({ appointmentId, onKeep }: CancelConfirmationProps) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function cancel() {
    setPending(true);
    setError(null);
    try {
      await api.cancelAppointment(appointmentId);
      router.push("/");
      router.refresh();
    } catch (cause) {
      setError(describeError(cause));
      setPending(false);
    }
  }

  return (
    <Card tone="warn-tint" role="group" aria-labelledby="cancel-title" className="gap-3.5">
      <h2 id="cancel-title" ref={headingRef} tabIndex={-1} className="text-tile font-bold outline-none">
        Möchten Sie diesen Termin absagen?
      </h2>
      <p>Zum Ändern sagen Sie den Termin ab und buchen einen neuen.</p>
      <ErrorNote message={error} />
      <Button variant="danger-outline" onClick={cancel} disabled={pending}>
        {pending ? "Wird abgesagt …" : "Ja, absagen"}
      </Button>
      <Button variant="secondary" onClick={onKeep} disabled={pending}>
        Nein, behalten
      </Button>
    </Card>
  );
}

/** «Termin ändern oder absagen» mit Inline-Bestätigung – kein Browser-Dialog. */
export function CancelAppointment({ appointmentId }: { readonly appointmentId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="text" onClick={() => setConfirming(true)}>
        Termin ändern oder absagen
      </Button>
    );
  }

  return <CancelConfirmation appointmentId={appointmentId} onKeep={() => setConfirming(false)} />;
}

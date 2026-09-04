"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DropIcon, StethoscopeIcon } from "@/components/icons";
import { Button, ErrorNote, InfoNote, OptionCard, OptionRow, OptionTile, StepHeading } from "@/components/ui";
import { api, describeError } from "@/lib/api";
import type { IsoDate } from "@/lib/dates";
import { APPOINTMENT_SLOT_LABELS, APPOINTMENT_TYPE_LABELS } from "@/lib/labels";
import {
  APPOINTMENT_SLOTS,
  APPOINTMENT_TYPES,
  type AppointmentSlot,
  type AppointmentType,
} from "@/server/domain";

export interface DayOption {
  readonly iso: IsoDate;
  readonly weekday: string;
  readonly dayMonth: string;
}

const TYPE_ICONS: Readonly<Record<AppointmentType, React.ReactNode>> = {
  blood_draw: <DropIcon />,
  home_checkup: <StethoscopeIcon />,
};

export function AppointmentBooking({ days }: { readonly days: readonly DayOption[] }) {
  const router = useRouter();
  const [type, setType] = useState<AppointmentType | null>(null);
  const [date, setDate] = useState<IsoDate | null>(null);
  const [slot, setSlot] = useState<AppointmentSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const complete = type !== null && date !== null && slot !== null;

  async function submit() {
    if (!complete) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const { appointment } = await api.createAppointment({ type, date, slot });
      router.push(`/termin/bestaetigt?id=${encodeURIComponent(appointment.id)}`);
    } catch (cause) {
      setError(describeError(cause));
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5.5">
      <section className="flex flex-col gap-3" role="radiogroup" aria-labelledby="step-type">
        <StepHeading step={1} id="step-type">
          Was brauchen Sie?
        </StepHeading>
        {APPOINTMENT_TYPES.map((option) => (
          <OptionCard
            key={option}
            icon={TYPE_ICONS[option]}
            title={APPOINTMENT_TYPE_LABELS[option].title}
            subtitle={APPOINTMENT_TYPE_LABELS[option].subtitle}
            selected={type === option}
            onClick={() => setType(option)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3" role="radiogroup" aria-labelledby="step-day">
        <StepHeading step={2} id="step-day">
          An welchem Tag?
        </StepHeading>
        <div className="grid grid-cols-2 gap-2.5">
          {days.map((day) => (
            <OptionTile key={day.iso} selected={date === day.iso} onClick={() => setDate(day.iso)} className="min-h-19">
              <span className="text-lead font-bold">{day.weekday}</span>
              <span className="text-label">{day.dayMonth}</span>
            </OptionTile>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3" role="radiogroup" aria-labelledby="step-slot">
        <StepHeading step={3} id="step-slot">
          Zu welcher Zeit?
        </StepHeading>
        <div className="flex flex-col gap-2.5">
          {APPOINTMENT_SLOTS.map((option) => (
            <OptionRow
              key={option}
              label={APPOINTMENT_SLOT_LABELS[option].label}
              trailing={APPOINTMENT_SLOT_LABELS[option].time}
              selected={slot === option}
              onClick={() => setSlot(option)}
            />
          ))}
        </div>
      </section>

      {type === "blood_draw" && (
        <InfoNote>Bitte essen Sie am Morgen vor der Blutentnahme nichts. Wasser trinken ist erlaubt.</InfoNote>
      )}

      <ErrorNote message={error} />

      <Button onClick={submit} disabled={!complete || pending}>
        {pending ? "Wird gebucht …" : "Termin bestätigen"}
      </Button>
      {!complete && (
        <p className="text-center text-small text-muted">Bitte wählen Sie Art, Tag und Zeit.</p>
      )}
    </div>
  );
}

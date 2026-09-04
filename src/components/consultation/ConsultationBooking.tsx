"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { HospitalIcon, PhoneIcon } from "@/components/icons";
import { Button, ErrorNote, InfoNote, OptionRow, OptionTile, StepHeading } from "@/components/ui";
import { api } from "@/lib/api";
import { useErrorMessage } from "@/lib/useErrorMessage";
import { CONSULTATION_CHANNELS, type ConsultationChannel, type Doctor } from "@/server/domain";
import { ConsultationConfirmation, type ConfirmedConsultation } from "./ConsultationConfirmation";

export interface SlotOption {
  readonly id: string;
  readonly dateLabel: string;
  readonly time: string;
  readonly taken: boolean;
}

export interface ConsultationBookingProps {
  readonly doctor: Doctor;
  readonly slots: readonly SlotOption[];
  /** Bereits vereinbarte Besprechung – dann wird direkt die Bestätigung gezeigt. */
  readonly existing: ConfirmedConsultation | null;
}

const CHANNEL_ICONS: Readonly<Record<ConsultationChannel, React.ReactNode>> = {
  phone: <PhoneIcon size={30} />,
  onsite: <HospitalIcon size={30} />,
};

export function ConsultationBooking({ doctor, slots, existing }: ConsultationBookingProps) {
  const router = useRouter();
  const t = useTranslations("consultation");
  const tLabels = useTranslations("labels");
  const describeError = useErrorMessage();
  const [channel, setChannel] = useState<ConsultationChannel | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<ConfirmedConsultation | null>(existing);
  const [justBooked, setJustBooked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const complete = channel !== null && slotId !== null;
  const hint = channel
    ? tLabels(`channel.${channel}.hint`, { doctor: doctor.shortName })
    : t("chooseChannelFirst", { doctor: doctor.shortName });

  async function submit() {
    if (!complete) {
      return;
    }
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) {
      return;
    }
    setPending(true);
    setError(null);
    try {
      await api.bookConsultation({ slotId, channel });
      setConfirmed({ channel, dateLabel: slot.dateLabel, time: slot.time });
      setJustBooked(true);
      router.refresh();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setPending(false);
    }
  }

  if (confirmed) {
    return <ConsultationConfirmation doctor={doctor} consultation={confirmed} focusHeading={justBooked} />;
  }

  return (
    <div className="flex flex-col gap-5.5">
      <section className="flex flex-col gap-3" role="radiogroup" aria-labelledby="step-channel">
        <StepHeading step={1} id="step-channel">
          {t("stepChannel", { doctor: doctor.shortName })}
        </StepHeading>
        <div className="grid grid-cols-2 gap-2.5">
          {CONSULTATION_CHANNELS.map((option) => (
            <OptionTile
              key={option}
              selected={channel === option}
              onClick={() => setChannel(option)}
              className="min-h-26 gap-2 rounded-card text-lead"
            >
              <span className={channel === option ? "text-brand" : "text-muted"}>{CHANNEL_ICONS[option]}</span>
              <span className={channel === option ? "font-bold" : undefined}>{tLabels(`channel.${option}.label`)}</span>
            </OptionTile>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3" role="radiogroup" aria-labelledby="step-slot">
        <StepHeading step={2} id="step-slot">
          {t("stepSlot")}
        </StepHeading>
        <p className="text-small text-muted">{t("slotsIntro", { doctor: doctor.shortName })}</p>
        <div className="flex flex-col gap-2.5">
          {slots.map((slot) => (
            <OptionRow
              key={slot.id}
              label={slot.dateLabel}
              trailing={t("slotTime", { time: slot.time })}
              selected={slotId === slot.id}
              disabled={slot.taken}
              onClick={() => setSlotId(slot.id)}
              className="min-h-16 px-4 text-body"
            />
          ))}
        </div>
      </section>

      <InfoNote>{hint}</InfoNote>

      <ErrorNote message={error} />

      <Button onClick={submit} disabled={!complete || pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>
      {!complete && <p className="text-center text-small text-muted">{t("incomplete")}</p>}
    </div>
  );
}

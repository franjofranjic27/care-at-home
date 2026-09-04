"use client";

import { useEffect, useRef } from "react";
import { CalendarIcon, CheckIcon, ClockIcon, HospitalIcon, PhoneIcon } from "@/components/icons";
import { Card, IconCircle, LinkButton } from "@/components/ui";
import { CHANNEL_LABELS } from "@/lib/labels";
import type { ConsultationChannel, Doctor } from "@/server/domain";

export interface ConfirmedConsultation {
  readonly channel: ConsultationChannel;
  readonly dateLabel: string;
  readonly time: string;
}

export interface ConsultationConfirmationProps {
  readonly doctor: Doctor;
  readonly consultation: ConfirmedConsultation;
  /** Nach einem Ansichtswechsel den Fokus auf die Überschrift setzen (nicht beim ersten Laden der Seite). */
  readonly focusHeading?: boolean;
}

/** Bestätigungsansicht nach dem Vereinbaren einer Besprechung. */
export function ConsultationConfirmation({ doctor, consultation, focusHeading = false }: ConsultationConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ChannelIcon = consultation.channel === "phone" ? PhoneIcon : HospitalIcon;

  useEffect(() => {
    if (focusHeading) {
      headingRef.current?.focus();
    }
  }, [focusHeading]);

  return (
    <div className="flex grow flex-col gap-6">
      <div className="flex flex-col items-center gap-4.5 pt-6">
        <IconCircle tone="ok" size="xl">
          <CheckIcon size={56} />
        </IconCircle>
        <h2
          ref={headingRef}
          tabIndex={-1}
          aria-live="polite"
          className="text-center text-title font-bold outline-none"
        >
          Ihre Besprechung ist vereinbart
        </h2>
      </div>

      <Card tone="brand-tint" padding="lg" className="gap-3.5">
        <p className="text-card-title font-bold">Besprechung mit {doctor.name}</p>
        <p className="flex items-center gap-3 text-lead">
          <CalendarIcon className="shrink-0 text-brand" />
          <span>{consultation.dateLabel}</span>
        </p>
        <p className="flex items-center gap-3 text-lead">
          <ClockIcon className="shrink-0 text-brand" />
          <span>{consultation.time} Uhr</span>
        </p>
        <p className="flex items-center gap-3 text-lead">
          <ChannelIcon className="shrink-0 text-brand" />
          <span>{CHANNEL_LABELS[consultation.channel].confirmation}</span>
        </p>
      </Card>

      <p className="text-center text-muted">
        {consultation.channel === "phone"
          ? "Wir erinnern Sie am Tag davor per SMS und Anruf."
          : "Bitte kommen Sie 10 Minuten vorher. Wir erinnern Sie am Tag davor per SMS und Anruf."}
      </p>

      <div className="grow" />

      <LinkButton href="/">Zur Übersicht</LinkButton>
    </div>
  );
}

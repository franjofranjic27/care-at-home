import { CalendarIcon, CheckIcon } from "@/components/icons";
import { ReviewingCard } from "@/components/doctor/ReviewingCard";
import { ArrowLink, Card, IconCircle, LinkButton } from "@/components/ui";
import { formatInstantDayMonth, formatWeekdayDayMonth } from "@/lib/dates";
import { CHANNEL_LABELS } from "@/lib/labels";
import type { Doctor, DoctorMessage, TrafficLight } from "@/server/domain";
import type { ConsultationView } from "@/server/store";

export interface StatusCardProps {
  readonly trafficLight: TrafficLight;
  readonly doctor: Doctor;
  readonly latestMessage: DoctorMessage | null;
  readonly consultation: ConsultationView | null;
}

/** Ampel-Karte auf der Übersicht: grün, gelb oder blau (Arzt prüft gerade). */
export function StatusCard({ trafficLight, doctor, latestMessage, consultation }: StatusCardProps) {
  if (trafficLight === "blue") {
    return (
      <ReviewingCard doctor={doctor} headingLevel="h2">
        <ArrowLink href="/arzt">Mehr erfahren</ArrowLink>
      </ReviewingCard>
    );
  }

  if (trafficLight === "yellow") {
    return (
      <Card tone="warn">
        <div className="flex items-center gap-3.5">
          <IconCircle tone="warn">
            <CalendarIcon size={26} strokeWidth={2.2} />
          </IconCircle>
          <h2 className="text-card-title font-bold">Bitte zur Besprechung</h2>
        </div>
        <p>
          {doctor.name} möchte etwas mit Ihnen besprechen
          {latestMessage ? ` (Nachricht vom ${formatInstantDayMonth(latestMessage.dateISO)})` : ""}. Kein Grund
          zur Sorge.
        </p>
        {consultation ? (
          <p className="font-bold">
            Ihre Besprechung: {formatWeekdayDayMonth(consultation.slot.dateISO)}, {consultation.slot.time} Uhr ·{" "}
            {CHANNEL_LABELS[consultation.channel].label}
          </p>
        ) : (
          <LinkButton href="/arzt/besprechung" className="min-h-15 text-tile">
            Termin auswählen
          </LinkButton>
        )}
        <ArrowLink href="/arzt">Nachricht lesen</ArrowLink>
      </Card>
    );
  }

  return (
    <Card tone="ok">
      <div className="flex items-center gap-3.5">
        <IconCircle tone="ok">
          <CheckIcon size={28} />
        </IconCircle>
        <h2 className="text-card-title font-bold">Ihre Werte sehen gut aus</h2>
      </div>
      <p>
        {doctor.name} hat Ihre Werte
        {latestMessage ? ` am ${formatInstantDayMonth(latestMessage.dateISO)}` : ""} geprüft. Sie müssen nicht ins
        Spital.
      </p>
      <ArrowLink href="/arzt">Nachricht lesen</ArrowLink>
    </Card>
  );
}

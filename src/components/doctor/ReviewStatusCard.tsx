import { Card } from "@/components/ui";
import { formatInstantDayMonth, formatInstantTime, isToday, type IsoInstant } from "@/lib/dates";
import type { Doctor, DoctorStatus } from "@/server/domain";
import { ReviewingCard } from "./ReviewingCard";

export interface ReviewStatusCardProps {
  readonly doctor: Doctor;
  readonly status: DoctorStatus;
  readonly vitalsSentAt: IsoInstant;
  readonly now: Date;
}

/** Abschnitt «Gerade jetzt»: prüft der Arzt gerade, oder wann war die letzte Prüfung? */
export function ReviewStatusCard({ doctor, status, vitalsSentAt, now }: ReviewStatusCardProps) {
  const sentAt = <p className="text-small text-muted">Werte gesendet um {formatInstantTime(vitalsSentAt)} Uhr</p>;

  if (status.state === "reviewing") {
    return (
      <ReviewingCard doctor={doctor} headingLevel="p">
        {sentAt}
      </ReviewingCard>
    );
  }

  const lastCheck = isToday(status.sinceISO, now)
    ? `heute um ${formatInstantTime(status.sinceISO)} Uhr`
    : `am ${formatInstantDayMonth(status.sinceISO)} um ${formatInstantTime(status.sinceISO)} Uhr`;

  return (
    <Card>
      <p className="text-cta font-bold">Keine Prüfung offen</p>
      <p>
        {doctor.shortName} hat Ihre Werte zuletzt {lastCheck} geprüft.
      </p>
      {sentAt}
    </Card>
  );
}

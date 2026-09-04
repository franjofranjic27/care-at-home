import { CalendarIcon, CheckIcon } from "@/components/icons";
import { Card, IconCircle, LinkButton } from "@/components/ui";
import { formatInstantDayMonth, formatWeekdayDayMonth } from "@/lib/dates";
import { CHANNEL_LABELS } from "@/lib/labels";
import type { DoctorMessage } from "@/server/domain";
import type { ConsultationView } from "@/server/store";

export interface DoctorMessageCardProps {
  readonly message: DoctorMessage;
  /** Bereits vereinbarte Besprechung – ersetzt den Knopf «Termin auswählen». */
  readonly consultation: ConsultationView | null;
}

export function DoctorMessageCard({ message, consultation }: DoctorMessageCardProps) {
  const isConsultation = message.kind === "consultation";
  return (
    <Card tone={isConsultation ? "warn" : "ok"} className={isConsultation ? "gap-3.5" : "gap-3"} role="article">
      <div className="flex items-center justify-between gap-3">
        <IconCircle tone={isConsultation ? "warn" : "ok"} size="sm">
          {isConsultation ? <CalendarIcon size={22} strokeWidth={2.2} /> : <CheckIcon />}
        </IconCircle>
        <time dateTime={message.dateISO} className="text-small text-muted">
          {formatInstantDayMonth(message.dateISO)}
        </time>
      </div>
      <p className="text-cta font-bold">{message.title}</p>
      <p>{message.body}</p>
      {isConsultation &&
        (consultation ? (
          <p className="font-bold">
            Vereinbart: {formatWeekdayDayMonth(consultation.slot.dateISO)}, {consultation.slot.time} Uhr ·{" "}
            {CHANNEL_LABELS[consultation.channel].label}
          </p>
        ) : (
          <LinkButton href="/arzt/besprechung" className="min-h-15 text-tile">
            Termin auswählen
          </LinkButton>
        ))}
    </Card>
  );
}

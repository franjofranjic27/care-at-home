import { CalendarIcon, UserIcon } from "@/components/icons";
import { ArrowLink, Card, SectionLabel } from "@/components/ui";
import { formatWeekdayDayMonth, type IsoDate } from "@/lib/dates";
import { APPOINTMENT_SLOT_LABELS, APPOINTMENT_TYPE_LABELS } from "@/lib/labels";
import type { Appointment, CareTeam } from "@/server/domain";

export interface NextAppointmentCardProps {
  readonly appointment: Appointment | null;
  readonly careTeam: CareTeam;
  readonly today: IsoDate;
}

export function NextAppointmentCard({ appointment, careTeam, today }: NextAppointmentCardProps) {
  if (!appointment) {
    return (
      <Card tone="brand-tint" className="gap-2.5">
        <SectionLabel tone="brand">Nächster Termin</SectionLabel>
        <p className="text-cta font-bold">Kein Termin geplant</p>
        <p>Buchen Sie unten einen Termin. {careTeam.organisation} kommt zu Ihnen nach Hause.</p>
      </Card>
    );
  }

  const isToday = appointment.date === today;
  const dayLabel = isToday ? "Heute" : formatWeekdayDayMonth(appointment.date);

  return (
    <Card tone="brand-tint" className="gap-2.5">
      <SectionLabel tone="brand">{isToday ? "Heute" : "Nächster Termin"}</SectionLabel>
      <p className="text-cta font-bold">
        {isToday
          ? `Ihre ${APPOINTMENT_TYPE_LABELS[appointment.type].title} ist heute`
          : APPOINTMENT_TYPE_LABELS[appointment.type].longTitle}
      </p>
      <p className="flex items-center gap-2.5">
        <CalendarIcon size={22} className="shrink-0 text-brand" />
        <span>
          {dayLabel}, {APPOINTMENT_SLOT_LABELS[appointment.slot].time}
        </span>
      </p>
      <p className="flex items-center gap-2.5">
        <UserIcon size={22} className="shrink-0 text-brand" />
        <span>
          {careTeam.organisation} · {careTeam.contactPerson} kommt zu Ihnen
        </span>
      </p>
      <ArrowLink href={`/termin/bestaetigt?id=${encodeURIComponent(appointment.id)}`}>
        Termin ansehen oder absagen
      </ArrowLink>
    </Card>
  );
}

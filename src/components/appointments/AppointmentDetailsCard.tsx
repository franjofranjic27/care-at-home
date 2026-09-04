import { CalendarIcon, ClockIcon, HomeIcon } from "@/components/icons";
import { Card } from "@/components/ui";
import { formatWeekdayDayMonth } from "@/lib/dates";
import { APPOINTMENT_SLOT_LABELS, APPOINTMENT_TYPE_LABELS } from "@/lib/labels";
import type { Appointment, CareTeam } from "@/server/domain";

export interface AppointmentDetailsCardProps {
  readonly appointment: Appointment;
  readonly careTeam: CareTeam;
}

export function AppointmentDetailsCard({ appointment, careTeam }: AppointmentDetailsCardProps) {
  return (
    <Card tone="brand-tint" padding="lg" className="gap-3.5">
      <p className="text-card-title font-bold">{APPOINTMENT_TYPE_LABELS[appointment.type].longTitle}</p>
      <p className="flex items-center gap-3 text-lead">
        <CalendarIcon className="shrink-0 text-brand" />
        <span>{formatWeekdayDayMonth(appointment.date)}</span>
      </p>
      <p className="flex items-center gap-3 text-lead">
        <ClockIcon className="shrink-0 text-brand" />
        <span>{APPOINTMENT_SLOT_LABELS[appointment.slot].time}</span>
      </p>
      <p className="flex items-center gap-3 text-lead">
        <HomeIcon className="shrink-0 text-brand" />
        <span>Bei Ihnen zuhause, {careTeam.organisation}</span>
      </p>
    </Card>
  );
}

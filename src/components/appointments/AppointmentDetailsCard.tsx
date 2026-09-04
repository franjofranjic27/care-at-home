import { getLocale, getTranslations } from "next-intl/server";
import { CalendarIcon, ClockIcon, HomeIcon } from "@/components/icons";
import { Card } from "@/components/ui";
import { formatWeekdayDayMonth } from "@/lib/dates";
import type { Appointment, CareTeam } from "@/server/domain";

export interface AppointmentDetailsCardProps {
  readonly appointment: Appointment;
  readonly careTeam: CareTeam;
}

export async function AppointmentDetailsCard({ appointment, careTeam }: AppointmentDetailsCardProps) {
  const [locale, t, tLabels] = await Promise.all([
    getLocale(),
    getTranslations("appointment.confirmed"),
    getTranslations("labels"),
  ]);

  return (
    <Card tone="brand-tint" padding="lg" className="gap-3.5">
      <p className="text-card-title font-bold">{tLabels(`appointmentType.${appointment.type}.longTitle`)}</p>
      <p className="flex items-center gap-3 text-lead">
        <CalendarIcon className="shrink-0 text-brand" />
        <span>{formatWeekdayDayMonth(appointment.date, locale)}</span>
      </p>
      <p className="flex items-center gap-3 text-lead">
        <ClockIcon className="shrink-0 text-brand" />
        <span>{tLabels(`appointmentSlot.${appointment.slot}.time`)}</span>
      </p>
      <p className="flex items-center gap-3 text-lead">
        <HomeIcon className="shrink-0 text-brand" />
        <span>{t("location", { organisation: careTeam.organisation })}</span>
      </p>
    </Card>
  );
}

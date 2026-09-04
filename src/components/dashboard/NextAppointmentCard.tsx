import { getLocale, getTranslations } from "next-intl/server";
import { CalendarIcon, UserIcon } from "@/components/icons";
import { ArrowLink, Card, SectionLabel } from "@/components/ui";
import { formatWeekdayDayMonth, type IsoDate } from "@/lib/dates";
import type { Appointment, CareTeam } from "@/server/domain";

export interface NextAppointmentCardProps {
  readonly appointment: Appointment | null;
  readonly careTeam: CareTeam;
  readonly today: IsoDate;
}

export async function NextAppointmentCard({ appointment, careTeam, today }: NextAppointmentCardProps) {
  const [locale, t, tLabels] = await Promise.all([
    getLocale(),
    getTranslations("dashboard.nextAppointment"),
    getTranslations("labels"),
  ]);

  if (!appointment) {
    return (
      <Card tone="brand-tint" className="gap-2.5">
        <SectionLabel tone="brand">{t("label")}</SectionLabel>
        <p className="text-cta font-bold">{t("none")}</p>
        <p>{t("noneHint", { organisation: careTeam.organisation })}</p>
      </Card>
    );
  }

  const isToday = appointment.date === today;
  const dayLabel = isToday ? t("today") : formatWeekdayDayMonth(appointment.date, locale);

  return (
    <Card tone="brand-tint" className="gap-2.5">
      <SectionLabel tone="brand">{isToday ? t("today") : t("label")}</SectionLabel>
      <p className="text-cta font-bold">
        {isToday
          ? t("todayTitle", { type: tLabels(`appointmentType.${appointment.type}.title`) })
          : tLabels(`appointmentType.${appointment.type}.longTitle`)}
      </p>
      <p className="flex items-center gap-2.5">
        <CalendarIcon size={22} className="shrink-0 text-brand" />
        <span>
          {dayLabel}, {tLabels(`appointmentSlot.${appointment.slot}.time`)}
        </span>
      </p>
      <p className="flex items-center gap-2.5">
        <UserIcon size={22} className="shrink-0 text-brand" />
        <span>{t("who", { organisation: careTeam.organisation, contactPerson: careTeam.contactPerson })}</span>
      </p>
      <ArrowLink href={`/termin/bestaetigt?id=${encodeURIComponent(appointment.id)}`}>{t("manage")}</ArrowLink>
    </Card>
  );
}

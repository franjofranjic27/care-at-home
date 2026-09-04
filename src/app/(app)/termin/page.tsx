import { getLocale, getTranslations } from "next-intl/server";
import { AppointmentBooking, type DayOption } from "@/components/appointments/AppointmentBooking";
import { Screen } from "@/components/layout/Screen";
import { BackLink } from "@/components/ui";
import { formatDayMonth, formatWeekday, nextBusinessDays, todayIso } from "@/lib/dates";
import { BOOKABLE_DAYS } from "@/server/seed";

// Die Tagesauswahl hängt vom aktuellen Datum ab und darf nicht zur Build-Zeit eingefroren werden.
export const dynamic = "force-dynamic";

export default async function AppointmentPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations()]);
  const days: DayOption[] = nextBusinessDays(todayIso(new Date()), BOOKABLE_DAYS).map((iso) => ({
    iso,
    weekday: formatWeekday(iso, locale),
    dayMonth: formatDayMonth(iso, locale),
  }));

  return (
    <Screen>
      <BackLink href="/" label={t("common.back")} />
      <h1>{t("appointment.title")}</h1>
      <AppointmentBooking days={days} />
    </Screen>
  );
}

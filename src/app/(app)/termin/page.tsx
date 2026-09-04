import { AppointmentBooking, type DayOption } from "@/components/appointments/AppointmentBooking";
import { Screen } from "@/components/layout/Screen";
import { BackLink } from "@/components/ui";
import { formatDayMonth, formatWeekday, nextBusinessDays, todayIso } from "@/lib/dates";
import { BOOKABLE_DAYS } from "@/server/seed";

// Die Tagesauswahl hängt vom aktuellen Datum ab und darf nicht zur Build-Zeit eingefroren werden.
export const dynamic = "force-dynamic";

export default function AppointmentPage() {
  const days: DayOption[] = nextBusinessDays(todayIso(new Date()), BOOKABLE_DAYS).map((iso) => ({
    iso,
    weekday: formatWeekday(iso),
    dayMonth: formatDayMonth(iso),
  }));

  return (
    <Screen>
      <BackLink href="/" />
      <h1>Termin buchen</h1>
      <AppointmentBooking days={days} />
    </Screen>
  );
}

export type DayPeriod = "morning" | "afternoon" | "evening";

/** Tageszeit für die Begrüssung (Stunde 0–23); der Text kommt aus den Messages. */
export function dayPeriodForHour(hour: number): DayPeriod {
  if (hour < 11) {
    return "morning";
  }
  if (hour < 18) {
    return "afternoon";
  }
  return "evening";
}

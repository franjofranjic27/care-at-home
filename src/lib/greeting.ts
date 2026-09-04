/** Begrüssung nach Tageszeit (Stunde 0–23). */
export function greetingForHour(hour: number): string {
  if (hour < 11) {
    return "Guten Morgen";
  }
  if (hour < 18) {
    return "Guten Tag";
  }
  return "Guten Abend";
}

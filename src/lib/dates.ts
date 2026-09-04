/**
 * Datums-Hilfsfunktionen für die Schweiz (Zeitzone Europe/Zurich).
 *
 * Kalendertage werden als `IsoDate` ("YYYY-MM-DD") geführt und intern als
 * UTC-Mitternacht gerechnet, damit Zeitzonen und Sommerzeit keine Rolle spielen.
 * Zeitpunkte (`IsoInstant`) sind echte Zeitstempel und werden für die Anzeige
 * in die Schweizer Zeitzone umgerechnet.
 *
 * Berechnungen sind sprachunabhängig; die Formatierung nimmt die App-Sprache
 * entgegen und formatiert regional (`de` → de-CH, `en` → en-GB).
 */
import { intlLocale, TIME_ZONE, type Locale } from "@/i18n/config";

/** Kalendertag im Format "YYYY-MM-DD". */
export type IsoDate = string;
/** Vollständiger ISO-8601-Zeitstempel. */
export type IsoInstant = string;

/** 0 = Sonntag … 6 = Samstag (wie `Date#getDay`). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const MONDAY: Weekday = 1;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

function toUtcDate(iso: IsoDate): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function fromUtcDate(date: Date): IsoDate {
  return date.toISOString().slice(0, 10);
}

export function isIsoDate(value: unknown): value is IsoDate {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  const date = toUtcDate(value);
  return !Number.isNaN(date.getTime()) && fromUtcDate(date) === value;
}

function zurichParts(instant: Date): Record<string, number> {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const result: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = Number(part.value);
    }
  }
  return result;
}

/** Heutiger Kalendertag in der Schweiz. */
export function todayIso(now: Date): IsoDate {
  const p = zurichParts(now);
  return fromUtcDate(new Date(Date.UTC(p.year, p.month - 1, p.day)));
}

/** Stunde (0–23) in der Schweiz, z. B. für die Begrüssung. */
export function hourInZurich(now: Date): number {
  return zurichParts(now).hour;
}

/** Zeitpunkt für einen Kalendertag und eine Uhrzeit ("HH:MM") in der Schweiz. */
export function instantAt(iso: IsoDate, time: string): IsoInstant {
  if (!TIME_PATTERN.test(time)) {
    throw new Error(`Ungültige Uhrzeit: ${time}`);
  }
  const [hour, minute] = time.split(":").map(Number);
  const [year, month, day] = iso.split("-").map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const shown = zurichParts(new Date(guess));
  const shownAsUtc = Date.UTC(
    shown.year,
    shown.month - 1,
    shown.day,
    shown.hour,
    shown.minute,
    shown.second,
  );
  const offsetMs = shownAsUtc - guess;
  return new Date(guess - offsetMs).toISOString();
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = toUtcDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtcDate(date);
}

export function weekdayOf(iso: IsoDate): Weekday {
  return toUtcDate(iso).getUTCDay() as Weekday;
}

/** Nächster gewünschter Wochentag, der strikt nach `after` liegt. */
export function nextWeekday(after: IsoDate, weekday: Weekday): IsoDate {
  const diff = (weekday - weekdayOf(after) + 7) % 7 || 7;
  return addDays(after, diff);
}

/** Die nächsten `count` Werktage (Mo–Fr), strikt nach `after`. */
export function nextBusinessDays(after: IsoDate, count: number): IsoDate[] {
  const result: IsoDate[] = [];
  let cursor = after;
  while (result.length < count) {
    cursor = addDays(cursor, 1);
    const weekday = weekdayOf(cursor);
    if (weekday !== 0 && weekday !== 6) {
      result.push(cursor);
    }
  }
  return result;
}

function formatCalendar(iso: IsoDate, locale: Locale, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone: "UTC", ...options }).format(
    toUtcDate(iso),
  );
}

function formatInstant(instant: IsoInstant, locale: Locale, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone: TIME_ZONE, ...options }).format(
    new Date(instant),
  );
}

/** "Freitag, 4. September 2026" / "Friday, 4 September 2026" */
export function formatFullDate(iso: IsoDate, locale: Locale): string {
  return formatCalendar(iso, locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "Montag, 7. September" / "Monday, 7 September" */
export function formatWeekdayDayMonth(iso: IsoDate, locale: Locale): string {
  return formatCalendar(iso, locale, { weekday: "long", day: "numeric", month: "long" });
}

/** "Montag" / "Monday" */
export function formatWeekday(iso: IsoDate, locale: Locale): string {
  return formatCalendar(iso, locale, { weekday: "long" });
}

/** "7. September" / "7 September" */
export function formatDayMonth(iso: IsoDate, locale: Locale): string {
  return formatCalendar(iso, locale, { day: "numeric", month: "long" });
}

/** "2. September" / "2 September" (Zeitpunkt, in Schweizer Zeit) */
export function formatInstantDayMonth(instant: IsoInstant, locale: Locale): string {
  return formatInstant(instant, locale, { day: "numeric", month: "long" });
}

/** "08:05" (Zeitpunkt, in Schweizer Zeit, 24-Stunden-Format in beiden Sprachen) */
export function formatInstantTime(instant: IsoInstant, locale: Locale): string {
  return formatInstant(instant, locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

export function isToday(instant: IsoInstant, now: Date): boolean {
  return todayIso(new Date(instant)) === todayIso(now);
}

/**
 * Statische Seed-Daten der Demo. Alle Daten sind reine Funktionen von
 * «heute», damit Termine und Nachrichten immer in der Zukunft bzw. jüngeren
 * Vergangenheit liegen. Die Daten sind sprachunabhängig: Texte werden in den
 * Komponenten aus `kind`/`id` übersetzt.
 */
import { addDays, instantAt, MONDAY, nextWeekday, weekdayOf, type IsoDate } from "@/lib/dates";
import type {
  Appointment,
  ConsultationSlot,
  Doctor,
  Medication,
  MessageKind,
  Patient,
  Vital,
} from "./domain";

export const DEMO_PIN = "1234";

export const SEED_APPOINTMENT_ID = "apt-seed-blood-draw";
export const SEED_GOOD_MESSAGE_ID = "msg-seed-good";
export const SEED_CONSULTATION_MESSAGE_ID = "msg-seed-consultation";

/** Uhrzeit, zu der die Werte «heute Morgen» gesendet wurden. */
export const VITALS_TIME = "08:05";

/** Anzahl Werktage, die zum Buchen angeboten werden (ab morgen). */
export const BOOKABLE_DAYS = 4;

export function getPatient(): Patient {
  return {
    id: "pat-rosa-meier",
    firstName: "Rosa",
    lastName: "Meier",
    initials: "RM",
    careTeam: {
      organisation: "Spitex Wil",
      contactPerson: "M. Huber",
      phone: "+41710000000",
    },
  };
}

export function getDoctor(): Doctor {
  return {
    id: "doc-anna-keller",
    name: "Dr. med. Anna Keller",
    shortName: "Dr. Keller",
    initials: "AK",
    specialty: "cardiology",
    hospital: "Kantonsspital St. Gallen",
  };
}

/** Bestehender Termin: Blutentnahme am nächsten Montag (heute eingeschlossen), 08–10 Uhr. */
export function getSeedAppointment(today: IsoDate): Appointment {
  return {
    id: SEED_APPOINTMENT_ID,
    type: "blood_draw",
    date: weekdayOf(today) === MONDAY ? today : nextWeekday(today, MONDAY),
    slot: "morning",
  };
}

export interface SeedMessage {
  readonly id: string;
  readonly kind: MessageKind;
  readonly dateISO: string;
  readonly read: boolean;
}

/** Nachrichten ohne Text – der Text wird in der Komponente aus `kind` übersetzt. */
export function getSeedMessages(today: IsoDate): readonly SeedMessage[] {
  return [
    {
      id: SEED_GOOD_MESSAGE_ID,
      kind: "good",
      dateISO: instantAt(addDays(today, -2), "08:40"),
      read: false,
    },
    {
      id: SEED_CONSULTATION_MESSAGE_ID,
      kind: "consultation",
      dateISO: instantAt(addDays(today, -15), "09:20"),
      read: true,
    },
  ];
}

export function getVitals(): readonly Vital[] {
  return [
    { id: "blood_pressure", values: [128, 78], status: "good" },
    { id: "pulse", values: [72], status: "good" },
    { id: "weight", values: [68.2], unit: "kg", status: "stable" },
    { id: "inr", values: [2.4], status: "in_range" },
  ];
}

export function getMedications(): readonly Medication[] {
  return [
    { id: "marcoumar", name: "Marcoumar", dose: "3 mg", timeOfDay: "morning", taken: true },
    { id: "torasemid", name: "Torasemid", dose: "10 mg", timeOfDay: "evening", taken: false },
  ];
}

/**
 * Drei Besprechungs-Slots: nächste Woche Donnerstag und Freitag sowie der
 * darauffolgende Montag.
 */
export function getSeedConsultationSlots(today: IsoDate): readonly Omit<ConsultationSlot, "taken">[] {
  const nextMonday = nextWeekday(today, MONDAY);
  return [
    { id: "slot-thu-1400", dateISO: addDays(nextMonday, 3), time: "14:00" },
    { id: "slot-fri-0930", dateISO: addDays(nextMonday, 4), time: "09:30" },
    { id: "slot-mon-1100", dateISO: addDays(nextMonday, 7), time: "11:00" },
  ];
}

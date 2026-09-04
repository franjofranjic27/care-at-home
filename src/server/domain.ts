import type { IsoDate, IsoInstant } from "@/lib/dates";

export const APPOINTMENT_TYPES = ["blood_draw", "home_checkup"] as const;
export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const APPOINTMENT_SLOTS = ["morning", "late_morning", "afternoon"] as const;
export type AppointmentSlot = (typeof APPOINTMENT_SLOTS)[number];

export interface CareTeam {
  readonly organisation: string;
  readonly contactPerson: string;
  readonly phone: string;
}

export interface Patient {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly initials: string;
  readonly careTeam: CareTeam;
}

export interface Appointment {
  readonly id: string;
  readonly type: AppointmentType;
  readonly date: IsoDate;
  readonly slot: AppointmentSlot;
}

/** Fachgebiet als Schlüssel; die Bezeichnung kommt aus den Messages (`labels.specialty`). */
export type DoctorSpecialty = "cardiology";

export interface Doctor {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly initials: string;
  readonly specialty: DoctorSpecialty;
  readonly hospital: string;
}

export type DoctorActivity = "reviewing" | "idle";

export interface DoctorStatus {
  readonly state: DoctorActivity;
  readonly sinceISO: IsoInstant;
}

export const MESSAGE_KINDS = ["good", "consultation"] as const;
export type MessageKind = (typeof MESSAGE_KINDS)[number];

/** Kontext, den die Komponenten in den Nachrichtentext einsetzen (`{date}`). */
export interface MessageContext {
  readonly nextBloodDrawDate: IsoDate | null;
}

/**
 * Nachricht der Ärztin. Der Text ist nicht Teil der Daten: Er wird in der
 * Sprache der Anfrage aus `kind` und `context` übersetzt.
 */
export interface DoctorMessage {
  readonly id: string;
  readonly kind: MessageKind;
  readonly dateISO: IsoInstant;
  readonly read: boolean;
  readonly context: MessageContext;
}

export interface ConsultationSlot {
  readonly id: string;
  readonly dateISO: IsoDate;
  /** Uhrzeit "HH:MM". */
  readonly time: string;
  readonly taken: boolean;
}

export const CONSULTATION_CHANNELS = ["phone", "onsite"] as const;
export type ConsultationChannel = (typeof CONSULTATION_CHANNELS)[number];

/** Vereinbarte Besprechung. Datum und Uhrzeit werden beim Buchen aufgelöst und gespeichert. */
export interface Consultation {
  readonly slotId: string;
  readonly dateISO: IsoDate;
  /** Uhrzeit "HH:MM". */
  readonly time: string;
  readonly channel: ConsultationChannel;
}

export type VitalStatus = "good" | "stable" | "in_range";

export const VITAL_IDS = ["blood_pressure", "pulse", "weight", "inr"] as const;
export type VitalId = (typeof VITAL_IDS)[number];

/**
 * Messwert. Die Bezeichnung kommt aus den Messages (`labels.vital.<id>`);
 * mehrere Zahlen (Blutdruck) werden in der Anzeige mit «/» verbunden.
 */
export interface Vital {
  readonly id: VitalId;
  readonly values: readonly number[];
  readonly unit?: string;
  readonly status: VitalStatus;
}

export type TimeOfDay = "morning" | "evening";

export interface Medication {
  readonly id: string;
  readonly name: string;
  readonly dose: string;
  readonly timeOfDay: TimeOfDay;
  readonly taken: boolean;
}

/** Ampel auf der Übersicht. */
export type TrafficLight = "green" | "yellow" | "blue";

export const SCENARIOS = ["reviewing", "good", "consultation"] as const;
export type Scenario = (typeof SCENARIOS)[number];

/** Prüft, ob `value` einer der erlaubten Werte ist. */
export function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

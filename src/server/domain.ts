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

export interface Doctor {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly initials: string;
  readonly specialty: string;
  readonly hospital: string;
}

export type DoctorActivity = "reviewing" | "idle";

export interface DoctorStatus {
  readonly state: DoctorActivity;
  readonly sinceISO: IsoInstant;
}

export const MESSAGE_KINDS = ["good", "consultation"] as const;
export type MessageKind = (typeof MESSAGE_KINDS)[number];

export interface DoctorMessage {
  readonly id: string;
  readonly kind: MessageKind;
  readonly dateISO: IsoInstant;
  readonly title: string;
  readonly body: string;
  readonly read: boolean;
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

export interface Vital {
  readonly id: string;
  readonly name: string;
  readonly value: string;
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

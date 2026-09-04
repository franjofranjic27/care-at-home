/**
 * Setzt Seed-Daten und Cookie-Zustand zu Ansichtsdaten zusammen (Queries) und
 * enthält die Reducer für alle Mutationen. Keine Modul-Variablen mit Zustand.
 */
import { randomUUID } from "node:crypto";
import { instantAt, nextBusinessDays, todayIso, type IsoDate, type IsoInstant } from "@/lib/dates";
import {
  APPOINTMENT_SLOTS,
  type Appointment,
  type AppointmentSlot,
  type AppointmentType,
  type ConsultationChannel,
  type ConsultationSlot,
  type Doctor,
  type DoctorMessage,
  type DoctorStatus,
  type Medication,
  type Patient,
  type Scenario,
  type TrafficLight,
  type Vital,
} from "./domain";
import { NotFoundError, ValidationError } from "./errors";
import {
  BOOKABLE_DAYS,
  getDoctor,
  getMedications,
  getPatient,
  getSeedAppointment,
  getSeedConsultationSlots,
  getSeedMessages,
  getVitals,
  messageText,
  VITALS_TIME,
} from "./seed";
import type { DemoState } from "./state";

export interface ConsultationView {
  readonly slot: ConsultationSlot;
  readonly channel: ConsultationChannel;
}

export interface DashboardView {
  readonly patient: Patient;
  readonly doctor: Doctor;
  readonly trafficLight: TrafficLight;
  readonly doctorStatus: DoctorStatus;
  readonly latestMessage: DoctorMessage | null;
  readonly nextAppointment: Appointment | null;
  readonly consultation: ConsultationView | null;
}

export interface DoctorView {
  readonly doctor: Doctor;
  readonly status: DoctorStatus;
  readonly messages: readonly DoctorMessage[];
  readonly consultation: ConsultationView | null;
  readonly vitalsSentAt: IsoInstant;
}

export interface HealthView {
  readonly vitals: readonly Vital[];
  readonly measuredAt: IsoInstant;
  readonly medications: readonly Medication[];
  readonly patient: Patient;
}

export interface ConsultationSlotsView {
  readonly doctor: Doctor;
  readonly slots: readonly ConsultationSlot[];
  readonly consultation: ConsultationView | null;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function getAppointments(state: DemoState, now: Date): readonly Appointment[] {
  const today = todayIso(now);
  return [getSeedAppointment(today), ...state.appointments]
    .filter((a) => !state.cancelledIds.includes(a.id))
    .filter((a) => a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || slotIndex(a.slot) - slotIndex(b.slot));
}

export function getAppointment(state: DemoState, id: string, now: Date): Appointment | null {
  return getAppointments(state, now).find((a) => a.id === id) ?? null;
}

export function getNextAppointment(state: DemoState, now: Date): Appointment | null {
  return getAppointments(state, now)[0] ?? null;
}

export function getDoctorStatus(state: DemoState, now: Date): DoctorStatus {
  if (state.scenario === "reviewing" && state.scenarioSinceISO) {
    return { state: "reviewing", sinceISO: state.scenarioSinceISO };
  }
  const latest = getMessages(state, now)[0];
  return { state: "idle", sinceISO: latest?.dateISO ?? instantAt(todayIso(now), VITALS_TIME) };
}

export function getMessages(state: DemoState, now: Date): readonly DoctorMessage[] {
  const today = todayIso(now);
  const nextBloodDraw =
    getAppointments(state, now).find((a) => a.type === "blood_draw")?.date ?? null;
  const context = { nextBloodDrawDate: nextBloodDraw };

  const seeded = getSeedMessages(today).map((m) => ({
    ...m,
    read: m.read || state.readMessageIds.includes(m.id),
  }));
  const extra = state.extraMessages.map((m) => ({
    ...m,
    read: state.readMessageIds.includes(m.id),
  }));

  return [...extra, ...seeded]
    .map((m) => ({ ...m, ...messageText(m.kind, context) }))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

/** Die vereinbarte Besprechung kommt vollständig aus dem gespeicherten Zustand und wandert nicht mit «heute». */
export function getConsultation(state: DemoState): ConsultationView | null {
  if (!state.consultation) {
    return null;
  }
  const { slotId, dateISO, time, channel } = state.consultation;
  return { slot: { id: slotId, dateISO, time, taken: true }, channel };
}

export function getConsultationSlots(state: DemoState, now: Date): readonly ConsultationSlot[] {
  return getSeedConsultationSlots(todayIso(now)).map((slot) => ({
    ...slot,
    taken: state.consultation?.slotId === slot.id,
  }));
}

export function getConsultationSlotsView(state: DemoState, now: Date): ConsultationSlotsView {
  return {
    doctor: getDoctor(),
    slots: getConsultationSlots(state, now),
    consultation: getConsultation(state),
  };
}

function trafficLightFor(status: DoctorStatus, latest: DoctorMessage | null): TrafficLight {
  if (status.state === "reviewing") {
    return "blue";
  }
  return latest?.kind === "consultation" ? "yellow" : "green";
}

export function getDashboard(state: DemoState, now: Date): DashboardView {
  const messages = getMessages(state, now);
  const latestMessage = messages[0] ?? null;
  const doctorStatus = getDoctorStatus(state, now);
  return {
    patient: getPatient(),
    doctor: getDoctor(),
    trafficLight: trafficLightFor(doctorStatus, latestMessage),
    doctorStatus,
    latestMessage,
    nextAppointment: getNextAppointment(state, now),
    consultation: getConsultation(state),
  };
}

export function getDoctorView(state: DemoState, now: Date): DoctorView {
  return {
    doctor: getDoctor(),
    status: getDoctorStatus(state, now),
    messages: getMessages(state, now),
    consultation: getConsultation(state),
    vitalsSentAt: instantAt(todayIso(now), VITALS_TIME),
  };
}

export function getHealth(state: DemoState, now: Date): HealthView {
  return {
    patient: getPatient(),
    vitals: getVitals(),
    measuredAt: instantAt(todayIso(now), VITALS_TIME),
    medications: getMedications().map((m) => ({
      ...m,
      taken: state.medicationTaken[m.id] ?? m.taken,
    })),
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export interface BookAppointmentInput {
  readonly type: AppointmentType;
  readonly date: IsoDate;
  readonly slot: AppointmentSlot;
}

export interface BookAppointmentResult {
  readonly state: DemoState;
  readonly appointment: Appointment;
}

export function bookAppointment(
  state: DemoState,
  input: BookAppointmentInput,
  now: Date,
): BookAppointmentResult {
  if (!nextBusinessDays(todayIso(now), BOOKABLE_DAYS).includes(input.date)) {
    throw new ValidationError("Bitte wählen Sie einen der angebotenen Tage.");
  }
  const planned = getAppointments(state, now);
  if (planned.some((a) => a.type === input.type && a.date === input.date && a.slot === input.slot)) {
    throw new ValidationError("Diesen Termin haben Sie bereits gebucht.");
  }
  if (planned.length >= MAX_PLANNED_APPOINTMENTS) {
    throw new ValidationError(
      `Sie haben bereits ${MAX_PLANNED_APPOINTMENTS} Termine geplant. Bitte sagen Sie zuerst einen ab.`,
    );
  }
  const appointment: Appointment = { id: newId("apt"), ...input };
  return {
    state: { ...state, appointments: [...state.appointments, appointment] },
    appointment,
  };
}

/*
 * Selbst gebuchte Termine werden aus dem Zustand entfernt; nur der Seed-Termin
 * braucht einen Eintrag in `cancelledIds`, damit die Liste nicht wächst.
 */
export function cancelAppointment(state: DemoState, id: string, now: Date): DemoState {
  if (!getAppointment(state, id, now)) {
    throw new NotFoundError("Dieser Termin wurde nicht gefunden.");
  }
  if (state.appointments.some((a) => a.id === id)) {
    return { ...state, appointments: state.appointments.filter((a) => a.id !== id) };
  }
  return { ...state, cancelledIds: [...state.cancelledIds, id] };
}

export function markMessageRead(state: DemoState, id: string, now: Date): DemoState {
  if (!getMessages(state, now).some((m) => m.id === id)) {
    throw new NotFoundError("Diese Nachricht wurde nicht gefunden.");
  }
  if (state.readMessageIds.includes(id)) {
    return state;
  }
  return { ...state, readMessageIds: [...state.readMessageIds, id] };
}

export interface ConsultationInput {
  readonly slotId: string;
  readonly channel: ConsultationChannel;
}

export function bookConsultation(state: DemoState, input: ConsultationInput, now: Date): DemoState {
  if (state.consultation) {
    throw new ValidationError("Sie haben bereits eine Besprechung vereinbart.");
  }
  const slot = getConsultationSlots(state, now).find((s) => s.id === input.slotId);
  if (!slot) {
    throw new NotFoundError("Diese Zeit ist nicht mehr verfügbar.");
  }
  return {
    ...state,
    consultation: { slotId: slot.id, dateISO: slot.dateISO, time: slot.time, channel: input.channel },
  };
}

export function setMedicationTaken(state: DemoState, id: string, taken: boolean): DemoState {
  if (!getMedications().some((m) => m.id === id)) {
    throw new NotFoundError("Dieses Medikament wurde nicht gefunden.");
  }
  return { ...state, medicationTaken: { ...state.medicationTaken, [id]: taken } };
}

export function applyScenario(state: DemoState, scenario: Scenario, now: Date): DemoState {
  const sinceISO = now.toISOString();
  if (scenario === "reviewing") {
    return { ...state, scenario, scenarioSinceISO: sinceISO };
  }
  return {
    ...state,
    scenario,
    scenarioSinceISO: sinceISO,
    extraMessages: [{ id: newId("msg"), kind: scenario, dateISO: sinceISO }, ...state.extraMessages].slice(
      0,
      MAX_EXTRA_MESSAGES,
    ),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Obergrenzen, damit das State-Cookie klein bleibt. */
const MAX_PLANNED_APPOINTMENTS = 10;
const MAX_EXTRA_MESSAGES = 5;

function slotIndex(slot: AppointmentSlot): number {
  return APPOINTMENT_SLOTS.indexOf(slot);
}

function newId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

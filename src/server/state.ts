/**
 * Veränderlicher Demo-Zustand. Er liegt vollständig in einem Cookie, damit die
 * App auf Serverless-Plattformen ohne Datenbank funktioniert: Nur die Deltas
 * gegenüber den Seed-Daten werden gespeichert, damit das Cookie klein bleibt.
 */
import type { cookies } from "next/headers";
import { isIsoDate, type IsoDate, type IsoInstant } from "@/lib/dates";
import { cookieOptions } from "./cookies";
import {
  APPOINTMENT_SLOTS,
  APPOINTMENT_TYPES,
  CONSULTATION_CHANNELS,
  isOneOf,
  MESSAGE_KINDS,
  SCENARIOS,
  type AppointmentSlot,
  type AppointmentType,
  type Consultation,
  type MessageKind,
  type Scenario,
} from "./domain";

export const STATE_COOKIE = "cah_state";
const STATE_VERSION = 1;
const STATE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
/** Browser verwerfen Cookies ab 4096 Bytes still; darunter bleibt Reserve für Name und Attribute. */
const STATE_MAX_ENCODED_LENGTH = 3500;

export type CookieStore = Awaited<ReturnType<typeof cookies>>;

export interface BookedAppointment {
  readonly id: string;
  readonly type: AppointmentType;
  readonly date: IsoDate;
  readonly slot: AppointmentSlot;
}

export interface ExtraMessage {
  readonly id: string;
  readonly kind: MessageKind;
  readonly dateISO: IsoInstant;
}

export interface DemoState {
  readonly version: typeof STATE_VERSION;
  readonly appointments: readonly BookedAppointment[];
  readonly cancelledIds: readonly string[];
  readonly consultation: Consultation | null;
  readonly scenario: Scenario | null;
  readonly scenarioSinceISO: IsoInstant | null;
  readonly extraMessages: readonly ExtraMessage[];
  readonly readMessageIds: readonly string[];
  readonly medicationTaken: Readonly<Record<string, boolean>>;
}

export function defaultState(): DemoState {
  return {
    version: STATE_VERSION,
    appointments: [],
    cancelledIds: [],
    consultation: null,
    scenario: null,
    scenarioSinceISO: null,
    extraMessages: [],
    readMessageIds: [],
    medicationTaken: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isIsoInstant(value: unknown): value is IsoInstant {
  return isString(value) && !Number.isNaN(Date.parse(value));
}

function isStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isString);
}

function isBookedAppointment(value: unknown): value is BookedAppointment {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isOneOf(value.type, APPOINTMENT_TYPES) &&
    isIsoDate(value.date) &&
    isOneOf(value.slot, APPOINTMENT_SLOTS)
  );
}

function isExtraMessage(value: unknown): value is ExtraMessage {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isOneOf(value.kind, MESSAGE_KINDS) &&
    isIsoInstant(value.dateISO)
  );
}

const TIME_PATTERN = /^\d{2}:\d{2}$/;

function isTime(value: unknown): value is string {
  return isString(value) && TIME_PATTERN.test(value);
}

function isConsultation(value: unknown): value is Consultation {
  return (
    isRecord(value) &&
    isString(value.slotId) &&
    isIsoDate(value.dateISO) &&
    isTime(value.time) &&
    isOneOf(value.channel, CONSULTATION_CHANNELS)
  );
}

/*
 * Das Cookie kommt vom Client und ist damit nicht vertrauenswürdig. Jedes Feld
 * wird bis auf die Elementebene geprüft, sonst könnten manipulierte Werte die
 * Server Components zum Absturz bringen.
 */
function isDemoState(value: unknown): value is DemoState {
  return (
    isRecord(value) &&
    value.version === STATE_VERSION &&
    Array.isArray(value.appointments) &&
    value.appointments.every(isBookedAppointment) &&
    isStringArray(value.cancelledIds) &&
    (value.consultation === null || isConsultation(value.consultation)) &&
    (value.scenario === null || isOneOf(value.scenario, SCENARIOS)) &&
    (value.scenarioSinceISO === null || isIsoInstant(value.scenarioSinceISO)) &&
    Array.isArray(value.extraMessages) &&
    value.extraMessages.every(isExtraMessage) &&
    isStringArray(value.readMessageIds) &&
    isRecord(value.medicationTaken) &&
    Object.values(value.medicationTaken).every((taken) => typeof taken === "boolean")
  );
}

export function encodeState(state: DemoState): string {
  return Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
}

/** Liefert bei fehlendem oder beschädigtem Wert den Default-Zustand. */
export function decodeState(raw: string | undefined): DemoState {
  if (!raw) {
    return defaultState();
  }
  try {
    const parsed: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    return isDemoState(parsed) ? parsed : defaultState();
  } catch {
    return defaultState();
  }
}

export function readState(cookieStore: CookieStore): DemoState {
  return decodeState(cookieStore.get(STATE_COOKIE)?.value);
}

/**
 * Schreibt den Zustand als `Set-Cookie` in die Antwort (nur in Route Handlers erlaubt).
 * Würde das Cookie zu gross, wird auf den Default-Zustand zurückgesetzt, statt dass
 * der Browser das Cookie still verwirft.
 */
export function writeState(cookieStore: CookieStore, state: DemoState): void {
  const encoded = encodeState(state);
  const value = encoded.length > STATE_MAX_ENCODED_LENGTH ? encodeState(defaultState()) : encoded;
  cookieStore.set(STATE_COOKIE, value, cookieOptions(STATE_MAX_AGE_SECONDS));
}

export function clearState(cookieStore: CookieStore): void {
  cookieStore.delete(STATE_COOKIE);
}

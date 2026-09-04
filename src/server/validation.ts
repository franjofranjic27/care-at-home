import { isIsoDate } from "@/lib/dates";
import {
  APPOINTMENT_SLOTS,
  APPOINTMENT_TYPES,
  CONSULTATION_CHANNELS,
  isOneOf,
  SCENARIOS,
  type Scenario,
} from "./domain";
import { ValidationError } from "./errors";
import type { BookAppointmentInput, ConsultationInput } from "./store";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) {
    throw new ValidationError("Die Anfrage ist ungültig.");
  }
  return body;
}

function requireOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  message: string,
): T {
  if (!isOneOf(value, allowed)) {
    throw new ValidationError(message);
  }
  return value;
}

function requireText(value: unknown, message: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(message);
  }
  return value.trim();
}

export interface LoginInput {
  readonly insuranceNumber: string;
  readonly pin: string;
}

export function parseLoginInput(body: unknown): LoginInput {
  const record = requireRecord(body);
  return {
    insuranceNumber: requireText(record.insuranceNumber, "Bitte geben Sie Ihre AHV-Nummer ein."),
    pin: requireText(record.pin, "Bitte geben Sie Ihre PIN ein."),
  };
}

export function parseBookAppointmentInput(body: unknown): BookAppointmentInput {
  const record = requireRecord(body);
  const date = record.date;
  if (!isIsoDate(date)) {
    throw new ValidationError("Bitte wählen Sie einen Tag.");
  }
  return {
    type: requireOneOf(record.type, APPOINTMENT_TYPES, "Bitte wählen Sie, was Sie brauchen."),
    date,
    slot: requireOneOf(record.slot, APPOINTMENT_SLOTS, "Bitte wählen Sie eine Zeit."),
  };
}

export function parseConsultationInput(body: unknown): ConsultationInput {
  const record = requireRecord(body);
  return {
    slotId: requireText(record.slotId, "Bitte wählen Sie eine Zeit."),
    channel: requireOneOf(record.channel, CONSULTATION_CHANNELS, "Bitte wählen Sie, wie Sie sprechen möchten."),
  };
}

export function parseTakenInput(body: unknown): { readonly taken: boolean } {
  const record = requireRecord(body);
  if (typeof record.taken !== "boolean") {
    throw new ValidationError("Die Angabe «genommen» fehlt.");
  }
  return { taken: record.taken };
}

export function parseScenarioInput(body: unknown): { readonly scenario: Scenario } {
  const record = requireRecord(body);
  return {
    scenario: requireOneOf(record.scenario, SCENARIOS, "Unbekanntes Szenario."),
  };
}

import { LOCALES, type Locale } from "@/i18n/config";
import { isIsoDate } from "@/lib/dates";
import {
  APPOINTMENT_SLOTS,
  APPOINTMENT_TYPES,
  CONSULTATION_CHANNELS,
  isOneOf,
  SCENARIOS,
  type Scenario,
} from "./domain";
import { ValidationError, type ApiErrorKey } from "./errors";
import type { BookAppointmentInput, ConsultationInput } from "./store";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) {
    throw new ValidationError("invalidRequest");
  }
  return body;
}

function requireOneOf<T extends string>(value: unknown, allowed: readonly T[], errorKey: ApiErrorKey): T {
  if (!isOneOf(value, allowed)) {
    throw new ValidationError(errorKey);
  }
  return value;
}

function requireText(value: unknown, errorKey: ApiErrorKey): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(errorKey);
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
    insuranceNumber: requireText(record.insuranceNumber, "insuranceNumberRequired"),
    pin: requireText(record.pin, "pinRequired"),
  };
}

export function parseBookAppointmentInput(body: unknown): BookAppointmentInput {
  const record = requireRecord(body);
  const date = record.date;
  if (!isIsoDate(date)) {
    throw new ValidationError("dayRequired");
  }
  return {
    type: requireOneOf(record.type, APPOINTMENT_TYPES, "typeRequired"),
    date,
    slot: requireOneOf(record.slot, APPOINTMENT_SLOTS, "slotRequired"),
  };
}

export function parseConsultationInput(body: unknown): ConsultationInput {
  const record = requireRecord(body);
  return {
    slotId: requireText(record.slotId, "slotRequired"),
    channel: requireOneOf(record.channel, CONSULTATION_CHANNELS, "channelRequired"),
  };
}

export function parseTakenInput(body: unknown): { readonly taken: boolean } {
  const record = requireRecord(body);
  if (typeof record.taken !== "boolean") {
    throw new ValidationError("takenMissing");
  }
  return { taken: record.taken };
}

export function parseScenarioInput(body: unknown): { readonly scenario: Scenario } {
  const record = requireRecord(body);
  return {
    scenario: requireOneOf(record.scenario, SCENARIOS, "unknownScenario"),
  };
}

export function parseLocaleInput(body: unknown): { readonly locale: Locale } {
  const record = requireRecord(body);
  return {
    locale: requireOneOf(record.locale, LOCALES, "unknownLocale"),
  };
}

/**
 * Kleiner Client für die simulierten API-Routen. Wird nur aus
 * Client-Komponenten verwendet.
 */
import type { Locale } from "@/i18n/config";
import type { Appointment, ConsultationChannel, Scenario } from "@/server/domain";
import type { BookAppointmentInput } from "@/server/store";

export class ApiError extends Error {
  /**
   * @param serverMessage Bereits übersetzte Meldung aus der JSON-Antwort
   *   (`error`), oder `null`, wenn die Antwort keine enthielt.
   */
  constructor(
    readonly status: number,
    readonly serverMessage: string | null,
  ) {
    super(serverMessage ?? `Request failed with status ${status}`);
    this.name = "ApiError";
  }
}

/** Liefert die Meldung des Servers, sonst den übergebenen (übersetzten) Ersatztext. */
export function describeError(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.serverMessage ? error.serverMessage : fallback;
}

function extractServerMessage(payload: unknown): string | null {
  if (typeof payload === "object" && payload !== null && "error" in payload) {
    const { error } = payload as { error: unknown };
    return typeof error === "string" && error.length > 0 ? error : null;
  }
  return null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, extractServerMessage(payload));
  }
  return payload as T;
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });
}

export interface LoginRequest {
  readonly insuranceNumber: string;
  readonly pin: string;
}

export const api = {
  login: (input: LoginRequest) => post<{ ok: true }>("/api/login", input),
  logout: () => post<{ ok: true }>("/api/logout"),
  setLocale: (locale: Locale) => post<{ ok: true; locale: Locale }>("/api/locale", { locale }),
  createAppointment: (input: BookAppointmentInput) =>
    post<{ appointment: Appointment }>("/api/appointments", input),
  cancelAppointment: (id: string) =>
    request<{ ok: true }>(`/api/appointments/${encodeURIComponent(id)}`, { method: "DELETE" }),
  markMessageRead: (id: string) =>
    post<{ ok: true }>(`/api/doctor/messages/${encodeURIComponent(id)}/read`),
  bookConsultation: (input: { slotId: string; channel: ConsultationChannel }) =>
    post<{ ok: true }>("/api/consultations", input),
  setMedicationTaken: (id: string, taken: boolean) =>
    post<{ ok: true }>(`/api/medications/${encodeURIComponent(id)}/taken`, { taken }),
  setScenario: (scenario: Scenario) => post<{ ok: true }>("/api/demo/scenario", { scenario }),
  resetDemo: () => post<{ ok: true }>("/api/demo/reset"),
} as const;

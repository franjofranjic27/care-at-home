/**
 * Kleiner Client für die simulierten API-Routen. Wird nur aus
 * Client-Komponenten verwendet.
 */
import type { Appointment, ConsultationChannel, Scenario } from "@/server/domain";
import type { BookAppointmentInput } from "@/server/store";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const GENERIC_ERROR = "Etwas hat nicht geklappt. Bitte versuchen Sie es noch einmal.";

/** Liefert eine verständliche Fehlermeldung für die Anzeige. */
export function describeError(error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_ERROR;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error: unknown }).error)
        : GENERIC_ERROR;
    throw new ApiError(response.status, message);
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

/**
 * Gemeinsame Bausteine der Route Handlers: Zustand aus dem Cookie lesen,
 * Fehler in JSON übersetzen und die Session prüfen.
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession, type Session } from "@/lib/session";
import { HttpError, UnauthorizedError, ValidationError } from "./errors";
import { readState, writeState, type CookieStore, type DemoState } from "./state";

export interface ErrorBody {
  readonly error: string;
}

export function jsonError(message: string, status: number): NextResponse<ErrorBody> {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Führt einen Handler aus und übersetzt bekannte Fehler in JSON-Antworten.
 * Ungültiges JSON im Request wird als 400 gemeldet.
 */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonError(error.message, error.status);
    }
    if (error instanceof SyntaxError) {
      return jsonError(new ValidationError("Die Anfrage ist ungültig.").message, 400);
    }
    console.error(error);
    return jsonError("Etwas hat nicht geklappt. Bitte versuchen Sie es später noch einmal.", 500);
  }
}

export async function requireSession(): Promise<Session> {
  const session = await readSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export interface StateContext {
  readonly cookieStore: CookieStore;
  readonly state: DemoState;
  readonly now: Date;
}

export async function loadState(): Promise<StateContext> {
  const cookieStore = await cookies();
  return { cookieStore, state: readState(cookieStore), now: new Date() };
}

/** Persistiert den neuen Zustand im Cookie und antwortet mit JSON. */
export function commit<T>(context: StateContext, nextState: DemoState, body: T): NextResponse<T> {
  writeState(context.cookieStore, nextState);
  return NextResponse.json(body);
}

const MAX_BODY_LENGTH = 10_000;

/** Liest JSON aus dem Request; leerer Body ergibt ein leeres Objekt, zu grosse Bodies werden abgelehnt. */
export async function readJson(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_LENGTH) {
    throw new ValidationError("Die Anfrage ist zu gross.");
  }
  const text = await request.text();
  if (text.length > MAX_BODY_LENGTH) {
    throw new ValidationError("Die Anfrage ist zu gross.");
  }
  return text.trim().length === 0 ? {} : (JSON.parse(text) as unknown);
}

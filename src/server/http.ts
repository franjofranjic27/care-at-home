/**
 * Gemeinsame Bausteine der Route Handlers: Zustand aus dem Cookie lesen,
 * Fehler übersetzen und als JSON ausgeben, Session prüfen.
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createTranslator } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { readSession, type Session } from "@/lib/session";
import { HttpError, UnauthorizedError, ValidationError, type ApiErrorKey, type ApiErrorValues } from "./errors";
import { readState, writeState, type CookieStore, type DemoState } from "./state";

export interface ErrorBody {
  readonly error: string;
}

export function jsonError(message: string, status: number): NextResponse<ErrorBody> {
  return NextResponse.json({ error: message }, { status });
}

/*
 * Der Schlüssel ist hier zur Laufzeit beliebig aus `error.api`, deshalb
 * bewusst ein Übersetzer ohne die schlüsselgenaue ICU-Typisierung von
 * next-intl (die sonst die Schnittmenge aller Argumente verlangen würde).
 */
async function translateApiError(key: ApiErrorKey, values?: ApiErrorValues): Promise<string> {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  const t = createTranslator<Record<string, string>>({ locale, messages: messages.error.api });
  return t(key, values);
}

/**
 * Führt einen Handler aus und übersetzt bekannte Fehler in JSON-Antworten
 * in der Sprache der Anfrage. Ungültiges JSON im Request wird als 400 gemeldet.
 */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof HttpError) {
      return jsonError(await translateApiError(error.key, error.values), error.status);
    }
    if (error instanceof SyntaxError) {
      return jsonError(await translateApiError("invalidRequest"), 400);
    }
    console.error(error);
    return jsonError(await translateApiError("unexpected"), 500);
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
    throw new ValidationError("requestTooLarge");
  }
  const text = await request.text();
  if (text.length > MAX_BODY_LENGTH) {
    throw new ValidationError("requestTooLarge");
  }
  return text.trim().length === 0 ? {} : (JSON.parse(text) as unknown);
}

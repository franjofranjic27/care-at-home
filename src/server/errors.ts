import type { Messages } from "next-intl";

/** Schlüssel unter `error.api` in `messages/<locale>.json`. */
export type ApiErrorKey = keyof Messages["error"]["api"];
export type ApiErrorValues = Readonly<Record<string, string | number>>;

/**
 * Fehler mit HTTP-Status. Statt eines fertigen Textes trägt er einen
 * Übersetzungsschlüssel (plus Werte); `handle()` übersetzt ihn in der
 * Sprache der Anfrage. `message` enthält den Schlüssel für Logs.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly key: ApiErrorKey,
    readonly values?: ApiErrorValues,
  ) {
    super(key);
    this.name = new.target.name;
  }
}

export class ValidationError extends HttpError {
  constructor(key: ApiErrorKey, values?: ApiErrorValues) {
    super(400, key, values);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(key: ApiErrorKey = "unauthorized") {
    super(401, key);
  }
}

export class NotFoundError extends HttpError {
  constructor(key: ApiErrorKey) {
    super(404, key);
  }
}

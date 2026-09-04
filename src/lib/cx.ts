/** Verbindet Klassennamen und lässt leere Werte weg. */
export function cx(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

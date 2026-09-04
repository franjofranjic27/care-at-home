/** Pulsierender blauer Punkt («Arzt prüft gerade»). Ohne Animation bei reduzierter Bewegung. */
export function PulseDot() {
  return <span aria-hidden="true" className="ml-1 size-5 shrink-0 rounded-full bg-brand motion-safe:animate-pulse-dot" />;
}

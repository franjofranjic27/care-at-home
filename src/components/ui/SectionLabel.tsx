import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface SectionLabelProps {
  readonly children: ReactNode;
  readonly tone?: "muted" | "brand";
  /** Optionaler Zusatz rechts, z. B. «Heute, 08:05 Uhr». */
  readonly trailing?: ReactNode;
  readonly id?: string;
}

/** Abschnittstitel: 17 px, fett, gemischte Schreibung. */
export function SectionLabel({ children, tone = "muted", trailing, id }: SectionLabelProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 id={id} className={cx("text-label font-bold", tone === "brand" ? "text-brand" : "text-muted")}>
        {children}
      </h2>
      {trailing !== undefined && <span className="text-small text-muted">{trailing}</span>}
    </div>
  );
}

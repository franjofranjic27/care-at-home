import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export interface StepHeadingProps {
  readonly step: number;
  readonly id: string;
  readonly children: ReactNode;
}

/** Nummerierter Schritt-Titel («1 · Was brauchen Sie?»). */
export function StepHeading({ step, id, children }: StepHeadingProps) {
  const t = useTranslations("common");
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-label font-bold text-white"
      >
        {step}
      </span>
      <h2 id={id} className="text-tile font-bold">
        <span className="sr-only">{t("step", { step })}</span>
        {children}
      </h2>
    </div>
  );
}

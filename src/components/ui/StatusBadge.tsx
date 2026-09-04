import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type StatusTone = "ok" | "warn" | "danger";

const TONES: Readonly<Record<StatusTone, string>> = {
  ok: "bg-ok-tint text-ok-text",
  warn: "bg-warn-tint text-warn",
  danger: "bg-danger-tint text-danger",
};

export interface StatusBadgeProps {
  readonly tone: StatusTone;
  readonly children: ReactNode;
}

/** Status-Pille, z. B. «gut» oder «im Ziel». */
export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span className={cx("inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-label font-bold", TONES[tone])}>
      {children}
    </span>
  );
}

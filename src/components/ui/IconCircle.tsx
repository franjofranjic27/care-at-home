import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type IconCircleTone = "ok" | "warn" | "brand";
export type IconCircleSize = "sm" | "md" | "xl";

const TONES: Readonly<Record<IconCircleTone, string>> = {
  ok: "bg-ok text-white",
  warn: "bg-warn text-white",
  brand: "bg-brand text-white",
};

const SIZES: Readonly<Record<IconCircleSize, string>> = {
  sm: "size-10",
  md: "size-12",
  xl: "size-26",
};

export interface IconCircleProps {
  readonly tone: IconCircleTone;
  readonly size?: IconCircleSize;
  readonly children: ReactNode;
}

/** Farbiger Kreis mit Icon (Status-Karten, Nachrichten, Bestätigung). */
export function IconCircle({ tone, size = "md", children }: IconCircleProps) {
  return (
    <span className={cx("flex shrink-0 items-center justify-center rounded-full", TONES[tone], SIZES[size])}>
      {children}
    </span>
  );
}

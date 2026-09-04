import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";

export type CardTone =
  | "outline"
  | "brand-tint"
  | "brand-outline"
  | "ok"
  | "warn"
  | "warn-tint"
  | "sky";

const TONES: Readonly<Record<CardTone, string>> = {
  outline: "border-2 border-line bg-white",
  "brand-tint": "bg-brand-tint",
  "brand-outline": "border-2 border-brand bg-white",
  ok: "border-2 border-ok bg-ok-tint",
  warn: "border-2 border-warn bg-warn-tint",
  "warn-tint": "bg-warn-tint",
  sky: "bg-sky-tint",
};

export type CardPadding = "none" | "md" | "lg";

const PADDINGS: Readonly<Record<CardPadding, string>> = {
  none: "",
  md: "p-5",
  lg: "p-5.5",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly tone?: CardTone;
  readonly padding?: CardPadding;
}

export function Card({ tone = "outline", padding = "md", className, children, ...rest }: CardProps) {
  return (
    <div
      className={cx("flex flex-col gap-3 rounded-card", TONES[tone], PADDINGS[padding], className)}
      {...rest}
    >
      {children}
    </div>
  );
}

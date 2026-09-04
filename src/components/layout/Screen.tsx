import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ScreenPadding = "sub" | "dashboard" | "none";

const PADDINGS: Readonly<Record<ScreenPadding, string>> = {
  sub: "gap-5.5 px-6 pt-5 pb-8",
  dashboard: "gap-5 px-6 py-7",
  none: "",
};

export interface ScreenProps {
  readonly padding?: ScreenPadding;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Zentrierte Inhaltsspalte (max. 480 px). Auf breiten Bildschirmen hebt sich
 * die weisse Spalte mit einem Rand vom grauen Seitenhintergrund ab.
 */
export function Screen({ padding = "sub", className, children }: ScreenProps) {
  return (
    <main
      className={cx(
        "mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-white md:border-x-2 md:border-line",
        PADDINGS[padding],
        className,
      )}
    >
      {children}
    </main>
  );
}

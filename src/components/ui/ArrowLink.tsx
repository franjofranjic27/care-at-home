import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { FOCUS_RING } from "./focus";

export interface ArrowLinkProps {
  readonly href: string;
  readonly children: ReactNode;
}

/** Textlink mit Pfeil nach rechts, 60 px hoch (z. B. «Nachricht lesen»). */
export function ArrowLink({ href, children }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex min-h-15 items-center gap-1.5 self-start pr-2 text-body font-bold text-brand no-underline hover:text-brand-dark",
        FOCUS_RING,
      )}
    >
      <span>{children}</span>
      <ChevronRightIcon size={22} />
    </Link>
  );
}

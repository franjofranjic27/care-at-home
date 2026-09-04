import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { cx } from "@/lib/cx";
import { FOCUS_RING } from "./focus";

export interface BackLinkProps {
  readonly href: string;
  /** Übersetzter Text, z. B. «Zurück» oder «Zur Übersicht». */
  readonly label: string;
}

/** Grosser Zurück-Link am Seitenanfang (60 px hoch). */
export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex min-h-15 items-center gap-2 self-start pr-3 text-body font-bold text-brand no-underline hover:text-brand-dark",
        FOCUS_RING,
      )}
    >
      <ArrowLeftIcon />
      <span>{label}</span>
    </Link>
  );
}

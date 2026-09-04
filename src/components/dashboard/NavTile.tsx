import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";

export interface NavTileProps {
  readonly href: string;
  readonly icon: ReactNode;
  readonly label: string;
}

/** Grosse Navigations-Kachel (76 px hoch). */
export function NavTile({ href, icon, label }: NavTileProps) {
  return (
    <Link
      href={href}
      className="flex min-h-19 items-center gap-3.5 rounded-card border-2 border-line bg-white py-2 pr-4 pl-3.5 text-ink no-underline transition-colors hover:border-faint hover:text-ink focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-ink"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-field bg-brand-tint text-brand">
        {icon}
      </span>
      <span className="grow text-tile font-bold">{label}</span>
      <ChevronRightIcon className="shrink-0 text-muted" />
    </Link>
  );
}

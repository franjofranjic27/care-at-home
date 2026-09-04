import type { ReactNode } from "react";
import { InfoIcon } from "@/components/icons";

/** Hellblauer Hinweis mit Info-Icon. */
export function InfoNote({ children }: { readonly children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-control bg-sky-tint px-4.5 py-4">
      <InfoIcon className="mt-0.5 shrink-0 text-brand" />
      <p className="text-label">{children}</p>
    </div>
  );
}

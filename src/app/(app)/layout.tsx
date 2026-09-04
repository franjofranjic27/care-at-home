import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { readSession } from "@/lib/session";

/** Geschützter Bereich: ohne Session geht es zur Anmeldung. */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await readSession();
  if (!session) {
    redirect("/login");
  }
  return children;
}

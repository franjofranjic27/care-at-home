"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

/**
 * Markiert ungelesene Nachrichten beim Öffnen der Seite als gelesen.
 * Die Aufrufe laufen nacheinander, weil der Zustand im Cookie liegt und
 * parallele Anfragen sich sonst gegenseitig überschreiben würden.
 */
export function MarkMessagesRead({ unreadIds }: { readonly unreadIds: readonly string[] }) {
  useEffect(() => {
    let cancelled = false;
    async function markAll() {
      for (const id of unreadIds) {
        if (cancelled) {
          return;
        }
        await api.markMessageRead(id).catch(() => undefined);
      }
    }
    if (unreadIds.length > 0) {
      void markAll();
    }
    return () => {
      cancelled = true;
    };
  }, [unreadIds]);

  return null;
}

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/api";

/** Kleiner Text-Knopf «Abmelden» neben dem Avatar. */
export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("common");
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await api.logout();
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="min-h-15 px-2 text-small font-bold whitespace-nowrap text-brand hover:text-brand-dark focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-ink disabled:text-faint"
    >
      {t("logout")}
    </button>
  );
}

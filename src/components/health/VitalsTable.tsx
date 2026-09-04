import { getLocale, getTranslations } from "next-intl/server";
import { Card, StatusBadge } from "@/components/ui";
import { formatNumber } from "@/lib/numbers";
import type { Vital } from "@/server/domain";

export async function VitalsTable({ vitals }: { readonly vitals: readonly Vital[] }) {
  const [locale, tLabels] = await Promise.all([getLocale(), getTranslations("labels")]);

  return (
    <Card padding="none" className="gap-0">
      <ul className="flex flex-col divide-y-2 divide-line">
        {vitals.map((vital) => (
          <li key={vital.id} className="flex min-h-17 items-center gap-3 px-4.5 py-3">
            <span className="grow">{tLabels(`vital.${vital.id}`)}</span>
            <span className="text-card-title font-bold">
              {vital.values.map((value) => formatNumber(value, locale)).join(" / ")}
              {vital.unit ? ` ${vital.unit}` : ""}
            </span>
            <StatusBadge tone="ok">{tLabels(`vitalStatus.${vital.status}`)}</StatusBadge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

import { Card, StatusBadge } from "@/components/ui";
import { VITAL_STATUS_LABELS } from "@/lib/labels";
import type { Vital } from "@/server/domain";

export function VitalsTable({ vitals }: { readonly vitals: readonly Vital[] }) {
  return (
    <Card padding="none" className="gap-0">
      <ul className="flex flex-col divide-y-2 divide-line">
        {vitals.map((vital) => (
          <li key={vital.id} className="flex min-h-17 items-center gap-3 px-4.5 py-3">
            <span className="grow">{vital.name}</span>
            <span className="text-card-title font-bold">
              {vital.value}
              {vital.unit ? ` ${vital.unit}` : ""}
            </span>
            <StatusBadge tone="ok">{VITAL_STATUS_LABELS[vital.status]}</StatusBadge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

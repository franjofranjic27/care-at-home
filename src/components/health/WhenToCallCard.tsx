import { PhoneIcon } from "@/components/icons";
import { Card, LinkButton } from "@/components/ui";
import type { CareTeam } from "@/server/domain";

const REASONS: readonly string[] = [
  "Sie schlechter Luft bekommen als sonst",
  "Ihr Gewicht in 3 Tagen um mehr als 2 kg steigt",
  "Ihre Beine stark anschwellen",
];

export function WhenToCallCard({ careTeam }: { readonly careTeam: CareTeam }) {
  return (
    <Card tone="warn-tint" className="gap-3.5">
      <p>Rufen Sie Ihre Spitex an, wenn:</p>
      <ul className="flex flex-col gap-2.5">
        {REASONS.map((reason) => (
          <li key={reason} className="flex gap-2.5">
            <span aria-hidden="true" className="font-bold text-warn">
              •
            </span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      <LinkButton href={`tel:${careTeam.phone}`} variant="secondary" icon={<PhoneIcon />}>
        {careTeam.organisation} anrufen
      </LinkButton>
    </Card>
  );
}

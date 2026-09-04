import { useTranslations } from "next-intl";
import { PhoneIcon } from "@/components/icons";
import { Card, LinkButton } from "@/components/ui";
import type { CareTeam } from "@/server/domain";

const REASON_KEYS = ["breathing", "weight", "legs"] as const;

export function WhenToCallCard({ careTeam }: { readonly careTeam: CareTeam }) {
  const t = useTranslations("health");
  return (
    <Card tone="warn-tint" className="gap-3.5">
      <p>{t("callIf")}</p>
      <ul className="flex flex-col gap-2.5">
        {REASON_KEYS.map((key) => (
          <li key={key} className="flex gap-2.5">
            <span aria-hidden="true" className="font-bold text-warn">
              •
            </span>
            <span>{t(`reasons.${key}`)}</span>
          </li>
        ))}
      </ul>
      <LinkButton href={`tel:${careTeam.phone}`} variant="secondary" icon={<PhoneIcon />}>
        {t("call", { organisation: careTeam.organisation })}
      </LinkButton>
    </Card>
  );
}

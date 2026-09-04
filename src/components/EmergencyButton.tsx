import { useTranslations } from "next-intl";
import { PhoneIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui";
import { EMERGENCY_NUMBER } from "@/lib/labels";

/** Rot umrandeter Notfall-Knopf, ruft 144 an. */
export function EmergencyButton() {
  const t = useTranslations("common");
  return (
    <LinkButton href={`tel:${EMERGENCY_NUMBER}`} variant="danger-outline" icon={<PhoneIcon />}>
      {t("emergency", { number: EMERGENCY_NUMBER })}
    </LinkButton>
  );
}

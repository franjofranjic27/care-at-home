import { cookies } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { EmergencyButton } from "@/components/EmergencyButton";
import { MedicationList } from "@/components/health/MedicationList";
import { VitalsTable } from "@/components/health/VitalsTable";
import { WhenToCallCard } from "@/components/health/WhenToCallCard";
import { Screen } from "@/components/layout/Screen";
import { BackLink, SectionLabel } from "@/components/ui";
import { formatInstantTime } from "@/lib/dates";
import { readState } from "@/server/state";
import { getHealth } from "@/server/store";

export default async function HealthPage() {
  const [locale, t, state] = await Promise.all([getLocale(), getTranslations(), cookies().then(readState)]);
  const health = getHealth(state, new Date());

  return (
    <Screen>
      <BackLink href="/" label={t("common.back")} />
      <h1>{t("health.title")}</h1>

      <section className="flex flex-col gap-3" aria-labelledby="section-vitals">
        <SectionLabel
          id="section-vitals"
          trailing={t("health.measuredAt", { time: formatInstantTime(health.measuredAt, locale) })}
        >
          {t("health.vitals")}
        </SectionLabel>
        <VitalsTable vitals={health.vitals} />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="section-medications">
        <SectionLabel id="section-medications">{t("health.medications")}</SectionLabel>
        <MedicationList medications={health.medications} />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="section-call">
        <SectionLabel id="section-call">{t("health.whenToCall")}</SectionLabel>
        <WhenToCallCard careTeam={health.patient.careTeam} />
      </section>

      <EmergencyButton />
    </Screen>
  );
}

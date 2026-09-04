import { cookies } from "next/headers";
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
  const state = readState(await cookies());
  const health = getHealth(state, new Date());

  return (
    <Screen>
      <BackLink href="/" />
      <h1>Meine Gesundheit</h1>

      <section className="flex flex-col gap-3" aria-labelledby="section-vitals">
        <SectionLabel id="section-vitals" trailing={`Heute, ${formatInstantTime(health.measuredAt)} Uhr`}>
          Meine Werte
        </SectionLabel>
        <VitalsTable vitals={health.vitals} />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="section-medications">
        <SectionLabel id="section-medications">Medikamente heute</SectionLabel>
        <MedicationList medications={health.medications} />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="section-call">
        <SectionLabel id="section-call">Wann soll ich anrufen?</SectionLabel>
        <WhenToCallCard careTeam={health.patient.careTeam} />
      </section>

      <EmergencyButton />
    </Screen>
  );
}

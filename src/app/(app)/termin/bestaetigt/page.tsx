import { cookies } from "next/headers";
import { AppointmentDetailsCard } from "@/components/appointments/AppointmentDetailsCard";
import { CancelAppointment } from "@/components/appointments/CancelAppointment";
import { CheckIcon } from "@/components/icons";
import { Screen } from "@/components/layout/Screen";
import { BackLink, IconCircle, LinkButton } from "@/components/ui";
import { getPatient } from "@/server/seed";
import { readState } from "@/server/state";
import { getAppointment } from "@/server/store";

interface PageProps {
  readonly searchParams: Promise<{ id?: string | string[] }>;
}

export default async function AppointmentConfirmedPage({ searchParams }: PageProps) {
  const { id } = await searchParams;
  const appointmentId = typeof id === "string" ? id : null;
  const state = readState(await cookies());
  const appointment = appointmentId ? getAppointment(state, appointmentId, new Date()) : null;

  if (!appointment) {
    return (
      <Screen>
        <BackLink href="/" label="Zur Übersicht" />
        <h1>Termin nicht gefunden</h1>
        <p>Dieser Termin ist nicht mehr vorhanden. Vielleicht wurde er abgesagt.</p>
        <LinkButton href="/termin" variant="secondary">
          Neuen Termin buchen
        </LinkButton>
        <LinkButton href="/">Zur Übersicht</LinkButton>
      </Screen>
    );
  }

  return (
    <Screen className="gap-6">
      <BackLink href="/" label="Zur Übersicht" />

      <div className="flex flex-col items-center gap-4.5 pt-6">
        <IconCircle tone="ok" size="xl">
          <CheckIcon size={56} />
        </IconCircle>
        <h1 className="text-center">Ihr Termin ist gebucht</h1>
      </div>

      <AppointmentDetailsCard appointment={appointment} careTeam={getPatient().careTeam} />

      <p className="text-center text-muted">Wir erinnern Sie am Tag davor per SMS und Anruf.</p>

      <div className="grow" />

      <LinkButton href="/">Zur Übersicht</LinkButton>
      <CancelAppointment appointmentId={appointment.id} />
    </Screen>
  );
}

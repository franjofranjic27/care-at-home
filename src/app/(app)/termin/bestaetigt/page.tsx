import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
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
  const [{ id }, t, state] = await Promise.all([searchParams, getTranslations(), cookies().then(readState)]);
  const appointmentId = typeof id === "string" ? id : null;
  const appointment = appointmentId ? getAppointment(state, appointmentId, new Date()) : null;

  if (!appointment) {
    return (
      <Screen>
        <BackLink href="/" label={t("common.toOverview")} />
        <h1>{t("appointment.confirmed.notFoundTitle")}</h1>
        <p>{t("appointment.confirmed.notFoundBody")}</p>
        <LinkButton href="/termin" variant="secondary">
          {t("appointment.confirmed.bookNew")}
        </LinkButton>
        <LinkButton href="/">{t("common.toOverview")}</LinkButton>
      </Screen>
    );
  }

  return (
    <Screen className="gap-6">
      <BackLink href="/" label={t("common.toOverview")} />

      <div className="flex flex-col items-center gap-4.5 pt-6">
        <IconCircle tone="ok" size="xl">
          <CheckIcon size={56} />
        </IconCircle>
        <h1 className="text-center">{t("appointment.confirmed.title")}</h1>
      </div>

      <AppointmentDetailsCard appointment={appointment} careTeam={getPatient().careTeam} />

      <p className="text-center text-muted">{t("appointment.confirmed.reminder")}</p>

      <div className="grow" />

      <LinkButton href="/">{t("common.toOverview")}</LinkButton>
      <CancelAppointment appointmentId={appointment.id} />
    </Screen>
  );
}

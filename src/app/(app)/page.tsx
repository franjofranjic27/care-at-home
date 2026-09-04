import { cookies } from "next/headers";
import { EmergencyButton } from "@/components/EmergencyButton";
import { CalendarPlusIcon, HeartIcon, StethoscopeIcon } from "@/components/icons";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NavTile } from "@/components/dashboard/NavTile";
import { NextAppointmentCard } from "@/components/dashboard/NextAppointmentCard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Screen } from "@/components/layout/Screen";
import { formatFullDate, hourInZurich, todayIso } from "@/lib/dates";
import { greetingForHour } from "@/lib/greeting";
import { readState } from "@/server/state";
import { getDashboard } from "@/server/store";

export default async function DashboardPage() {
  const now = new Date();
  const state = readState(await cookies());
  const dashboard = getDashboard(state, now);

  return (
    <Screen padding="dashboard">
      <DashboardHeader patient={dashboard.patient} />

      <div className="flex flex-col gap-1">
        <h1 className="text-hero">
          {greetingForHour(hourInZurich(now))}, {dashboard.patient.firstName}
        </h1>
        <p className="text-label text-muted">{formatFullDate(todayIso(now))}</p>
      </div>

      <StatusCard
        trafficLight={dashboard.trafficLight}
        doctor={dashboard.doctor}
        latestMessage={dashboard.latestMessage}
        consultation={dashboard.consultation}
      />

      <NextAppointmentCard
        appointment={dashboard.nextAppointment}
        careTeam={dashboard.patient.careTeam}
        today={todayIso(now)}
      />

      <nav aria-label="Hauptbereiche" className="flex flex-col gap-3">
        <NavTile href="/termin" icon={<CalendarPlusIcon size={26} />} label="Termin buchen" />
        <NavTile href="/arzt" icon={<StethoscopeIcon size={26} />} label="Mein Arzt" />
        <NavTile href="/gesundheit" icon={<HeartIcon size={26} />} label="Meine Gesundheit" />
      </nav>

      <div className="grow" />

      <EmergencyButton />
    </Screen>
  );
}

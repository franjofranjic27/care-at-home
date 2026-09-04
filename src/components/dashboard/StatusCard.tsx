import { getLocale, getTranslations } from "next-intl/server";
import { CalendarIcon, CheckIcon } from "@/components/icons";
import { ReviewingCard } from "@/components/doctor/ReviewingCard";
import { ArrowLink, Card, IconCircle, LinkButton } from "@/components/ui";
import { formatInstantDayMonth, formatWeekdayDayMonth } from "@/lib/dates";
import type { Doctor, DoctorMessage, TrafficLight } from "@/server/domain";
import type { ConsultationView } from "@/server/store";

export interface StatusCardProps {
  readonly trafficLight: TrafficLight;
  readonly doctor: Doctor;
  readonly latestMessage: DoctorMessage | null;
  readonly consultation: ConsultationView | null;
}

/** Ampel-Karte auf der Übersicht: grün, gelb oder blau (Arzt prüft gerade). */
export async function StatusCard({ trafficLight, doctor, latestMessage, consultation }: StatusCardProps) {
  const [locale, t, tLabels] = await Promise.all([
    getLocale(),
    getTranslations("dashboard.status"),
    getTranslations("labels"),
  ]);

  if (trafficLight === "blue") {
    return (
      <ReviewingCard doctor={doctor} headingLevel="h2">
        <ArrowLink href="/arzt">{t("learnMore")}</ArrowLink>
      </ReviewingCard>
    );
  }

  const messageDate = latestMessage ? formatInstantDayMonth(latestMessage.dateISO, locale) : null;

  if (trafficLight === "yellow") {
    return (
      <Card tone="warn">
        <div className="flex items-center gap-3.5">
          <IconCircle tone="warn">
            <CalendarIcon size={26} strokeWidth={2.2} />
          </IconCircle>
          <h2 className="text-card-title font-bold">{t("consultation.title")}</h2>
        </div>
        <p>
          {messageDate
            ? t("consultation.bodyDated", { doctor: doctor.name, date: messageDate })
            : t("consultation.body", { doctor: doctor.name })}
        </p>
        {consultation ? (
          <p className="font-bold">
            {t("consultation.arranged", {
              date: formatWeekdayDayMonth(consultation.slot.dateISO, locale),
              time: consultation.slot.time,
              channel: tLabels(`channel.${consultation.channel}.label`),
            })}
          </p>
        ) : (
          <LinkButton href="/arzt/besprechung" className="min-h-15 text-tile">
            {t("chooseTime")}
          </LinkButton>
        )}
        <ArrowLink href="/arzt">{t("readMessage")}</ArrowLink>
      </Card>
    );
  }

  return (
    <Card tone="ok">
      <div className="flex items-center gap-3.5">
        <IconCircle tone="ok">
          <CheckIcon size={28} />
        </IconCircle>
        <h2 className="text-card-title font-bold">{t("good.title")}</h2>
      </div>
      <p>
        {messageDate
          ? t("good.bodyDated", { doctor: doctor.name, date: messageDate })
          : t("good.body", { doctor: doctor.name })}
      </p>
      <ArrowLink href="/arzt">{t("readMessage")}</ArrowLink>
    </Card>
  );
}

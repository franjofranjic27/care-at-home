import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui";
import { formatInstantDayMonth, formatInstantTime, isToday, type IsoInstant } from "@/lib/dates";
import type { Doctor, DoctorStatus } from "@/server/domain";
import { ReviewingCard } from "./ReviewingCard";

export interface ReviewStatusCardProps {
  readonly doctor: Doctor;
  readonly status: DoctorStatus;
  readonly vitalsSentAt: IsoInstant;
  readonly now: Date;
}

/** Abschnitt «Gerade jetzt»: prüft der Arzt gerade, oder wann war die letzte Prüfung? */
export async function ReviewStatusCard({ doctor, status, vitalsSentAt, now }: ReviewStatusCardProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("doctor.status")]);
  const sentAt = (
    <p className="text-small text-muted">{t("sentAt", { time: formatInstantTime(vitalsSentAt, locale) })}</p>
  );

  if (status.state === "reviewing") {
    return (
      <ReviewingCard doctor={doctor} headingLevel="p">
        {sentAt}
      </ReviewingCard>
    );
  }

  const time = formatInstantTime(status.sinceISO, locale);
  const lastCheck = isToday(status.sinceISO, now)
    ? t("lastCheckToday", { doctor: doctor.shortName, time })
    : t("lastCheckOn", { doctor: doctor.shortName, date: formatInstantDayMonth(status.sinceISO, locale), time });

  return (
    <Card>
      <p className="text-cta font-bold">{t("idleTitle")}</p>
      <p>{lastCheck}</p>
      {sentAt}
    </Card>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import { CalendarIcon, CheckIcon } from "@/components/icons";
import { Card, IconCircle, LinkButton } from "@/components/ui";
import { formatDayMonth, formatInstantDayMonth, formatWeekdayDayMonth } from "@/lib/dates";
import type { DoctorMessage } from "@/server/domain";
import type { ConsultationView } from "@/server/store";

export interface DoctorMessageCardProps {
  readonly message: DoctorMessage;
  /** Bereits vereinbarte Besprechung – ersetzt den Knopf «Termin auswählen». */
  readonly consultation: ConsultationView | null;
}

export async function DoctorMessageCard({ message, consultation }: DoctorMessageCardProps) {
  const [locale, t, tLabels] = await Promise.all([
    getLocale(),
    getTranslations("doctor.message"),
    getTranslations("labels"),
  ]);
  const isConsultation = message.kind === "consultation";

  const title = isConsultation ? t("consultation.title") : t("good.title");
  const body = isConsultation
    ? t("consultation.body")
    : message.context.nextBloodDrawDate
      ? t("good.bodyWithDate", { date: formatDayMonth(message.context.nextBloodDrawDate, locale) })
      : t("good.bodyWithoutDate");

  return (
    <Card tone={isConsultation ? "warn" : "ok"} className={isConsultation ? "gap-3.5" : "gap-3"} role="article">
      <div className="flex items-center justify-between gap-3">
        <IconCircle tone={isConsultation ? "warn" : "ok"} size="sm">
          {isConsultation ? <CalendarIcon size={22} strokeWidth={2.2} /> : <CheckIcon />}
        </IconCircle>
        <time dateTime={message.dateISO} className="text-small text-muted">
          {formatInstantDayMonth(message.dateISO, locale)}
        </time>
      </div>
      <p className="text-cta font-bold">{title}</p>
      <p>{body}</p>
      {isConsultation &&
        (consultation ? (
          <p className="font-bold">
            {t("arranged", {
              date: formatWeekdayDayMonth(consultation.slot.dateISO, locale),
              time: consultation.slot.time,
              channel: tLabels(`channel.${consultation.channel}.label`),
            })}
          </p>
        ) : (
          <LinkButton href="/arzt/besprechung" className="min-h-15 text-tile">
            {t("chooseTime")}
          </LinkButton>
        ))}
    </Card>
  );
}

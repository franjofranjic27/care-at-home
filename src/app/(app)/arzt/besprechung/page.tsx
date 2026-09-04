import { cookies } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { ConsultationBooking, type SlotOption } from "@/components/consultation/ConsultationBooking";
import type { ConfirmedConsultation } from "@/components/consultation/ConsultationConfirmation";
import { Screen } from "@/components/layout/Screen";
import { Avatar, BackLink, Card } from "@/components/ui";
import { formatWeekdayDayMonth } from "@/lib/dates";
import { readState } from "@/server/state";
import { getConsultationSlotsView } from "@/server/store";

export default async function ConsultationPage() {
  const [locale, t, state] = await Promise.all([getLocale(), getTranslations(), cookies().then(readState)]);
  const view = getConsultationSlotsView(state, new Date());

  const slots: SlotOption[] = view.slots.map((slot) => ({
    id: slot.id,
    dateLabel: formatWeekdayDayMonth(slot.dateISO, locale),
    time: slot.time,
    taken: slot.taken,
  }));

  const existing: ConfirmedConsultation | null = view.consultation
    ? {
        channel: view.consultation.channel,
        dateLabel: formatWeekdayDayMonth(view.consultation.slot.dateISO, locale),
        time: view.consultation.slot.time,
      }
    : null;

  return (
    <Screen>
      <BackLink href="/arzt" label={t("common.back")} />
      <h1>{t("consultation.title")}</h1>

      {!existing && (
        <Card tone="warn-tint" className="flex-row items-center gap-4 px-5 py-4.5">
          <Avatar initials={view.doctor.initials} name={view.doctor.name} size="md" />
          <p>{t("consultation.reason", { doctor: view.doctor.name })}</p>
        </Card>
      )}

      <ConsultationBooking doctor={view.doctor} slots={slots} existing={existing} />
    </Screen>
  );
}

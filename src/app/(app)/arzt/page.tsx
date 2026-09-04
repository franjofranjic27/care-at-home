import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { DoctorMessageCard } from "@/components/doctor/DoctorMessageCard";
import { MarkMessagesRead } from "@/components/doctor/MarkMessagesRead";
import { ReviewStatusCard } from "@/components/doctor/ReviewStatusCard";
import { Screen } from "@/components/layout/Screen";
import { BackLink, SectionLabel } from "@/components/ui";
import { readState } from "@/server/state";
import { getDoctorView } from "@/server/store";

export default async function DoctorPage() {
  const now = new Date();
  const [t, state] = await Promise.all([getTranslations(), cookies().then(readState)]);
  const view = getDoctorView(state, now);
  const unreadIds = view.messages.filter((m) => !m.read).map((m) => m.id);

  return (
    <Screen>
      <BackLink href="/" label={t("common.back")} />
      <h1>{t("doctor.title")}</h1>

      <DoctorCard doctor={view.doctor} />

      <section className="flex flex-col gap-3" aria-labelledby="section-now">
        <SectionLabel id="section-now">{t("doctor.now")}</SectionLabel>
        <ReviewStatusCard doctor={view.doctor} status={view.status} vitalsSentAt={view.vitalsSentAt} now={now} />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="section-messages">
        <SectionLabel id="section-messages">{t("doctor.messagesFrom", { doctor: view.doctor.shortName })}</SectionLabel>
        {view.messages.map((message) => (
          <DoctorMessageCard key={message.id} message={message} consultation={view.consultation} />
        ))}
      </section>

      <MarkMessagesRead unreadIds={unreadIds} />
    </Screen>
  );
}

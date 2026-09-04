import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Card, PulseDot } from "@/components/ui";
import type { Doctor } from "@/server/domain";

export interface ReviewingCardProps {
  readonly doctor: Doctor;
  /** «h2» als eigener Abschnitt (Übersicht), «p» unter einem bestehenden Abschnittstitel (Mein Arzt). */
  readonly headingLevel: "h2" | "p";
  /** Zusatz unter dem Text, z. B. Sendezeit oder Link. */
  readonly children?: ReactNode;
}

/** Blaue Karte «Ihre Werte werden geprüft» mit pulsierendem Punkt – auf Übersicht und «Mein Arzt» identisch. */
export function ReviewingCard({ doctor, headingLevel, children }: ReviewingCardProps) {
  const t = useTranslations("doctor.reviewing");
  const Heading = headingLevel;
  return (
    <Card tone="brand-outline">
      <div className="flex items-center gap-3.5">
        <PulseDot />
        <Heading className={headingLevel === "h2" ? "text-card-title font-bold" : "text-cta font-bold"}>
          {t("title")}
        </Heading>
      </div>
      <p>{t("body", { doctor: doctor.shortName })}</p>
      {children}
    </Card>
  );
}

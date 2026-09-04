import { useTranslations } from "next-intl";
import { Avatar, Card } from "@/components/ui";
import type { Doctor } from "@/server/domain";

export function DoctorCard({ doctor }: { readonly doctor: Doctor }) {
  const tLabels = useTranslations("labels");
  return (
    <Card className="flex-row items-center gap-4 p-4.5">
      <Avatar initials={doctor.initials} name={doctor.name} size="lg" />
      <div className="flex flex-col gap-1">
        <p className="text-tile font-bold">{doctor.name}</p>
        <p className="text-small text-muted">
          {tLabels(`specialty.${doctor.specialty}`)} · {doctor.hospital}
        </p>
      </div>
    </Card>
  );
}

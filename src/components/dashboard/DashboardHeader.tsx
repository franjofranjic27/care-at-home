import { LogoutButton } from "@/components/auth/LogoutButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Avatar } from "@/components/ui";
import type { Patient } from "@/server/domain";

export function DashboardHeader({ patient }: { readonly patient: Patient }) {
  return (
    <header className="flex items-center justify-between">
      <BrandLogo variant="header" />
      <div className="flex items-center gap-1">
        <LanguageSwitcher variant="text" />
        <LogoutButton />
        <Avatar initials={patient.initials} name={`${patient.firstName} ${patient.lastName}`} />
      </div>
    </header>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Screen } from "@/components/layout/Screen";
import { FOCUS_RING } from "@/components/ui";
import { cx } from "@/lib/cx";

export default async function LoginPage() {
  const t = await getTranslations();

  return (
    <Screen padding="none">
      <header className="flex flex-col gap-3.5 bg-brand px-7 pt-16 pb-10 text-white">
        <div className="flex items-center justify-between gap-3">
          <BrandLogo variant="hero" />
          <LanguageSwitcher variant="hero" />
        </div>
        <p className="text-lead text-brand-tint">{t("common.tagline")}</p>
      </header>

      <div className="flex grow flex-col gap-5 px-7 pt-7 pb-5">
        <LoginForm />
      </div>

      <footer className="flex flex-col gap-3 px-7 pb-8">
        <p className="text-small text-muted">{t("login.spitexHelp")}</p>
        <Link
          href="/demo"
          className={cx(
            "inline-flex min-h-15 items-center self-start text-small font-bold text-muted hover:text-ink",
            FOCUS_RING,
          )}
        >
          {t("login.demoLink")}
        </Link>
      </footer>
    </Screen>
  );
}

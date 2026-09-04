import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DemoControls } from "@/components/demo/DemoControls";
import { Screen } from "@/components/layout/Screen";
import { FOCUS_RING, LinkButton } from "@/components/ui";
import { cx } from "@/lib/cx";

export default async function DemoPage() {
  const t = await getTranslations();

  return (
    <Screen>
      <h1>{t("demo.title")}</h1>
      <p>{t("demo.intro")}</p>

      <DemoControls />

      <div className="grow" />

      <LinkButton href="/">{t("common.toOverview")}</LinkButton>
      <Link
        href="/login"
        className={cx(
          "inline-flex min-h-15 items-center justify-center text-body font-bold text-brand hover:text-brand-dark",
          FOCUS_RING,
        )}
      >
        {t("common.toLogin")}
      </Link>
    </Screen>
  );
}

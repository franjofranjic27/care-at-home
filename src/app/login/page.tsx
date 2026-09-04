import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Screen } from "@/components/layout/Screen";
import { FOCUS_RING } from "@/components/ui";
import { cx } from "@/lib/cx";

export default function LoginPage() {
  return (
    <Screen padding="none">
      <header className="flex flex-col gap-3.5 bg-brand px-7 pt-16 pb-10 text-white">
        <BrandLogo variant="hero" />
        <p className="text-lead text-brand-tint">Die Untersuchung kommt zu Ihnen nach Hause.</p>
      </header>

      <div className="flex grow flex-col gap-5 px-7 pt-7 pb-5">
        <LoginForm />
      </div>

      <footer className="flex flex-col gap-3 px-7 pb-8">
        <p className="text-small text-muted">Ihre Spitex hilft Ihnen gerne beim ersten Anmelden.</p>
        <Link
          href="/demo"
          className={cx(
            "inline-flex min-h-15 items-center self-start text-small font-bold text-muted hover:text-ink",
            FOCUS_RING,
          )}
        >
          Demo-Steuerung
        </Link>
      </footer>
    </Screen>
  );
}

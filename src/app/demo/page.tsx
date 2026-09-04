import Link from "next/link";
import { DemoControls } from "@/components/demo/DemoControls";
import { Screen } from "@/components/layout/Screen";
import { FOCUS_RING, LinkButton } from "@/components/ui";
import { cx } from "@/lib/cx";

export default function DemoPage() {
  return (
    <Screen>
      <h1>Demo-Steuerung</h1>
      <p>
        Hier stellen Sie die Demo ein. Die Übersicht und «Mein Arzt» zeigen danach den gewählten Zustand.
        Der Zustand liegt in einem Cookie in diesem Browser.
      </p>

      <DemoControls />

      <div className="grow" />

      <LinkButton href="/">Zur Übersicht</LinkButton>
      <Link
        href="/login"
        className={cx(
          "inline-flex min-h-15 items-center justify-center text-body font-bold text-brand hover:text-brand-dark",
          FOCUS_RING,
        )}
      >
        Zur Anmeldung
      </Link>
    </Screen>
  );
}

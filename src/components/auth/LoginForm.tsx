"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { EyeIcon, EyeOffIcon, PhoneIcon } from "@/components/icons";
import { Button, ErrorNote, LinkButton } from "@/components/ui";
import { api, describeError } from "@/lib/api";
import { HELP_LINE } from "@/lib/labels";

const FIELD_CLASSES =
  "h-15 w-full rounded-field border-2 border-muted bg-white px-4.5 text-tile text-ink placeholder:text-muted " +
  "focus:border-brand focus:outline-[3px] focus:outline-offset-2 focus:outline-brand";

export function LoginForm() {
  const router = useRouter();
  const ids = { number: useId(), numberHint: useId(), pin: useId() };
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.login({ insuranceNumber, pin });
      router.push("/");
      router.refresh();
    } catch (cause) {
      setError(describeError(cause));
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <h1>Anmelden</h1>

      <div className="flex flex-col gap-2">
        <label htmlFor={ids.number} className="text-label font-bold">
          AHV-Nummer
        </label>
        <p id={ids.numberHint} className="text-small text-muted">
          Steht auf Ihrer Versichertenkarte.
        </p>
        <input
          id={ids.number}
          name="insuranceNumber"
          type="text"
          inputMode="numeric"
          autoComplete="username"
          placeholder="756.1234.5678.97"
          aria-describedby={ids.numberHint}
          value={insuranceNumber}
          onChange={(event) => setInsuranceNumber(event.target.value)}
          className={FIELD_CLASSES}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={ids.pin} className="text-label font-bold">
          PIN (4 Ziffern)
        </label>
        <div className="relative">
          <input
            id={ids.pin}
            name="pin"
            type={showPin ? "text" : "password"}
            inputMode="numeric"
            autoComplete="current-password"
            maxLength={4}
            placeholder="••••"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className={`${FIELD_CLASSES} pr-16 tracking-[0.3em]`}
          />
          <button
            type="button"
            onClick={() => setShowPin((value) => !value)}
            aria-label={showPin ? "PIN verbergen" : "PIN anzeigen"}
            aria-pressed={showPin}
            className="absolute top-1/2 right-0 flex size-15 -translate-y-1/2 items-center justify-center rounded-field text-muted hover:text-ink focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-ink"
          >
            {showPin ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <ErrorNote message={error} />

      <Button type="submit" disabled={pending}>
        {pending ? "Bitte warten …" : "Anmelden"}
      </Button>

      <p className="text-small text-muted">Demo: beliebige Nummer, PIN 1234</p>

      <div className="flex items-center gap-3 text-label text-muted" aria-hidden="true">
        <span className="h-px grow bg-line" />
        <span>Brauchen Sie Hilfe?</span>
        <span className="h-px grow bg-line" />
      </div>

      <LinkButton href={`tel:${HELP_LINE.tel}`} variant="secondary" icon={<PhoneIcon />}>
        Anrufen: {HELP_LINE.display}
      </LinkButton>
    </form>
  );
}

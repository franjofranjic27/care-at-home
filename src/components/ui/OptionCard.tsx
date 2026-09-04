import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

interface SelectableProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  readonly selected: boolean;
}

/*
 * Ausgewählte Karten haben visuell einen 3-px-Rahmen. Der dritte Pixel kommt
 * über einen Inset-Schatten, damit sich das Layout beim Umschalten nicht verschiebt.
 */
const SELECTED = "border-brand bg-brand-tint shadow-[inset_0_0_0_1px_var(--color-brand)]";
const UNSELECTED = "border-line bg-white hover:border-faint";

function Selectable({ selected, className, children, ...rest }: SelectableProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cx(
        "flex w-full items-center border-2 text-left text-ink transition-colors",
        "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-ink",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected ? SELECTED : UNSELECTED,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function SelectionIndicator({ selected }: { readonly selected: boolean }) {
  return (
    <span
      className={cx(
        "flex size-7.5 shrink-0 items-center justify-center rounded-full",
        selected ? "bg-brand text-white" : "border-2 border-faint",
      )}
    >
      {selected && <CheckIcon size={18} />}
    </span>
  );
}

export interface OptionCardProps extends SelectableProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly subtitle?: string;
}

/** Auswahlkarte mit Icon, Titel, Untertitel und Haken (z. B. Terminart). */
export function OptionCard({ icon, title, subtitle, selected, className, ...rest }: OptionCardProps) {
  return (
    <Selectable selected={selected} className={cx("min-h-18 gap-3.5 rounded-card px-4 py-3.5", className)} {...rest}>
      <span
        className={cx(
          "flex size-11 shrink-0 items-center justify-center rounded-field text-brand",
          selected ? "bg-white" : "bg-brand-tint",
        )}
      >
        {icon}
      </span>
      <span className="flex grow flex-col gap-0.5">
        <span className="text-tile font-bold">{title}</span>
        {subtitle && <span className="text-small text-muted">{subtitle}</span>}
      </span>
      <SelectionIndicator selected={selected} />
    </Selectable>
  );
}

export interface OptionRowProps extends SelectableProps {
  readonly label: string;
  readonly trailing: string;
}

/** Einzeilige Auswahl mit Text links und rechts (z. B. Zeitfenster). */
export function OptionRow({ label, trailing, selected, className, ...rest }: OptionRowProps) {
  return (
    <Selectable
      selected={selected}
      className={cx("min-h-15 justify-between gap-3 rounded-control px-4.5 text-lead", selected && "font-bold", className)}
      {...rest}
    >
      <span>{label}</span>
      <span className="shrink-0">{trailing}</span>
    </Selectable>
  );
}

export interface OptionTileProps extends SelectableProps {
  readonly children: ReactNode;
}

/** Kachel mit zentriertem Inhalt (z. B. Tag oder Kanal). */
export function OptionTile({ selected, className, children, ...rest }: OptionTileProps) {
  return (
    <Selectable
      selected={selected}
      className={cx("flex-col justify-center gap-0.5 rounded-control px-3 text-center", className)}
      {...rest}
    >
      {children}
    </Selectable>
  );
}

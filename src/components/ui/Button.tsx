import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "danger-outline" | "text";

const BASE =
  "inline-flex w-full items-center justify-center gap-3 rounded-control text-center font-bold no-underline transition-colors " +
  "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-ink " +
  "disabled:cursor-not-allowed";

const VARIANTS: Readonly<Record<ButtonVariant, string>> = {
  primary:
    "min-h-16 bg-brand px-5 text-cta text-white hover:bg-brand-dark hover:text-white disabled:bg-faint disabled:text-white",
  secondary:
    "min-h-15 border-2 border-brand bg-white px-5 text-lead text-brand hover:bg-brand-tint hover:text-brand-dark",
  "danger-outline":
    "min-h-15 border-2 border-danger bg-white px-5 text-lead text-danger hover:bg-danger-tint hover:text-danger",
  text: "min-h-15 px-3 text-body text-brand hover:text-brand-dark",
};

function buttonClasses(variant: ButtonVariant, className?: string): string {
  return cx(BASE, VARIANTS[variant], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly icon?: ReactNode;
}

/** Grosser, gut tippbarer Knopf (min. 56–64 px hoch). */
export function Button({
  variant = "primary",
  icon,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

export interface LinkButtonProps {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly icon?: ReactNode;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Link im Look eines Knopfs. `tel:`-Links werden als normales `<a>` gerendert. */
export function LinkButton({ href, variant = "primary", icon, className, children }: LinkButtonProps) {
  const classes = buttonClasses(variant, className);
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );
  if (href.startsWith("tel:")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

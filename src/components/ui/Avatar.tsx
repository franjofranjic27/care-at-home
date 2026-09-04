import { cx } from "@/lib/cx";

export type AvatarSize = "sm" | "md" | "lg";

const SIZES: Readonly<Record<AvatarSize, string>> = {
  sm: "size-12 text-label",
  md: "size-14 text-tile",
  lg: "size-16 text-card-title",
};

export interface AvatarProps {
  readonly initials: string;
  readonly name: string;
  readonly size?: AvatarSize;
}

/** Runder Kreis mit Initialen. */
export function Avatar({ initials, name, size = "sm" }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full bg-brand-tint font-bold text-brand",
        SIZES[size],
      )}
    >
      {initials}
    </span>
  );
}

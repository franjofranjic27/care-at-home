import { HouseHeartIcon } from "@/components/icons";

export type BrandLogoVariant = "header" | "hero";

/** Wortmarke «Care@Home» mit Haus-Herz-Icon. */
export function BrandLogo({ variant = "header" }: { readonly variant?: BrandLogoVariant }) {
  if (variant === "hero") {
    return (
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-control bg-white text-brand">
          <HouseHeartIcon size={28} />
        </span>
        <span className="text-title font-bold tracking-[-0.01em]">Care@Home</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 text-brand">
      <HouseHeartIcon size={26} />
      <span className="text-body font-bold">Care@Home</span>
    </div>
  );
}

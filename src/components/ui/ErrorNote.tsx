/** Deutlich sichtbare Fehlermeldung. Wird nur gerendert, wenn eine Meldung vorliegt. */
export function ErrorNote({ message }: { readonly message: string | null }) {
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="rounded-control border-2 border-danger bg-danger-tint px-4.5 py-4 text-body font-bold text-danger">
      {message}
    </p>
  );
}

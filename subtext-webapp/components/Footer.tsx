import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-[var(--border)] bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <p className="font-ui text-[13px] text-muted">
          Subtext ·{" "}
          <span className="text-accent3">La struttura prima della storia.</span>
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-2 font-ui text-[13px]">
          <Link href="/metodo" className="nav-link font-medium">
            Metodo
          </Link>
          <Link href="/privacy" className="nav-link font-medium">
            Privacy
          </Link>
          <Link href="/contatti" className="nav-link font-medium">
            Contatti
          </Link>
        </div>
      </div>
    </footer>
  );
}

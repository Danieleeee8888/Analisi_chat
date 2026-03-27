import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:px-6">
        <p className="text-stone-500">&copy; Subtext 2026</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-stone-900">
            Privacy
          </Link>
          <Link href="/contatti" className="hover:text-stone-900">
            Contatti
          </Link>
        </div>
      </div>
    </footer>
  );
}

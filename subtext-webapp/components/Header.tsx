import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fafaf9]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-stone-900"
        >
          Subtext
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600">
          <Link href="/#come-funziona" className="hover:text-stone-900">
            Come funziona
          </Link>
          <Link href="/privacy" className="hover:text-stone-900">
            Privacy
          </Link>
          <Link href="/faq" className="hover:text-stone-900">
            FAQ
          </Link>
        </nav>
        <p className="w-full text-center text-[11px] leading-tight text-stone-500 sm:w-auto sm:text-left">
          <span className="inline-block rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-emerald-900">
            La tua chat viene eliminata dopo l&apos;analisi
          </span>
        </p>
      </div>
    </header>
  );
}

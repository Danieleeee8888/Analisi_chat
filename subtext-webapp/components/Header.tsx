"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/#come-funziona", label: "Come funziona" },
  { href: "/privacy", label: "Privacy" },
  { href: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-foreground"
          onClick={() => setOpen(false)}
        >
          Subtext
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Principale"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link font-ui text-[14px] font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full bg-accent-light px-3 py-1 text-left font-ui text-xs font-medium text-accent-dark sm:inline-block">
            Chat eliminata post-analisi
          </span>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-[1.125rem]">
              <span
                className={[
                  "absolute left-0 h-px w-full bg-foreground transition-all duration-200",
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[calc(50%-5px)]",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 h-px w-full bg-foreground transition-all duration-200",
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-[calc(50%+5px)]",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={[
          "border-t border-[var(--border)] bg-white md:hidden",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <nav
          className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4 sm:px-6"
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link font-ui py-2 text-[14px] font-medium"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <p className="mt-3 rounded-full bg-accent-light px-3 py-1.5 font-ui text-xs font-medium text-accent-dark">
            Chat eliminata post-analisi
          </p>
        </nav>
      </div>
    </header>
  );
}

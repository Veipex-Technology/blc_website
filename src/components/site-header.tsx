"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/erp/types";

type HeaderLink = { href: string; label: string };

export function SiteHeader({
  locale,
  settings,
  links,
  labels,
}: {
  locale: Locale;
  settings: SiteSettings;
  links: HeaderLink[];
  labels: {
    menu: string;
    close: string;
    call: string;
    whatsapp: string;
    logoAlt: string;
    prefill: string;
    navLabel: string;
    language: string;
  };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsappHref = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(labels.prefill)}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", menuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--blc-sand-200)] bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-soft" : "shadow-none"}`}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link
          href={`/${locale}`}
          onClick={() => setMenuOpen(false)}
          className="shrink-0 rounded-xl focus-ring-light"
          aria-label={labels.logoAlt}
        >
          <Image
            src={settings.logo_url}
            alt={labels.logoAlt}
            width={168}
            height={56}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>
        <nav
          aria-label={labels.navLabel}
          className="hidden items-center gap-6 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-[var(--blc-green-900)] transition-colors hover:text-[var(--blc-gold-500)] focus-ring-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher locale={locale} label={labels.language} />
          <a
            href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--blc-green-900)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--blc-green-700)] focus-ring-dark"
          >
            <Phone size={16} aria-hidden="true" />
            {labels.call}
          </a>
          <a
            href={whatsappHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--blc-green-700)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--blc-green-900)] focus-ring-dark"
          >
            <MessageCircle size={16} aria-hidden="true" />
            {labels.whatsapp}
          </a>
        </div>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? labels.close : labels.menu}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--blc-green-900)] md:hidden focus-ring-light"
        >
          {menuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 top-20 z-50 flex min-h-[calc(100dvh-5rem)] flex-col bg-white px-5 py-8 md:hidden"
        >
          <nav aria-label={labels.navLabel} className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-4 text-2xl font-semibold text-[var(--blc-green-900)] focus-ring-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-3 border-t border-[var(--blc-sand-200)] pt-6">
            <a
              href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--blc-green-900)] px-5 font-semibold text-white focus-ring-dark"
            >
              <Phone size={18} aria-hidden="true" />
              {labels.call}
            </a>
            <a
              href={whatsappHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--blc-green-700)] px-5 font-semibold text-white focus-ring-dark"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {labels.whatsapp}
            </a>
            <LanguageSwitcher locale={locale} label={labels.language} />
          </div>
        </div>
      )}
    </header>
  );
}

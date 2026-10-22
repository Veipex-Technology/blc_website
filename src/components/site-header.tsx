"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  MessageCircle,
  Phone,
  Stethoscope,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/erp/types";
import { whatsappLink } from "@/lib/contact";

type HeaderLink = { href: string; label: string };
type HeaderService = { title: string; href: string };

export function SiteHeader({
  locale,
  settings,
  links,
  services,
  labels,
}: {
  locale: Locale;
  settings: SiteSettings;
  links: HeaderLink[];
  services: HeaderService[];
  labels: {
    menu: string;
    close: string;
    call: string;
    whatsapp: string;
    logoAlt: string;
    prefill: string;
    navLabel: string;
    language: string;
    contact: string;
  };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const whatsappHref = whatsappLink(labels.prefill);
  const servicesHref = `/${locale}/services`;

  const closeNavigation = () => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  };

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

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        servicesMenuRef.current &&
        !servicesMenuRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileServicesOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--blc-sand-200)] bg-white/95 backdrop-blur transition-shadow duration-300 ${scrolled ? "shadow-soft" : "shadow-none"}`}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center justify-between gap-3 px-4 lg:gap-4 lg:px-6">
        <Link
          href={`/${locale}`}
          onClick={closeNavigation}
          className="group shrink-0 rounded-xl focus-ring-light"
          aria-label={labels.logoAlt}
        >
          {/* Responsive width and explicit intrinsic dimensions keep the header logo sharp and stable. */}
          <Image
            src={settings.logo_url}
            alt={labels.logoAlt}
            width={168}
            height={56}
            sizes="(max-width: 767px) 96px, 132px"
            priority
            className="h-auto w-[80px] object-contain transition-opacity duration-300 ease-out group-hover:opacity-100 opacity-90 md:w-[108px]"
          />
        </Link>
        <nav
          aria-label={labels.navLabel}
          className="hidden items-center gap-0.5 md:flex lg:gap-1.5"
        >
          {links.map((link) => {
            const isServices = link.href === servicesHref;

            if (!isServices || !services.length) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeNavigation}
                  className="rounded-full px-2.5 py-1.5 text-sm font-semibold text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-cream-100)] hover:text-[var(--blc-gold-500)] focus-ring-light lg:px-3"
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <div
                key={link.href}
                ref={servicesMenuRef}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="inline-flex items-center rounded-full text-sm font-semibold text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-cream-100)] hover:text-[var(--blc-gold-500)]">
                  <Link
                    href={link.href}
                    onClick={closeNavigation}
                    className="rounded-s-full px-2.5 py-1.5 focus-ring-light lg:px-3"
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="desktop-services-menu"
                    aria-haspopup="true"
                    aria-label={link.label}
                    onClick={() => setServicesOpen((open) => !open)}
                    className="rounded-e-full px-2 py-2 focus-ring-light lg:px-3"
                  >
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={`transition-transform duration-200 motion-reduce:transition-none ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {servicesOpen && (
                  <div
                    id="desktop-services-menu"
                    role="menu"
                    className="services-dropdown absolute start-full top-full z-50 pt-4 w-72 -translate-x-1/2  text-start  rtl:translate-x-full"
                  >
                    <div className=" bg-white rounded-2xl border border-[var(--blc-sand-200)] p-3 shadow-[0_18px_45px_rgb(2_56_48_/_0.16)]">
                      <Link
                        href={link.href}
                        role="menuitem"
                        onClick={closeNavigation}
                        className="block rounded-xl px-4 py-3 text-sm font-bold text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-cream-100)] hover:text-[var(--blc-gold-500)] focus-ring-light"
                      >
                        {link.label}
                      </Link>
                      <div className="my-2 border-t border-[var(--blc-sand-200)]" />
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          role="menuitem"
                          onClick={closeNavigation}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-[var(--blc-cream-100)] focus-ring-light"
                        >
                          <Stethoscope
                            size={18}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--blc-gold-500)]"
                          />
                          <span className="text-sm font-semibold text-[var(--blc-green-900)]">
                            {service.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher locale={locale} label={labels.language} />
          {links.find((link) => link.href === `/${locale}/contact`) && (
            <Link
              href={`/${locale}/contact`}
              onClick={closeNavigation}
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--blc-gold-500)] px-3 text-sm font-semibold text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-gold-500)] hover:text-white focus-ring-light"
            >
              {labels.contact}
            </Link>
          )}
          <a
            href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--blc-green-900)] px-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--blc-green-700)] focus-ring-dark"
          >
            <Phone size={16} aria-hidden="true" />
            {labels.call}
          </a>
          <a
            href={whatsappHref}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--blc-green-700)] px-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--blc-green-900)] focus-ring-dark"
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
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--blc-sand-200)] text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-cream-100)] md:hidden focus-ring-light"
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
          className="fixed inset-0 top-[72px] z-50 flex min-h-[calc(100dvh-72px)] flex-col bg-white px-5 py-8 md:hidden"
        >
          <nav aria-label={labels.navLabel} className="grid gap-2">
            {links.map((link) => {
              if (link.href !== servicesHref || !services.length) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeNavigation}
                    className="rounded-xl px-4 py-4 text-2xl font-semibold text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-cream-100)] focus-ring-light"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <div
                  key={link.href}
                  className="rounded-2xl border border-[var(--blc-sand-200)] bg-[var(--blc-cream-100)]/50"
                >
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={closeNavigation}
                      className="min-w-0 flex-1 rounded-xl px-4 py-4 text-2xl font-semibold text-[var(--blc-green-900)] focus-ring-light"
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={mobileServicesOpen}
                      aria-controls="mobile-services-menu"
                      aria-label={link.label}
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      className="me-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--blc-green-900)] focus-ring-light"
                    >
                      <ChevronDown
                        size={22}
                        aria-hidden="true"
                        className={`transition-transform duration-200 motion-reduce:transition-none ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <div
                      id="mobile-services-menu"
                      className="grid gap-1 px-3 pb-3"
                    >
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={closeNavigation}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-[var(--blc-green-700)] transition-colors hover:bg-white focus-ring-light"
                        >
                          <Stethoscope
                            size={18}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--blc-gold-500)]"
                          />
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
